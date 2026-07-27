import { fireEvent, render, screen } from '@testing-library/react-native';
import React from 'react';
import { Pressable } from 'react-native';
import ToggleSwitch from './CustomToggleSwitch';

describe('CustomToggleSwitch', () => {
  it('calls onValueChange with the inverted value when pressed', () => {
    const onValueChange = jest.fn();
    render(<ToggleSwitch value={false} onValueChange={onValueChange} />);

    fireEvent.press(screen.UNSAFE_getByType(Pressable));

    expect(onValueChange).toHaveBeenCalledWith(true);
  });

  it('inverts from true to false when currently on', () => {
    const onValueChange = jest.fn();
    render(<ToggleSwitch value={true} onValueChange={onValueChange} />);

    fireEvent.press(screen.UNSAFE_getByType(Pressable));

    expect(onValueChange).toHaveBeenCalledWith(false);
  });

  it('does not call onValueChange when disabled', () => {
    const onValueChange = jest.fn();
    render(<ToggleSwitch value={false} onValueChange={onValueChange} disabled />);

    fireEvent.press(screen.UNSAFE_getByType(Pressable));

    expect(onValueChange).not.toHaveBeenCalled();
  });
});
