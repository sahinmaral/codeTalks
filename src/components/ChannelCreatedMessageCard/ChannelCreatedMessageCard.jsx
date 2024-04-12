import React from 'react';
import {Text, View} from 'react-native';
import styles from '../ChannelCreatedMessageCard/ChannelCreatedMessageCard.styles';

function ChannelCreatedMessageCard({channelName}) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        {channelName} odası kuruldu!
      </Text>
    </View>
  );
}

export default ChannelCreatedMessageCard;
