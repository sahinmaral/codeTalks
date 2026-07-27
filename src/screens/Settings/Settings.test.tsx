import { setNotificationSettings } from '@/redux/reducers/appReducer';
import { fetchUpdateUserNotificationSettings } from '@/services/apiServices/users';
import { renderWithProviders } from '@/test/renderWithProviders';
import { ProfileStackParamList } from '@/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { act, fireEvent, screen } from '@testing-library/react-native';
import { AxiosError } from 'axios';
import React from 'react';
import { Pressable } from 'react-native';
import { showMessage } from 'react-native-flash-message';
import Settings from './Settings';

// The notification toggle awaits an API call before updating redux/local state.
const flush = () => act(async () => {});

const mockConfirm = jest.fn();
const mockLogout = jest.fn();

jest.mock('@/services/apiServices/users', () => ({
  fetchUpdateUserNotificationSettings: jest.fn(),
}));
jest.mock('react-native-flash-message', () => ({ showMessage: jest.fn() }));
jest.mock('@/components/ConfirmationDialog', () => ({
  useConfirmationDialog: () => ({ confirm: mockConfirm }),
}));
jest.mock('@/hooks/useLogout', () => ({ __esModule: true, default: () => mockLogout }));

const mockFetchUpdateNotificationSettings = fetchUpdateUserNotificationSettings as jest.Mock;
const mockShowMessage = showMessage as jest.Mock;

const navigation = { navigate: jest.fn() } as unknown as NativeStackNavigationProp<
  ProfileStackParamList,
  'Settings'
>;

const notificationSettings = { isEnabled: true, isSoundEnabled: false };

const preloadedState = {
  app: {
    user: null,
    notificationSettings,
    channelMuteSettings: [],
    totalUnreadCount: 0,
    channelUnreadCounts: {},
  },
};

const renderScreen = (state = preloadedState) =>
  renderWithProviders(<Settings navigation={navigation} />, { preloadedState: state });

// The sound row is the second toggle on the screen; the first (message notification) is
// permanently disabled.
const soundToggle = () => screen.UNSAFE_getAllByType(Pressable)[1];

beforeEach(() => {
  jest.clearAllMocks();
  mockFetchUpdateNotificationSettings.mockResolvedValue({ data: null });
});

describe('Settings', () => {
  it('renders every settings section', () => {
    renderScreen();

    expect(screen.getByText('NOTIFICATIONS')).toBeTruthy();
    expect(screen.getByText('APPEARANCE')).toBeTruthy();
    expect(screen.getByText('LANGUAGE')).toBeTruthy();
    expect(screen.getByText('PRIVACY & SECURITY')).toBeTruthy();
    expect(screen.getByText('ABOUT')).toBeTruthy();
    expect(screen.getByText('Log Out')).toBeTruthy();
    expect(screen.getByText('1.0.0')).toBeTruthy();
  });

  it('ticks the currently selected theme and language', () => {
    renderScreen();

    // One check icon for the selected theme, one for the selected language.
    expect(screen.UNSAFE_getAllByProps({ name: 'ri-check-line' })).toHaveLength(2);
  });

  it('changes the theme mode when another theme option is picked', () => {
    const { store } = renderScreen();

    fireEvent.press(screen.getByText('Dark'));

    expect(store.getState().theme.mode).toBe('dark');
  });

  it('changes the language mode when another language option is picked', () => {
    const { store } = renderScreen();

    fireEvent.press(screen.getByText('Turkish'));

    expect(store.getState().language.mode).toBe('tr');
  });

  it('navigates to the change password, terms and privacy screens', () => {
    renderScreen();

    fireEvent.press(screen.getByText('Change Password'));
    fireEvent.press(screen.getByText('Terms Of Service'));
    fireEvent.press(screen.getByText('Privacy Policy'));

    expect(navigation.navigate).toHaveBeenCalledWith('ChangePassword');
    expect(navigation.navigate).toHaveBeenCalledWith('TermsOfService');
    expect(navigation.navigate).toHaveBeenCalledWith('PrivacyPolicy');
  });

  it('sends the new sound preference to the API when the sound toggle is flipped', async () => {
    renderScreen();

    fireEvent.press(soundToggle());
    await flush();

    expect(mockFetchUpdateNotificationSettings).toHaveBeenCalledWith({ isSoundEnabled: true });
  });

  it('stores the same sound preference in redux that it sent to the API', async () => {
    const { store } = renderScreen();

    fireEvent.press(soundToggle());
    await flush();

    expect(store.getState().app.notificationSettings).toEqual({
      isEnabled: true,
      isSoundEnabled: true,
    });
  });

  it('turns the sound back off on a second toggle', async () => {
    const { store } = renderScreen();

    fireEvent.press(soundToggle());
    await flush();
    fireEvent.press(soundToggle());
    await flush();

    expect(mockFetchUpdateNotificationSettings).toHaveBeenLastCalledWith({ isSoundEnabled: false });
    expect(store.getState().app.notificationSettings).toEqual({
      isEnabled: true,
      isSoundEnabled: false,
    });
  });

  it('shows the stored sound preference rather than a stale local copy', async () => {
    const { store } = renderScreen({
      ...preloadedState,
      app: {
        ...preloadedState.app,
        notificationSettings: { isEnabled: true, isSoundEnabled: true },
      },
    });

    // A change made elsewhere in the app is reflected without remounting the screen.
    act(() => {
      store.dispatch(setNotificationSettings({ isEnabled: true, isSoundEnabled: false }));
    });

    fireEvent.press(soundToggle());
    await flush();

    expect(mockFetchUpdateNotificationSettings).toHaveBeenCalledWith({ isSoundEnabled: true });
  });

  it('surfaces the server message when the sound preference cannot be saved', async () => {
    const error = new AxiosError('Request failed');
    error.response = { data: { detail: 'Settings could not be saved' } } as never;
    mockFetchUpdateNotificationSettings.mockRejectedValue(error);
    const { store } = renderScreen();

    fireEvent.press(soundToggle());
    await flush();

    expect(mockShowMessage).toHaveBeenCalledWith({
      message: 'Settings could not be saved',
      type: 'danger',
    });
    expect(store.getState().app.notificationSettings).toEqual(notificationSettings);
  });

  it('asks for confirmation before logging out and logs out only on confirm', () => {
    renderScreen();

    fireEvent.press(screen.getByText('Log Out'));

    expect(mockConfirm).toHaveBeenCalledTimes(1);
    expect(mockLogout).not.toHaveBeenCalled();

    const options = mockConfirm.mock.calls[0][0];
    expect(options).toEqual(
      expect.objectContaining({
        theme: 'danger',
        title: 'Log Out',
        description: 'Are you sure you want to log out?',
      }),
    );

    options.onConfirm();
    expect(mockLogout).toHaveBeenCalledTimes(1);
  });

  it('goes back to the profile screen from the header back button', () => {
    renderScreen();

    fireEvent.press(screen.UNSAFE_getByProps({ name: 'arrow-left-line' }));

    expect(navigation.navigate).toHaveBeenCalledWith('MyProfile');
  });
});
