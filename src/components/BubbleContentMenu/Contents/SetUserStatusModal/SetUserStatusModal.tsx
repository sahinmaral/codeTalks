import { useBubbleContentMenuScroll } from '@/components/BubbleContentMenu/BubbleContentMenu.context';
import { useBubbleContentMenu } from '@/components/BubbleContentMenu/BubbleContentMenu.provider';
import Text from '@/components/Text';
import userStatusesData from '@/constants/userStatuses.json';
import { UserStatusType } from '@/enums/UserStatusType';
import translateErrorMessage from '@/helpers/apiErrorTranslation';
import { fetchUpdateUserStatus } from '@/services/users';
import colors from '@/styles/colors';
import { UserStatus, UserStatusOption } from '@/types';
import React, { useMemo, useRef, useState } from 'react';
import { View } from 'react-native';
import { showMessage } from 'react-native-flash-message';
import styles from './SetUserStatusModal.styles';
import UserStatusTypeList from './UserStatusTypeList';

type SetUserStatusModalProps = {
  currentUserStatus: UserStatus;
  onSuccess?: (status: UserStatusType) => void;
};

const statusColors: Record<string, string> = {
  Online: colors.success,
  Away: colors.warning,
  Busy: colors.danger,
  Invisible: colors.gray[300],
};

const userPresenceStatuses: UserStatusOption[] = userStatusesData.map(item => ({
  ...item,
  color: statusColors[item.status],
}));

function SetUserStatusModal({ currentUserStatus, onSuccess }: SetUserStatusModalProps) {
  const initialValues = { channelId: '' };
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { scrollTo } = useBubbleContentMenuScroll();
  const { hide } = useBubbleContentMenu();
  const groupYPositions = useRef<Record<number, number>>({});

  const currentUserStatusOption: UserStatusOption | undefined = useMemo(() => {
    return userPresenceStatuses.find(status => status.statusType === currentUserStatus.status);
  }, [currentUserStatus]);

  const handleUpdateUserStatus = async (status: UserStatusType) => {
    try {
      setLoading(true);
      await fetchUpdateUserStatus({ status });
      hide();
      onSuccess?.(status);
    } catch (err: any) {
      const errorResult = err?.response?.data;
      showMessage({
        message: translateErrorMessage(errorResult?.Detail ?? ''),
        type: 'danger',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View>
      <View style={styles.header}>
        <Text fontWeight="800" size="large">
          Send Status
        </Text>
      </View>

      <View style={styles.description}>
        <Text color={colors.gray[400]}>Currently: </Text>
        <Text size="medium" fontWeight="700" color={currentUserStatusOption?.color}>
          {currentUserStatusOption?.label}
        </Text>
      </View>

      <UserStatusTypeList
        currentUserStatusOption={currentUserStatusOption}
        handleUpdateUserStatus={handleUpdateUserStatus}
      />
    </View>
  );
}

export default SetUserStatusModal;
