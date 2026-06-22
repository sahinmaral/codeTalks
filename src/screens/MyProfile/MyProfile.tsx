import { useBubbleContentMenu } from '@/components/BubbleContentMenu';
import SetUserStatusModal from '@/components/BubbleContentMenu/Contents/SetUserStatusModal';
import UpdateProfilePhotoModal from '@/components/BubbleContentMenu/Contents/UpdateProfilePhotoModal';
import Button from '@/components/Button';
import Header from '@/components/Header';
import Text from '@/components/Text';
import UserAvatar from '@/components/UserAvatar';
import userStatusesData from '@/constants/userStatuses.json';
import { UserStatusType } from '@/enums/UserStatusType';
import getFullName from '@/helpers/getFullName';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setProfile } from '@/redux/reducers/appReducer';
import Error from '@/screens/Error';
import Loading from '@/screens/Loading';
import { fetchMe } from '@/services/auths';
import colors from '@/styles/colors';
import { ProfileStackParamList, UserStatusOption } from '@/types';
import { getApiErrorMessage } from '@/utils/getApiErrorMessage';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AxiosError } from 'axios';
import { useCallback, useMemo, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { showMessage } from 'react-native-flash-message';
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

  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.app.user);
  const profile = user?.profile ?? null;

  const { show } = useBubbleContentMenu();

  const currentStatusOption: UserStatusOption | undefined = useMemo(() => {
    return userPresenceStatuses.find(status => status.statusType === profile?.userStatus.status);
  }, [profile?.userStatus]);

  const formatMonthYear = (date: string | Date) =>
    new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' }).format(new Date(date));

  const userFullname = useMemo(() => (user ? getFullName(user) : null), [user]);

  const fetchUserProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchMe();
      dispatch(setProfile(response.data));
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

  const handleUpdateUserStatusSuccess = (status: UserStatusType) => {
    if (!profile) return;
    dispatch(
      setProfile({ ...profile, userStatus: { status, lastUpdated: new Date().toISOString() } }),
    );
  };

  useFocusEffect(
    useCallback(() => {
      if (user && !profile) fetchUserProfile();
    }, [user, profile]),
  );

  if (isLoading && !profile) {
    return <Loading text="Kullanıcı bilgileri yüklenirken lütfen bekleyiniz ..." />;
  }

  if (error && !profile) {
    return <Error description={error} />;
  }

  return (
    <View style={styles.container}>
      <Header
        title="My Profile"
        rightIcon="settings-5-line"
        onRightIconPress={() => navigation.navigate('Settings')}
      />
      <View style={styles.content}>
        <View style={styles.cardInformationContainer}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatarWrapper}>
              <UserAvatar
                uri={user?.profilePhotoURL}
                size={80}
                onPress={() => show(<UpdateProfilePhotoModal />)}
              />
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
            <Text style={styles.description}>{profile?.bio}</Text>
          </View>
          <View style={styles.editProfileContainer}>
            <Button theme="primary-outline" title="Edit Profile" style={styles.editProfileButton} />
          </View>
        </View>

        <View style={styles.additionalInformationContainer}>
          <View style={styles.additionalInformationCard}>
            <Text color={colors.orange[500]} fontWeight="700" size="large">
              {profile?.joinedChannelCount}
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
              {profile?.createdAt ? formatMonthYear(profile.createdAt) : '—'}
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
            if (!profile) return;
            show(
              <SetUserStatusModal
                currentUserStatus={profile.userStatus}
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
