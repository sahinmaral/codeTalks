import AllChannelCard from '@/components/AllChannelCard';
import Header from '@/components/Header';
import Input from '@/components/Input';
import Text from '@/components/Text';
import useDebounce from '@/hooks/useDebounce';
import ErrorScreen from '@/screens/Error';
import Loading from '@/screens/Loading';
import { fetchGetChannels } from '@/services/channels';
import colors from '@/styles/colors';
import { Channel, PaginatedResult } from '@/types';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  NativeScrollEvent,
  NativeSyntheticEvent,
  RefreshControl,
  ScrollView,
  View,
} from 'react-native';
import styles from '../ChannelList.styles';

const PAGE_SIZE = 10;

function AllChannelList() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [loading, setLoading] = useState(true);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search.trim(), 400);

  const fetchPage = useCallback(
    async (index: number) => {
      const { data } = await fetchGetChannels({
        title: debouncedSearch || undefined,
        index,
        size: PAGE_SIZE,
      });

      const result = data as PaginatedResult<Channel>;
      setChannels(prev => {
        if (index === 0) return result.items;
        const existingIds = new Set(prev.map(channel => channel.id));
        return [...prev, ...result.items.filter(channel => !existingIds.has(channel.id))];
      });
      setHasNext(result.hasNext);
    },
    [debouncedSearch],
  );

  useEffect(() => {
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
  }, [fetchPage]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      setError(null);
      setPageIndex(0);
      await fetchPage(0);
    } catch (exception) {
      setError(exception instanceof Error ? exception : new Error(String(exception)));
    } finally {
      setRefreshing(false);
    }
  }, [fetchPage]);

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

  if (loading && !hasLoaded) {
    return <Loading text="Kanallar yüklenirken lütfen bekleyiniz ..." />;
  }

  if (error && channels.length === 0) {
    return (
      <ErrorScreen
        description="Kanallar yüklenemedi. Lütfen tekrar deneyiniz ..."
        onRetry={() => {
          setLoading(true);
          setHasLoaded(false);
          fetchPage(0)
            .catch(exception =>
              setError(exception instanceof Error ? exception : new Error(String(exception))),
            )
            .finally(() => {
              setLoading(false);
              setHasLoaded(true);
            });
        }}
      />
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Explore" description="Discover and join new channels" />

      <View style={styles.searchContainer}>
        <Input
          icon="ri-search-line"
          placeholder="Search channels..."
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <ScrollView
        style={styles.channelListContainer}
        contentContainerStyle={styles.channelListContainerContent}
        keyboardShouldPersistTaps="handled"
        onScroll={handleScroll}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.orange[500]}
            colors={[colors.orange[500]]}
          />
        }
      >
        {channels.map(channel => (
          <AllChannelCard key={channel.id} channel={channel} />
        ))}

        {isFetchingMore && <ActivityIndicator color={colors.orange[500]} />}

        {channels.length === 0 && (
          <View style={styles.emptyContainer}>
            <Text size="large" fontWeight="700" style={{ textAlign: 'center' }}>
              No Channels Found
            </Text>
            <Text color={colors.gray[500]} size="medium" style={{ textAlign: 'center' }}>
              {debouncedSearch
                ? `"${debouncedSearch}" ile eşleşen kanal bulunamadı.`
                : 'Try searching with a different keyword.'}
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

export default AllChannelList;
