import ChannelJoinPolicy from '@/enums/ChannelJoinPolicy';
import { UserRole } from '@/enums/UserRole';
import {
  fetchGetUsersByChannelId,
  fetchRemoveMemberFromChannel,
} from '@/services/apiServices/channels';
import { renderWithProviders } from '@/test/renderWithProviders';
import { ChannelUser, RootStackParamList, User, UsersAtChannelListModel } from '@/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { act, fireEvent, screen } from '@testing-library/react-native';
import { AxiosError } from 'axios';
import React from 'react';
import { showMessage } from 'react-native-flash-message';
import RemoveMemberFromChannel from './RemoveMemberFromChannel';

// The focus effect fetches the first page; flush that promise inside act().
const flush = () => act(async () => {});

const mockConfirm = jest.fn();

jest.mock('@/services/apiServices/channels', () => ({
  fetchGetUsersByChannelId: jest.fn(),
  fetchRemoveMemberFromChannel: jest.fn(),
}));
jest.mock('react-native-flash-message', () => ({ showMessage: jest.fn() }));
jest.mock('@/components/ConfirmationDialog', () => ({
  useConfirmationDialog: () => ({ confirm: mockConfirm }),
}));

const mockFetchGetUsersByChannelId = fetchGetUsersByChannelId as jest.Mock;
const mockFetchRemoveMemberFromChannel = fetchRemoveMemberFromChannel as jest.Mock;
const mockShowMessage = showMessage as jest.Mock;

const navigation = { goBack: jest.fn() } as unknown as NativeStackNavigationProp<
  RootStackParamList,
  'RemoveMemberFromChannel'
>;

const channelUser = (id: string, firstName: string, userName: string, role = UserRole.User) =>
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

const makeState = (role: UserRole) => ({
  app: {
    user: { id: 'me' } as User,
    notificationSettings: null,
    channelMuteSettings: [],
    totalUnreadCount: 0,
    channelUnreadCounts: {},
  },
  activeChannel: {
    viewingChannelId: null,
    channel: {
      id: 'channel-1',
      name: 'general',
      inviteCode: 'invite-1',
      joinPolicy: ChannelJoinPolicy.Open,
      createdAt: '2026-01-01T00:00:00Z',
      role,
    },
  },
});

const renderScreen = (role = UserRole.Owner) =>
  renderWithProviders(<RemoveMemberFromChannel navigation={navigation} />, {
    preloadedState: makeState(role),
  });

// Card types are only visible through the trailing icon each card renders.
const cardIcons = () =>
  screen.UNSAFE_queryAllByProps({ name: 'ri-delete-bin-line' }).length +
  screen.UNSAFE_queryAllByProps({ name: 'lock-2-line' }).length;

beforeEach(() => {
  jest.clearAllMocks();
  mockFetchGetUsersByChannelId.mockResolvedValue({
    data: usersPage([channelUser('user-2', 'Bob', 'bob')], {
      admins: [
        channelUser('me', 'Me', 'me', UserRole.Owner),
        channelUser('user-1', 'Alice', 'alice', UserRole.Moderator),
      ],
    }),
  });
  mockFetchRemoveMemberFromChannel.mockResolvedValue({ data: null });
});

describe('RemoveMemberFromChannel', () => {
  it('shows the loading screen until the first page arrives', async () => {
    let resolveFetch: (value: unknown) => void = () => {};
    mockFetchGetUsersByChannelId.mockReturnValue(new Promise(resolve => (resolveFetch = resolve)));

    renderScreen();

    expect(screen.getByText('Please wait while members load ...')).toBeTruthy();

    await act(async () => resolveFetch({ data: usersPage([]) }));

    expect(screen.queryByText('Please wait while members load ...')).toBeNull();
  });

  it('lists admins and members of the active channel', async () => {
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

  it('lets an owner remove other admins but locks their own card', async () => {
    renderScreen(UserRole.Owner);
    await flush();

    // Removable: the other admin (Alice) and the regular member (Bob). Locked: the owner.
    expect(screen.UNSAFE_getAllByProps({ name: 'ri-delete-bin-line' })).toHaveLength(2);
    expect(screen.UNSAFE_getAllByProps({ name: 'lock-2-line' })).toHaveLength(1);
    expect(cardIcons()).toBe(3);
  });

  it('locks every admin card for a non-owner', async () => {
    renderScreen(UserRole.Moderator);
    await flush();

    // Both admins are locked; only the regular member stays removable.
    expect(screen.UNSAFE_getAllByProps({ name: 'lock-2-line' })).toHaveLength(2);
    expect(screen.UNSAFE_getAllByProps({ name: 'ri-delete-bin-line' })).toHaveLength(1);
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
      data: usersPage([channelUser('user-2', 'Bob', 'bob')], { admins: [] }),
    });
    fireEvent.press(screen.getByText('Try Again'));
    await flush();

    expect(screen.getByText('Bob Doe')).toBeTruthy();
  });

  it('asks for confirmation naming the member before removing anyone', async () => {
    renderScreen();
    await flush();

    fireEvent.press(screen.getByText('Bob Doe'));

    expect(mockConfirm).toHaveBeenCalledTimes(1);
    expect(mockConfirm.mock.calls[0][0]).toEqual(
      expect.objectContaining({
        theme: 'danger',
        title: 'Remove Member?',
        description:
          'Are you sure you want to remove @bob from this channel? They will need to send a new join request to return.',
      }),
    );
    expect(mockFetchRemoveMemberFromChannel).not.toHaveBeenCalled();
  });

  it('removes the member and reloads the list on confirm', async () => {
    renderScreen();
    await flush();

    fireEvent.press(screen.getByText('Bob Doe'));
    mockFetchGetUsersByChannelId.mockResolvedValue({ data: usersPage([], { admins: [] }) });
    await act(async () => mockConfirm.mock.calls[0][0].onConfirm());

    expect(mockFetchRemoveMemberFromChannel).toHaveBeenCalledWith('channel-1', 'user-2');
    expect(screen.queryByText('Bob Doe')).toBeNull();
    expect(screen.getByText('No users found in this channel.')).toBeTruthy();
  });

  it('surfaces the server message when the removal fails', async () => {
    const error = new AxiosError('Request failed');
    error.response = { data: { detail: 'Member could not be removed' } } as never;
    mockFetchRemoveMemberFromChannel.mockRejectedValue(error);
    renderScreen();
    await flush();

    fireEvent.press(screen.getByText('Bob Doe'));
    await act(async () => mockConfirm.mock.calls[0][0].onConfirm());

    expect(mockShowMessage).toHaveBeenCalledWith({
      message: 'Member could not be removed',
      type: 'danger',
    });
    expect(screen.getByText('Bob Doe')).toBeTruthy();
  });

  it('searches server-side and filters the loaded admins locally', async () => {
    jest.useFakeTimers();
    try {
      renderScreen();
      await act(async () => {});

      mockFetchGetUsersByChannelId.mockResolvedValue({
        data: usersPage([], {
          admins: [channelUser('user-1', 'Alice', 'alice', UserRole.Moderator)],
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
      expect(screen.queryByText('Alice Doe')).toBeNull();
      expect(screen.getByText('No users found matching "bob".')).toBeTruthy();
    } finally {
      jest.useRealTimers();
    }
  });

  it('goes back from the header back button', async () => {
    renderScreen();
    await flush();

    fireEvent.press(screen.UNSAFE_getByProps({ name: 'arrow-left-line' }));

    expect(navigation.goBack).toHaveBeenCalled();
  });
});
