import { useBubbleContentMenu } from '@/components/BubbleContentMenu';
import SetUserStatusModal from '@/components/BubbleContentMenu/Contents/SetUserStatusModal';
import Button from '@/components/Button';
import Header from '@/components/Header';
import Text from '@/components/Text';
import userStatusesData from '@/constants/userStatuses.json';
import { UserStatusType } from '@/enums/UserStatusType';
import Error from '@/screens/Error';
import Loading from '@/screens/Loading';
import { fetchMe } from '@/services/auths';
import colors from '@/styles/colors';
import { MyProfileDto, ProfileStackParamList, UserStatusOption } from '@/types';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback, useMemo, useState } from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-remix-icon';
import styles from './MyProfile.styles';

type MyProfileProps = {
  navigation: NativeStackNavigationProp<ProfileStackParamList, 'MyProfile'>;
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

function MyProfile({ navigation }: MyProfileProps) {
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<MyProfileDto | null>(null);

  const { show } = useBubbleContentMenu();

  const currentStatusOption: UserStatusOption | undefined = useMemo(() => {
    return userPresenceStatuses.find(status => status.statusType === user?.userStatus.status);
  }, [user?.userStatus]);

  const formatMonthYear = (date: string | Date) =>
    new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' }).format(new Date(date));

  const userFullname = useMemo(() => {
    if (user) {
      if (user.middleName) return `${user.firstName} ${user.middleName} ${user.lastName}`;
      else return `${user.firstName} ${user.lastName}`;
    }
    return null;
  }, [user]);

  const fetchUserProfile = async () => {
    setLoading(true);
    try {
      const response = await fetchMe();
      setUser(response.data);
    } catch (err) {
      setError('Failed to load user profile');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUserStatusSuccess = (status: UserStatusType) => {
    setUser(prev =>
      prev ? { ...prev, userStatus: { status, lastUpdated: new Date().toISOString() } } : prev,
    );
  };

  useFocusEffect(
    useCallback(() => {
      fetchUserProfile();
    }, []),
  );

  if (isLoading) {
    return <Loading text="Kullanıcı bilgileri yüklenirken lütfen bekleyiniz ..." />;
  }

  if (!isLoading && error) {
    return <Error description={error} />;
  }

  return (
    <View style={styles.container}>
      <Header
        title="My Profile"
        showRightIcon
        rightIcon="settings-5-line"
        onRightIconPress={() => navigation.navigate('Settings')}
      />
      <View style={styles.content}>
        <View style={styles.cardInformationContainer}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatarWrapper}>
              <View style={styles.avatarInner}>
                {user?.profilePhotoURL ? (
                  <Image
                    source={{ uri: user.profilePhotoURL }}
                    style={{ width: 80, height: 80, borderRadius: 40 }}
                  />
                ) : null}
              </View>
            </View>
          </View>
          <View style={styles.headerContainer}>
            <View>
              <Text size="large" fontWeight="700" style={{ textAlign: 'center' }}>
                {userFullname}
              </Text>
              <Text color={colors.gray[400]} style={{ textAlign: 'center' }}>
                @{user?.userName}
              </Text>
            </View>
            <Text style={styles.description}>{user?.bio}</Text>
          </View>
          <View style={styles.editProfileContainer}>
            <Button theme="primary-outline" title="Edit Profile" style={styles.editProfileButton} />
          </View>
        </View>

        <View style={styles.additionalInformationContainer}>
          <View style={styles.additionalInformationCard}>
            <Text color={colors.orange[500]} fontWeight="700" size="large">
              {user?.joinedChannelCount}
            </Text>
            <Text
              style={styles.additionalInformationCardDescription}
              color={colors.gray[500]}
              fontWeight="400"
            >
              Channels
            </Text>
          </View>
          <View style={styles.additionalInformationCard}>
            <Text
              style={styles.additionalInformationCardHeader}
              color={colors.orange[500]}
              size="large"
              fontWeight="700"
            >
              {user?.createdAt ? formatMonthYear(user.createdAt) : '—'}
            </Text>
            <Text
              style={styles.additionalInformationCardDescription}
              color={colors.gray[500]}
              fontWeight="400"
            >
              Joined
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.userPresenceStatusContainer}
          onPress={() => {
            if (!user) return;
            show(
              <SetUserStatusModal
                currentUserStatus={user.userStatus}
                onSuccess={status => handleUpdateUserStatusSuccess(status)}
              />,
            );
          }}
        >
          <View style={styles.userPresenceStatusBadgeContainer}>
            <View
              style={[
                styles.userPresenceStatusBadge,
                { backgroundColor: currentStatusOption?.color },
              ]}
            ></View>
            <Text fontWeight="500">{currentStatusOption?.label}</Text>
          </View>
          <Icon
            name="arrow-right-s-line"
            size={20}
            color={colors.gray[400]}
            style={{ marginLeft: 10 }}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default MyProfile;
