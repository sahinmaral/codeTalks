import { fetchSignUp } from '@/services/apiServices/auths';
import { renderWithProviders } from '@/test/renderWithProviders';
import { RootStackParamList } from '@/types';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { act, fireEvent, screen } from '@testing-library/react-native';
import { AxiosError } from 'axios';
import React from 'react';
import { showMessage } from 'react-native-flash-message';
import ContinueSignUp from './ContinueSignUp';

// handleSubmit awaits Yup validation before the register call, so results land a microtask later.
const flush = () => act(async () => {});

jest.mock('@/services/apiServices/auths', () => ({ fetchSignUp: jest.fn() }));
jest.mock('react-native-flash-message', () => ({ showMessage: jest.fn() }));

const mockFetchSignUp = fetchSignUp as jest.Mock;
const mockShowMessage = showMessage as jest.Mock;

const navigation = {
  navigate: jest.fn(),
  goBack: jest.fn(),
} as unknown as NativeStackNavigationProp<RootStackParamList, 'ContinueSignUp'>;

const route = {
  key: 'ContinueSignUp-1',
  name: 'ContinueSignUp',
  params: {
    email: 'jane@example.com',
    username: 'janedoe',
    password: 'Secret1.',
  },
} as unknown as RouteProp<RootStackParamList, 'ContinueSignUp'>;

const renderScreen = () =>
  renderWithProviders(<ContinueSignUp navigation={navigation} route={route} />);

// The name fields start empty, so anything reaching the register call has to fill them first.
const fillNames = ({ firstName = 'Jane', lastName = 'Doer' } = {}) => {
  fireEvent.changeText(screen.getByPlaceholderText('John'), firstName);
  fireEvent.changeText(screen.getByPlaceholderText('Doe'), lastName);
};

beforeEach(() => {
  jest.clearAllMocks();
  mockFetchSignUp.mockResolvedValue({ data: null });
});

describe('ContinueSignUp', () => {
  it('renders the personal details form, empty', () => {
    renderScreen();

    expect(screen.getByPlaceholderText('John').props.value).toBe('');
    expect(screen.getByPlaceholderText('Doe').props.value).toBe('');
    expect(screen.getByText('Complete your profile to join the Codetalks community.')).toBeTruthy();
    expect(screen.getByText('First Name')).toBeTruthy();
    expect(screen.getByText('Middle Name (optional)')).toBeTruthy();
    expect(screen.getByText('Last Name')).toBeTruthy();
  });

  it('rejects an empty first name before calling the register endpoint', async () => {
    renderScreen();

    fillNames({ firstName: '' });
    fireEvent.press(screen.getByText('Create Account'));
    await flush();

    expect(mockFetchSignUp).not.toHaveBeenCalled();
    expect(mockShowMessage).toHaveBeenCalledWith({
      message: 'Please enter your first name',
      type: 'warning',
    });
  });

  it('rejects an empty last name before calling the register endpoint', async () => {
    renderScreen();

    fillNames({ lastName: '' });
    fireEvent.press(screen.getByText('Create Account'));
    await flush();

    expect(mockFetchSignUp).not.toHaveBeenCalled();
    expect(mockShowMessage).toHaveBeenCalledWith({
      message: 'Please enter your last name',
      type: 'warning',
    });
  });

  it('registers the user with the credentials carried over from SignUp and returns to Login', async () => {
    renderScreen();

    fillNames();
    fireEvent.press(screen.getByText('Create Account'));
    await flush();

    expect(mockFetchSignUp).toHaveBeenCalledWith({
      email: 'jane@example.com',
      username: 'janedoe',
      password: 'Secret1.',
      firstName: 'Jane',
      middleName: undefined,
      lastName: 'Doer',
    });
    expect(mockShowMessage).toHaveBeenCalledWith({
      message: 'Your registration was completed successfully',
      type: 'info',
    });
    expect(navigation.navigate).toHaveBeenCalledWith('Login');
  });

  it('sends an entered middle name along with the registration', async () => {
    renderScreen();

    fillNames();
    fireEvent.changeText(screen.getByPlaceholderText('Jae'), 'Quinn');
    fireEvent.press(screen.getByText('Create Account'));
    await flush();

    expect(mockFetchSignUp).toHaveBeenCalledWith(expect.objectContaining({ middleName: 'Quinn' }));
  });

  it('surfaces the server message and stays on the screen when registration fails', async () => {
    const error = new AxiosError('Request failed');
    error.response = { data: { detail: 'This email is already registered' } } as never;
    mockFetchSignUp.mockRejectedValue(error);
    renderScreen();

    fillNames();
    fireEvent.press(screen.getByText('Create Account'));
    await flush();

    expect(mockShowMessage).toHaveBeenCalledWith({
      message: 'This email is already registered',
      type: 'danger',
    });
    expect(navigation.navigate).not.toHaveBeenCalled();
  });

  it('goes back to SignUp from the back button', () => {
    renderScreen();

    fireEvent.press(screen.getByText('Back'));

    expect(navigation.goBack).toHaveBeenCalled();
  });
});
