import Header from '@/components/Header';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { format, isToday, isYesterday, parseISO } from 'date-fns';
import React, { useEffect, useMemo, useRef, useState } from 'react';
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
import { useAppSelector } from '../../redux/hooks';
import useTheme from '@/hooks/useTheme';
import useThemedStyles from '@/hooks/useThemedStyles';
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

const formatDateLabel = (date: Date) => {
  if (isToday(date)) return 'Today';
  if (isYesterday(date)) return 'Yesterday';
  return format(date, 'd MMMM yyyy');
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
  const styles = useThemedStyles(makeStyles);
  const theme = useTheme();
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
    setHasMore(messages.items.length === pageSize);
    setIsFetchingMore(false);
  }, [messages]);

  const handleScroll = (event: any) => {
    const { contentOffset } = event.nativeEvent;
    if (contentOffset.y <= 0 && hasMore && !isFetchingMore) {
      setIsFetchingMore(true);
      setPageIndex(prev => prev + 1);
    }
  };

  const groupedItems = useMemo<GroupedItem[]>(() => {
    const result: GroupedItem[] = [];
    let lastDayKey: string | null = null;

    for (const message of allMessages) {
      const date = parseISO(message.createdAt);
      const dayKey = format(date, 'yyyy-MM-dd');
      if (dayKey !== lastDayKey) {
        result.push({ type: 'date', key: `date-${dayKey}`, label: formatDateLabel(date) });
        lastDayKey = dayKey;
      }
      result.push({ type: 'message', key: message.id, message });
    }
    return result;
  }, [allMessages]);

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
          <ErrorScreen
            description="Mesajlar yüklenemedi. Sunucuya bağlanmaya çalışılıyor ..."
            onRetry={retry}
          />
        ) : !hasLoaded ? (
          <Loading text="Mesajlar yüklenirken lütfen bekleyiniz ..." />
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
