import { useBubbleContentMenu } from '@/components/BubbleContentMenu/BubbleContentMenu.provider';
import Button from '@/components/Button';
import Text from '@/components/Text';
import useTheme from '@/hooks/useTheme';
import useThemedStyles from '@/hooks/useThemedStyles';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { upsertChannelMuteSetting } from '@/redux/reducers/appReducer';
import { fetchUpdateUserChannelMuteSettingOfChannel } from '@/services/apiServices/users';
import colors from '@/styles/colors';
import { FOREVER_MUTE_DATE } from '@/utils/channelMuteSetting';
import { getApiErrorMessage } from '@/utils/getApiErrorMessage';
import { AxiosError } from 'axios';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity, View } from 'react-native';
import { showMessage } from 'react-native-flash-message';
import Icon from 'react-native-remix-icon';
import makeStyles from './UpdateChannelMuteSettingModal.styles';

type MuteDurationValue = '1d' | '1m' | '1y' | 'forever';

const MUTE_DURATIONS: { labelKey: string; value: MuteDurationValue }[] = [
  { labelKey: 'components.muteDuration1d', value: '1d' },
  { labelKey: 'components.muteDuration1m', value: '1m' },
  { labelKey: 'components.muteDuration1y', value: '1y' },
  { labelKey: 'components.muteDurationForever', value: 'forever' },
];

const getMuteUntil = (duration: MuteDurationValue): string => {
  const date = new Date();
  switch (duration) {
    case '1d':
      date.setDate(date.getDate() + 1);
      break;
    case '1m':
      date.setMonth(date.getMonth() + 1);
      break;
    case '1y':
      date.setFullYear(date.getFullYear() + 1);
      break;
    case 'forever':
      return FOREVER_MUTE_DATE;
  }
  return date.toISOString();
};

function UpdateChannelMuteSettingModal() {
  const { t } = useTranslation();
  const styles = useThemedStyles(makeStyles);
  const theme = useTheme();

  const currentChannel = useAppSelector(state => state.activeChannel.channel);
  const channelName = currentChannel?.name ?? '';
  const selectedChannelId = currentChannel?.id ?? '';

  const [selectedDuration, setSelectedDuration] = useState<MuteDurationValue>('forever');
  const [loading, setLoading] = useState(false);

  const { hide } = useBubbleContentMenu();
  const dispatch = useAppDispatch();

  const handleMuteChannel = async () => {
    try {
      setLoading(true);
      const muteUntil = getMuteUntil(selectedDuration);
      await fetchUpdateUserChannelMuteSettingOfChannel(selectedChannelId, { muteUntil });
      dispatch(
        upsertChannelMuteSetting({
          channelId: selectedChannelId,
          mutedUntil: muteUntil,
          isMuted: true,
        }),
      );
      hide();
      showMessage({ message: t('components.channelMutedSuccess'), type: 'success' });
    } catch (exception) {
      if (exception instanceof AxiosError) {
        showMessage({ message: getApiErrorMessage(exception), type: 'danger' });
      } else {
        showMessage({ message: t('common.errorOccurred'), type: 'danger' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text fontWeight="800" size="large">
          {t('components.muteChannelTitle')}
        </Text>
        <Text color={theme.text.secondary} style={styles.description}>
          {t('components.muteChannelDescription', { channel: channelName })}
        </Text>
      </View>

      <View style={styles.optionList}>
        {MUTE_DURATIONS.map((duration, index) => {
          const isActive = selectedDuration === duration.value;
          const isLast = index === MUTE_DURATIONS.length - 1;
          return (
            <TouchableOpacity
              key={duration.value}
              activeOpacity={0.7}
              disabled={loading}
              onPress={() => setSelectedDuration(duration.value)}
              style={[
                styles.option,
                !isLast && styles.optionBordered,
                isActive && styles.optionActive,
              ]}
            >
              <Text
                fontWeight={isActive ? '700' : '500'}
                color={isActive ? colors.orange[500] : theme.text.primary}
              >
                {t(duration.labelKey)}
              </Text>
              <Icon
                name={isActive ? 'ri-radio-button-line' : 'ri-checkbox-blank-circle-line'}
                size={22}
                color={isActive ? colors.orange[500] : theme.border}
              />
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.infoBox}>
        <Icon name="ri-information-line" size={18} color={theme.text.tertiary} />
        <Text size="small" color={theme.text.secondary} style={styles.infoText}>
          {t('components.muteInfo')}
        </Text>
      </View>

      <View style={styles.actions}>
        <Button
          title={t('components.muteChannelButton')}
          loading={loading}
          disabled={loading}
          onPress={handleMuteChannel}
        />
      </View>
    </View>
  );
}

export default UpdateChannelMuteSettingModal;
