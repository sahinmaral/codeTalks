import React from 'react';
import { View } from 'react-native';
import styles from './ChannelCreatedMessageCard.styles';
import Icon from 'react-native-remix-icon';
import colors from '@/styles/colors';
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
  const formattedCreatedAt = new Date(channelCreatedAt).toLocaleDateString('en-US', {
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
            {channelName} was created
          </Text>
        </View>
        <View style={styles.description}>
          <Text color={colors.gray[400]} style={styles.text}>
            This is the very beginning of {channelName}. Share code, ask questions and collaborate
            with fellow developers!
          </Text>
        </View>
        <View style={styles.channelCreatedAtContainer}>
          <View style={styles.channelCreatedAtPillContainer}>
            <Icon name="ri-calendar-line" size={24} color={colors.gray[500]} />
            <Text>Created {formattedCreatedAt}</Text>
          </View>
        </View>
        <View>
          <Button title="Say Hello 👋" style={{ paddingVertical: 10 }} onPress={onPress} />
        </View>
      </View>
    </View>
  );
}

export default ChannelCreatedMessageCard;
