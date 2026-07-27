import { useBubbleContentMenu } from '@/components/BubbleContentMenu';
import { ChannelUser } from '@/types';
import { renderWithProviders } from '@/test/renderWithProviders';
import { fireEvent, screen } from '@testing-library/react-native';
import React from 'react';
import PendingJoinRequestMemberCard from './PendingJoinRequestMemberCard';

jest.mock('@/components/BubbleContentMenu', () => ({
  useBubbleContentMenu: jest.fn(),
}));

const mockShow = jest.fn();
const mockUseBubbleContentMenu = useBubbleContentMenu as jest.Mock;

const user: ChannelUser = {
  id: 'user-1',
  firstName: 'Ali',
  lastName: 'Veli',
  userName: 'aliveli',
  role: { name: 'User' },
  statusCreatedAt: new Date().toISOString(),
};

beforeEach(() => {
  jest.clearAllMocks();
  mockUseBubbleContentMenu.mockReturnValue({ show: mockShow, hide: jest.fn(), visible: false });
});

describe('PendingJoinRequestMemberCard', () => {
  it("renders the user's full name and username", () => {
    renderWithProviders(<PendingJoinRequestMemberCard user={user} onSubmit={jest.fn()} />);

    expect(screen.getByText('Ali Veli')).toBeTruthy();
    expect(screen.getByText('@aliveli')).toBeTruthy();
  });

  it('opens the pending-request action menu when pressed', () => {
    renderWithProviders(<PendingJoinRequestMemberCard user={user} onSubmit={jest.fn()} />);

    fireEvent.press(screen.getByText('Ali Veli'));

    expect(mockShow).toHaveBeenCalledTimes(1);
    expect(mockShow.mock.calls[0][0].props.user).toBe(user);
  });
});
