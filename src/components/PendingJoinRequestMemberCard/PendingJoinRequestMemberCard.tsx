import ChannelUserStatus from '@/enums/ChannelUserStatus';
import colors from '@/styles/colors';
import { ChannelUser } from '@/types';
import formatRelativeTime from '@/utils/formatRelativeTime';
import React from 'react';
import { Image, View } from 'react-native';
import Button from '../Button';
import Divider from '../Divider';
import Text from '../Text';
import styles from './PendingJoinRequestMemberCard.styles';

type PendingJoinRequestMemberCardProps = {
  user: ChannelUser;
  onSubmit: (status: ChannelUserStatus) => void;
};

const PendingJoinRequestMemberCard = ({ user, onSubmit }: PendingJoinRequestMemberCardProps) => {
  const fullName = [user.firstName, user.middleName, user.lastName].filter(Boolean).join(' ');

  return (
    <View style={styles.container}>
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
      <Divider />
      <View style={styles.actionsContainer}>
        <Button
          theme="success-outline"
          icon="ri-check-line"
          title="Accept"
          style={styles.actionButton}
          onPress={() => onSubmit(ChannelUserStatus.Accepted)}
        />
        <Button
          theme="danger-outline"
          icon="ri-close-line"
          title="Reject"
          style={styles.actionButton}
          onPress={() => onSubmit(ChannelUserStatus.Denied)}
        />
      </View>
    </View>
  );
};

export default PendingJoinRequestMemberCard;
