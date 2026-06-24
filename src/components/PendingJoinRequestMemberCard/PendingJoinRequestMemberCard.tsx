import ChannelUserStatus from '@/enums/ChannelUserStatus';
import useTheme from '@/hooks/useTheme';
import useThemedStyles from '@/hooks/useThemedStyles';
import getFullName from '@/helpers/getFullName';
import { ChannelUser } from '@/types';
import formatRelativeTime from '@/utils/formatRelativeTime';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useBubbleContentMenu } from '../BubbleContentMenu';
import PendingJoinRequestActionList from '../BubbleContentMenu/Contents/PendingJoinRequestActionList';
import Text from '../Text';
import UserAvatar from '../UserAvatar';
import makeStyles from './PendingJoinRequestMemberCard.styles';

type PendingJoinRequestMemberCardProps = {
  user: ChannelUser;
  onSubmit: (status: ChannelUserStatus) => void;
};

const PendingJoinRequestMemberCard = ({ user, onSubmit }: PendingJoinRequestMemberCardProps) => {
  const styles = useThemedStyles(makeStyles);
  const theme = useTheme();
  const fullName = getFullName(user);

  const { show } = useBubbleContentMenu();

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() =>
        show(<PendingJoinRequestActionList user={user} onSelect={status => onSubmit(status)} />)
      }
    >
      <View style={styles.userInformationsContainer}>
        <UserAvatar uri={user.profilePhotoURL} size={50} />
        <View style={styles.userInformationContainer}>
          <Text fontWeight="700">{fullName}</Text>
          <Text color={theme.text.tertiary}>@{user.userName}</Text>
        </View>
        <View style={styles.statusCreateAtContainer}>
          <Text size="small" color={theme.text.tertiary} style={{ textAlign: 'right' }}>
            {formatRelativeTime(user.statusCreatedAt)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default PendingJoinRequestMemberCard;
