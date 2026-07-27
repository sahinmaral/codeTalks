import { renderWithProviders } from '@/test/renderWithProviders';
import { fireEvent, screen } from '@testing-library/react-native';
import React from 'react';
import Header from './Header';

describe('Header', () => {
  it('renders the title', () => {
    renderWithProviders(<Header title="Channel Detail" />);
    expect(screen.getByText('Channel Detail')).toBeTruthy();
  });

  it('renders the description when given', () => {
    renderWithProviders(<Header title="Channel Detail" description="12 members" />);
    expect(screen.getByText('12 members')).toBeTruthy();
  });

  it('renders no description when omitted', () => {
    renderWithProviders(<Header title="Channel Detail" />);
    expect(screen.queryByText('12 members')).toBeNull();
  });

  it('calls onBackPress when the back button is pressed', () => {
    const onBackPress = jest.fn();
    renderWithProviders(<Header title="Channel Detail" onBackPress={onBackPress} />);

    fireEvent.press(screen.UNSAFE_getByProps({ name: 'arrow-left-line' }).parent!);

    expect(onBackPress).toHaveBeenCalledTimes(1);
  });

  it('calls onRightIconPress when the right icon is pressed', () => {
    const onRightIconPress = jest.fn();
    renderWithProviders(
      <Header
        title="Channel Detail"
        rightIcon="settings-line"
        onRightIconPress={onRightIconPress}
      />,
    );

    fireEvent.press(screen.UNSAFE_getByProps({ name: 'settings-line' }).parent!);

    expect(onRightIconPress).toHaveBeenCalledTimes(1);
  });

  it('renders no right icon button when rightIcon is omitted', () => {
    renderWithProviders(<Header title="Channel Detail" />);
    expect(screen.UNSAFE_queryByProps({ name: 'settings-line' })).toBeNull();
  });
});
