import Button from '@/components/Button';
import Text from '@/components/Text';
import ChannelJoinPolicy from '@/enums/ChannelJoinPolicy';
import validationSchema from '@/schemas/CreateChannelSchema';
import { fetchCreateChannel } from '@/services/channels';
import colors from '@/styles/colors';
import { getApiErrorMessage } from '@/utils/getApiErrorMessage';
import { BottomSheetTextInput } from '@gorhom/bottom-sheet';
import { AxiosError } from 'axios';
import { Formik } from 'formik';
import React, { useRef, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { showMessage } from 'react-native-flash-message';
import Icon from 'react-native-remix-icon';
import * as Yup from 'yup';
import { useBubbleContentMenuScroll } from '../../BubbleContentMenu.context';
import { useBubbleContentMenu } from '../../BubbleContentMenu.provider';
import styles from './ChannelCreateModal.styles';

const JOIN_POLICIES = [
  { label: 'Request', value: ChannelJoinPolicy.Request, icon: 'mail-send-line' },
  { label: 'Open', value: ChannelJoinPolicy.Open, icon: 'global-line' },
];

function CreateChannelModal() {
  const initialValues = { name: '', description: '', joinPolicy: ChannelJoinPolicy.Request };
  const [loading, setLoading] = useState(false);
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
        {({ handleChange, handleBlur, handleSubmit: formikSubmit, setFieldValue, values }) => (
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

            <View style={styles.formGroup}>
              <Text fontWeight="600">Join Policy</Text>
              <View style={styles.segmentContainer}>
                {JOIN_POLICIES.map(policy => {
                  const isActive = values.joinPolicy === policy.value;
                  const activeColor = isActive ? colors.orange[500] : colors.gray[500];
                  return (
                    <TouchableOpacity
                      key={policy.value}
                      activeOpacity={0.8}
                      style={[styles.segment, isActive && styles.segmentActive]}
                      onPress={() => setFieldValue('joinPolicy', policy.value)}
                    >
                      <Icon name={policy.icon} size={16} color={activeColor} />
                      <Text fontWeight={isActive ? '600' : '400'} color={activeColor}>
                        {policy.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
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
