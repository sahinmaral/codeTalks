import ChannelJoinPolicy from '@/enums/ChannelJoinPolicy';
import { UserRole } from '@/enums/UserRole';
import { fetchGetUsersByChannelId } from '@/services/apiServices/channels';
import { renderWithProviders } from '@/test/renderWithProviders';
import { ChannelUser, RootStackParamList, UsersAtChannelListModel } from '@/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { act, fireEvent, screen } from '@testing-library/react-native';
import React from 'react';
import { ScrollView } from 'react-native';
import ChannelMembersList from './ChannelMembersList';

// The focus effect fetches the first page; flush that promise inside act().
const flush = () => act(async () => {});

const mockShow = jest.fn();
const mockHide = jest.fn();

jest.mock('@/services/apiServices/channels', () => ({ fetchGetUsersByChannelId: jest.fn() }));
jest.mock('@/components/BubbleContentMenu', () => ({
  useBubbleContentMenu: () => ({ show: mockShow, hide: mockHide }),
}));
jest.mock('@/components/BubbleContentMenu/Contents/MembersActionList', () => 'MembersActionList');

const mockFetchGetUsersByChannelId = fetchGetUsersByChannelId as jest.Mock;

const navigation = { goBack: jest.fn() } as unknown as NativeStackNavigationProp<
  RootStackParamList,
  'ChannelMembersList'
>;

const member = (id: string, firstName: string, userName: string, role = UserRole.User) =>
  ({
    id,
    firstName,
    middleName: null,
    lastName: 'Doe',
    userName,
    role: { name: role },
    statusCreatedAt: '2026-01-01T00:00:00Z',
  }) as ChannelUser;

const usersPage = (
  items: ChannelUser[],
  { admins, hasNext = false }: { admins?: ChannelUser[]; hasNext?: boolean } = {},
): UsersAtChannelListModel => ({
  items,
  admins,
  count: items.length,
  size: 5,
  index: 0,
  pages: hasNext ? 2 : 1,
  hasNext,
  hasPrevious: false,
});

