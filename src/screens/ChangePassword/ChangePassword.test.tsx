import { fetchChangeUserPassword } from '@/services/apiServices/users';
import { renderWithProviders } from '@/test/renderWithProviders';
import { ProfileStackParamList } from '@/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { act, fireEvent, screen } from '@testing-library/react-native';
import { AxiosError } from 'axios';
import React from 'react';
import { showMessage } from 'react-native-flash-message';
import ChangePassword from './ChangePassword';

// handleSubmit awaits validation and the change-password request; flush both inside act().
const flush = () => act(async () => {});

jest.mock('@/services/apiServices/users', () => ({ fetchChangeUserPassword: jest.fn() }));
jest.mock('react-native-flash-message', () => ({ showMessage: jest.fn() }));

const mockFetchChangeUserPassword = fetchChangeUserPassword as jest.Mock;
const mockShowMessage = showMessage as jest.Mock;

const navigation = { goBack: jest.fn() } as unknown as NativeStackNavigationProp<
  ProfileStackParamList,
  'ChangePassword'
>;

const passwordInputs = () => screen.getAllByPlaceholderText('********');
const fillForm = ({
  current = 'Current1.',
  next = 'Secret1.',
  repeat = 'Secret1.',
}: { current?: string; next?: string; repeat?: string } = {}) => {
  const [currentInput, newInput, repeatInput] = passwordInputs();
  fireEvent.changeText(currentInput, current);
  fireEvent.changeText(newInput, next);
  fireEvent.changeText(repeatInput, repeat);
};

beforeEach(() => {
  jest.clearAllMocks();
  mockFetchChangeUserPassword.mockResolvedValue({ data: null });
});

describe('ChangePassword', () => {
  it('renders the three password fields and the requirements checklist', () => {
    renderWithProviders(<ChangePassword navigation={navigation} />);

    expect(screen.getByText('Current Password')).toBeTruthy();
    expect(screen.getByText('New Password')).toBeTruthy();
    expect(screen.getByText('Confirm New Password')).toBeTruthy();
    expect(screen.getByText('Min 6 characters')).toBeTruthy();
    expect(screen.getByText('Include a lowercase letter')).toBeTruthy();
    expect(screen.getByText('Include an uppercase letter')).toBeTruthy();
    expect(screen.getByText('Include a special character')).toBeTruthy();
  });

  it('starts with no requirement met and ticks them all off for a strong password', () => {
    renderWithProviders(<ChangePassword navigation={navigation} />);

    expect(screen.UNSAFE_getAllByProps({ name: 'ri-close-line' })).toHaveLength(4);

    fireEvent.changeText(passwordInputs()[1], 'Secret1.');

    expect(screen.UNSAFE_getAllByProps({ name: 'ri-check-line' })).toHaveLength(4);
    expect(screen.UNSAFE_queryAllByProps({ name: 'ri-close-line' })).toHaveLength(0);
  });

  it('marks only the satisfied requirements for a partially strong password', () => {
    renderWithProviders(<ChangePassword navigation={navigation} />);

    // Long enough and has a lowercase letter, but no uppercase and no special character.
    fireEvent.changeText(passwordInputs()[1], 'abcdefg');

    expect(screen.UNSAFE_getAllByProps({ name: 'ri-check-line' })).toHaveLength(2);
    expect(screen.UNSAFE_getAllByProps({ name: 'ri-close-line' })).toHaveLength(2);
  });

  it('changes the password and returns to the previous screen', async () => {
    renderWithProviders(<ChangePassword navigation={navigation} />);

    fillForm();
    fireEvent.press(screen.getByText('Save Password'));
    await flush();

    expect(mockFetchChangeUserPassword).toHaveBeenCalledWith({
      currentPassword: 'Current1.',
      newPassword: 'Secret1.',
    });
    expect(mockShowMessage).toHaveBeenCalledWith({
      message: 'Password changed successfully',
      type: 'success',
    });
    expect(navigation.goBack).toHaveBeenCalled();
  });

  it('rejects a new password that repeats the current one', async () => {
    renderWithProviders(<ChangePassword navigation={navigation} />);

    fillForm({ current: 'Secret1.', next: 'Secret1.', repeat: 'Secret1.' });
    fireEvent.press(screen.getByText('Save Password'));
    await flush();

    expect(mockFetchChangeUserPassword).not.toHaveBeenCalled();
    expect(mockShowMessage).toHaveBeenCalledWith({
      message: 'New password cannot be the same as the current password',
      type: 'warning',
    });
  });

  it('rejects a new password without an uppercase letter', async () => {
    renderWithProviders(<ChangePassword navigation={navigation} />);

    fillForm({ next: 'secret1.', repeat: 'secret1.' });
    fireEvent.press(screen.getByText('Save Password'));
    await flush();

    expect(mockFetchChangeUserPassword).not.toHaveBeenCalled();
    expect(mockShowMessage).toHaveBeenCalledWith({
      message: 'Password must contain at least one uppercase letter',
      type: 'warning',
    });
  });

  it('rejects a confirmation that does not match the new password', async () => {
    renderWithProviders(<ChangePassword navigation={navigation} />);

    fillForm({ repeat: 'Different1.' });
    fireEvent.press(screen.getByText('Save Password'));
    await flush();

    expect(mockFetchChangeUserPassword).not.toHaveBeenCalled();
    expect(mockShowMessage).toHaveBeenCalledWith({
      message: 'Passwords do not match',
      type: 'warning',
    });
  });

  it('surfaces the server message and stays on the screen when the API rejects the change', async () => {
    const error = new AxiosError('Request failed');
    error.response = { data: { detail: 'Current password is incorrect' } } as never;
    mockFetchChangeUserPassword.mockRejectedValue(error);
    renderWithProviders(<ChangePassword navigation={navigation} />);

    fillForm();
    fireEvent.press(screen.getByText('Save Password'));
    await flush();

    expect(mockShowMessage).toHaveBeenCalledWith({
      message: 'Current password is incorrect',
      type: 'danger',
    });
    expect(navigation.goBack).not.toHaveBeenCalled();
  });

  it('goes back from the header back button', () => {
    renderWithProviders(<ChangePassword navigation={navigation} />);

    fireEvent.press(screen.UNSAFE_getByProps({ name: 'arrow-left-line' }));

    expect(navigation.goBack).toHaveBeenCalled();
  });
});
