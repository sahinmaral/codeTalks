import ChannelJoinPolicy from '@/enums/ChannelJoinPolicy';
import { fetchGetChannelUnreadCount } from '@/services/apiServices/notifications';
import { renderWithProviders } from '@/test/renderWithProviders';
import { Channel, RootStackParamList } from '@/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { act, fireEvent, screen } from '@testing-library/react-native';
import React from 'react';
import ActiveChannelCard from './ActiveChannelCard';

// The component's own on-mount unread-count fetch resolves on a later microtask;
// flush it inside an act() boundary so its dispatch doesn't fire after the test exits act.
const flush = () => act(async () => {});

jest.mock('@/services/apiServices/notifications', () => ({
  fetchGetChannelUnreadCount: jest.fn(),
}));

const mockFetchGetChannelUnreadCount = fetchGetChannelUnreadCount as jest.Mock;

const channel: Channel = {
  id: 'channel-1',
  name: 'General',
  description: 'General discussion',
  inviteCode: 'ABC123',
  joinPolicy: ChannelJoinPolicy.Open,
  memberCount: 5,
  createdAt: '2026-01-01T00:00:00Z',
  role: { name: 'Owner' },
};

const navigation = { navigate: jest.fn() } as unknown as NativeStackNavigationProp<
  RootStackParamList,
  keyof RootStackParamList
>;

beforeEach(() => {
  jest.clearAllMocks();
  mockFetchGetChannelUnreadCount.mockResolvedValue({ data: 0 });
});

describe('ActiveChannelCard', () => {
  it('renders the channel name, member count and description', async () => {
    renderWithProviders(<ActiveChannelCard channel={channel} navigation={navigation} />);
    await flush();

    expect(screen.getByText('General')).toBeTruthy();
    expect(screen.getByText('5 members')).toBeTruthy();
    expect(screen.getByText('General discussion')).toBeTruthy();
  });

  it('shows the unread badge when the channel has unread messages', async () => {
    mockFetchGetChannelUnreadCount.mockResolvedValue({ data: 7 });
    renderWithProviders(<ActiveChannelCard channel={channel} navigation={navigation} />);
    await flush();

    expect(screen.getByText('7')).toBeTruthy();
  });

  it('caps the displayed unread count at "99+"', async () => {
    mockFetchGetChannelUnreadCount.mockResolvedValue({ data: 150 });
    renderWithProviders(<ActiveChannelCard channel={channel} navigation={navigation} />);
    await flush();

    expect(screen.getByText('99+')).toBeTruthy();
  });

  it('does not show an unread badge when there are no unread messages', async () => {
    renderWithProviders(<ActiveChannelCard channel={channel} navigation={navigation} />);
    await flush();
    expect(screen.queryByText(/^\d+(\+)?$/)).toBeNull();
  });

  it('shows a muted icon when the channel is muted', async () => {
    renderWithProviders(<ActiveChannelCard channel={channel} navigation={navigation} />, {
      preloadedState: {
        app: {
          user: null,
          notificationSettings: null,
          channelMuteSettings: [{ channelId: 'channel-1', isMuted: true }],
          totalUnreadCount: 0,
          channelUnreadCounts: {},
        },
      },
    });
    await flush();

    expect(screen.UNSAFE_getByProps({ name: 'ri-notification-off-line' })).toBeTruthy();
  });

  it('does not show a muted icon when the channel is not muted', async () => {
    renderWithProviders(<ActiveChannelCard channel={channel} navigation={navigation} />);
    await flush();
    expect(screen.UNSAFE_queryByProps({ name: 'ri-notification-off-line' })).toBeNull();
  });

  it('dispatches setActiveChannel and navigates on press', async () => {
    renderWithProviders(<ActiveChannelCard channel={channel} navigation={navigation} />);
    await flush();

    fireEvent.press(screen.getByText('General'));

    expect(navigation.navigate).toHaveBeenCalledWith('ChannelMessagesList');
  });

  it('fetches the unread count for the channel on mount', async () => {
    renderWithProviders(<ActiveChannelCard channel={channel} navigation={navigation} />);
    await flush();
    expect(mockFetchGetChannelUnreadCount).toHaveBeenCalledWith('channel-1');
  });
});
