import { fetchUpdateUserProfile } from '@/services/apiServices/users';
import { renderWithProviders } from '@/test/renderWithProviders';
import { ProfileStackParamList, User } from '@/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { act, fireEvent, screen } from '@testing-library/react-native';
import { AxiosError } from 'axios';
import React from 'react';
import { showMessage } from 'react-native-flash-message';
import EditProfile from './EditProfile';

// handleSubmit awaits validation and the profile update request; flush both inside act().
const flush = () => act(async () => {});

const mockShow = jest.fn();

jest.mock('@/services/apiServices/users', () => ({ fetchUpdateUserProfile: jest.fn() }));
jest.mock('react-native-flash-message', () => ({ showMessage: jest.fn() }));
jest.mock('@/components/BubbleContentMenu', () => ({
  useBubbleContentMenu: () => ({ show: mockShow, hide: jest.fn() }),
}));
// Rendering the real photo modal would pull in the native image picker; the screen only
// needs to hand *something* to show(), and we assert on that call, not on the modal.
jest.mock('@/components/BubbleContentMenu/Contents/UpdateProfilePhotoModal', () => 'PhotoModal');

const mockFetchUpdateUserProfile = fetchUpdateUserProfile as jest.Mock;
const mockShowMessage = showMessage as jest.Mock;

const navigation = { goBack: jest.fn() } as unknown as NativeStackNavigationProp<
  ProfileStackParamList,
  'EditProfile'
>;

const user = {
  id: 'user-1',
  userName: 'janedoe',
  firstName: 'Jane',
  middleName: 'Quinn',
  lastName: 'Doe',
  profile: {
    bio: 'Mobile developer',
    email: 'jane@example.com',
    joinedChannelCount: 3,
    createdAt: '2026-01-01T00:00:00Z',
  },
} as unknown as User;

const preloadedState = {
  app: {
    user,
    notificationSettings: null,
    channelMuteSettings: [],
    totalUnreadCount: 0,
    channelUnreadCounts: {},
  },
};

const renderScreen = () =>
  renderWithProviders(<EditProfile navigation={navigation} />, { preloadedState });

beforeEach(() => {
  jest.clearAllMocks();
  mockFetchUpdateUserProfile.mockResolvedValue({ data: null });
});

describe('EditProfile', () => {
  it('prefills the form from the logged-in user', () => {
    renderScreen();

    expect(screen.getByDisplayValue('Jane')).toBeTruthy();
    expect(screen.getByDisplayValue('Quinn')).toBeTruthy();
    expect(screen.getByDisplayValue('Doe')).toBeTruthy();
    expect(screen.getByDisplayValue('Mobile developer')).toBeTruthy();
  });

  it('saves the edited profile and updates redux, then goes back', async () => {
    const { store } = renderScreen();

    fireEvent.changeText(screen.getByDisplayValue('Jane'), 'Janet');
    fireEvent.changeText(screen.getByDisplayValue('Mobile developer'), 'Backend developer');
    fireEvent.press(screen.getByText('Save Changes'));
    await flush();

    expect(mockFetchUpdateUserProfile).toHaveBeenCalledWith({
      firstName: 'Janet',
      middleName: 'Quinn',
      lastName: 'Doe',
      bio: 'Backend developer',
    });
    expect(store.getState().app.user).toEqual(
      expect.objectContaining({ firstName: 'Janet', lastName: 'Doe' }),
    );
    expect(store.getState().app.user?.profile?.bio).toBe('Backend developer');
    expect(mockShowMessage).toHaveBeenCalledWith({
      message: 'Profile updated successfully',
      type: 'success',
    });
    expect(navigation.goBack).toHaveBeenCalled();
  });

  it('trims surrounding whitespace from the submitted values', async () => {
    renderScreen();

    fireEvent.changeText(screen.getByDisplayValue('Jane'), '  Janet  ');
    fireEvent.changeText(screen.getByDisplayValue('Doe'), '  Doer  ');
    fireEvent.press(screen.getByText('Save Changes'));
    await flush();

    expect(mockFetchUpdateUserProfile).toHaveBeenCalledWith(
      expect.objectContaining({ firstName: 'Janet', lastName: 'Doer' }),
    );
  });

  it('sends null for a cleared middle name and bio', async () => {
    renderScreen();

    fireEvent.changeText(screen.getByDisplayValue('Quinn'), '');
    fireEvent.changeText(screen.getByDisplayValue('Mobile developer'), '');
    fireEvent.press(screen.getByText('Save Changes'));
    await flush();

    expect(mockFetchUpdateUserProfile).toHaveBeenCalledWith(
      expect.objectContaining({ middleName: null, bio: null }),
    );
  });

  it('rejects a first name shorter than two characters', async () => {
    renderScreen();

    fireEvent.changeText(screen.getByDisplayValue('Jane'), 'J');
    fireEvent.press(screen.getByText('Save Changes'));
    await flush();

    expect(mockFetchUpdateUserProfile).not.toHaveBeenCalled();
    expect(mockShowMessage).toHaveBeenCalledWith({
      message: 'First name must be at least 2 characters',
      type: 'warning',
    });
    expect(navigation.goBack).not.toHaveBeenCalled();
  });

  it('rejects an empty last name', async () => {
    renderScreen();

    fireEvent.changeText(screen.getByDisplayValue('Doe'), '   ');
    fireEvent.press(screen.getByText('Save Changes'));
    await flush();

    expect(mockFetchUpdateUserProfile).not.toHaveBeenCalled();
    expect(mockShowMessage).toHaveBeenCalledWith({
      message: 'Please enter your last name',
      type: 'warning',
    });
  });

  it('keeps the user in redux unchanged when the API rejects the update', async () => {
    const error = new AxiosError('Request failed');
    error.response = { data: { detail: 'Profile could not be updated' } } as never;
    mockFetchUpdateUserProfile.mockRejectedValue(error);
    const { store } = renderScreen();

    fireEvent.changeText(screen.getByDisplayValue('Jane'), 'Janet');
    fireEvent.press(screen.getByText('Save Changes'));
    await flush();

    expect(mockShowMessage).toHaveBeenCalledWith({
      message: 'Profile could not be updated',
      type: 'danger',
    });
    expect(store.getState().app.user?.firstName).toBe('Jane');
    expect(navigation.goBack).not.toHaveBeenCalled();
  });

  it('opens the change-photo menu when the avatar is tapped', () => {
    renderScreen();

    // The "Change Photo" caption sits outside the touchable; the avatar itself (marked by
    // its camera badge) is what opens the menu.
    fireEvent.press(screen.UNSAFE_getByProps({ name: 'camera-fill' }));

    expect(mockShow).toHaveBeenCalledTimes(1);
  });
});
