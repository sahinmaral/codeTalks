import Text from '@/components/Text';
import { UserRole } from '@/enums/UserRole';
import { useAppDispatch } from '@/redux/hooks';
import { setActiveChannel } from '@/redux/reducers/activeChannelReducer';
import colors from '@/styles/colors';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-remix-icon';
import { Channel, RootStackParamList } from '../../types';
import ChannelThumbnail from '../ChannelThumbnail';
import styles from './ActiveChannelCard.styles';

interface ActiveChannelCardProps {
  navigation: NativeStackNavigationProp<RootStackParamList, keyof RootStackParamList>;
  channel: Channel;
}

function ActiveChannelCard({ navigation, channel }: ActiveChannelCardProps) {
  const dispatch = useAppDispatch();

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => {
        dispatch(
          setActiveChannel({
            id: channel.id,
            name: channel.name,
            description: channel.description,
            createdAt: channel.createdAt,
            inviteCode: channel.inviteCode,
            joinPolicy: channel.joinPolicy,
            role: channel.role?.name as UserRole,
          }),
        );
        navigation.navigate('ChannelMessagesList');
      }}
    >
      <View style={styles.firstSection}>
        <View style={styles.headerContainer}>
          <ChannelThumbnail
            uri={channel?.thumbnailPhotoURL}
            size={35}
            style={styles.thumbnailPhoto}
          />
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
