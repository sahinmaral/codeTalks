import { renderWithProviders } from '@/test/renderWithProviders';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { fireEvent, screen } from '@testing-library/react-native';
import React from 'react';
import CustomBottomTab from './CustomBottomTab';

function makeProps({ hideOnChannelMessages = false } = {}) {
  const routes = [
    { key: 'channels-key', name: 'Channels' },
    { key: 'explore-key', name: 'Explore' },
    { key: 'profile-key', name: 'Profile' },
  ];

  const focusedRoute = hideOnChannelMessages
    ? { ...routes[0], state: { index: 0, routes: [{ key: 'msgs', name: 'ChannelMessagesList' }] } }
    : routes[0];

  const stateRoutes = routes.map((route, index) => (index === 0 ? focusedRoute : route));

  const descriptors = Object.fromEntries(routes.map(route => [route.key, { options: {} }]));

  const emit = jest.fn().mockReturnValue({ defaultPrevented: false });
  const navigate = jest.fn();

  return {
    state: { routes: stateRoutes, index: 0 },
    descriptors,
    navigation: { emit, navigate },
  } as unknown as BottomTabBarProps;
}

describe('CustomBottomTab', () => {
  it('renders a tab for each route', () => {
    renderWithProviders(<CustomBottomTab {...makeProps()} />);

    expect(screen.getByText('Channels')).toBeTruthy();
    expect(screen.getByText('Explore')).toBeTruthy();
    expect(screen.getByText('Profile')).toBeTruthy();
  });

  it('navigates to a tab when it is pressed', () => {
    const props = makeProps();
    renderWithProviders(<CustomBottomTab {...props} />);

    fireEvent.press(screen.getByText('Explore'));

    expect(props.navigation.navigate).toHaveBeenCalledWith('Explore');
  });

  it('shows the unread badge on the Channels tab when there are unread messages', () => {
    renderWithProviders(<CustomBottomTab {...makeProps()} />, {
      preloadedState: {
        app: {
          user: null,
          notificationSettings: null,
          channelMuteSettings: [],
          totalUnreadCount: 12,
          channelUnreadCounts: {},
        },
      },
    });

    expect(screen.getByText('12')).toBeTruthy();
  });

  it('caps the unread badge at "99+"', () => {
    renderWithProviders(<CustomBottomTab {...makeProps()} />, {
      preloadedState: {
        app: {
          user: null,
          notificationSettings: null,
          channelMuteSettings: [],
          totalUnreadCount: 250,
          channelUnreadCounts: {},
        },
      },
    });

    expect(screen.getByText('99+')).toBeTruthy();
  });

  it('renders nothing when the focused nested route is ChannelMessagesList', () => {
    renderWithProviders(<CustomBottomTab {...makeProps({ hideOnChannelMessages: true })} />);
    expect(screen.queryByText('Channels')).toBeNull();
  });
});
