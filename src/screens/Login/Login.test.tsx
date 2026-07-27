import { fetchLogin } from '@/services/apiServices/auths';
import {
  fetchUserChannelMuteSettings,
  fetchUserNotificationSettings,
} from '@/services/apiServices/users';
import { renderWithProviders } from '@/test/renderWithProviders';
import { RootStackParamList, User } from '@/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { act, fireEvent, screen } from '@testing-library/react-native';
import { AxiosError } from 'axios';
import React from 'react';
import { showMessage } from 'react-native-flash-message';
import Login from './Login';

// handleSubmit awaits Yup validation + two API round trips; flush those microtasks
// inside act() so the state updates they trigger land before assertions.
const flush = () => act(async () => {});

jest.mock('@/services/apiServices/auths', () => ({ fetchLogin: jest.fn() }));
jest.mock('@/services/apiServices/users', () => ({
  fetchUserNotificationSettings: jest.fn(),
  fetchUserChannelMuteSettings: jest.fn(),
}));
jest.mock('react-native-flash-message', () => ({ showMessage: jest.fn() }));

const mockFetchLogin = fetchLogin as jest.Mock;
const mockFetchNotificationSettings = fetchUserNotificationSettings as jest.Mock;
const mockFetchChannelMuteSettings = fetchUserChannelMuteSettings as jest.Mock;
const mockShowMessage = showMessage as jest.Mock;

const user = { id: 'user-1', username: 'mehmetkesici' } as unknown as User;

const navigation = { navigate: jest.fn() } as unknown as NativeStackNavigationProp<
  RootStackParamList,
  'Login'
>;

// "Sign In" is both the screen heading and the submit button label, in that render order.
const pressSignInButton = () => fireEvent.press(screen.getAllByText('Sign In')[1]);

// The form starts empty, so anything exercising the submit path has to fill it first.
const fillCredentials = ({ email = 'jane@example.com', password = 'Secret1.' } = {}) => {
  fireEvent.changeText(screen.getByPlaceholderText('name@example.com'), email);
  fireEvent.changeText(screen.getByPlaceholderText('********'), password);
};

beforeEach(() => {
  jest.clearAllMocks();
  mockFetchLogin.mockResolvedValue({ data: user });
  mockFetchNotificationSettings.mockResolvedValue({ data: { isPushEnabled: true } });
  mockFetchChannelMuteSettings.mockResolvedValue({ data: [] });
});

describe('Login', () => {
  it('renders an empty sign-in form', () => {
    renderWithProviders(<Login navigation={navigation} />);

    expect(screen.getByPlaceholderText('name@example.com').props.value).toBe('');
    expect(screen.getByPlaceholderText('********').props.value).toBe('');
    expect(screen.getByText('Welcome back! Please enter your details.')).toBeTruthy();
    expect(screen.getByText('Email Address')).toBeTruthy();
    expect(screen.getByText('Password')).toBeTruthy();
    expect(screen.getByText('Remember me')).toBeTruthy();
    expect(screen.getByText('Create account')).toBeTruthy();
  });

  it('logs in with the entered credentials and stores the user in redux', async () => {
    const { store } = renderWithProviders(<Login navigation={navigation} />);

    fillCredentials();
    pressSignInButton();
    await flush();

    expect(mockFetchLogin).toHaveBeenCalledWith({
      usernameOrEmail: 'jane@example.com',
      password: 'Secret1.',
      rememberMe: true,
    });
    expect(store.getState().app.user).toEqual(user);
    expect(mockShowMessage).toHaveBeenCalledWith({
      message: 'You have signed in successfully',
      type: 'success',
    });
  });

  it('loads notification and channel mute settings into redux after a successful login', async () => {
    mockFetchNotificationSettings.mockResolvedValue({ data: { isPushEnabled: false } });
    mockFetchChannelMuteSettings.mockResolvedValue({
      data: [{ channelId: 'channel-1', isMuted: true }],
    });
    const { store } = renderWithProviders(<Login navigation={navigation} />);

    fillCredentials();
    pressSignInButton();
    await flush();

    expect(store.getState().app.notificationSettings).toEqual({ isPushEnabled: false });
    expect(store.getState().app.channelMuteSettings).toEqual([
      { channelId: 'channel-1', isMuted: true },
    ]);
  });

  it('warns and does not call the API when the email is empty', async () => {
    renderWithProviders(<Login navigation={navigation} />);

    fillCredentials({ email: '' });
    pressSignInButton();
    await flush();

    expect(mockFetchLogin).not.toHaveBeenCalled();
    expect(mockShowMessage).toHaveBeenCalledWith({
      message: 'Please enter your email',
      type: 'warning',
    });
  });

  it('warns and does not call the API when the password is empty', async () => {
    renderWithProviders(<Login navigation={navigation} />);

    fillCredentials({ password: '' });
    pressSignInButton();
    await flush();

    expect(mockFetchLogin).not.toHaveBeenCalled();
    expect(mockShowMessage).toHaveBeenCalledWith({
      message: 'Please enter your password',
      type: 'warning',
    });
  });

  it('surfaces the server message when the credentials are rejected', async () => {
    const error = new AxiosError('Request failed');
    error.response = { data: { detail: 'Invalid username or password' } } as never;
    mockFetchLogin.mockRejectedValue(error);
    const { store } = renderWithProviders(<Login navigation={navigation} />);

    fillCredentials();
    pressSignInButton();
    await flush();

    expect(mockShowMessage).toHaveBeenCalledWith({
      message: 'Invalid username or password',
      type: 'danger',
    });
    expect(store.getState().app.user).toBeNull();
  });

  it('shows a generic error when login fails with a non-Axios error', async () => {
    mockFetchLogin.mockRejectedValue(new Error('boom'));
    renderWithProviders(<Login navigation={navigation} />);

    fillCredentials();
    pressSignInButton();
    await flush();

    expect(mockShowMessage).toHaveBeenCalledWith({
      message: 'An error occurred',
      type: 'danger',
    });
  });

  it('sends rememberMe: false when the checkbox is unticked', async () => {
    renderWithProviders(<Login navigation={navigation} />);

    fillCredentials();
    fireEvent.press(screen.getByText('Remember me'));
    pressSignInButton();
    await flush();

    expect(mockFetchLogin).toHaveBeenCalledWith(expect.objectContaining({ rememberMe: false }));
  });

  it('navigates to SignUp when "Create account" is pressed', () => {
    renderWithProviders(<Login navigation={navigation} />);

    fireEvent.press(screen.getByText('Create account'));

    expect(navigation.navigate).toHaveBeenCalledWith('SignUp');
  });
});
