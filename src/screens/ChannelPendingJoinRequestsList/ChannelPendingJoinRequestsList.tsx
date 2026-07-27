import Header from '@/components/Header';
import Input from '@/components/Input';
import PendingJoinRequestMemberCard from '@/components/PendingJoinRequestMemberCard';
import Text from '@/components/Text';
import ChannelUserStatus from '@/enums/ChannelUserStatus';
import useDebounce from '@/hooks/useDebounce';
import { useAppSelector } from '@/redux/hooks';
import { fetchGetUsersByChannelId, fetchPatchUserStatus } from '@/services/apiServices/channels';
import useTheme from '@/hooks/useTheme';
import useThemedStyles from '@/hooks/useThemedStyles';
import colors from '@/styles/colors';
import { ChannelUser, RootStackParamList, UsersAtChannelListModel } from '@/types';
import { getApiErrorMessage } from '@/utils/getApiErrorMessage';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AxiosError } from 'axios';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  View,
} from 'react-native';
import { showMessage } from 'react-native-flash-message';
import Icon from 'react-native-remix-icon';
import ErrorScreen from '../Error';
import Loading from '../Loading';
import makeStyles from './ChannelPendingJoinRequestsList.styles';

type ChannelPendingJoinRequestsListProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'ChannelPendingJoinRequestsList'>;
};

const PAGE_SIZE = 5;

const ChannelPendingJoinRequestsList = ({ navigation }: ChannelPendingJoinRequestsListProps) => {
  const { t } = useTranslation();
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
  const [error, setError] = useState<Error | null>(null);

  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search.trim(), 400);

  const handlePatchUserStatus = async (userIdWhoSentRequest: string, status: ChannelUserStatus) => {
    try {
      setLoading(true);
      await fetchPatchUserStatus(channelId, userIdWhoSentRequest, status);

      setPageIndex(0);
      await fetchPage(0);
    } catch (exception) {
      if (exception instanceof AxiosError) {
        showMessage({ message: getApiErrorMessage(exception), type: 'danger' });
      } else {
        showMessage({ message: t('common.errorOccurred'), type: 'danger' });
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
        status: ChannelUserStatus.RequestSent,
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
          setError(null);
          setPageIndex(0);
          await fetchPage(0);
        } catch (exception) {
          if (active) {
            setError(exception instanceof Error ? exception : new Error(String(exception)));
          }
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

  const retry = useCallback(() => {
    setLoading(true);
    setError(null);
    setPageIndex(0);
    fetchPage(0)
      .catch(exception =>
        setError(exception instanceof Error ? exception : new Error(String(exception))),
      )
      .finally(() => setLoading(false));
  }, [fetchPage]);

  if (loading && !hasLoaded) {
    return <Loading text={t('channels.loadingMembers')} />;
  }

  // Without this the screen would render its "no join requests" empty state, which reads as
  // nothing pending rather than a failed request.
  if (error && !hasResults) {
    return <ErrorScreen description={t('channels.requestsLoadFailedRetry')} onRetry={retry} />;
  }

  return (
    <View style={styles.container}>
      <Header title={t('channels.pendingTitle')} onBackPress={() => navigation.goBack()} />

      <View style={{ backgroundColor: theme.surface, paddingBottom: 15 }}>
        <View style={styles.searchContainer}>
          <Input
            icon="ri-search-line"
            placeholder={t('channels.searchRequests')}
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
            {t('channels.pendingDescription', { channel: channelName })}
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
                  <PendingJoinRequestMemberCard
                    key={member.id}
                    user={member}
                    onSubmit={(status: ChannelUserStatus) =>
                      handlePatchUserStatus(member.id, status)
                    }
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
                  ? t('channels.noRequestsMatchSearch', { query: debouncedSearch })
                  : t('channels.noRequests')}
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  );
};

export default ChannelPendingJoinRequestsList;
