import React, { useMemo } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-remix-icon';
import ChannelUserStatus from '../../enums/ChannelUserStatus';
import Badge from '../Badge/Badge';
import styles from '../../screens/ChannelList/ChannelList.styles';
import { Channel } from '../../types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';

interface ChannelCardProps {
  navigation: NativeStackNavigationProp<RootStackParamList>;
  channel: Channel;
  toggleModal: () => void;
  handleSelectChannel: (channel: Channel) => void;
}

function ChannelCard({ navigation, channel, toggleModal, handleSelectChannel }: ChannelCardProps) {
  const isUserAcceptedToThisChannel = useMemo(() => {
    return channel.status === ChannelUserStatus.Accepted;
  }, [channel]);

  const userStatusAtChannelBadgeText = useMemo(() => {
    switch (channel.status) {
      case ChannelUserStatus.RequestSent:
        return 'İstek gönderildi';
      case ChannelUserStatus.Denied:
        return 'İstek reddedildi';
      case ChannelUserStatus.Blocked:
        return 'Kanaldan bloklandınız';
      default:
        return '';
    }
  }, [channel]);

  const userStatusAtChannelBadgeColor = useMemo(() => {
    switch (channel.status) {
      case ChannelUserStatus.RequestSent:
        return 'success' as const;
      case ChannelUserStatus.Denied:
        return 'danger' as const;
      case ChannelUserStatus.Blocked:
        return 'warning' as const;
      default:
        return 'info' as const;
    }
  }, [channel]);

  return (
    <TouchableOpacity
      disabled={!isUserAcceptedToThisChannel}
      style={styles.channelCardContainer}
      onPress={() => {
        if (isUserAcceptedToThisChannel) {
          navigation.navigate('ChannelMessagesList', {
            channelId: channel.id,
            channelName: channel.name,
          });
        }
      }}
    >
      <View style={styles.channelCardContentLeftPartContainer}>
        <Image
          style={styles.channelCardPhoto}
          source={{ uri: 'https://reactnative.dev/img/tiny_logo.png' }}
        />
        <View style={styles.channelCardHeaderContainer}>
          <Text style={styles.channelCardHeaderText}>{channel.name}</Text>
          {channel.status !== ChannelUserStatus.Accepted ? (
            <Badge text={userStatusAtChannelBadgeText} color={userStatusAtChannelBadgeColor} />
          ) : null}
        </View>
      </View>
      {isUserAcceptedToThisChannel ? (
        <TouchableOpacity
          style={styles.channelCardContentRightPartContainer}
          onPress={() => {
            toggleModal();
            handleSelectChannel(channel);
          }}
        >
          <Icon name="menu-line" size={24} color="black" />
        </TouchableOpacity>
      ) : null}
    </TouchableOpacity>
  );
}

export default ChannelCard;
