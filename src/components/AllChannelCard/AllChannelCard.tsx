import Button from '@/components/Button';
import Text from '@/components/Text';
import ChannelJoinPolicy from '@/enums/ChannelJoinPolicy';
import ChannelUserStatus from '@/enums/ChannelUserStatus';
import { fetchJoinChannel } from '@/services/apiServices/channels';
import useTheme from '@/hooks/useTheme';
import useThemedStyles from '@/hooks/useThemedStyles';
import { Channel } from '@/types';
import { getApiErrorMessage } from '@/utils/getApiErrorMessage';
import { AxiosError } from 'axios';
import React, { useState } from 'react';
import { View } from 'react-native';
import { showMessage } from 'react-native-flash-message';
import Icon from 'react-native-remix-icon';
import ChannelThumbnail from '../ChannelThumbnail';
import makeStyles from './AllChannelCard.styles';

interface AllChannelCardProps {
  channel: Channel;
}

function AllChannelCard({ channel }: AllChannelCardProps) {
  const styles = useThemedStyles(makeStyles);
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<ChannelUserStatus | null>(
    channel.status != null ? (channel.status as ChannelUserStatus) : null,
  );

  const isOpen = channel.joinPolicy === ChannelJoinPolicy.Open;

  const handleJoin = async () => {
    try {
      setLoading(true);
      const { data } = await fetchJoinChannel({ inviteCode: channel.inviteCode });

      setStatus(data.status);
      showMessage({
        message:
          data.status === ChannelUserStatus.Accepted
            ? 'Kanala başarıyla katıldınız'
            : 'İsteğiniz başarıyla gönderildi',
        type: 'success',
      });
    } catch (exception) {
      if (exception instanceof AxiosError) {
        showMessage({ message: getApiErrorMessage(exception), type: 'danger' });
      } else {
        showMessage({ message: 'An error occurred', type: 'danger' });
      }
    } finally {
      setLoading(false);
    }
  };

  const joined = status === ChannelUserStatus.Accepted;
  const requested = status === ChannelUserStatus.RequestSent;

  const buttonTitle = loading
    ? isOpen
      ? 'Joining...'
      : 'Sending...'
    : joined
      ? 'Joined'
      : requested
        ? 'Requested'
        : isOpen
          ? 'Join'
          : 'Request to Join';

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <ChannelThumbnail
          uri={channel?.thumbnailPhotoURL}
          size={40}
          style={styles.thumbnailPhoto}
        />
        <View style={styles.titleContainer}>
          <Text size="medium" fontWeight="700">
            {channel.name}
          </Text>
          <View style={styles.memberContainer}>
            <Icon name="ri-group-line" color={theme.text.tertiary} size={18} />
            <Text size="medium" fontWeight="300" color={theme.text.secondary}>
              {channel.memberCount} members
            </Text>
          </View>
        </View>
      </View>

      {channel.description ? (
        <View style={styles.description}>
          <Text fontWeight="300" color={theme.text.secondary}>
            {channel.description}
          </Text>
        </View>
      ) : null}

      <Button
        title={buttonTitle}
        theme="primary-outline"
        style={styles.joinButton}
        loading={loading}
        disabled={loading || joined || requested}
        onPress={handleJoin}
      />
    </View>
  );
}

export default AllChannelCard;
