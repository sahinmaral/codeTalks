import { renderWithProviders } from '@/test/renderWithProviders';
import { ChannelUser, User } from '@/types';
import { screen } from '@testing-library/react-native';
import React from 'react';
import ChannelDetailUserCard from './ChannelDetailUserCard';

const otherUser: ChannelUser = {
  id: 'user-2',
  firstName: 'Ali',
  lastName: 'Veli',
  userName: 'aliveli',
  role: { name: 'Owner' },
  statusCreatedAt: '2026-01-01T00:00:00Z',
};

const currentUser: User = {
  id: 'user-1',
  userName: 'sahin',
  firstName: 'Sahin',
  lastName: 'Maral',
  accessToken: 'access-token',
  refreshToken: 'refresh-token',
  refreshTokenExpires: '2030-01-01T00:00:00Z',
};

describe('ChannelDetailUserCard', () => {
  it("renders the user's full name and role when viewing someone else", () => {
    renderWithProviders(<ChannelDetailUserCard user={otherUser} />);

    expect(screen.getByText('Ali Veli')).toBeTruthy();
    expect(screen.getByText('Owner')).toBeTruthy();
  });

  it('renders "Siz" instead of the name when viewing your own card', () => {
    renderWithProviders(<ChannelDetailUserCard user={{ ...otherUser, id: currentUser.id }} />, {
      preloadedState: {
        app: {
          user: currentUser,
          notificationSettings: null,
          channelMuteSettings: [],
          totalUnreadCount: 0,
          channelUnreadCounts: {},
        },
      },
    });

    expect(screen.getByText('Siz')).toBeTruthy();
  });
});
