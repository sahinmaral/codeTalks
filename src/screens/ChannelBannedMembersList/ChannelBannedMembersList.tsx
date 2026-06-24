import ChannelMemberCard from '@/components/ChannelMemberCard';
import { useConfirmationDialog } from '@/components/ConfirmationDialog';
import Header from '@/components/Header';
import Input from '@/components/Input';
import Text from '@/components/Text';
import ChannelUserStatus from '@/enums/ChannelUserStatus';
import getFullName from '@/helpers/getFullName';
import useDebounce from '@/hooks/useDebounce';
import { useAppSelector } from '@/redux/hooks';
import { fetchGetUsersByChannelId, fetchPatchUserStatus } from '@/services/channels';
import useTheme from '@/hooks/useTheme';
import useThemedStyles from '@/hooks/useThemedStyles';
import colors from '@/styles/colors';
import { ChannelUser, RootStackParamList, UsersAtChannelListModel } from '@/types';
import { getApiErrorMessage } from '@/utils/getApiErrorMessage';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AxiosError } from 'axios';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  View,
} from 'react-native';
import { showMessage } from 'react-native-flash-message';
import Icon from 'react-native-remix-icon';
import Loading from '../Loading';
import makeStyles from './ChannelBannedMembersList.styles';

type ChannelBannedMembersListProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'ChannelBannedMembersList'>;
};

const PAGE_SIZE = 5;

const ChannelBannedMembersList = ({ navigation }: ChannelBannedMembersListProps) => {
  const styles = useThemedStyles(makeStyles);
  const theme = useTheme();
  const channelId = useAppSelector(state => state.activeChannel.channel?.id ?? '');
  const channelName = useAppSelector(state => state.activeChannel.channel?.name ?? '');

  const [members, setMembers] = useState<ChannelUser[]>([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [loading, setLoading] = useState(true);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search.trim(), 400);

  const { confirm } = useConfirmationDialog();

  const handlePatchUserStatus = async (userId: string) => {
    try {
      setLoading(true);
      await fetchPatchUserStatus(channelId, userId, ChannelUserStatus.Accepted);

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
        status: ChannelUserStatus.Banned,
      });

      const data = response.data as UsersAtChannelListModel;
      setMembers(prev => (index === 0 ? data.items : [...prev, ...data.items]));
      setHasNext(data.hasNext);
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

  const hasResults = members.length > 0;

  if (loading && !hasLoaded) {
    return <Loading text="Kanaldan banlanan kullanıcılar yüklenirken lütfen bekleyiniz ..." />;
  }

  return (
    <View style={styles.container}>
      <Header title={'Banned Members'} onBackPress={() => navigation.goBack()} />

      <View style={{ backgroundColor: theme.surface, paddingBottom: 15 }}>
        <View style={styles.searchContainer}>
          <Input
            icon="ri-search-line"
            placeholder="Search banned members..."
            containerStyle={{ borderRadius: 20, backgroundColor: theme.input.background }}
            onChangeText={setSearch}
            value={search}
          />
        </View>
      </View>

      <View style={{ backgroundColor: theme.background.secondary, flex: 1 }}>
        <View style={styles.descriptionContainer}>
          <Icon name="ri-information-line" color={colors.orange[500]} size={20} />
          <Text color={colors.orange[500]} size="small" style={styles.descriptionText}>
            Review members banned from #{channelName}. Tap a member to unban them and restore their
            access
          </Text>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          {members.length > 0 && (
            <View>
              <View style={styles.membersList}>
                {members.map(member => (
                  <ChannelMemberCard
                    key={member.id}
                    user={member}
                    onPress={() => {
                      confirm({
                        theme: 'success',
                        icon: 'ri-lock-unlock-line',
                        title: 'Unban User?',
                        description: `Are you sure you want to unban ${getFullName(member)}? They will regain access to this channel.`,
                        confirmTitle: 'Unban User',
                        onConfirm: () => handlePatchUserStatus(member.id),
                      });
                    }}
                  />
                ))}
              </View>
            </View>
          )}

          {isFetchingMore && <ActivityIndicator color={colors.orange[500]} />}

          {!hasResults && (
            <View style={styles.membersHeader}>
              <Text color={theme.text.secondary} style={{ textAlign: 'center' }}>
                {debouncedSearch
                  ? `"${debouncedSearch}" ile eşleşen banlanan kullanıcı bulunamadı.`
                  : 'Kanaldan banlanan kullanıcı bulunamadı.'}
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  );
};

export default ChannelBannedMembersList;
