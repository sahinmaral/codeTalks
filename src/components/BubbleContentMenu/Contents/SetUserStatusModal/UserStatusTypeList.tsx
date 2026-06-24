import { View, TouchableOpacity } from 'react-native';
import Text from '@/components/Text';
import React from 'react';
import userStatusesData from '@/constants/userStatuses.json';
import useTheme from '@/hooks/useTheme';
import useThemedStyles from '@/hooks/useThemedStyles';
import colors from '@/styles/colors';
import makeStyles from './UserStatusTypeList.styles';
import { UserStatusOption } from '@/types';
import { UserStatusType } from '@/enums/UserStatusType';
import Icon from 'react-native-remix-icon';

type UserStatusTypeListProps = {
  currentUserStatusOption: UserStatusOption | undefined;
  handleUpdateUserStatus: (status: UserStatusType) => Promise<void>;
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

function UserStatusTypeList({
  currentUserStatusOption,
  handleUpdateUserStatus,
}: UserStatusTypeListProps) {
  const styles = useThemedStyles(makeStyles);
  const theme = useTheme();
  return (
    <View style={styles.container}>
      {userStatusesData.map((userStatus, index) => {
        return (
          <TouchableOpacity
            key={userStatus.status}
            onPress={() => handleUpdateUserStatus(userStatus.statusType)}
            style={[
              styles.cardContainer,
              {
                borderBottomWidth: index === userStatusesData.length - 1 ? 0 : 1,
                borderTopEndRadius: index === 0 ? 20 : 0,
                borderTopStartRadius: index === 0 ? 20 : 0,
                borderBottomStartRadius: index === userStatusesData.length - 1 ? 20 : 0,
                borderBottomEndRadius: index === userStatusesData.length - 1 ? 20 : 0,
                backgroundColor:
                  currentUserStatusOption?.status === userStatus.status
                    ? colors.orange[100]
                    : theme.surface,
              },
            ]}
          >
            <View style={styles.cardPillContainer}>
              <View
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 5,
                  backgroundColor: statusColors[userStatus.status],
                }}
              ></View>
            </View>
            <View style={styles.contentContainer}>
              <Text fontWeight="700">{userStatus.label}</Text>
              <Text color={theme.text.tertiary}>{userStatus.description}</Text>
            </View>
            <View style={styles.checkContainer}>
              {currentUserStatusOption?.status === userStatus.status ? (
                <Icon name="ri-check-line" color={colors.orange[400]} />
              ) : null}
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default UserStatusTypeList;
