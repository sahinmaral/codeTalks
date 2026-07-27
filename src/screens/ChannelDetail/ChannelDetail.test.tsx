import ChannelJoinPolicy from '@/enums/ChannelJoinPolicy';
import { UserRole } from '@/enums/UserRole';
import { upsertChannelMuteSetting } from '@/redux/reducers/appReducer';
import {
  fetchDeleteChannel,
  fetchGetChannelById,
  fetchRemoveMemberFromChannel,
} from '@/services/apiServices/channels';
import { fetchUnmuteChannel } from '@/services/apiServices/users';
import { renderWithProviders } from '@/test/renderWithProviders';
import { ChannelDetailDto, RootStackParamList, User } from '@/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { act, fireEvent, screen } from '@testing-library/react-native';
import { AxiosError } from 'axios';
import React from 'react';
import { showMessage } from 'react-native-flash-message';
import ChannelDetail from './ChannelDetail';

// The focus effect loads the channel detail; flush that promise inside act().
const flush = () => act(async () => {});

const mockShow = jest.fn();
const mockConfirm = jest.fn();

jest.mock('@/services/apiServices/channels', () => ({
  fetchGetChannelById: jest.fn(),
  fetchDeleteChannel: jest.fn(),
  fetchRemoveMemberFromChannel: jest.fn(),
}));
jest.mock('@/services/apiServices/users', () => ({ fetchUnmuteChannel: jest.fn() }));
jest.mock('react-native-flash-message', () => ({ showMessage: jest.fn() }));
jest.mock('@/components/BubbleContentMenu', () => ({
  useBubbleContentMenu: () => ({ show: mockShow, hide: jest.fn() }),
}));
jest.mock('@/components/ConfirmationDialog', () => ({
  useConfirmationDialog: () => ({ confirm: mockConfirm }),
}));

const mockFetchGetChannelById = fetchGetChannelById as jest.Mock;
const mockFetchDeleteChannel = fetchDeleteChannel as jest.Mock;
const mockFetchRemoveMemberFromChannel = fetchRemoveMemberFromChannel as jest.Mock;
const mockFetchUnmuteChannel = fetchUnmuteChannel as jest.Mock;
const mockShowMessage = showMessage as jest.Mock;

const navigation = {
  navigate: jest.fn(),
  goBack: jest.fn(),
} as unknown as NativeStackNavigationProp<RootStackParamList, 'ChannelDetail'>;

const detail = (role: UserRole, joinPolicy = ChannelJoinPolicy.Open): ChannelDetailDto => ({
  id: 'channel-1',
  name: 'general',
  description: 'General discussion',
  inviteCode: 'INVITE1',
  joinPolicy,
  memberCount: 12,
  createdAt: '2026-01-15T12:00:00Z',
  role: { name: role },
});

const makeState = (mutedUntil?: string) => ({
  app: {
    user: { id: 'user-1' } as User,
    notificationSettings: null,
    channelMuteSettings: mutedUntil
      ? [{ channelId: 'channel-1', isMuted: true, mutedUntil }]
      : [{ channelId: 'channel-1', isMuted: false }],
    totalUnreadCount: 0,
    channelUnreadCounts: {},
  },
  activeChannel: {
    viewingChannelId: null,
    channel: {
      id: 'channel-1',
      name: 'general',
      description: 'General discussion',
      inviteCode: 'INVITE1',
      joinPolicy: ChannelJoinPolicy.Open,
      createdAt: '2026-01-15T12:00:00Z',
    },
  },
});

const renderScreen = (mutedUntil?: string) =>
  renderWithProviders(<ChannelDetail navigation={navigation} />, {
    preloadedState: makeState(mutedUntil),
  });

beforeEach(() => {
  jest.clearAllMocks();
  mockFetchGetChannelById.mockResolvedValue({ data: detail(UserRole.User) });
  mockFetchDeleteChannel.mockResolvedValue({ data: null });
  mockFetchRemoveMemberFromChannel.mockResolvedValue({ data: null });
  mockFetchUnmuteChannel.mockResolvedValue({ data: null });
});

