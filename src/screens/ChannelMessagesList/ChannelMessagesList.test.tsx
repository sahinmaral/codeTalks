import ChannelJoinPolicy from '@/enums/ChannelJoinPolicy';
import useSignalRConnection from '@/hooks/useSignalRConnection';
import {
  fetchGetUnreadCount,
  fetchResetChannelUnreadCount,
} from '@/services/apiServices/notifications';
import { renderWithProviders } from '@/test/renderWithProviders';
import { Message, PaginatedResult, RootStackParamList, User } from '@/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { act, fireEvent, screen } from '@testing-library/react-native';
import React from 'react';
import { ScrollView } from 'react-native';
import ChannelMessagesList from './ChannelMessagesList';

// The screen resets unread counts on mount; flush those promises inside act().
const flush = () => act(async () => {});

// The hub is the seam that drives every state of this screen (loading, error, empty, loaded).
jest.mock('@/hooks/useSignalRConnection');
jest.mock('@/services/apiServices/notifications', () => ({
  fetchResetChannelUnreadCount: jest.fn(),
  fetchGetUnreadCount: jest.fn(),
}));
jest.mock('@/services/apiServices/messages', () => ({ fetchCreateMessage: jest.fn() }));
jest.mock('react-native-flash-message', () => ({ showMessage: jest.fn() }));

const mockUseSignalRConnection = useSignalRConnection as jest.Mock;
const mockFetchResetChannelUnreadCount = fetchResetChannelUnreadCount as jest.Mock;
const mockFetchGetUnreadCount = fetchGetUnreadCount as jest.Mock;
const mockRetry = jest.fn();

const navigation = {
  goBack: jest.fn(),
  navigate: jest.fn(),
} as unknown as NativeStackNavigationProp<RootStackParamList, 'ChannelMessagesList'>;

const message = (id: string, content: string, createdAt: string, senderId = 'user-2'): Message => ({
  id,
  content,
  createdAt,
  sender: { id: senderId, userName: senderId === 'user-1' ? 'me' : 'bob', profilePhotoURL: '' },
});

const page = (items: Message[]): PaginatedResult<Message> => ({
  items,
  count: items.length,
  size: 30,
  index: 0,
  pages: 1,
  hasNext: false,
  hasPrevious: false,
});

const preloadedState = {
  app: {
    user: { id: 'user-1', userName: 'me' } as User,
    notificationSettings: null,
    channelMuteSettings: [],
    totalUnreadCount: 4,
    channelUnreadCounts: { 'channel-1': 3 },
  },
  activeChannel: {
    viewingChannelId: null,
    channel: {
      id: 'channel-1',
      name: 'general',
      inviteCode: 'invite-1',
      joinPolicy: ChannelJoinPolicy.Open,
      createdAt: '2026-01-01T00:00:00Z',
    },
  },
};

const mockConnection = (overrides: Partial<ReturnType<typeof useSignalRConnection>> = {}) =>
  mockUseSignalRConnection.mockReturnValue({
    data: null,
    isLoading: false,
    error: null,
    retry: mockRetry,
    ...overrides,
  });

const renderScreen = () =>
  renderWithProviders(<ChannelMessagesList navigation={navigation} />, { preloadedState });

// A full page (pageSize) tells the screen there may be more history behind it. Each page is
// timestamped further back so the merged list stays in chronological order.
const buildPage = (label: string, count = 30) =>
  Array.from({ length: count }, (_, index) =>
    message(
      `${label}-${index}`,
      `${label} ${index}`,
      `2026-01-0${label === 'newest' ? 3 : label === 'older' ? 2 : 1}T09:${String(index).padStart(2, '0')}:00Z`,
    ),
  );

/**
 * Answers with the page the screen is currently asking for, the way the hub does — this is
 * what makes the "which page is being polled" behaviour observable.
 */
const servePages = (overrides: Record<number, Message[]> = {}) => {
  const pages: Record<number, Message[]> = {
    0: buildPage('newest'),
    1: buildPage('older'),
    2: buildPage('oldest'),
    ...overrides,
  };

  mockUseSignalRConnection.mockImplementation(({ invokeArgs }) => ({
    data: page(pages[invokeArgs[2] as number] ?? []),
    isLoading: false,
    error: null,
    retry: mockRetry,
  }));
};

const requestedPages = () =>
  mockUseSignalRConnection.mock.calls.map(([options]) => options.invokeArgs[2] as number);

const scrollToTop = () =>
  fireEvent.scroll(screen.UNSAFE_getByType(ScrollView), {
    nativeEvent: {
      layoutMeasurement: { height: 800, width: 375 },
      contentOffset: { y: 0, x: 0 },
      contentSize: { height: 1800, width: 375 },
    },
  });

beforeEach(() => {
  jest.clearAllMocks();
  mockFetchResetChannelUnreadCount.mockResolvedValue({ data: null });
  mockFetchGetUnreadCount.mockResolvedValue({ data: 1 });
});

