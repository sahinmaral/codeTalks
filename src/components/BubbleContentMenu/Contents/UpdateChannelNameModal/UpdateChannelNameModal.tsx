import React, { useRef, useState } from 'react';
import Button from '@/components/Button';
import Text from '@/components/Text';
import { ActivityIndicator, View } from 'react-native';
import { useBubbleContentMenuScroll } from '@/components/BubbleContentMenu/BubbleContentMenu.context';
import { BottomSheetTextInput } from '@gorhom/bottom-sheet';
import styles from './UpdateChannelNameModal.styles';
import { showMessage } from 'react-native-flash-message';
import { Formik } from 'formik';
import validationSchema from '@/schemas/CreateChannelSchema';
import { useAppDispatch } from '@/redux/hooks';
import { setActiveChannelName } from '@/redux/reducers/activeChannelReducer';
import { fetchPatchChannel } from '@/services/channels';
import colors from '@/styles/colors';
import { useBubbleContentMenu } from '@/components/BubbleContentMenu/BubbleContentMenu.provider';
import translateErrorMessage from '@/helpers/apiErrorTranslation';

type UpdateChannelNameModalProps = {
  selectedChannelId: string;
  currentChannelName: string;
};

function UpdateChannelNameModal({
  selectedChannelId,
  currentChannelName,
}: UpdateChannelNameModalProps) {
  const initialValues = { channelName: currentChannelName };
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isFocused, setFocused] = useState(false);

  const { hide } = useBubbleContentMenu();
  const { scrollTo } = useBubbleContentMenuScroll();
  const dispatch = useAppDispatch();

  const groupYPositions = useRef<Record<number, number>>({});

  const handleUpdateChannelName = async ({ channelName }: typeof initialValues) => {
    if (channelName.length === 0) {
      setError('Lütfen herhangi bir kanal adı giriniz');
      return;
    }

    try {
      setLoading(true);
      await fetchPatchChannel(selectedChannelId, { name: channelName });
      dispatch(setActiveChannelName(channelName));
      hide();
      showMessage({ message: 'Kanal adı başarıyla güncellendi', type: 'success' });
    } catch (err: any) {
      const errorResult = err?.response?.data;
      showMessage({
        message: translateErrorMessage(errorResult?.Detail ?? ''),
        type: 'danger',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View>
      <View style={styles.header}>
        <Text fontWeight="800" size="xlarge">
          Edit Channel Name
        </Text>
      </View>

      <Formik initialValues={initialValues} onSubmit={handleUpdateChannelName}>
        {({ handleChange, handleBlur, handleSubmit: formikSubmit, values, errors }) => (
          <View style={styles.formContainer}>
            <View
              style={styles.formGroup}
              onLayout={e => {
                groupYPositions.current[0] = e.nativeEvent.layout.y;
              }}
            >
              <Text fontWeight="600">Channel Name</Text>
              <BottomSheetTextInput
                onChangeText={handleChange('channelName')}
                value={values.channelName}
                placeholder="Enter channel name here"
                placeholderTextColor={colors.gray[400]}
                style={[styles.input, isFocused && styles.inputFocused]}
                onFocus={() => {
                  scrollTo(groupYPositions.current[0] ?? 0);
                  setFocused(true);
                }}
                onBlur={() => {
                  handleBlur('channelName');
                  setFocused(false);
                }}
              />
              {errors.channelName && <Text style={styles.inputError}>* {errors.channelName}</Text>}
              <Text size="small" color={colors.gray[400]}>
                Use lowercase letters, numbers and hypens only
              </Text>
            </View>

            <Button
              title={loading ? 'Saving changes...' : 'Save Changes'}
              loading={loading}
              disabled={loading}
              style={styles.button}
              onPress={formikSubmit}
            />
          </View>
        )}
      </Formik>
    </View>
  );
}

export default UpdateChannelNameModal;
