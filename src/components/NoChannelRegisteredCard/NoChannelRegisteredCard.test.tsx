import ModalType from '@/enums/ModalType';
import { useBubbleContentMenu } from '@/components/BubbleContentMenu/BubbleContentMenu.provider';
import { renderWithProviders } from '@/test/renderWithProviders';
import { fireEvent, screen } from '@testing-library/react-native';
import React from 'react';
import NoChannelRegisteredCard from './NoChannelRegisteredCard';

jest.mock('@/components/BubbleContentMenu/BubbleContentMenu.provider', () => ({
  useBubbleContentMenu: jest.fn(),
}));

// Never actually rendered here (only passed to the mocked `show` above), but it's imported
// eagerly and its own subtree transitively pulls in the real Redux store via axiosConfig,
// which needs a native AsyncStorage module that isn't available under Jest — stub it out.
jest.mock('@/components/BubbleContentMenu/Contents/HomepageActionList', () => ({
  __esModule: true,
  default: () => null,
}));

const mockShow = jest.fn();
const mockUseBubbleContentMenu = useBubbleContentMenu as jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
  mockUseBubbleContentMenu.mockReturnValue({ show: mockShow, hide: jest.fn(), visible: false });
});

describe('NoChannelRegisteredCard', () => {
  it('renders the empty-state copy', () => {
    renderWithProviders(<NoChannelRegisteredCard />);
    expect(screen.getByText('No Active Channels')).toBeTruthy();
  });

  it('opens the create-channel menu when "Create Channel" is pressed', () => {
    renderWithProviders(<NoChannelRegisteredCard />);

    fireEvent.press(screen.getByText('Create Channel'));

    expect(mockShow).toHaveBeenCalledTimes(1);
    expect(mockShow.mock.calls[0][0].props.initialModalType).toBe(ModalType.ChannelCreate);
  });

  it('opens the join-channel menu when "Join With Channel ID" is pressed', () => {
    renderWithProviders(<NoChannelRegisteredCard />);

    fireEvent.press(screen.getByText('Join With Channel ID'));

    expect(mockShow).toHaveBeenCalledTimes(1);
    expect(mockShow.mock.calls[0][0].props.initialModalType).toBe(ModalType.SendInviteToChannel);
  });
});
