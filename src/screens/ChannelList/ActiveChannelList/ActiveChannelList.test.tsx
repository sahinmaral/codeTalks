import ChannelJoinPolicy from '@/enums/ChannelJoinPolicy';
import useSignalRConnection from '@/hooks/useSignalRConnection';
import { fetchGetChannelUnreadCount } from '@/services/apiServices/notifications';
import { renderWithProviders } from '@/test/renderWithProviders';
import { Channel, PaginatedResult, RootStackParamList } from '@/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { act, fireEvent, screen } from '@testing-library/react-native';
import React from 'react';
import ActiveChannelList from './ActiveChannelList';

// The channel cards each fetch their unread count on mount.
const flush = () => act(async () => {});

const mockShow = jest.fn();

// The hub connection itself is covered by the manual QA plan; here the hook is the seam
// that lets us drive every list state (loading, error, empty, populated) deterministically.
jest.mock('@/hooks/useSignalRConnection');
jest.mock('@/services/apiServices/notifications', () => ({
  fetchGetChannelUnreadCount: jest.fn(),
}));
jest.mock('@/components/BubbleContentMenu/BubbleContentMenu.provider', () => ({
  useBubbleContentMenu: () => ({ show: mockShow, visible: mockMenuVisible() }),
}));
jest.mock('@/components/BubbleContentMenu/Contents/HomepageActionList', () => 'HomepageActionList');

// Read lazily inside the mock factory so individual tests can flip menu visibility.
let menuVisible = false;
const mockMenuVisible = () => menuVisible;

const mockUseSignalRConnection = useSignalRConnection as jest.Mock;
const mockFetchGetChannelUnreadCount = fetchGetChannelUnreadCount as jest.Mock;
const mockRetry = jest.fn();

const navigation = { navigate: jest.fn() } as unknown as NativeStackNavigationProp<
  RootStackParamList,
  'ActiveChannelList'
>;

const channel = (id: string, name: string): Channel => ({
  id,
  name,
  description: `${name} description`,
  inviteCode: `invite-${id}`,
  joinPolicy: ChannelJoinPolicy.Open,
  memberCount: 3,
  createdAt: '2026-01-01T00:00:00Z',
  role: { name: 'Member' },
});

const page = (items: Channel[]): PaginatedResult<Channel> => ({
  items,
  count: items.length,
  size: 10,
  index: 0,
  pages: 1,
  hasNext: false,
  hasPrevious: false,
});

const mockConnection = (overrides: Partial<ReturnType<typeof useSignalRConnection>> = {}) =>
  mockUseSignalRConnection.mockReturnValue({
    data: null,
    isLoading: false,
    error: null,
    retry: mockRetry,
    ...overrides,
  });

beforeEach(() => {
  jest.clearAllMocks();
  menuVisible = false;
  mockFetchGetChannelUnreadCount.mockResolvedValue({ data: 0 });
});

describe('ActiveChannelList', () => {
  it('shows the loading screen while the hub connection is being established', () => {
    mockConnection({ isLoading: true });
    renderWithProviders(<ActiveChannelList navigation={navigation} />);

    expect(screen.getByText('Please wait while channels load ...')).toBeTruthy();
  });

  it('shows the error screen with a retry action when the connection fails', () => {
    mockConnection({ error: new Error('hub down'), isLoading: true });
    renderWithProviders(<ActiveChannelList navigation={navigation} />);

    expect(
      screen.getByText('Failed to load channels. Trying to connect to the server ...'),
    ).toBeTruthy();

    fireEvent.press(screen.getByText('Try Again'));
    expect(mockRetry).toHaveBeenCalledTimes(1);
  });

  it('keeps showing the list when the connection drops but data is already loaded', async () => {
    mockConnection({ data: page([channel('channel-1', 'General')]), error: new Error('dropped') });
    renderWithProviders(<ActiveChannelList navigation={navigation} />);
    await flush();

    expect(screen.getByText('General')).toBeTruthy();
    expect(
      screen.queryByText('Failed to load channels. Trying to connect to the server ...'),
    ).toBeNull();
  });

  it('renders a card per channel returned by the hub', async () => {
    mockConnection({
      data: page([channel('channel-1', 'General'), channel('channel-2', 'Random')]),
    });
    renderWithProviders(<ActiveChannelList navigation={navigation} />);
    await flush();

    expect(screen.getByText('General')).toBeTruthy();
    expect(screen.getByText('Random')).toBeTruthy();
    expect(screen.getByText('Active Channels')).toBeTruthy();
  });

  it('shows the empty-state card when the user has no active channels', async () => {
    mockConnection({ data: page([]) });
    renderWithProviders(<ActiveChannelList navigation={navigation} />);
    await flush();

    expect(screen.getByText('No Active Channels')).toBeTruthy();
    expect(
      screen.getByText(
        "You haven't joined any channels yet. Explore and find communities that interest you!",
      ),
    ).toBeTruthy();
  });

  it('opens the homepage action menu from the floating button', async () => {
    // A populated list keeps the empty-state card (which has its own "+" button) out of the way.
    mockConnection({ data: page([channel('channel-1', 'General')]) });
    renderWithProviders(<ActiveChannelList navigation={navigation} />);
    await flush();

    fireEvent.press(screen.UNSAFE_getByProps({ name: 'ri-add-line' }));

    expect(mockShow).toHaveBeenCalledTimes(1);
  });

  it('hides the floating button while a bubble menu is already open', async () => {
    menuVisible = true;
    mockConnection({ data: page([channel('channel-1', 'General')]) });
    renderWithProviders(<ActiveChannelList navigation={navigation} />);
    await flush();

    expect(screen.UNSAFE_queryByProps({ name: 'ri-add-line' })).toBeNull();
  });
});
