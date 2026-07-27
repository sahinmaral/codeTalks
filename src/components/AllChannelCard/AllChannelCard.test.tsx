import ChannelJoinPolicy from '@/enums/ChannelJoinPolicy';
import ChannelUserStatus from '@/enums/ChannelUserStatus';
import { fetchJoinChannel } from '@/services/apiServices/channels';
import { renderWithProviders } from '@/test/renderWithProviders';
import { Channel } from '@/types';
import { fireEvent, screen, waitFor } from '@testing-library/react-native';
import { AxiosError } from 'axios';
import React from 'react';
import { showMessage } from 'react-native-flash-message';
import AllChannelCard from './AllChannelCard';

jest.mock('@/services/apiServices/channels', () => ({
  fetchJoinChannel: jest.fn(),
}));

jest.mock('react-native-flash-message', () => ({
  showMessage: jest.fn(),
}));

const mockFetchJoinChannel = fetchJoinChannel as jest.Mock;
const mockShowMessage = showMessage as jest.Mock;

const openChannel: Channel = {
  id: 'channel-1',
  name: 'General',
  description: 'General discussion',
  inviteCode: 'ABC123',
  joinPolicy: ChannelJoinPolicy.Open,
  memberCount: 5,
  createdAt: '2026-01-01T00:00:00Z',
};

const requestChannel: Channel = { ...openChannel, joinPolicy: ChannelJoinPolicy.Request };

beforeEach(() => {
  jest.clearAllMocks();
});

describe('AllChannelCard', () => {
  it('shows a "Join" button for an open channel', () => {
    renderWithProviders(<AllChannelCard channel={openChannel} />);
    expect(screen.getByText('Join')).toBeTruthy();
  });

  it('shows a "Request to Join" button for a request-based channel', () => {
    renderWithProviders(<AllChannelCard channel={requestChannel} />);
    expect(screen.getByText('Request to Join')).toBeTruthy();
  });

  it('joins directly and shows a success toast for an open channel', async () => {
    mockFetchJoinChannel.mockResolvedValue({ data: { status: ChannelUserStatus.Accepted } });
    renderWithProviders(<AllChannelCard channel={openChannel} />);

    fireEvent.press(screen.getByText('Join'));

    await waitFor(() => expect(screen.getByText('Joined')).toBeTruthy());
    expect(mockShowMessage).toHaveBeenCalledWith({
      message: 'You have joined the channel successfully',
      type: 'success',
    });
  });

  it('sends a join request and shows a success toast for a request-based channel', async () => {
    mockFetchJoinChannel.mockResolvedValue({ data: { status: ChannelUserStatus.RequestSent } });
    renderWithProviders(<AllChannelCard channel={requestChannel} />);

    fireEvent.press(screen.getByText('Request to Join'));

    await waitFor(() => expect(screen.getByText('Requested')).toBeTruthy());
    expect(mockShowMessage).toHaveBeenCalledWith({
      message: 'Your request has been sent successfully',
      type: 'success',
    });
  });

  it('shows a danger toast with the API error message on failure', async () => {
    const error = new AxiosError('failed');
    error.response = { data: { detail: 'Channel is full' } } as never;
    mockFetchJoinChannel.mockRejectedValue(error);

    renderWithProviders(<AllChannelCard channel={openChannel} />);
    fireEvent.press(screen.getByText('Join'));

    await waitFor(() =>
      expect(mockShowMessage).toHaveBeenCalledWith({ message: 'Channel is full', type: 'danger' }),
    );
    expect(screen.getByText('Join')).toBeTruthy();
  });

  it('disables the button and shows loading text while the request is in flight', async () => {
    let resolveJoin!: (value: unknown) => void;
    mockFetchJoinChannel.mockReturnValue(new Promise(resolve => (resolveJoin = resolve)));

    renderWithProviders(<AllChannelCard channel={openChannel} />);
    fireEvent.press(screen.getByText('Join'));

    expect(screen.getByText('Joining...')).toBeTruthy();

    resolveJoin({ data: { status: ChannelUserStatus.Accepted } });
    await waitFor(() => expect(screen.getByText('Joined')).toBeTruthy());
  });
});
