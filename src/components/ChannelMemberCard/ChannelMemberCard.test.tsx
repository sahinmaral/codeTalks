import { UserRole } from '@/enums/UserRole';
import { renderWithProviders } from '@/test/renderWithProviders';
import { ChannelUser } from '@/types';
import { fireEvent, screen } from '@testing-library/react-native';
import React from 'react';
import ChannelMemberCard, { ChannelMemberCardType } from './ChannelMemberCard';

function makeUser(role: UserRole): ChannelUser {
  return {
    id: 'user-1',
    firstName: 'Ali',
    lastName: 'Veli',
    userName: 'aliveli',
    role: { name: role },
    statusCreatedAt: '2026-01-01T00:00:00Z',
  };
}

describe('ChannelMemberCard', () => {
  it("renders the user's full name and role", () => {
    renderWithProviders(<ChannelMemberCard user={makeUser(UserRole.Owner)} />);

    expect(screen.getByText('Ali Veli')).toBeTruthy();
    expect(screen.getByText(UserRole.Owner)).toBeTruthy();
  });

  it('calls onPress when tapped for a normal card', () => {
    const onPress = jest.fn();
    renderWithProviders(<ChannelMemberCard user={makeUser(UserRole.User)} onPress={onPress} />);

    fireEvent.press(screen.getByText('Ali Veli'));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('does not call onPress when the card is locked', () => {
    const onPress = jest.fn();
    renderWithProviders(
      <ChannelMemberCard
        user={makeUser(UserRole.User)}
        onPress={onPress}
        cardType={ChannelMemberCardType.Locked}
      />,
    );

    fireEvent.press(screen.getByText('Ali Veli'));

    expect(onPress).not.toHaveBeenCalled();
  });
});