describe('ChannelDetail', () => {
  it('shows the loading screen until the channel detail arrives', async () => {
    let resolveFetch: (value: unknown) => void = () => {};
    mockFetchGetChannelById.mockReturnValue(new Promise(resolve => (resolveFetch = resolve)));

    renderScreen();

    expect(screen.getByText('Please wait while the channel details load ...')).toBeTruthy();

    await act(async () => resolveFetch({ data: detail(UserRole.User) }));

    expect(screen.queryByText('Please wait while the channel details load ...')).toBeNull();
  });

  it('renders the channel identity and stats', async () => {
    renderScreen();
    await flush();

    expect(mockFetchGetChannelById).toHaveBeenCalledWith('channel-1');
    expect(screen.getByText('General discussion')).toBeTruthy();
    expect(screen.getByText('#INVITE1')).toBeTruthy();
    expect(screen.getByText('12')).toBeTruthy();
    expect(screen.getByText('Jan 2026')).toBeTruthy();
  });

  it('refreshes the active channel in redux from the fetched detail', async () => {
    mockFetchGetChannelById.mockResolvedValue({
      data: { ...detail(UserRole.Owner), name: 'general-renamed' },
    });
    const { store } = renderScreen();
    await flush();

    expect(store.getState().activeChannel.channel).toEqual(
      expect.objectContaining({ name: 'general-renamed', role: UserRole.Owner }),
    );
  });

  it('renders nothing when the channel detail cannot be loaded', async () => {
    mockFetchGetChannelById.mockRejectedValue(new Error('not found'));
    renderScreen();
    await flush();

    expect(screen.queryByText('General discussion')).toBeNull();
    expect(screen.queryByText('Please wait while the channel details load ...')).toBeNull();
  });

  it('hides the admin panel from a regular member', async () => {
    renderScreen();
    await flush();

    expect(screen.queryByText('ADMIN PANEL')).toBeNull();
    expect(screen.getByText('View All Members')).toBeTruthy();
  });

  it('shows moderator tools but no owner-only tools for a moderator', async () => {
    mockFetchGetChannelById.mockResolvedValue({ data: detail(UserRole.Moderator) });
    renderScreen();
    await flush();

    expect(screen.getByText('ADMIN PANEL')).toBeTruthy();
    expect(screen.getByText('Remove a Member')).toBeTruthy();
    expect(screen.getByText('Banned Members')).toBeTruthy();
    expect(screen.queryByText('Edit Channel Name')).toBeNull();
    expect(screen.queryByText('Edit Join Policy')).toBeNull();
  });

  it('shows the full admin panel for the owner', async () => {
    mockFetchGetChannelById.mockResolvedValue({ data: detail(UserRole.Owner) });
    renderScreen();
    await flush();

    expect(screen.getByText('Edit Channel Name')).toBeTruthy();
    expect(screen.getByText('Edit Description')).toBeTruthy();
    expect(screen.getByText('Edit Join Policy')).toBeTruthy();
  });

  it('only offers pending join requests on a request-based channel', async () => {
    mockFetchGetChannelById.mockResolvedValue({ data: detail(UserRole.Owner) });
    const { unmount } = renderScreen();
    await flush();

    expect(screen.queryByText('Pending Join Requests')).toBeNull();
    unmount();

    mockFetchGetChannelById.mockResolvedValue({
      data: detail(UserRole.Owner, ChannelJoinPolicy.Request),
    });
    renderScreen();
    await flush();

    expect(screen.getByText('Pending Join Requests')).toBeTruthy();
  });

  it('navigates to the member management screens', async () => {
    mockFetchGetChannelById.mockResolvedValue({
      data: detail(UserRole.Owner, ChannelJoinPolicy.Request),
    });
    renderScreen();
    await flush();

    fireEvent.press(screen.getByText('View All Members'));
    fireEvent.press(screen.getByText('Pending Join Requests'));
    fireEvent.press(screen.getByText('Remove a Member'));
    fireEvent.press(screen.getByText('Banned Members'));

    expect(navigation.navigate).toHaveBeenCalledWith('ChannelMembersList');
    expect(navigation.navigate).toHaveBeenCalledWith('ChannelPendingJoinRequestsList');
    expect(navigation.navigate).toHaveBeenCalledWith('RemoveMemberFromChannel');
    expect(navigation.navigate).toHaveBeenCalledWith('ChannelBannedMembersList');
  });

  it('opens the owner edit menus', async () => {
    mockFetchGetChannelById.mockResolvedValue({ data: detail(UserRole.Owner) });
    renderScreen();
    await flush();

    fireEvent.press(screen.getByText('Edit Channel Name'));
    fireEvent.press(screen.getByText('Set/Change Thumbnail Image'));
    fireEvent.press(screen.getByText('Edit Description'));
    fireEvent.press(screen.getByText('Edit Join Policy'));

    expect(mockShow).toHaveBeenCalledTimes(4);
  });

  it('offers to mute a channel that has no mute setting in redux', async () => {
    renderScreen();
    await flush();

    expect(screen.getByText('Mute this Channel')).toBeTruthy();
    expect(screen.UNSAFE_queryByProps({ name: 'ri-notification-off-line' })).toBeNull();
  });

  it('opens the mute menu from the notifications row', async () => {
    renderScreen();
    await flush();

    fireEvent.press(screen.getByText('Mute this Channel'));

    expect(mockShow).toHaveBeenCalledTimes(1);
  });

  it('shows how long the channel stays muted when redux says it is muted', async () => {
    renderScreen('2026-08-01T18:30:00.000Z');
    await flush();

    expect(screen.queryByText('Mute this Channel')).toBeNull();
    // The deadline is rendered in local time, so match its shape rather than a fixed clock time.
    expect(screen.getByText(/^Muted until \d{2} \w{3} 2026, \d{2}:\d{2}$/)).toBeTruthy();
  });

  it('reflects a mute made elsewhere in the app without remounting', async () => {
    const { store } = renderScreen();
    await flush();

    expect(screen.getByText('Mute this Channel')).toBeTruthy();

    act(() => {
      store.dispatch(
        upsertChannelMuteSetting({
          channelId: 'channel-1',
          isMuted: true,
          mutedUntil: '9999-12-31T23:59:59.999Z',
        }),
      );
    });

    expect(screen.queryByText('Mute this Channel')).toBeNull();
    expect(screen.getByText('Muted until forever')).toBeTruthy();
  });

  it('asks for confirmation before unmuting and unmutes on confirm', async () => {
    const { store } = renderScreen('9999-12-31T23:59:59.999Z');
    await flush();

    fireEvent.press(screen.getByText('Muted until forever'));

    expect(mockConfirm.mock.calls[0][0]).toEqual(
      expect.objectContaining({
        title: 'Unmute Channel?',
        description:
          'Are you sure you want to unmute #general? You will start receiving notifications from this channel again.',
      }),
    );
    expect(mockFetchUnmuteChannel).not.toHaveBeenCalled();

    await act(async () => mockConfirm.mock.calls[0][0].onConfirm());

    expect(mockFetchUnmuteChannel).toHaveBeenCalledWith('channel-1');
    expect(store.getState().app.channelMuteSettings).toEqual([]);
    expect(mockShowMessage).toHaveBeenCalledWith({
      message: 'You have unmuted this channel',
      type: 'success',
    });
    expect(navigation.navigate).toHaveBeenCalledWith('ActiveChannelList');
  });

  it('asks for confirmation before leaving and leaves on confirm', async () => {
    renderScreen();
    await flush();

    fireEvent.press(screen.getByText('Leave Channel'));

    expect(mockConfirm.mock.calls[0][0]).toEqual(
      expect.objectContaining({ theme: 'warning', title: 'Leave Channel?' }),
    );
    expect(mockFetchRemoveMemberFromChannel).not.toHaveBeenCalled();

    await act(async () => mockConfirm.mock.calls[0][0].onConfirm());

    expect(mockFetchRemoveMemberFromChannel).toHaveBeenCalledWith('channel-1', 'user-1');
    expect(navigation.navigate).toHaveBeenCalledWith('ActiveChannelList');
    expect(mockShowMessage).toHaveBeenCalledWith({
      message: 'You have left this channel',
      type: 'success',
    });
  });

  it('surfaces the server message and stays put when leaving fails', async () => {
    const error = new AxiosError('Request failed');
    error.response = { data: { detail: 'Owner cannot leave the channel' } } as never;
    mockFetchRemoveMemberFromChannel.mockRejectedValue(error);
    renderScreen();
    await flush();

    fireEvent.press(screen.getByText('Leave Channel'));
    await act(async () => mockConfirm.mock.calls[0][0].onConfirm());

    expect(mockShowMessage).toHaveBeenCalledWith({
      message: 'Owner cannot leave the channel',
      type: 'danger',
    });
    expect(navigation.navigate).not.toHaveBeenCalled();
  });

  it('asks for confirmation before deleting and deletes on confirm', async () => {
    renderScreen();
    await flush();

    fireEvent.press(screen.getByText('Delete Channel'));

    expect(mockConfirm.mock.calls[0][0]).toEqual(
      expect.objectContaining({ theme: 'danger', title: 'Delete Channel?' }),
    );
    expect(mockFetchDeleteChannel).not.toHaveBeenCalled();

    await act(async () => mockConfirm.mock.calls[0][0].onConfirm());

    expect(mockFetchDeleteChannel).toHaveBeenCalledWith('channel-1');
    expect(navigation.navigate).toHaveBeenCalledWith('ActiveChannelList');
    expect(mockShowMessage).toHaveBeenCalledWith({
      message: 'You have deleted this channel',
      type: 'success',
    });
  });

  it('goes back from the header back button', async () => {
    renderScreen();
    await flush();

    fireEvent.press(screen.UNSAFE_getByProps({ name: 'arrow-left-line' }));

    expect(navigation.goBack).toHaveBeenCalled();
  });
});
