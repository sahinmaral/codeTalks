import { UserStatusType } from '@/enums/UserStatusType';
import { fetchMe } from '@/services/apiServices/users';
import { renderWithProviders } from '@/test/renderWithProviders';
import { ProfileStackParamList, User } from '@/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { act, fireEvent, screen } from '@testing-library/react-native';
import { AxiosError } from 'axios';
import React from 'react';
import { showMessage } from 'react-native-flash-message';
import MyProfile from './MyProfile';

// The focus effect kicks off fetchMe(); flush its promise inside act().
const flush = () => act(async () => {});

const mockShow = jest.fn();

jest.mock('@/services/apiServices/users', () => ({ fetchMe: jest.fn() }));
jest.mock('react-native-flash-message', () => ({ showMessage: jest.fn() }));
jest.mock('@/components/BubbleContentMenu', () => ({
  useBubbleContentMenu: () => ({ show: mockShow, hide: jest.fn() }),
}));
jest.mock('@/components/BubbleContentMenu/Contents/UpdateProfilePhotoModal', () => 'PhotoModal');
jest.mock('@/components/BubbleContentMenu/Contents/SetUserStatusModal', () => 'StatusModal');

const mockFetchMe = fetchMe as jest.Mock;
const mockShowMessage = showMessage as jest.Mock;

const navigation = { navigate: jest.fn() } as unknown as NativeStackNavigationProp<
  ProfileStackParamList,
  'MyProfile'
>;

const profile = {
  bio: 'Mobile developer',
  email: 'jane@example.com',
  joinedChannelCount: 7,
  createdAt: '2026-03-14T00:00:00Z',
  userStatus: { status: UserStatusType.Busy, lastUpdated: '2026-03-14T00:00:00Z' },
};

const user = {
  id: 'user-1',
  userName: 'janedoe',
  firstName: 'Jane',
  middleName: null,
  lastName: 'Doe',
} as unknown as User;

type StateOverrides = { user?: User | null; profile?: typeof profile | null };

const makeState = ({ user: userOverride, profile: profileOverride }: StateOverrides = {}) => ({
  app: {
    user:
      userOverride === undefined
        ? ({ ...user, profile: profileOverride === undefined ? profile : profileOverride } as User)
        : userOverride,
    notificationSettings: null,
    channelMuteSettings: [],
    totalUnreadCount: 0,
    channelUnreadCounts: {},
  },
});

beforeEach(() => {
  jest.clearAllMocks();
  mockFetchMe.mockResolvedValue({ data: profile });
});

describe('MyProfile', () => {
  it('renders the profile of the logged-in user', async () => {
    renderWithProviders(<MyProfile navigation={navigation} />, { preloadedState: makeState() });
    await flush();

    expect(screen.getByText('Jane Doe')).toBeTruthy();
    expect(screen.getByText('@janedoe')).toBeTruthy();
    expect(screen.getByText('Mobile developer')).toBeTruthy();
    expect(screen.getByText('7')).toBeTruthy();
    expect(screen.getByText('Busy')).toBeTruthy();
  });

  it('does not refetch the profile when it is already in redux', async () => {
    renderWithProviders(<MyProfile navigation={navigation} />, { preloadedState: makeState() });
    await flush();

    expect(mockFetchMe).not.toHaveBeenCalled();
  });

  it('fetches the profile on focus when only the user is known, and stores it', async () => {
    const { store } = renderWithProviders(<MyProfile navigation={navigation} />, {
      preloadedState: makeState({ profile: null }),
    });
    await flush();

    expect(mockFetchMe).toHaveBeenCalledTimes(1);
    expect(store.getState().app.user?.profile).toEqual(profile);
    expect(screen.getByText('Mobile developer')).toBeTruthy();
  });

  it('shows the loading screen while the profile is being fetched', async () => {
    let resolveFetch: (value: unknown) => void = () => {};
    mockFetchMe.mockReturnValue(new Promise(resolve => (resolveFetch = resolve)));

    renderWithProviders(<MyProfile navigation={navigation} />, {
      preloadedState: makeState({ profile: null }),
    });

    expect(screen.getByText('Please wait while your profile loads ...')).toBeTruthy();

    await act(async () => resolveFetch({ data: profile }));
    expect(screen.queryByText('Please wait while your profile loads ...')).toBeNull();
  });

  it('surfaces the server message when the profile cannot be fetched', async () => {
    const error = new AxiosError('Request failed');
    error.response = { data: { detail: 'Profile is unavailable' } } as never;
    mockFetchMe.mockRejectedValue(error);

    renderWithProviders(<MyProfile navigation={navigation} />, {
      preloadedState: makeState({ profile: null }),
    });
    await flush();

    expect(mockShowMessage).toHaveBeenCalledWith({
      message: 'Profile is unavailable',
      type: 'danger',
    });
    // The message fades, so the failure also has to be visible on the screen itself.
    expect(screen.getByText('Profile is unavailable')).toBeTruthy();
  });

  it('retries the profile fetch from the error screen', async () => {
    mockFetchMe.mockRejectedValue(new Error('offline'));

    renderWithProviders(<MyProfile navigation={navigation} />, {
      preloadedState: makeState({ profile: null }),
    });
    await flush();

    expect(screen.getByText('An error occurred')).toBeTruthy();

    mockFetchMe.mockResolvedValue({ data: profile });
    fireEvent.press(screen.getByText('Try Again'));
    await flush();

    expect(screen.getByText('Mobile developer')).toBeTruthy();
  });

  it('does not fetch anything when nobody is logged in', async () => {
    renderWithProviders(<MyProfile navigation={navigation} />, {
      preloadedState: makeState({ user: null }),
    });
    await flush();

    expect(mockFetchMe).not.toHaveBeenCalled();
  });

  it('navigates to Settings and EditProfile', async () => {
    renderWithProviders(<MyProfile navigation={navigation} />, { preloadedState: makeState() });
    await flush();

    fireEvent.press(screen.UNSAFE_getByProps({ name: 'settings-5-line' }));
    fireEvent.press(screen.getByText('Edit Profile'));

    expect(navigation.navigate).toHaveBeenCalledWith('Settings');
    expect(navigation.navigate).toHaveBeenCalledWith('EditProfile');
  });

  it('opens the status menu when the status row is tapped', async () => {
    renderWithProviders(<MyProfile navigation={navigation} />, { preloadedState: makeState() });
    await flush();

    fireEvent.press(screen.getByText('Busy'));

    expect(mockShow).toHaveBeenCalledTimes(1);
  });

  it('writes the picked status back to redux when the status menu reports success', async () => {
    const { store } = renderWithProviders(<MyProfile navigation={navigation} />, {
      preloadedState: makeState(),
    });
    await flush();

    fireEvent.press(screen.getByText('Busy'));
    const statusModal = mockShow.mock.calls[0][0];
    act(() => statusModal.props.onSuccess(UserStatusType.Away));

    expect(store.getState().app.user?.profile?.userStatus.status).toBe(UserStatusType.Away);
    expect(screen.getByText('Away')).toBeTruthy();
  });
});
