import { useBubbleContentMenuScroll } from '@/components/BubbleContentMenu/BubbleContentMenu.context';
import { useBubbleContentMenu } from '@/components/BubbleContentMenu/BubbleContentMenu.provider';
import Button from '@/components/Button';
import Text from '@/components/Text';
import translateErrorMessage from '@/helpers/apiErrorTranslation';
import { fetchSendInviteToChannel } from '@/services/channels';
import colors from '@/styles/colors';
import { BottomSheetTextInput } from '@gorhom/bottom-sheet';
import { Formik } from 'formik';
import React, { useRef, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { showMessage } from 'react-native-flash-message';
import styles from './SendJoinRequestModal.styles';

function SendJoinRequestModal() {
  const initialValues = { channelId: '' };
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { hide } = useBubbleContentMenu();

  const { scrollTo } = useBubbleContentMenuScroll();
  const groupYPositions = useRef<Record<number, number>>({});

  const handleSendInvite = async ({ channelId }: typeof initialValues) => {
    if (channelId.length === 0) {
      setError('Lütfen istek göndermek istediğiniz kanalın ID sini giriniz');
      return;
    }

    try {
      setLoading(true);
      await fetchSendInviteToChannel(channelId);
      hide();
      showMessage({ message: 'İsteğiniz başarıyla gönderildi', type: 'info' });
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
          Send Join Request
        </Text>
      </View>

      <View style={styles.description}>
        <Text size="medium" color={colors.gray[400]}>
          Enter the Channel ID below to request access. The channel admins will review your request.
        </Text>
      </View>

      <Formik initialValues={initialValues} onSubmit={handleSendInvite}>
        {({ handleChange, handleBlur, handleSubmit: formikSubmit, values, errors }) => (
          <View style={styles.formContainer}>
            <View
              style={styles.formGroup}
              onLayout={e => {
                groupYPositions.current[0] = e.nativeEvent.layout.y;
              }}
            >
              <Text fontWeight="600">Channel ID</Text>
              <BottomSheetTextInput
                onChangeText={handleChange('channelId')}
                onBlur={handleBlur('channelId')}
                onFocus={() => scrollTo(groupYPositions.current[0] ?? 0)}
                value={values.channelId}
                placeholder="# Paste ID here"
                placeholderTextColor={colors.gray[400]}
                style={styles.input}
              />
              {errors.channelId && <Text style={styles.inputError}>* {errors.channelId}</Text>}
            </View>

            <Button
              title={loading ? 'Sending request...' : 'Send Join Request'}
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

export default SendJoinRequestModal;
