import Header from '@/components/Header';
import useTheme from '@/hooks/useTheme';
import useThemedStyles from '@/hooks/useThemedStyles';
import { setViewingChannelId } from '@/redux/reducers/activeChannelReducer';
import { resetChannelUnreadCount, setTotalUnreadCount } from '@/redux/reducers/appReducer';
import {
  fetchGetUnreadCount,
  fetchResetChannelUnreadCount,
} from '@/services/apiServices/notifications';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { getDateFnsLocale } from '@/utils/dateFnsLocale';
import { format, isToday, isYesterday, parseISO } from 'date-fns';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from 'react-native';
import ChannelCreatedMessageCard from '../../components/ChannelCreatedMessageCard';
import MessageCard from '../../components/MessageCard';
import useSignalRConnection from '../../hooks/useSignalRConnection';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { Message, PaginatedResult, RootStackParamList } from '../../types';
import ErrorScreen from '../Error';
import Loading from '../Loading';
import makeStyles from './ChannelMessagesList.styles';
import SendMessageInput from './SendMessageInput';

interface ChannelMessagesListProps {
  navigation: NativeStackNavigationProp<RootStackParamList, 'ChannelMessagesList'>;
}

type GroupedItem =
  | { type: 'date'; key: string; label: string }
  | { type: 'message'; key: string; message: Message };

const formatDateLabel = (date: Date, t: TFunction) => {
  if (isToday(date)) return t('channels.today');
  if (isYesterday(date)) return t('channels.yesterday');
  return format(date, 'd MMMM yyyy', { locale: getDateFnsLocale() });
};

const DateSeparator = ({ label }: { label: string }) => {
  const styles = useThemedStyles(makeStyles);
  return (
    <View style={styles.dateSeparatorContainer}>
      <View style={styles.dateSeparatorPill}>
        <Text style={styles.dateSeparatorText}>{label}</Text>
      </View>
    </View>
  );
};

