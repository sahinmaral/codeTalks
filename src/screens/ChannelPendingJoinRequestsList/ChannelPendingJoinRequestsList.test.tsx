import ChannelJoinPolicy from '@/enums/ChannelJoinPolicy';
import ChannelUserStatus from '@/enums/ChannelUserStatus';
import { UserRole } from '@/enums/UserRole';
import { fetchGetUsersByChannelId, fetchPatchUserStatus } from '@/services/apiServices/channels';
import { renderWithProviders } from '@/test/renderWithProviders';
import { ChannelUser, RootStackParamList, UsersAtChannelListModel } from '@/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { act, fireEvent, screen } from '@testing-library/react-native';
import { AxiosError } from 'axios';
import React from 'react';
import { ScrollView } from 'react-native';
import { showMessage } from 'react-native-flash-message';
import ChannelPendingJoinRequestsList from './ChannelPendingJoinRequestsList';

// The focus effect fetches the first page; flush that promise inside act().
const flush = () => act(async () => {});

const mockShow = jest.fn();

jest.mock('@/services/apiServices/channels', () => ({
  fetchGetUsersByChannelId: jest.fn(),
  fetchPatchUserStatus: jest.fn(),
}));
jest.mock('react-native-flash-message', () => ({ showMessage: jest.fn() }));
jest.mock('@/components/BubbleContentMenu', () => ({
  useBubbleContentMenu: () => ({ show: mockShow, hide: jest.fn() }),
}));
jest.mock(
  '@/components/BubbleContentMenu/Contents/PendingJoinRequestActionList',
  () => 'PendingJoinRequestActionList',
);

const mockFetchGetUsersByChannelId = fetchGetUsersByChannelId as jest.Mock;
const mockFetchPatchUserStatus = fetchPatchUserStatus as jest.Mock;
const mockShowMessage = showMessage as jest.Mock;

const navigation = { goBack: jest.fn() } as unknown as NativeStackNavigationProp<
  RootStackParamList,
  'ChannelPendingJoinRequestsList'
>;

const requester = (id: string, firstName: string, userName: string) =>
  ({
    id,
    firstName,
    middleName: null,
    lastName: 'Doe',
    userName,
    role: { name: UserRole.User },
    statusCreatedAt: '2026-01-01T00:00:00Z',
  }) as ChannelUser;

const usersPage = (items: ChannelUser[], hasNext = false): UsersAtChannelListModel => ({
  items,
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
      joinPolicy: ChannelJoinPolicy.Request,
      createdAt: '2026-01-01T00:00:00Z',
    },
  },
};

const renderScreen = () =>
  renderWithProviders(<ChannelPendingJoinRequestsList navigation={navigation} />, {
    preloadedState,
  });

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
    data: usersPage([requester('user-1', 'Alice', 'alice')]),
  });
  mockFetchPatchUserStatus.mockResolvedValue({ data: null });
});

