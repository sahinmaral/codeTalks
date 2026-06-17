import ChannelUserStatus from '@/enums/ChannelUserStatus';
import getFullName from '@/helpers/getFullName';
import colors from '@/styles/colors';
import { ChannelUser } from '@/types';
import formatRelativeTime from '@/utils/formatRelativeTime';
import React from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import { useBubbleContentMenu } from '../BubbleContentMenu';
import PendingJoinRequestActionList from '../BubbleContentMenu/Contents/PendingJoinRequestActionList';
import Text from '../Text';
import styles from './PendingJoinRequestMemberCard.styles';

type PendingJoinRequestMemberCardProps = {
  user: ChannelUser;
  onSubmit: (status: ChannelUserStatus) => void;
};

const PendingJoinRequestMemberCard = ({ user, onSubmit }: PendingJoinRequestMemberCardProps) => {
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
        <View style={styles.avatarContainer}>
          {user.profilePhotoURL && (
            <Image style={styles.avatarProfilePhoto} source={{ uri: user.profilePhotoURL }} />
          )}
        </View>
        <View style={styles.userInformationContainer}>
          <Text fontWeight="700">{fullName}</Text>
          <Text color={colors.gray[400]}>@{user.userName}</Text>
        </View>
        <View style={styles.statusCreateAtContainer}>
          <Text size="small" color={colors.gray[400]} style={{ textAlign: 'right' }}>
            {formatRelativeTime(user.statusCreatedAt)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default PendingJoinRequestMemberCard;
