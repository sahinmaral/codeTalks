import { fireEvent, render, screen } from '@testing-library/react-native';
import React from 'react';
import { Image, TouchableOpacity } from 'react-native';
import ChannelThumbnail from './ChannelThumbnail';

describe('ChannelThumbnail', () => {
  it('renders the given uri', () => {
    render(<ChannelThumbnail uri="https://example.com/photo.png" />);
    expect(screen.UNSAFE_getByType(Image).props.source).toEqual({
      uri: 'https://example.com/photo.png',
    });
  });

  it('falls back to the default image when no uri is given', () => {
    render(<ChannelThumbnail />);
    const source = screen.UNSAFE_getByType(Image).props.source;
    expect(source).not.toEqual({ uri: undefined });
    expect(typeof source).not.toBe('string');
  });

  it('calls onPress when tappable', () => {
    const onPress = jest.fn();
    render(<ChannelThumbnail onPress={onPress} />);

    fireEvent.press(screen.UNSAFE_getByType(TouchableOpacity));

    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
