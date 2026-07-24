import { useBubbleContentMenuScroll } from '@/components/BubbleContentMenu/BubbleContentMenu.context';
import { useBubbleContentMenu } from '@/components/BubbleContentMenu/BubbleContentMenu.provider';
import Button from '@/components/Button';
import Text from '@/components/Text';
import ChannelUserStatus from '@/enums/ChannelUserStatus';
import { fetchJoinChannel } from '@/services/apiServices/channels';
import useTheme from '@/hooks/useTheme';
import useThemedStyles from '@/hooks/useThemedStyles';
import { getApiErrorMessage } from '@/utils/getApiErrorMessage';
import { BottomSheetTextInput } from '@gorhom/bottom-sheet';
import { AxiosError } from 'axios';
import { Formik } from 'formik';
import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { showMessage } from 'react-native-flash-message';
import * as Yup from 'yup';
import makeStyles from './SendJoinRequestModal.styles';

function SendJoinRequestModal() {
  const { t } = useTranslation();
  const styles = useThemedStyles(makeStyles);
  const theme = useTheme();
  const initialValues = { inviteCode: '' };
  const [loading, setLoading] = useState(false);
  const { hide } = useBubbleContentMenu();

  const { scrollTo } = useBubbleContentMenuScroll();
  const groupYPositions = useRef<Record<number, number>>({});

  const handleJoinChannel = async ({ inviteCode }: typeof initialValues) => {
    if (inviteCode.length === 0) {
      showMessage({
        message: t('components.enterInviteCode'),
        type: 'danger',
      });
      return;
    }

    try {
      setLoading(true);
      const { data } = await fetchJoinChannel({ inviteCode });

      hide();
      showMessage({
        message:
          data.status === ChannelUserStatus.Accepted
            ? t('components.joinedSuccess')
            : t('components.requestSentSuccess'),
        type: 'success',
      });
    } catch (exception) {
      if (exception instanceof Yup.ValidationError) {
        showMessage({ message: t(exception.errors[0]), type: 'warning' });
      } else if (exception instanceof AxiosError) {
        showMessage({ message: getApiErrorMessage(exception), type: 'danger' });
      } else {
        showMessage({ message: t('common.errorOccurred'), type: 'danger' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View>
      <View style={styles.header}>
        <Text fontWeight="800" size="xlarge">
          {t('components.joinChannelTitle')}
        </Text>
      </View>

      <View style={styles.description}>
        <Text size="medium" color={theme.text.secondary}>
          {t('components.joinChannelLongDescription')}
        </Text>
      </View>

      <Formik initialValues={initialValues} onSubmit={handleJoinChannel}>
        {({ handleChange, handleBlur, handleSubmit: formikSubmit, values, errors }) => (
          <View style={styles.formContainer}>
            <View
              style={styles.formGroup}
              onLayout={e => {
                groupYPositions.current[0] = e.nativeEvent.layout.y;
              }}
            >
              <Text fontWeight="600">{t('components.inviteCodeLabel')}</Text>
              <BottomSheetTextInput
                onChangeText={handleChange('inviteCode')}
                onBlur={handleBlur('inviteCode')}
                onFocus={() => scrollTo(groupYPositions.current[0] ?? 0)}
                value={values.inviteCode}
                placeholder={t('components.inviteCodePlaceholder')}
                placeholderTextColor={theme.text.tertiary}
                style={styles.input}
              />
              {errors.inviteCode && <Text style={styles.inputError}>* {errors.inviteCode}</Text>}
            </View>

            <Button
              title={loading ? t('components.sendingRequest') : t('components.sendJoinRequest')}
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
