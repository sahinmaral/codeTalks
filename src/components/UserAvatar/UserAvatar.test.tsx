import { fireEvent, render, screen } from '@testing-library/react-native';
import React from 'react';
import { Image, TouchableOpacity } from 'react-native';
import UserAvatar from './UserAvatar';

describe('UserAvatar', () => {
  it('renders the given uri', () => {
    render(<UserAvatar uri="https://example.com/photo.png" />);
    expect(screen.UNSAFE_getByType(Image).props.source).toEqual({
      uri: 'https://example.com/photo.png',
    });
  });

  it('falls back to the default image when no uri is given', () => {
    render(<UserAvatar />);
    const source = screen.UNSAFE_getByType(Image).props.source;
    expect(typeof source).not.toBe('string');
    expect(source).not.toEqual({ uri: undefined });
  });

  it('calls onPress when tappable', () => {
    const onPress = jest.fn();
    render(<UserAvatar onPress={onPress} />);

    fireEvent.press(screen.UNSAFE_getByType(TouchableOpacity));

    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
