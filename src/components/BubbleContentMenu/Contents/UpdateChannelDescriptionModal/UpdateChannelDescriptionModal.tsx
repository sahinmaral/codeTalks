import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '@/components/Button';
import Text from '@/components/Text';
import { View } from 'react-native';
import { useBubbleContentMenuScroll } from '@/components/BubbleContentMenu/BubbleContentMenu.context';
import { BottomSheetTextInput } from '@gorhom/bottom-sheet';
import useTheme from '@/hooks/useTheme';
import useThemedStyles from '@/hooks/useThemedStyles';
import makeStyles from './UpdateChannelDescriptionModal.styles';
import { showMessage } from 'react-native-flash-message';
import { Formik } from 'formik';
import validationSchema from '@/schemas/CreateChannelSchema';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setActiveChannelDescription } from '@/redux/reducers/activeChannelReducer';
import { fetchPatchChannel } from '@/services/apiServices/channels';
import { useBubbleContentMenu } from '@/components/BubbleContentMenu/BubbleContentMenu.provider';
import translateErrorMessage from '@/helpers/apiErrorTranslation';

function UpdateChannelDescriptionModal() {
  const { t } = useTranslation();
  const styles = useThemedStyles(makeStyles);
  const theme = useTheme();
  const currentChannel = useAppSelector(state => state.activeChannel.channel);
  const selectedChannelId = currentChannel?.id ?? '';
  const currentChannelDescription = currentChannel?.description ?? '';

  const initialValues = { channelDescription: currentChannelDescription };
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isFocused, setFocused] = useState(false);

  const { hide } = useBubbleContentMenu();
  const { scrollTo } = useBubbleContentMenuScroll();
  const dispatch = useAppDispatch();

  const groupYPositions = useRef<Record<number, number>>({});

  const handleUpdateChannelDescription = async ({ channelDescription }: typeof initialValues) => {
    if (channelDescription.length === 0) {
      setError(t('components.enterChannelDesc'));
      return;
    }

    try {
      setLoading(true);
      await fetchPatchChannel(selectedChannelId, { description: channelDescription });
      dispatch(setActiveChannelDescription(channelDescription));
      hide();
      showMessage({ message: t('components.channelDescUpdated'), type: 'success' });
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
          {t('components.editChannelDescTitle')}
        </Text>
      </View>

      <Formik initialValues={initialValues} onSubmit={handleUpdateChannelDescription}>
        {({ handleChange, handleBlur, handleSubmit: formikSubmit, values, errors }) => (
          <View style={styles.formContainer}>
            <View
              style={styles.formGroup}
              onLayout={e => {
                groupYPositions.current[0] = e.nativeEvent.layout.y;
              }}
            >
              <Text fontWeight="600">{t('components.channelDescLabel')}</Text>
              <BottomSheetTextInput
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                onChangeText={handleChange('channelDescription')}
                value={values.channelDescription}
                placeholder={t('components.channelDescPlaceholder')}
                placeholderTextColor={theme.text.tertiary}
                style={[styles.textArea, isFocused && styles.inputFocused]}
                onFocus={() => {
                  scrollTo(groupYPositions.current[0] ?? 0);
                  setFocused(true);
                }}
                onBlur={() => {
                  handleBlur('channelDescription');
                  setFocused(false);
                }}
              />
              {errors.channelDescription && (
                <Text style={styles.inputError}>* {errors.channelDescription}</Text>
              )}
              <Text size="small" color={theme.text.secondary}>
                {t('components.channelDescHelper')}
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

export default UpdateChannelDescriptionModal;