describe('ChannelPendingJoinRequestsList', () => {
  it('shows the loading screen until the first page arrives', async () => {
    let resolveFetch: (value: unknown) => void = () => {};
    mockFetchGetUsersByChannelId.mockReturnValue(new Promise(resolve => (resolveFetch = resolve)));

    renderScreen();

    expect(screen.getByText('Please wait while members load ...')).toBeTruthy();

    await act(async () => resolveFetch({ data: usersPage([]) }));

    expect(screen.queryByText('Please wait while members load ...')).toBeNull();
  });

  it('only requests users whose join request is still pending', async () => {
    renderScreen();
    await flush();

    expect(mockFetchGetUsersByChannelId).toHaveBeenCalledWith('channel-1', {
      search: '',
      index: 0,
      size: 5,
      status: ChannelUserStatus.RequestSent,
    });
    expect(screen.getByText('Alice Doe')).toBeTruthy();
    expect(screen.getByText('@alice')).toBeTruthy();
  });

  it('names the active channel in the screen description', async () => {
    renderScreen();
    await flush();

    expect(
      screen.getByText(
        'Review and manage join requests for #general. Tap a request to accept, reject, or block the user',
      ),
    ).toBeTruthy();
  });

  it('reports a failed load instead of claiming there are no requests', async () => {
    mockFetchGetUsersByChannelId.mockRejectedValue(new Error('network down'));
    renderScreen();
    await flush();

    expect(screen.getByText('Failed to load join requests. Please try again ...')).toBeTruthy();
    expect(screen.queryByText('No users have sent a join request to this channel.')).toBeNull();
  });

  it('reloads the requests when the error screen is retried', async () => {
    mockFetchGetUsersByChannelId.mockRejectedValue(new Error('network down'));
    renderScreen();
    await flush();

    mockFetchGetUsersByChannelId.mockResolvedValue({
      data: usersPage([requester('user-1', 'Alice', 'alice')]),
    });
    fireEvent.press(screen.getByText('Try Again'));
    await flush();

    expect(screen.getByText('Alice Doe')).toBeTruthy();
  });

  it('shows the empty state when there are no pending requests', async () => {
    mockFetchGetUsersByChannelId.mockResolvedValue({ data: usersPage([]) });
    renderScreen();
    await flush();

    expect(screen.getByText('No users have sent a join request to this channel.')).toBeTruthy();
  });

  it('searches with the debounced term and reports an empty search result', async () => {
    jest.useFakeTimers();
    try {
      renderScreen();
      await act(async () => {});

      mockFetchGetUsersByChannelId.mockResolvedValue({ data: usersPage([]) });
      fireEvent.changeText(screen.getByPlaceholderText('Search requests...'), '  bob  ');

      await act(async () => {
        jest.advanceTimersByTime(400);
      });
      await act(async () => {});

      expect(mockFetchGetUsersByChannelId).toHaveBeenLastCalledWith('channel-1', {
        search: 'bob',
        index: 0,
        size: 5,
        status: ChannelUserStatus.RequestSent,
      });
      expect(screen.getByText('No requesting users found matching "bob".')).toBeTruthy();
    } finally {
      jest.useRealTimers();
    }
  });

  it('accepts a request and reloads the list', async () => {
    renderScreen();
    await flush();

    fireEvent.press(screen.getByText('Alice Doe'));
    const actionList = mockShow.mock.calls[0][0];
    expect(actionList.props.user.id).toBe('user-1');

    mockFetchGetUsersByChannelId.mockResolvedValue({ data: usersPage([]) });
    await act(async () => actionList.props.onSelect(ChannelUserStatus.Accepted));

    expect(mockFetchPatchUserStatus).toHaveBeenCalledWith(
      'channel-1',
      'user-1',
      ChannelUserStatus.Accepted,
    );
    expect(mockFetchGetUsersByChannelId).toHaveBeenCalledTimes(2);
    expect(screen.queryByText('Alice Doe')).toBeNull();
  });

  it('surfaces the server message when a request cannot be updated', async () => {
    const error = new AxiosError('Request failed');
    error.response = { data: { detail: 'Request already handled' } } as never;
    mockFetchPatchUserStatus.mockRejectedValue(error);
    renderScreen();
    await flush();

    fireEvent.press(screen.getByText('Alice Doe'));
    const actionList = mockShow.mock.calls[0][0];
    await act(async () => actionList.props.onSelect(ChannelUserStatus.Denied));

    expect(mockShowMessage).toHaveBeenCalledWith({
      message: 'Request already handled',
      type: 'danger',
    });
    expect(screen.getByText('Alice Doe')).toBeTruthy();
  });

  it('appends the next page when the list is scrolled to the bottom', async () => {
    mockFetchGetUsersByChannelId.mockResolvedValue({
      data: usersPage([requester('user-1', 'Alice', 'alice')], true),
    });
    renderScreen();
    await flush();

    mockFetchGetUsersByChannelId.mockResolvedValue({
      data: usersPage([requester('user-2', 'Bob', 'bob')]),
    });
    scrollToBottom();
    await flush();

    expect(mockFetchGetUsersByChannelId).toHaveBeenLastCalledWith('channel-1', {
      search: '',
      index: 1,
      size: 5,
      status: ChannelUserStatus.RequestSent,
    });
    expect(screen.getByText('Alice Doe')).toBeTruthy();
    expect(screen.getByText('Bob Doe')).toBeTruthy();
  });

  it('goes back from the header back button', async () => {
    renderScreen();
    await flush();

    fireEvent.press(screen.UNSAFE_getByProps({ name: 'arrow-left-line' }));

    expect(navigation.goBack).toHaveBeenCalled();
  });
});
