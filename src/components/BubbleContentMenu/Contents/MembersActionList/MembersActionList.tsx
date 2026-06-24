import Button from '@/components/Button';
import { useConfirmationDialog } from '@/components/ConfirmationDialog';
import Text from '@/components/Text';
import UserAvatar from '@/components/UserAvatar';
import ChannelUserStatus from '@/enums/ChannelUserStatus';
import { UserRole } from '@/enums/UserRole';
import getFullName from '@/helpers/getFullName';
import useTheme from '@/hooks/useTheme';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setRoleOfCurrentUser } from '@/redux/reducers/activeChannelReducer';
import {
  fetchPatchUserRole,
  fetchPatchUserStatus,
  fetchRemoveMemberFromChannel,
} from '@/services/channels';
import colors from '@/styles/colors';
import { ChannelUser } from '@/types';
import formatRelativeTime from '@/utils/formatRelativeTime';
import { getApiErrorMessage } from '@/utils/getApiErrorMessage';
import { AxiosError } from 'axios';
import React, { useCallback, useMemo, useState } from 'react';
import { View } from 'react-native';
import { showMessage } from 'react-native-flash-message';
import Icon from 'react-native-remix-icon';
import styles from './MembersActionList.styles';

type MembersActionListProps = {
  selectedUser: ChannelUser;
  onActionComplete?: () => void;
};

type ActionButtonsProps = {
  selectedUser: ChannelUser & { fullName: string };
  channelId: string;
  onActionComplete?: () => void;
};

function MembersActionList({ selectedUser, onActionComplete }: MembersActionListProps) {
  const fullName = getFullName(selectedUser);

  const currentChannel = useAppSelector(state => state.activeChannel.channel);
  const theme = useTheme();
  if (!currentChannel) return null;

  const currentUserRoleAtChannel = currentChannel.role;

  const pillStyleByRoleName = useMemo(() => {
    switch (selectedUser.role.name) {
      case UserRole.Owner:
        return { backgroundColor: colors.orange[200] };
      case UserRole.Moderator:
        return { backgroundColor: colors.gray[300], borderWidth: 1, borderColor: colors.gray[400] };
      default:
        return { backgroundColor: colors.gray[300] };
    }
  }, [selectedUser.role.name]);

  const pillTextColorByRoleName = useMemo(() => {
    switch (selectedUser.role.name) {
      case UserRole.Owner:
        return colors.orange[500];
      case UserRole.Moderator:
        return colors.black;
      default:
        return colors.gray[500];
    }
  }, [selectedUser.role.name]);

  const pillIconByRoleName = useMemo(() => {
    switch (selectedUser.role.name) {
      case UserRole.Owner:
        return (
          <View style={[styles.pillIconBadge, { backgroundColor: colors.orange[500] }]}>
            <Icon name="star-fill" size={12} color={colors.white} />
          </View>
        );
      case UserRole.Moderator:
        return <Icon name="star-fill" size={12} color={colors.white} />;
      default:
        return null;
    }
  }, [selectedUser.role.name]);

  const renderActionButtonsByRoleName = useCallback(() => {
    switch (currentUserRoleAtChannel) {
      case UserRole.Owner:
        return (
          <OwnerActionButtons
            selectedUser={{ ...selectedUser, fullName }}
            channelId={currentChannel.id}
            onActionComplete={onActionComplete}
          />
        );
      case UserRole.Moderator:
        return (
          <ModeratorActionButtons
            selectedUser={{ ...selectedUser, fullName }}
            channelId={currentChannel.id}
            onActionComplete={onActionComplete}
          />
        );
      default:
        return null;
    }
  }, [selectedUser.role.name]);

  return (
    <View>
      <View style={styles.headerContainer}>
        <UserAvatar uri={selectedUser.profilePhotoURL} size={60} />
        <Text fontWeight="700" size="large">
          {fullName}
        </Text>
        <Text color={theme.text.tertiary}>@{selectedUser.userName}</Text>
        <View>
          <Text size="small" color={theme.text.tertiary}>
            Joined {formatRelativeTime(selectedUser.statusCreatedAt)}
          </Text>
        </View>
        <View style={[styles.rolePillContainer, pillStyleByRoleName]}>
          {pillIconByRoleName}
          <Text size="small" fontWeight="700" color={pillTextColorByRoleName}>
            {selectedUser.role.name.toUpperCase()}
          </Text>
        </View>
      </View>

      <View style={styles.actionListContainer}>{renderActionButtonsByRoleName()}</View>
    </View>
  );
}

