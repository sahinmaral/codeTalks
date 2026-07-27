import { renderWithProviders } from '@/test/renderWithProviders';
import { RootStackParamList } from '@/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { act, fireEvent, screen } from '@testing-library/react-native';
import React from 'react';
import { showMessage } from 'react-native-flash-message';
import SignUp from './SignUp';

// handleSubmit awaits Yup validation, so the navigate/showMessage calls land a microtask later.
const flush = () => act(async () => {});

jest.mock('react-native-flash-message', () => ({ showMessage: jest.fn() }));

const mockShowMessage = showMessage as jest.Mock;

const navigation = {
  navigate: jest.fn(),
  goBack: jest.fn(),
} as unknown as NativeStackNavigationProp<RootStackParamList, 'SignUp'>;

const emailInput = () => screen.getByPlaceholderText('name@example.com');
const usernameInput = () => screen.getByPlaceholderText('name.example');
const passwordInput = () => screen.getAllByPlaceholderText('********')[0];
const passwordConfirmInput = () => screen.getAllByPlaceholderText('********')[1];

// The form starts empty; each validation test fills it and then breaks one field, so the
// message under test is the first one the schema reports.
const fillValidForm = ({
  email = 'jane@example.com',
  username = 'janedoe',
  password = 'Secret1.',
  passwordConfirm = 'Secret1.',
} = {}) => {
  fireEvent.changeText(emailInput(), email);
  fireEvent.changeText(usernameInput(), username);
  fireEvent.changeText(passwordInput(), password);
  fireEvent.changeText(passwordConfirmInput(), passwordConfirm);
};

beforeEach(() => jest.clearAllMocks());

describe('SignUp', () => {
  it('renders every field of the sign-up form, empty', () => {
    renderWithProviders(<SignUp navigation={navigation} />);

    expect(emailInput().props.value).toBe('');
    expect(usernameInput().props.value).toBe('');
    expect(passwordInput().props.value).toBe('');
    expect(passwordConfirmInput().props.value).toBe('');
    expect(screen.getByText('Join the community and start your journey.')).toBeTruthy();
    expect(screen.getByText('Email Address')).toBeTruthy();
    expect(screen.getByText('Username')).toBeTruthy();
    expect(screen.getByText('Password')).toBeTruthy();
    expect(screen.getByText('Confirm Password')).toBeTruthy();
  });

  it('carries the entered credentials into ContinueSignUp when they are valid', async () => {
    renderWithProviders(<SignUp navigation={navigation} />);

    fillValidForm();
    fireEvent.press(screen.getByText('Next'));
    await flush();

    expect(navigation.navigate).toHaveBeenCalledWith('ContinueSignUp', {
      email: 'jane@example.com',
      username: 'janedoe',
      password: 'Secret1.',
    });
    // The password confirmation is a client-side check only; it is not forwarded.
    expect(navigation.navigate).not.toHaveBeenCalledWith(
      'ContinueSignUp',
      expect.objectContaining({ passwordConfirm: expect.anything() }),
    );
  });

  it('rejects a malformed email address', async () => {
    renderWithProviders(<SignUp navigation={navigation} />);

    fillValidForm({ email: 'not-an-email' });
    fireEvent.press(screen.getByText('Next'));
    await flush();

    expect(navigation.navigate).not.toHaveBeenCalled();
    expect(mockShowMessage).toHaveBeenCalledWith({
      message: 'Please enter a valid email',
      type: 'warning',
    });
  });

  it('rejects a username shorter than three characters', async () => {
    renderWithProviders(<SignUp navigation={navigation} />);

    fillValidForm({ username: 'ab' });
    fireEvent.press(screen.getByText('Next'));
    await flush();

    expect(navigation.navigate).not.toHaveBeenCalled();
    expect(mockShowMessage).toHaveBeenCalledWith({
      message: 'Username must be at least 3 characters',
      type: 'warning',
    });
  });

  it('rejects a password that does not meet the complexity rules', async () => {
    renderWithProviders(<SignUp navigation={navigation} />);

    fillValidForm({ password: 'abcdefg', passwordConfirm: 'abcdefg' });
    fireEvent.press(screen.getByText('Next'));
    await flush();

    expect(navigation.navigate).not.toHaveBeenCalled();
    expect(mockShowMessage).toHaveBeenCalledWith({
      message:
        'Your password must contain at least one uppercase letter, lowercase letter, number and special character',
      type: 'warning',
    });
  });

  it('rejects a confirmation that does not match the password', async () => {
    renderWithProviders(<SignUp navigation={navigation} />);

    fillValidForm({ passwordConfirm: 'Different1.' });
    fireEvent.press(screen.getByText('Next'));
    await flush();

    expect(navigation.navigate).not.toHaveBeenCalled();
    expect(mockShowMessage).toHaveBeenCalledWith({
      message: 'Must match your password',
      type: 'warning',
    });
  });

  it('goes back to Login from the "Sign In" link', () => {
    renderWithProviders(<SignUp navigation={navigation} />);

    fireEvent.press(screen.getByText('Sign In'));

    expect(navigation.goBack).toHaveBeenCalled();
  });
});
