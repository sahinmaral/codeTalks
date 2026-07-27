import { renderWithProviders } from '@/test/renderWithProviders';
import { fireEvent, screen } from '@testing-library/react-native';
import React from 'react';
import Input from './Input';

describe('Input', () => {
  it('renders the label and placeholder', () => {
    renderWithProviders(<Input label="Email" placeholder="you@example.com" />);
    expect(screen.getByText('Email')).toBeTruthy();
    expect(screen.getByPlaceholderText('you@example.com')).toBeTruthy();
  });

  it('calls onChangeText as the user types', () => {
    const onChangeText = jest.fn();
    renderWithProviders(<Input placeholder="you@example.com" onChangeText={onChangeText} />);

    fireEvent.changeText(screen.getByPlaceholderText('you@example.com'), 'hello');

    expect(onChangeText).toHaveBeenCalledWith('hello');
  });

  it('renders helperText when given', () => {
    renderWithProviders(<Input placeholder="x" helperText="Must be at least 6 characters" />);
    expect(screen.getByText('Must be at least 6 characters')).toBeTruthy();
  });

  it('renders the character count when showCharacterCount and maxLength are set', () => {
    renderWithProviders(<Input placeholder="x" value="hello" maxLength={20} showCharacterCount />);
    expect(screen.getByText('5/20')).toBeTruthy();
  });

  it('starts secure and toggles visibility when the eye icon is pressed', () => {
    renderWithProviders(<Input placeholder="password" isSecure />);

    expect(screen.getByPlaceholderText('password').props.secureTextEntry).toBe(true);

    fireEvent.press(screen.UNSAFE_getByProps({ name: 'eye-off-line' }).parent!);

    expect(screen.getByPlaceholderText('password').props.secureTextEntry).toBe(false);
  });
});