function OwnerActionButtons({ selectedUser, channelId, onActionComplete }: ActionButtonsProps) {
  const initialLoadingState = {
    removeModerator: false,
    removeFromChannel: false,
    banUser: false,
    toggleOwner: false,
    toggleModerator: false,
  };

  const [loading, setLoading] = useState(initialLoadingState);
  const isAnyProcessLoadig = Object.values(loading).filter(value => value).length === 1;

  const dispatch = useAppDispatch();
  const { confirm } = useConfirmationDialog();

  const handlePatchUserStatus = async (status: ChannelUserStatus) => {
    try {
      setLoading(prev => ({ ...prev, banUser: true }));
      await fetchPatchUserStatus(channelId, selectedUser.id, status);
      onActionComplete?.();
    } catch (exception) {
      if (exception instanceof AxiosError) {
        showMessage({ message: getApiErrorMessage(exception), type: 'danger' });
      } else {
        showMessage({ message: 'An error occurred', type: 'danger' });
      }
    } finally {
      setLoading(initialLoadingState);
    }
  };

  const handleRemoveFromChannel = async () => {
    try {
      setLoading(prev => ({ ...prev, removeFromChannel: true }));
      await fetchRemoveMemberFromChannel(channelId, selectedUser.id);
      onActionComplete?.();
    } catch (exception) {
      if (exception instanceof AxiosError) {
        showMessage({ message: getApiErrorMessage(exception), type: 'danger' });
      } else {
        showMessage({ message: 'An error occurred', type: 'danger' });
      }
    } finally {
      setLoading(initialLoadingState);
    }
  };

  const handlePatchUserRole = async (targetRole: UserRole) => {
    try {
      if (targetRole == UserRole.Owner) {
        setLoading(prev => ({ ...prev, toggleOwner: true }));
      }
      if (targetRole == UserRole.Moderator) {
        setLoading(prev => ({ ...prev, toggleModerator: true }));
      }
      if (targetRole == UserRole.User) {
        setLoading(prev => ({ ...prev, removeModerator: true }));
      }

      await fetchPatchUserRole(channelId, selectedUser.id, targetRole);

      if (targetRole == UserRole.Owner) {
        dispatch(setRoleOfCurrentUser(UserRole.User));
      }

      onActionComplete?.();
    } catch (exception) {
      if (exception instanceof AxiosError) {
        showMessage({ message: getApiErrorMessage(exception), type: 'danger' });
      } else {
        showMessage({ message: 'An error occurred', type: 'danger' });
      }
    } finally {
      setLoading(initialLoadingState);
    }
  };

  return (
    <>
      {selectedUser.role.name === UserRole.Moderator ? (
        <>
          <Button
            theme="primary"
            icon="ri-vip-crown-line"
            title="Make Owner"
            disabled={isAnyProcessLoadig}
            loading={loading.toggleOwner}
            onPress={() => {
              confirm({
                theme: 'primary',
                icon: 'vip-crown-line',
                title: 'Transfer Ownership?',
                description: `Are you sure you want to make ${selectedUser.fullName} the owner? You will lose owner privileges.`,
                confirmTitle: 'Make Owner',
                onConfirm: () => handlePatchUserRole(UserRole.Owner),
              });
            }}
          />
          <Button
            theme="primary-outline"
            icon="ri-user-line"
            title="Remove Moderator"
            disabled={isAnyProcessLoadig}
            loading={loading.removeModerator}
            onPress={() => {
              confirm({
                theme: 'warning',
                icon: 'user-line',
                title: 'Remove Moderator?',
                description: `Are you sure you want to remove ${selectedUser.fullName} as a moderator? They will become a regular member.`,
                confirmTitle: 'Remove Moderator',
                onConfirm: () => handlePatchUserRole(UserRole.User),
              });
            }}
          />
          <Button
            theme="danger-outline"
            icon="ri-user-unfollow-line"
            title="Remove from Channel"
            disabled={isAnyProcessLoadig}
            loading={loading.removeFromChannel}
            onPress={() => {
              confirm({
                theme: 'danger',
                icon: 'user-unfollow-line',
                title: 'Remove from Channel?',
                description: `Are you sure you want to remove ${selectedUser.fullName} from this channel? They can request to join again later.`,
                confirmTitle: 'Remove',
                onConfirm: () => handleRemoveFromChannel(),
              });
            }}
          />
          <Button
            theme="dark"
            icon="ri-forbid-line"
            title="Ban User"
            disabled={isAnyProcessLoadig}
            loading={loading.banUser}
            onPress={() => {
              confirm({
                theme: 'danger',
                icon: 'forbid-line',
                title: 'Ban User?',
                description: `Are you sure you want to ban ${selectedUser.fullName}? They won't be able to rejoin this channel.`,
                confirmTitle: 'Ban User',
                onConfirm: () => handlePatchUserStatus(ChannelUserStatus.Banned),
              });
            }}
          />
        </>
      ) : null}
      {selectedUser.role.name === UserRole.User ? (
        <>
          <Button
            theme="primary"
            icon="ri-vip-crown-line"
            title="Make Owner"
            disabled={isAnyProcessLoadig}
            loading={loading.toggleOwner}
            onPress={() => {
              confirm({
                theme: 'primary',
                icon: 'vip-crown-line',
                title: 'Transfer Ownership?',
                description: `Are you sure you want to make ${selectedUser.fullName} the owner? You will lose owner privileges.`,
                confirmTitle: 'Make Owner',
                onConfirm: () => handlePatchUserRole(UserRole.Owner),
              });
            }}
          />
          <Button
            theme="primary-outline"
            icon="ri-star-line"
            title="Make Moderator"
            disabled={isAnyProcessLoadig}
            loading={loading.toggleModerator}
            onPress={() => {
              confirm({
                theme: 'primary',
                icon: 'star-line',
                title: 'Make Moderator?',
                description: `Are you sure you want to make ${selectedUser.fullName} a moderator? They will be able to manage members.`,
                confirmTitle: 'Make Moderator',
                onConfirm: () => handlePatchUserRole(UserRole.Moderator),
              });
            }}
          />
          <Button
            theme="danger-outline"
            icon="ri-user-unfollow-line"
            title="Remove from Channel"
            disabled={isAnyProcessLoadig}
            loading={loading.removeFromChannel}
            onPress={() => {
              confirm({
                theme: 'danger',
                icon: 'user-unfollow-line',
                title: 'Remove from Channel?',
                description: `Are you sure you want to remove ${selectedUser.fullName} from this channel? They can request to join again later.`,
                confirmTitle: 'Remove',
                onConfirm: () => handleRemoveFromChannel(),
              });
            }}
          />
          <Button
            theme="dark"
            icon="ri-forbid-line"
            title="Ban User"
            disabled={isAnyProcessLoadig}
            loading={loading.banUser}
            onPress={() => {
              confirm({
                theme: 'danger',
                icon: 'forbid-line',
                title: 'Ban User?',
                description: `Are you sure you want to ban ${selectedUser.fullName}? They won't be able to rejoin this channel.`,
                confirmTitle: 'Ban User',
                onConfirm: () => handlePatchUserStatus(ChannelUserStatus.Banned),
              });
            }}
          />
        </>
      ) : null}
    </>
  );
}