describe('ChannelMessagesList', () => {
  it('shows the loading screen until the first batch of messages arrives', async () => {
    mockConnection();
    renderScreen();
    await flush();

    expect(screen.getByText('Please wait while messages load ...')).toBeTruthy();
  });

  it('shows the error screen with a retry action when the hub fails before any messages load', async () => {
    mockConnection({ error: new Error('hub down') });
    renderScreen();
    await flush();

    expect(
      screen.getByText('Failed to load messages. Trying to connect to the server ...'),
    ).toBeTruthy();

    fireEvent.press(screen.getByText('Try Again'));
    expect(mockRetry).toHaveBeenCalledTimes(1);
  });

  it('keeps the conversation on screen when the hub drops after messages have loaded', async () => {
    mockConnection({
      data: page([message('m1', 'hello there', '2026-01-02T10:00:00Z')]),
      error: new Error('dropped'),
    });
    renderScreen();
    await flush();

    expect(screen.getByText('hello there')).toBeTruthy();
    expect(
      screen.queryByText('Failed to load messages. Trying to connect to the server ...'),
    ).toBeNull();
  });

  it('resets the unread count for the channel it opens', async () => {
    mockConnection({ data: page([]) });
    const { store } = renderScreen();
    await flush();

    expect(mockFetchResetChannelUnreadCount).toHaveBeenCalledWith('channel-1');
    expect(store.getState().app.channelUnreadCounts['channel-1']).toBe(0);
    expect(store.getState().app.totalUnreadCount).toBe(1);
  });

  it('shows the channel-created card when the channel has no messages yet', async () => {
    mockConnection({ data: page([]) });
    renderScreen();
    await flush();

    expect(screen.getByText('Say Hello 👋')).toBeTruthy();
  });

  it('prefills the composer from the channel-created card', async () => {
    mockConnection({ data: page([]) });
    renderScreen();
    await flush();

    fireEvent.press(screen.getByText('Say Hello 👋'));

    expect(screen.getByDisplayValue('Hello 👋')).toBeTruthy();
  });

  it('renders messages oldest-first with one date separator per day', async () => {
    mockConnection({
      data: page([
        message('m2', 'second day', '2026-01-03T09:00:00Z'),
        message('m1', 'first day', '2026-01-02T09:00:00Z'),
        message('m3', 'second day again', '2026-01-03T11:00:00Z'),
      ]),
    });
    renderScreen();
    await flush();

    expect(screen.getByText('2 January 2026')).toBeTruthy();
    expect(screen.getByText('3 January 2026')).toBeTruthy();
    expect(screen.getByText('first day')).toBeTruthy();
    expect(screen.getByText('second day')).toBeTruthy();
    expect(screen.getByText('second day again')).toBeTruthy();
  });

  it('shows the sender name for other people but not for the logged-in user', async () => {
    mockConnection({
      data: page([
        message('m1', 'from bob', '2026-01-02T09:00:00Z'),
        message('m2', 'from me', '2026-01-02T10:00:00Z', 'user-1'),
      ]),
    });
    renderScreen();
    await flush();

    expect(screen.getByText('bob')).toBeTruthy();
    expect(screen.queryByText('me')).toBeNull();
  });

  it('does not duplicate messages that the hub polls again', async () => {
    // The real hook re-emits a fresh payload on every poll; a new object each render makes
    // the merge effect re-run with the same message, which is exactly the duplicate risk.
    mockUseSignalRConnection.mockImplementation(() => ({
      data: page([message('m1', 'hello there', '2026-01-02T09:00:00Z')]),
      isLoading: false,
      error: null,
      retry: mockRetry,
    }));
    renderScreen();
    await flush();

    expect(screen.getAllByText('hello there')).toHaveLength(1);
  });

  it('marks the channel as being viewed and clears that on the way out', async () => {
    mockConnection({ data: page([]) });
    const { store, unmount } = renderScreen();
    await flush();

    expect(store.getState().activeChannel.viewingChannelId).toBe('channel-1');

    unmount();

    expect(store.getState().activeChannel.viewingChannelId).toBeNull();
  });

  it('asks the hub for an older page when scrolled to the top', async () => {
    servePages();
    renderScreen();
    await flush();

    scrollToTop();
    await flush();

    expect(requestedPages()).toContain(1);
    expect(screen.getByText('older 0')).toBeTruthy();
    expect(screen.getByText('newest 0')).toBeTruthy();
  });

  // The hub polls whichever page invokeArgs names, so parking on an older page is what used
  // to silently stop new messages from ever reaching an open conversation.
  it('goes back to polling the newest page once the older history has merged', async () => {
    servePages();
    renderScreen();
    await flush();

    scrollToTop();
    await flush();

    expect(mockUseSignalRConnection).toHaveBeenLastCalledWith(
      expect.objectContaining({ invokeArgs: ['channel-1', 30, 0] }),
    );
  });

  it('walks further back through history on each pull', async () => {
    servePages();
    renderScreen();
    await flush();

    scrollToTop();
    await flush();
    scrollToTop();
    await flush();

    expect(requestedPages()).toContain(2);
    expect(screen.getByText('oldest 0')).toBeTruthy();
  });

  it('stops asking for more once a short page shows the history has run out', async () => {
    // Page 1 comes back short, so there is nothing behind it.
    servePages({ 1: buildPage('older', 5) });
    renderScreen();
    await flush();

    scrollToTop();
    await flush();
    const pagesAfterFirstPull = requestedPages();

    scrollToTop();
    await flush();

    expect(requestedPages()).toEqual(pagesAfterFirstPull);
  });

  it('navigates to the channel detail and back from the header', async () => {
    mockConnection({ data: page([]) });
    renderScreen();
    await flush();

    fireEvent.press(screen.UNSAFE_getByProps({ name: 'settings-5-line' }));
    fireEvent.press(screen.UNSAFE_getByProps({ name: 'arrow-left-line' }));

    expect(navigation.navigate).toHaveBeenCalledWith('ChannelDetail');
    expect(navigation.goBack).toHaveBeenCalled();
  });
});
