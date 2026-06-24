import { useBubbleContentMenu } from '@/components/BubbleContentMenu';
import MembersActionList from '@/components/BubbleContentMenu/Contents/MembersActionList';
import ChannelMemberCard from '@/components/ChannelMemberCard';
import Header from '@/components/Header';
import Input from '@/components/Input';
import Text from '@/components/Text';
import getFullName from '@/helpers/getFullName';
import useDebounce from '@/hooks/useDebounce';
import { useAppSelector } from '@/redux/hooks';
import { fetchGetUsersByChannelId } from '@/services/channels';
import useTheme from '@/hooks/useTheme';
import useThemedStyles from '@/hooks/useThemedStyles';
import colors from '@/styles/colors';
import { ChannelUser, RootStackParamList, UsersAtChannelListModel } from '@/types';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  View,
} from 'react-native';
import Loading from '../Loading';
import makeStyles from './ChannelMembersList.styles';

type ChannelMembersListProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'ChannelMembersList'>;
};

const PAGE_SIZE = 5;

const matchesSearch = (user: ChannelUser, term: string) => {
  if (!term) return true;

  const fullName = getFullName(user).toLowerCase();

  return fullName.includes(term) || user.userName.toLowerCase().includes(term);
};

const ChannelMembersList = ({ navigation }: ChannelMembersListProps) => {
  const styles = useThemedStyles(makeStyles);
  const theme = useTheme();
  const channelId = useAppSelector(state => state.activeChannel.channel?.id ?? '');
  const { show, hide } = useBubbleContentMenu();

  const [admins, setAdmins] = useState<ChannelUser[]>([]);
  const [members, setMembers] = useState<ChannelUser[]>([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [loading, setLoading] = useState(true);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search.trim(), 400);

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

  const refresh = useCallback(async () => {
    try {
      setPageIndex(0);
      await fetchPage(0);
    } catch {}
  }, [fetchPage]);

  const handleActionComplete = useCallback(() => {
    hide();
    refresh();
  }, [hide, refresh]);

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
      <Header title={'Members'} onBackPress={() => navigation.goBack()} />

      <View style={styles.searchContainer}>
        <Input
          icon="ri-search-line"
          placeholder="Search members..."
          containerStyle={{ borderRadius: 20, backgroundColor: theme.input.background }}
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
              <Text fontWeight="700" color={theme.text.secondary}>
                ADMINS
              </Text>
            </View>
            <View style={styles.adminMembersList}>
              {filteredAdmins.map(admin => (
                <ChannelMemberCard
                  key={admin.id}
                  user={admin}
                  onPress={() => {
                    show(
                      <MembersActionList
                        selectedUser={admin}
                        onActionComplete={handleActionComplete}
                      />,
                    );
                  }}
                />
              ))}
            </View>
          </View>
        )}

        {members.length > 0 && (
          <View>
            <View style={styles.adminMembersHeader}>
              <Text fontWeight="700" color={theme.text.secondary}>
                MEMBERS
              </Text>
            </View>
            <View style={styles.adminMembersList}>
              {members.map(member => (
                <ChannelMemberCard
                  key={member.id}
                  user={member}
                  onPress={() => {
                    show(
                      <MembersActionList
                        selectedUser={member}
                        onActionComplete={handleActionComplete}
                      />,
                    );
                  }}
                />
              ))}
            </View>
          </View>
        )}

        {isFetchingMore && <ActivityIndicator color={colors.orange[500]} />}

        {!hasResults && (
          <View style={styles.adminMembersHeader}>
            <Text color={theme.text.secondary} style={{ textAlign: 'center' }}>
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

export default ChannelMembersList;
