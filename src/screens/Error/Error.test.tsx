import { renderWithProviders } from '@/test/renderWithProviders';
import { User } from '@/types';
import { fireEvent, screen } from '@testing-library/react-native';
import React from 'react';
import ErrorScreen from './Error';

const preloadedState = {
  app: {
    user: { id: 'user-1' } as User,
    notificationSettings: { isEnabled: true, isSoundEnabled: true },
    channelMuteSettings: [{ channelId: 'channel-1', isMuted: true }],
    totalUnreadCount: 5,
    channelUnreadCounts: { 'channel-1': 2 },
  },
};

describe('Error', () => {
  it('renders the default title with the given description', () => {
    renderWithProviders(<ErrorScreen description="Failed to load channels." />);

    expect(screen.getByText('Failed to load channels.')).toBeTruthy();
    expect(screen.getByText('Something went wrong')).toBeTruthy();
  });

  it('prefers an explicit title over the default one', () => {
    renderWithProviders(<ErrorScreen title="No connection" description="Try again later." />);

    expect(screen.getByText('No connection')).toBeTruthy();
    expect(screen.queryByText('Something went wrong')).toBeNull();
  });

  it('offers a retry action only when the caller passes onRetry', () => {
    const onRetry = jest.fn();
    const { unmount } = renderWithProviders(<ErrorScreen description="Failed." />);

    expect(screen.queryByText('Try Again')).toBeNull();
    unmount();

    renderWithProviders(<ErrorScreen description="Failed." onRetry={onRetry} />);
    fireEvent.press(screen.getByText('Try Again'));

    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('clears the session so the app returns to login', () => {
    const { store } = renderWithProviders(<ErrorScreen description="Failed." />, {
      preloadedState,
    });

    fireEvent.press(screen.getByText('Go To Login'));

    expect(store.getState().app.user).toBeNull();
    expect(store.getState().app.channelMuteSettings).toEqual([]);
    expect(store.getState().app.totalUnreadCount).toBe(0);
  });
});
