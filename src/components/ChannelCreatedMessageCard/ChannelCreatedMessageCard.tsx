import React from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import makeStyles from './ChannelCreatedMessageCard.styles';
import Icon from 'react-native-remix-icon';
import colors from '@/styles/colors';
import useTheme from '@/hooks/useTheme';
import useThemedStyles from '@/hooks/useThemedStyles';
import Text from '@/components/Text';
import Button from '@/components/Button';

interface ChannelCreatedMessageCardProps {
  channelName: string;
  channelCreatedAt: string;
  onPress: () => void;
}

function ChannelCreatedMessageCard({
  channelName,
  channelCreatedAt,
  onPress,
}: ChannelCreatedMessageCardProps) {
  const { t, i18n } = useTranslation();
  const styles = useThemedStyles(makeStyles);
  const theme = useTheme();
  const formattedCreatedAt = new Date(channelCreatedAt).toLocaleDateString(i18n.language, {
    month: 'long',
    year: 'numeric',
  });

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Icon name="ri-cake-2-line" size={36} color={colors.orange[500]} />
      </View>
      <View style={styles.contentContainer}>
        <View style={styles.header}>
          <Text fontWeight="700" size="large" style={styles.text}>
            {t('components.channelCreatedHeading', { channel: channelName })}
          </Text>
        </View>
        <View style={styles.description}>
          <Text color={theme.text.tertiary} style={styles.text}>
            {t('components.channelBeginning', { channel: channelName })}
          </Text>
        </View>
        <View style={styles.channelCreatedAtContainer}>
          <View style={styles.channelCreatedAtPillContainer}>
            <Icon name="ri-calendar-line" size={24} color={theme.text.secondary} />
            <Text>{t('components.createdOn', { date: formattedCreatedAt })}</Text>
          </View>
        </View>
        <View>
          <Button
            title={t('components.sayHello')}
            style={{ paddingVertical: 10 }}
            onPress={onPress}
          />
        </View>
      </View>
    </View>
  );
}

export default ChannelCreatedMessageCard;
