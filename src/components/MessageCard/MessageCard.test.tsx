import { renderWithProviders } from '@/test/renderWithProviders';
import { Message, User } from '@/types';
import { screen } from '@testing-library/react-native';
import React from 'react';
import MessageCard from './MessageCard';

const currentUser: User = {
  id: 'user-1',
  userName: 'sahin',
  firstName: 'Sahin',
  lastName: 'Maral',
  accessToken: 'access-token',
  refreshToken: 'refresh-token',
  refreshTokenExpires: '2030-01-01T00:00:00Z',
};

const preloadedState = {
  app: {
    user: currentUser,
    notificationSettings: null,
    channelMuteSettings: [],
    totalUnreadCount: 0,
    channelUnreadCounts: {},
  },
};

function makeMessage(senderId: string): Message {
  return {
    id: 'message-1',
    content: 'Hello there',
    createdAt: '2026-01-01T00:00:00Z',
    sender: { id: senderId, userName: 'other-user', profilePhotoURL: '' },
  };
}

describe('MessageCard', () => {
  it("renders the sender's username and message for someone else's message", () => {
    renderWithProviders(<MessageCard messageDetail={makeMessage('user-2')} />, {
      preloadedState,
    });

    expect(screen.getByText('other-user')).toBeTruthy();
    expect(screen.getByText('Hello there')).toBeTruthy();
  });

  it("does not render the sender's username for the current user's own message", () => {
    renderWithProviders(<MessageCard messageDetail={makeMessage('user-1')} />, {
      preloadedState,
    });

    expect(screen.queryByText('other-user')).toBeNull();
    expect(screen.getByText('Hello there')).toBeTruthy();
  });
});
