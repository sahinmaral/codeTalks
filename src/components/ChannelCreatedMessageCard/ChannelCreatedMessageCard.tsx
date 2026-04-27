import React from 'react';
import { Text, View } from 'react-native';
import styles from './ChannelCreatedMessageCard.styles';

interface ChannelCreatedMessageCardProps {
  channelName: string;
}

function ChannelCreatedMessageCard({ channelName }: ChannelCreatedMessageCardProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{channelName} odası kuruldu!</Text>
    </View>
  );
}

export default ChannelCreatedMessageCard;