const preloadedState = {
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

const renderScreen = () =>
  renderWithProviders(<ChannelMembersList navigation={navigation} />, { preloadedState });

const scrollToBottom = () =>
  fireEvent.scroll(screen.UNSAFE_getByType(ScrollView), {
    nativeEvent: {
      layoutMeasurement: { height: 800, width: 375 },
      contentOffset: { y: 1000, x: 0 },
      contentSize: { height: 1800, width: 375 },
    },
  });

beforeEach(() => {
  jest.clearAllMocks();
  mockFetchGetUsersByChannelId.mockResolvedValue({
    data: usersPage([member('user-2', 'Bob', 'bob')], {
      admins: [member('user-1', 'Alice', 'alice', UserRole.Owner)],
    }),
  });
});

describe('ChannelMembersList', () => {
  it('shows the loading screen until the first page arrives', async () => {
    let resolveFetch: (value: unknown) => void = () => {};
    mockFetchGetUsersByChannelId.mockReturnValue(new Promise(resolve => (resolveFetch = resolve)));

    renderScreen();

    expect(screen.getByText('Please wait while members load ...')).toBeTruthy();

    await act(async () => resolveFetch({ data: usersPage([member('user-2', 'Bob', 'bob')]) }));

    expect(screen.queryByText('Please wait while members load ...')).toBeNull();
  });

  it('fetches the members of the active channel and lists admins separately', async () => {
    renderScreen();
    await flush();

    expect(mockFetchGetUsersByChannelId).toHaveBeenCalledWith('channel-1', {
      search: '',
      index: 0,
      size: 5,
    });
    expect(screen.getByText('ADMINS')).toBeTruthy();
    expect(screen.getByText('MEMBERS')).toBeTruthy();
    expect(screen.getByText('Alice Doe')).toBeTruthy();
    expect(screen.getByText('Bob Doe')).toBeTruthy();
  });

  it('hides the admins section when the channel has no admins', async () => {
    mockFetchGetUsersByChannelId.mockResolvedValue({
      data: usersPage([member('user-2', 'Bob', 'bob')], { admins: [] }),
    });
    renderScreen();
    await flush();

    expect(screen.queryByText('ADMINS')).toBeNull();
    expect(screen.getByText('MEMBERS')).toBeTruthy();
  });

  it('reports a failed load instead of claiming the channel is empty', async () => {
    mockFetchGetUsersByChannelId.mockRejectedValue(new Error('network down'));
    renderScreen();
    await flush();

    expect(screen.getByText('Failed to load members. Please try again ...')).toBeTruthy();
    expect(screen.queryByText('No users found in this channel.')).toBeNull();
  });

  it('reloads the members when the error screen is retried', async () => {
    mockFetchGetUsersByChannelId.mockRejectedValue(new Error('network down'));
    renderScreen();
    await flush();

    mockFetchGetUsersByChannelId.mockResolvedValue({
      data: usersPage([member('user-2', 'Bob', 'bob')], { admins: [] }),
    });
    fireEvent.press(screen.getByText('Try Again'));
    await flush();

    expect(screen.getByText('Bob Doe')).toBeTruthy();
    expect(screen.queryByText('Failed to load members. Please try again ...')).toBeNull();
  });

  it('keeps the loaded members on screen when a later refresh fails', async () => {
    renderScreen();
    await flush();

    mockFetchGetUsersByChannelId.mockRejectedValue(new Error('network down'));
    fireEvent.press(screen.getByText('Bob Doe'));
    await act(async () => mockShow.mock.calls[0][0].props.onActionComplete());

    expect(screen.getByText('Bob Doe')).toBeTruthy();
    expect(screen.queryByText('Failed to load members. Please try again ...')).toBeNull();
  });

  it('shows the empty state when the channel has no members at all', async () => {
    mockFetchGetUsersByChannelId.mockResolvedValue({ data: usersPage([], { admins: [] }) });
    renderScreen();
    await flush();

    expect(screen.getByText('No users found in this channel.')).toBeTruthy();
  });

  it('searches server-side and filters the already-loaded admins locally', async () => {
    jest.useFakeTimers();
    try {
      renderScreen();
      await act(async () => {});

      mockFetchGetUsersByChannelId.mockResolvedValue({
        data: usersPage([], {
          admins: [member('user-1', 'Alice', 'alice', UserRole.Owner)],
        }),
      });
      fireEvent.changeText(screen.getByPlaceholderText('Search members...'), '  bob  ');

      await act(async () => {
        jest.advanceTimersByTime(400);
      });
      await act(async () => {});

      expect(mockFetchGetUsersByChannelId).toHaveBeenLastCalledWith('channel-1', {
        search: 'bob',
        index: 0,
        size: 5,
      });
      // "Alice" does not match the term, so the admins section drops out too.
      expect(screen.queryByText('Alice Doe')).toBeNull();
      expect(screen.getByText('No users found matching "bob".')).toBeTruthy();
    } finally {
      jest.useRealTimers();
    }
  });

  it('appends the next page when the list is scrolled to the bottom', async () => {
    mockFetchGetUsersByChannelId.mockResolvedValue({
      data: usersPage([member('user-2', 'Bob', 'bob')], { admins: [], hasNext: true }),
    });
    renderScreen();
    await flush();

    mockFetchGetUsersByChannelId.mockResolvedValue({
      data: usersPage([member('user-3', 'Carol', 'carol')]),
    });
    scrollToBottom();
    await flush();

    expect(mockFetchGetUsersByChannelId).toHaveBeenLastCalledWith('channel-1', {
      search: '',
      index: 1,
      size: 5,
    });
    expect(screen.getByText('Bob Doe')).toBeTruthy();
    expect(screen.getByText('Carol Doe')).toBeTruthy();
  });

  it('does not request another page once the last one is loaded', async () => {
    renderScreen();
    await flush();

    scrollToBottom();
    await flush();

    expect(mockFetchGetUsersByChannelId).toHaveBeenCalledTimes(1);
  });

  it('opens the member action menu and refreshes the list after an action completes', async () => {
    renderScreen();
    await flush();

    fireEvent.press(screen.getByText('Bob Doe'));
    expect(mockShow).toHaveBeenCalledTimes(1);

    const actionList = mockShow.mock.calls[0][0];
    expect(actionList.props.selectedUser.id).toBe('user-2');

    await act(async () => actionList.props.onActionComplete());

    expect(mockHide).toHaveBeenCalledTimes(1);
    expect(mockFetchGetUsersByChannelId).toHaveBeenCalledTimes(2);
  });

  it('goes back from the header back button', async () => {
    renderScreen();
    await flush();

    fireEvent.press(screen.UNSAFE_getByProps({ name: 'arrow-left-line' }));

    expect(navigation.goBack).toHaveBeenCalled();
  });
});
