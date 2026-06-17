import ChannelMemberCard from '@/components/ChannelMemberCard';
import { ChannelMemberCardType } from '@/components/ChannelMemberCard/ChannelMemberCard';
import { useConfirmationDialog } from '@/components/ConfirmationDialog';
import Header from '@/components/Header';
import Input from '@/components/Input';
import Text from '@/components/Text';
import { UserRole } from '@/enums/UserRole';
import getFullName from '@/helpers/getFullName';
import useDebounce from '@/hooks/useDebounce';
import { useAppSelector } from '@/redux/hooks';
import { fetchGetUsersByChannelId, fetchRemoveMemberFromChannel } from '@/services/channels';
import colors from '@/styles/colors';
import { ChannelUser, RootStackParamList, UsersAtChannelListModel } from '@/types';
import { getApiErrorMessage } from '@/utils/getApiErrorMessage';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AxiosError } from 'axios';
import React, { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  View,
} from 'react-native';
import { showMessage } from 'react-native-flash-message';
import Loading from '../Loading';
import styles from './RemoveMemberFromChannel.styles';

type RemoveMemberFromChannelProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'RemoveMemberFromChannel'>;
};

const PAGE_SIZE = 5;

const matchesSearch = (user: ChannelUser, term: string) => {
  if (!term) return true;

  const fullName = getFullName(user).toLowerCase();

  return fullName.includes(term) || user.userName.toLowerCase().includes(term);
};

const RemoveMemberFromChannel = ({ navigation }: RemoveMemberFromChannelProps) => {
  const currentUserId = useAppSelector(state => state.app.user?.id);
  const channelId = useAppSelector(state => state.activeChannel.channel?.id ?? '');
  const currentRole = useAppSelector(state => state.activeChannel.channel?.role);

  const [admins, setAdmins] = useState<ChannelUser[]>([]);
  const [members, setMembers] = useState<ChannelUser[]>([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [loading, setLoading] = useState(true);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  const { confirm } = useConfirmationDialog();

  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search.trim(), 400);

  const handleRemoveMemberFromChannel = async (userIdIsBeingRemoved: string) => {
    try {
      setLoading(true);
      await fetchRemoveMemberFromChannel(channelId, userIdIsBeingRemoved);
      setPageIndex(0);
      await fetchPage(0);
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

  const fetchPage = useCallback(
    async (index: number) => {
      const response = await fetchGetUsersByChannelId(channelId, {
        search: debouncedSearch,
        index,
        size: PAGE_SIZE,
      });

      const data = response.data as UsersAtChannelListModel;
      setMembers(prev => (index === 0 ? data.items : [...prev, ...data.items]));
      setHasNext(data.hasNext);
      if (index === 0) {
        setAdmins(data.admins ?? []);
      }
    },
    [channelId, debouncedSearch],
  );

  useFocusEffect(
    useCallback(() => {
      let active = true;

      (async () => {
        try {
          setLoading(true);
          setPageIndex(0);
          await fetchPage(0);
        } catch {
        } finally {
          if (active) {
            setLoading(false);
            setHasLoaded(true);
          }
        }
      })();

      return () => {
        active = false;
      };
    }, [fetchPage]),
  );

  const handleLoadMore = useCallback(async () => {
    if (isFetchingMore || !hasNext) return;

    setIsFetchingMore(true);
    const nextIndex = pageIndex + 1;
    try {
      await fetchPage(nextIndex);
      setPageIndex(nextIndex);
    } catch {
    } finally {
      setIsFetchingMore(false);
    }
  }, [isFetchingMore, hasNext, pageIndex, fetchPage]);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const isNearBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - 80;
    if (isNearBottom) handleLoadMore();
  };

  const filteredAdmins = useMemo(() => {
    const term = debouncedSearch.toLowerCase();
    return admins.filter(admin => matchesSearch(admin, term));
  }, [admins, debouncedSearch]);

  const hasResults = filteredAdmins.length > 0 || members.length > 0;

  if (loading && !hasLoaded) {
    return <Loading text="Kanaldaki kullanıcılar yüklenirken lütfen bekleyiniz ..." />;
  }

  return (
    <View style={styles.container}>
      <Header theme="danger" title={'Remove Member'} onBackPress={() => navigation.goBack()} />

      <View style={styles.searchContainer}>
        <Input
          icon="ri-search-line"
          placeholder="Search members..."
          containerStyle={{ borderRadius: 20, backgroundColor: colors.light }}
          onChangeText={setSearch}
          value={search}
        />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {filteredAdmins.length > 0 && (
          <View>
            <View style={styles.adminMembersHeader}>
              <Text fontWeight="700" color={colors.gray[400]}>
                ADMINS
              </Text>
            </View>
            <View style={styles.adminMembersList}>
              {filteredAdmins.map(admin => (
                <ChannelMemberCard
                  key={admin.id}
                  user={admin}
                  cardType={
                    currentRole === UserRole.Owner && admin.id !== currentUserId
                      ? ChannelMemberCardType.RemoveUser
                      : ChannelMemberCardType.Locked
                  }
                  onPress={() =>
                    confirm({
                      theme: 'danger',
                      icon: 'ri-user-unfollow-line',
                      title: 'Remove Member?',
                      description: `Are you sure you want to remove @${admin.userName} from this channel? They will need to send a new join request to return.`,
                      confirmTitle: 'Remove Member',
                      onConfirm: () => handleRemoveMemberFromChannel(admin.id),
                    })
                  }
                />
              ))}
            </View>
          </View>
        )}

        {members.length > 0 && (
          <View>
            <View style={styles.adminMembersHeader}>
              <Text fontWeight="700" color={colors.gray[400]}>
                MEMBERS
              </Text>
            </View>
            <View style={styles.adminMembersList}>
              {members.map(member => (
                <ChannelMemberCard
                  key={member.id}
                  user={member}
                  onPress={() =>
                    confirm({
                      theme: 'danger',
                      icon: 'ri-user-unfollow-line',
                      title: 'Remove Member?',
                      description: `Are you sure you want to remove @${member.userName} from this channel? They will need to send a new join request to return.`,
                      confirmTitle: 'Remove Member',
                      onConfirm: () => handleRemoveMemberFromChannel(member.id),
                    })
                  }
                  cardType={ChannelMemberCardType.RemoveUser}
                />
              ))}
            </View>
          </View>
        )}

        {isFetchingMore && <ActivityIndicator color={colors.orange[500]} />}

        {!hasResults && (
          <View style={styles.adminMembersHeader}>
            <Text color={colors.gray[400]} style={{ textAlign: 'center' }}>
              {debouncedSearch
                ? `"${debouncedSearch}" ile eşleşen kullanıcı bulunamadı.`
                : 'Kanalda kullanıcı bulunamadı.'}
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default RemoveMemberFromChannel;
