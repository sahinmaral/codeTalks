import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '@/components/Button';
import Text from '@/components/Text';
import { View } from 'react-native';
import { useBubbleContentMenuScroll } from '@/components/BubbleContentMenu/BubbleContentMenu.context';
import { BottomSheetTextInput } from '@gorhom/bottom-sheet';
import makeStyles from './UpdateChannelNameModal.styles';
import { showMessage } from 'react-native-flash-message';
import { Formik } from 'formik';
import validationSchema from '@/schemas/CreateChannelSchema';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setActiveChannelName } from '@/redux/reducers/activeChannelReducer';
import { fetchPatchChannel } from '@/services/apiServices/channels';
import useTheme from '@/hooks/useTheme';
import useThemedStyles from '@/hooks/useThemedStyles';
import { useBubbleContentMenu } from '@/components/BubbleContentMenu/BubbleContentMenu.provider';
import translateErrorMessage from '@/helpers/apiErrorTranslation';

function UpdateChannelNameModal() {
  const { t } = useTranslation();
  const styles = useThemedStyles(makeStyles);
  const theme = useTheme();
  const currentChannel = useAppSelector(state => state.activeChannel.channel);
  const selectedChannelId = currentChannel?.id ?? '';
  const currentChannelName = currentChannel?.name ?? '';

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
      setError(t('components.enterChannelName'));
      return;
    }

    try {
      setLoading(true);
      await fetchPatchChannel(selectedChannelId, { name: channelName });
      dispatch(setActiveChannelName(channelName));
      hide();
      showMessage({ message: t('components.channelNameUpdated'), type: 'success' });
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
          {t('components.editChannelNameTitle')}
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
              <Text fontWeight="600">{t('components.channelNameLabel')}</Text>
              <BottomSheetTextInput
                onChangeText={handleChange('channelName')}
                value={values.channelName}
                placeholder={t('components.channelNamePlaceholder')}
                placeholderTextColor={theme.text.tertiary}
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
              <Text size="small" color={theme.text.secondary}>
                {t('components.channelNameHelper')}
              </Text>
            </View>

            <Button
              title={loading ? t('components.savingChanges') : t('components.saveChanges')}
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