function ModeratorActionButtons({ selectedUser, channelId, onActionComplete }: ActionButtonsProps) {
  const initialLoadingState = {
    removeFromChannel: false,
    banUser: false,
  };

  const [loading, setLoading] = useState(initialLoadingState);
  const isAnyProcessLoadig = Object.values(loading).filter(value => value).length === 1;

  const { confirm } = useConfirmationDialog();

  const handlePatchUserStatus = async (status: ChannelUserStatus) => {
    try {
      setLoading(prev => ({ ...prev, banUser: true }));
      await fetchPatchUserStatus(channelId, selectedUser.id, status);
      onActionComplete?.();
    } catch (exception) {
      if (exception instanceof AxiosError) {
        showMessage({ message: getApiErrorMessage(exception), type: 'danger' });
      } else {
        showMessage({ message: 'An error occurred', type: 'danger' });
      }
    } finally {
      setLoading(initialLoadingState);
    }
  };

  const handleRemoveFromChannel = async () => {
    try {
      setLoading(prev => ({ ...prev, removeFromChannel: true }));
      await fetchRemoveMemberFromChannel(channelId, selectedUser.id);
      onActionComplete?.();
    } catch (exception) {
      if (exception instanceof AxiosError) {
        showMessage({ message: getApiErrorMessage(exception), type: 'danger' });
      } else {
        showMessage({ message: 'An error occurred', type: 'danger' });
      }
    } finally {
      setLoading(initialLoadingState);
    }
  };

  return (
    <>
      {selectedUser.role.name === UserRole.User ? (
        <>
          <Button
            theme="danger-outline"
            icon="ri-user-unfollow-line"
            title="Remove from Channel"
            disabled={isAnyProcessLoadig}
            loading={loading.removeFromChannel}
            onPress={() => {
              confirm({
                theme: 'danger',
                icon: 'user-unfollow-line',
                title: 'Remove from Channel?',
                description: `Are you sure you want to remove ${selectedUser.fullName} from this channel? They can request to join again later.`,
                confirmTitle: 'Remove',
                onConfirm: () => handleRemoveFromChannel(),
              });
            }}
          />
          <Button
            theme="dark"
            icon="ri-forbid-line"
            title="Ban User"
            disabled={isAnyProcessLoadig}
            loading={loading.banUser}
            onPress={() => {
              confirm({
                theme: 'danger',
                icon: 'forbid-line',
                title: 'Ban User?',
                description: `Are you sure you want to ban ${selectedUser.fullName}? They won't be able to rejoin this channel.`,
                confirmTitle: 'Ban User',
                onConfirm: () => handlePatchUserStatus(ChannelUserStatus.Banned),
              });
            }}
          />
        </>
      ) : null}
    </>
  );
}

export default MembersActionList;
