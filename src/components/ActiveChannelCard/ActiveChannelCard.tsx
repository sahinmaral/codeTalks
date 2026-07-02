import Text from '@/components/Text';
import { UserRole } from '@/enums/UserRole';
import useTheme from '@/hooks/useTheme';
import useThemedStyles from '@/hooks/useThemedStyles';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setActiveChannel } from '@/redux/reducers/activeChannelReducer';
import { setChannelUnreadCount } from '@/redux/reducers/appReducer';
import { fetchGetChannelUnreadCount } from '@/services/apiServices/notifications';
import colors from '@/styles/colors';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect } from 'react';
import { TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-remix-icon';
import { Channel, RootStackParamList } from '../../types';
import ChannelThumbnail from '../ChannelThumbnail';
import makeStyles from './ActiveChannelCard.styles';

interface ActiveChannelCardProps {
  navigation: NativeStackNavigationProp<RootStackParamList, keyof RootStackParamList>;
  channel: Channel;
}

function ActiveChannelCard({ navigation, channel }: ActiveChannelCardProps) {
  const dispatch = useAppDispatch();
  const styles = useThemedStyles(makeStyles);
  const theme = useTheme();
  const unreadCount = useAppSelector(state => state.app.channelUnreadCounts?.[channel.id] ?? 0);
  const isMuted = useAppSelector(state =>
    state.app.channelMuteSettings.some(
      setting => setting.channelId === channel.id && setting.isMuted,
    ),
  );

  useEffect(() => {
    let cancelled = false;

    fetchGetChannelUnreadCount(channel.id)
      .then(({ data }) => {
        if (!cancelled) dispatch(setChannelUnreadCount({ channelId: channel.id, count: data }));
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [channel.id, dispatch]);

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
            <View style={styles.titleRow}>
              <Text size="medium" fontWeight="700">
                {channel.name}
              </Text>
              {isMuted && (
                <Icon name="ri-notification-off-line" color={theme.text.tertiary} size={16} />
              )}
            </View>
            <View style={styles.memberContainer}>
              <Icon name="ri-group-line" color={theme.text.tertiary} size={18} />
              <Text size="medium" fontWeight="300" color={theme.text.secondary}>
                {channel.memberCount} members
              </Text>
            </View>
          </View>
        </View>
        {unreadCount > 0 && (
          <View style={styles.unreadMessageContainer}>
            <View style={styles.unreadMessageBadge}>
              <Text size="medium" fontWeight="700" color={colors.white}>
                {unreadCount > 99 ? '99+' : unreadCount}
              </Text>
            </View>
          </View>
        )}
      </View>
      <View style={styles.description}>
        <Text fontWeight="300" color={theme.text.secondary}>
          {channel.description}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

export default ActiveChannelCard;
