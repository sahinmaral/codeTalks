import { renderWithProviders } from '@/test/renderWithProviders';
import { fireEvent, screen } from '@testing-library/react-native';
import React from 'react';
import ChannelCreatedMessageCard from './ChannelCreatedMessageCard';

describe('ChannelCreatedMessageCard', () => {
  it('renders the channel name in the heading and description', () => {
    renderWithProviders(
      <ChannelCreatedMessageCard
        channelName="General"
        channelCreatedAt="2026-03-15T00:00:00Z"
        onPress={jest.fn()}
      />,
    );

    expect(screen.getByText('General was created')).toBeTruthy();
  });

  it('calls onPress when the "say hello" button is pressed', () => {
    const onPress = jest.fn();
    renderWithProviders(
      <ChannelCreatedMessageCard
        channelName="General"
        channelCreatedAt="2026-03-15T00:00:00Z"
        onPress={onPress}
      />,
    );

    fireEvent.press(screen.getByText('Say Hello 👋'));

    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
