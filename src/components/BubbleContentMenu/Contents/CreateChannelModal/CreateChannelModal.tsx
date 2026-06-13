import Button from '@/components/Button';
import Text from '@/components/Text';
import { useAppSelector } from '@/redux/hooks';
import validationSchema from '@/schemas/CreateChannelSchema';
import { fetchCreateChannel } from '@/services/channels';
import colors from '@/styles/colors';
import { getApiErrorMessage } from '@/utils/getApiErrorMessage';
import { BottomSheetTextInput } from '@gorhom/bottom-sheet';
import { AxiosError } from 'axios';
import { Formik } from 'formik';
import React, { useRef, useState } from 'react';
import { View } from 'react-native';
import { showMessage } from 'react-native-flash-message';
import * as Yup from 'yup';
import { useBubbleContentMenuScroll } from '../../BubbleContentMenu.context';
import { useBubbleContentMenu } from '../../BubbleContentMenu.provider';
import styles from './ChannelCreateModal.styles';

function CreateChannelModal() {
  const initialValues = { name: '', description: '' };
  const [loading, setLoading] = useState(false);
  const user = useAppSelector(state => state.app.user);
  const { scrollTo } = useBubbleContentMenuScroll();
  const { hide } = useBubbleContentMenu();
  const formContainerScrollY = useRef(0);
  const groupYPositions = useRef<Record<number, number>>({});

  const handleCreateChannel = async (values: typeof initialValues) => {
    try {
      await fetchCreateChannel({ ...values });
      hide();
      showMessage({ message: 'Channel created successfully', type: 'success' });
    } catch (error) {
      throw error;
    }
  };

  const handleSubmit = async (values: typeof initialValues) => {
    try {
      setLoading(true);
      await validationSchema.validate(values, { abortEarly: false });
      await handleCreateChannel(values);
    } catch (exception) {
      if (exception instanceof Yup.ValidationError) {
        showMessage({ message: exception.errors[0], type: 'warning' });
      } else if (exception instanceof AxiosError) {
        showMessage({ message: getApiErrorMessage(exception), type: 'danger' });
      } else {
        showMessage({ message: 'An error occurred', type: 'danger' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View>
      <View style={{ paddingVertical: 10 }}>
        <Text fontWeight="800" size="xlarge">
          Create Channel
        </Text>
      </View>

      <Formik initialValues={initialValues} onSubmit={handleSubmit}>
        {({ handleChange, handleBlur, handleSubmit: formikSubmit, values, errors }) => (
          <View
            style={styles.formContainer}
            onLayout={e => {
              formContainerScrollY.current = e.nativeEvent.layout.y;
            }}
          >
            <View
              style={styles.formGroup}
              onLayout={e => {
                groupYPositions.current[0] = formContainerScrollY.current + e.nativeEvent.layout.y;
              }}
            >
              <Text fontWeight="600">Channel Name</Text>
              <BottomSheetTextInput
                onChangeText={handleChange('name')}
                onBlur={handleBlur('name')}
                onFocus={() => scrollTo(groupYPositions.current[0] ?? 0)}
                value={values.name}
                placeholder="e.g. ui-ux-design"
                placeholderTextColor={colors.gray[400]}
                style={styles.input}
              />
            </View>

            <View
              key={1}
              style={styles.formGroup}
              onLayout={e => {
                groupYPositions.current[1] = formContainerScrollY.current + e.nativeEvent.layout.y;
              }}
            >
              <Text fontWeight="600">Description</Text>
              <BottomSheetTextInput
                multiline={true}
                numberOfLines={4}
                placeholder="e.g. ui-ux-design"
                placeholderTextColor={colors.gray[400]}
                onChangeText={handleChange('description')}
                onBlur={handleBlur('description')}
                onFocus={() => scrollTo(groupYPositions.current[1] ?? 0)}
                value={values.description}
                style={styles.textArea}
              />
            </View>

            <Button
              title={loading ? 'Creating channel...' : 'Create Channel'}
              disabled={loading}
              loading={loading}
              style={styles.button}
              onPress={formikSubmit}
            />
          </View>
        )}
      </Formik>
    </View>
  );
}

export default CreateChannelModal;
