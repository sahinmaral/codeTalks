import { useBubbleContentMenu } from '@/components/BubbleContentMenu/BubbleContentMenu.provider';
import Button from '@/components/Button';
import Text from '@/components/Text';
import ChannelUserStatus from '@/enums/ChannelUserStatus';
import getFullName from '@/helpers/getFullName';
import useTheme from '@/hooks/useTheme';
import useThemedStyles from '@/hooks/useThemedStyles';
import { ChannelUser } from '@/types';
import formatRelativeTime from '@/utils/formatRelativeTime';
import React from 'react';
import { Image, View } from 'react-native';
import makeStyles from './PendingJoinRequestActionList.styles';

type PendingJoinRequestActionListProps = {
  user: ChannelUser;
  onSelect: (status: ChannelUserStatus) => void;
};

function PendingJoinRequestActionList({ user, onSelect }: PendingJoinRequestActionListProps) {
  const styles = useThemedStyles(makeStyles);
  const theme = useTheme();
  const { hide } = useBubbleContentMenu();

  const fullName = getFullName(user);

  const handleSelect = (status: ChannelUserStatus) => {
    hide();
    onSelect(status);
  };

  return (
    <View>
      <View style={styles.headerContainer}>
        <View style={styles.avatarContainer}>
          {user.profilePhotoURL && (
            <Image style={styles.avatarProfilePhoto} source={{ uri: user.profilePhotoURL }} />
          )}
        </View>
        <Text fontWeight="700" size="large">
          {fullName}
        </Text>
        <Text color={theme.text.tertiary}>@{user.userName}</Text>
        <View style={styles.requestedAtPill}>
          <Text size="small" color={theme.text.tertiary}>
            Requested {formatRelativeTime(user.statusCreatedAt)}
          </Text>
        </View>
      </View>

      <View style={styles.actionListContainer}>
        <Button
          theme="success"
          icon="ri-check-line"
          title="Accept Request"
          onPress={() => handleSelect(ChannelUserStatus.Accepted)}
        />
        <Button
          theme="danger-outline"
          icon="ri-close-line"
          title="Reject Request"
          onPress={() => handleSelect(ChannelUserStatus.Denied)}
        />
        <Button
          theme="dark"
          icon="ri-forbid-line"
          title="Ban User"
          onPress={() => handleSelect(ChannelUserStatus.Banned)}
        />
        <Text size="small" color={theme.text.tertiary} style={styles.blockHelperText}>
          Blocked users cannot send join requests or see your profile.
        </Text>
      </View>
    </View>
  );
}

export default PendingJoinRequestActionList;