function ChannelMessagesList({ navigation }: ChannelMessagesListProps) {
  const { t } = useTranslation();
  const styles = useThemedStyles(makeStyles);
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const scrollViewRef = useRef<ScrollView>(null);
  const user = useAppSelector(state => state.app.user);
  const activeChannel = useAppSelector(state => state.activeChannel.channel);

  const channelId = activeChannel?.id ?? '';
  const channelName = activeChannel?.name ?? '';
  const channelCreatedAt = activeChannel?.createdAt ?? '';

  const [message, setMessage] = useState('');

  const [pageIndex, setPageIndex] = useState(0);
  const [allMessages, setAllMessages] = useState<Message[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  const lastMessageIdRef = useRef<string | null>(null);
  // The hub polls whatever page `invokeArgs` names, so the screen only stays live while that
  // page is 0. Older history is therefore fetched as a one-off: request page N, merge it,
  // then go straight back to 0. These refs remember where the next pull should resume.
  const nextOlderPageRef = useRef(1);
  const reachedOldestRef = useRef(false);

  const pageSize = 30;

  const {
    data: messages,
    error,
    retry,
  } = useSignalRConnection<PaginatedResult<Message>>({
    receiveEvent: 'ReceiveMessagesOfChannel',
    sendMethod: 'SendMessagesOfChannel',
    invokeArgs: [channelId, pageSize, pageIndex],
  });

  // Tells the notification hub not to count messages for this channel as unread while its
  // conversation is on screen. Cleared on the way out so badges resume immediately.
  useEffect(() => {
    if (!channelId) return;

    dispatch(setViewingChannelId(channelId));
    return () => {
      dispatch(setViewingChannelId(null));
    };
  }, [channelId, dispatch]);

  useEffect(() => {
    if (!channelId) return;

    const resetUnread = async () => {
      try {
        await fetchResetChannelUnreadCount(channelId);
        dispatch(resetChannelUnreadCount(channelId));
        const { data: newTotal } = await fetchGetUnreadCount();
        dispatch(setTotalUnreadCount(newTotal));
      } catch {}
    };

    resetUnread();
  }, [channelId]);

  useEffect(() => {
    if (!messages) return;

    if (messages.items.length > 0) {
      setAllMessages(prev => {
        const existingIds = new Set(prev.map(m => m.id));
        const newItems = messages.items.filter(m => !existingIds.has(m.id));

        if (!newItems.length) return prev;

        const merged = pageIndex > 0 ? [...newItems, ...prev] : [...prev, ...newItems];

        return merged.sort(
          (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        );
      });
    }

    if (!hasLoaded) setHasLoaded(true);

    if (pageIndex > 0) {
      // A short page means there is no more history behind it.
      if (messages.items.length < pageSize) reachedOldestRef.current = true;
      nextOlderPageRef.current = pageIndex + 1;
      // Back to the newest page, otherwise the poll would sit on this older one and no new
      // message would ever reach the screen again.
      setPageIndex(0);
    }

    setHasMore(!reachedOldestRef.current && messages.items.length === pageSize);
    setIsFetchingMore(false);
  }, [messages]);

  const handleScroll = (event: any) => {
    const { contentOffset } = event.nativeEvent;
    if (contentOffset.y <= 0 && hasMore && !isFetchingMore) {
      setIsFetchingMore(true);
      setPageIndex(nextOlderPageRef.current);
    }
  };

  const groupedItems = useMemo<GroupedItem[]>(() => {
    const result: GroupedItem[] = [];
    let lastDayKey: string | null = null;

    for (const message of allMessages) {
      const date = parseISO(message.createdAt);
      const dayKey = format(date, 'yyyy-MM-dd');
      if (dayKey !== lastDayKey) {
        result.push({ type: 'date', key: `date-${dayKey}`, label: formatDateLabel(date, t) });
        lastDayKey = dayKey;
      }
      result.push({ type: 'message', key: message.id, message });
    }
    return result;
  }, [allMessages, t]);

  useEffect(() => {
    const newestId = allMessages[allMessages.length - 1]?.id ?? null;
    if (!newestId || newestId === lastMessageIdRef.current) return;

    const isInitial = lastMessageIdRef.current === null;
    lastMessageIdRef.current = newestId;

    if (isInitial || pageIndex === 0) {
      requestAnimationFrame(() => {
        scrollViewRef.current?.scrollToEnd({ animated: !isInitial });
      });
    }
  }, [allMessages]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={0}
    >
      <Header
        title={channelName}
        onBackPress={() => navigation.goBack()}
        rightIcon="settings-5-line"
        onRightIconPress={() => navigation.navigate('ChannelDetail')}
      />

      <View style={{ flex: 1, padding: 20 }}>
        {error && !hasLoaded ? (
          <ErrorScreen description={t('channels.messagesLoadFailedServer')} onRetry={retry} />
        ) : !hasLoaded ? (
          <Loading text={t('channels.loadingMessages')} />
        ) : allMessages.length === 0 ? (
          <ChannelCreatedMessageCard
            channelName={channelName}
            channelCreatedAt={channelCreatedAt}
            onPress={() => setMessage('Hello 👋')}
          />
        ) : (
          <ScrollView
            ref={scrollViewRef}
            contentContainerStyle={{
              gap: 15,
              paddingRight: 10,
            }}
            onScroll={handleScroll}
            scrollEventThrottle={16}
          >
            {isFetchingMore && <ActivityIndicator />}
            {groupedItems.map(item =>
              item.type === 'date' ? (
                <DateSeparator key={item.key} label={item.label} />
              ) : (
                <MessageCard key={item.key} messageDetail={item.message} />
              ),
            )}
          </ScrollView>
        )}
      </View>

      <View
        style={[
          { minHeight: 70 },
          hasLoaded && {
            backgroundColor: theme.surface,
            borderTopWidth: 1,
            borderTopColor: theme.border,
          },
        ]}
      >
        {hasLoaded && (
          <SendMessageInput
            channelName={channelName}
            channelId={channelId}
            userId={user?.id ?? ''}
            message={message}
            onMessageChange={setMessage}
          />
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

export default ChannelMessagesList;
