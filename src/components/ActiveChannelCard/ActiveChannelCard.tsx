import React, { useMemo } from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-remix-icon';
import ChannelUserStatus from '../../enums/ChannelUserStatus';
import Badge from '../Badge/Badge';
import styles from './ActiveChannelCard.styles';
import { Channel } from '../../types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';
import Text from '@/components/Text';
import colors from '@/styles/colors';

interface ActiveChannelCardProps {
  navigation: NativeStackNavigationProp<RootStackParamList>;
  channel: Channel;
}

function ActiveChannelCard({ navigation, channel }: ActiveChannelCardProps) {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => {
        navigation.navigate('ChannelMessagesList', {
          channelId: channel.id,
          channelName: channel.name,
          channelCreatedAt: channel.createdAt,
        });
      }}
    >
      <View style={styles.firstSection}>
        <View style={styles.headerContainer}>
          <View style={styles.thumbnailPhoto}>
            <Text size="large" fontWeight="800" color={colors.orange[500]}>
              #
            </Text>
          </View>
          <View style={styles.titleContainer}>
            <Text size="medium" fontWeight="700">
              {channel.name}
            </Text>
            <View style={styles.memberContainer}>
              <Icon name="ri-group-line" color={colors.gray[400]} size={18} />
              <Text size="medium" fontWeight="300" color={colors.gray[500]}>
                {channel.memberCount} members
              </Text>
            </View>
          </View>
        </View>
        {/* <View style={styles.unreadMessageContainer}>
          <View style={styles.unreadMessageBadge}>
            <Text size="medium" fontWeight="700" color={colors.white}>
              2
            </Text>
          </View>
        </View> */}
      </View>
      <View style={styles.description}>
        <Text fontWeight="300" color={colors.gray[500]}>
          {channel.description}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

export default ActiveChannelCard;
