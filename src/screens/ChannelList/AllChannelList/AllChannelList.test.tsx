import ChannelJoinPolicy from '@/enums/ChannelJoinPolicy';
import { fetchGetChannels } from '@/services/apiServices/channels';
import { renderWithProviders } from '@/test/renderWithProviders';
import { Channel, PaginatedResult } from '@/types';
import { act, fireEvent, screen } from '@testing-library/react-native';
import React from 'react';
import { ScrollView } from 'react-native';
import AllChannelList from './AllChannelList';

// The screen fetches its first page in an effect; flush that promise inside act().
const flush = () => act(async () => {});

jest.mock('@/services/apiServices/channels', () => ({
  fetchGetChannels: jest.fn(),
  fetchJoinChannel: jest.fn(),
}));

const mockFetchGetChannels = fetchGetChannels as jest.Mock;

const channel = (id: string, name: string): Channel => ({
  id,
  name,
  description: `${name} description`,
  inviteCode: `invite-${id}`,
  joinPolicy: ChannelJoinPolicy.Open,
  memberCount: 3,
  createdAt: '2026-01-01T00:00:00Z',
});

const page = (items: Channel[], hasNext = false): PaginatedResult<Channel> => ({
  items,
  count: items.length,
  size: 10,
  index: 0,
  pages: hasNext ? 2 : 1,
  hasNext,
  hasPrevious: false,
});

const scrollToBottom = () =>
  fireEvent.scroll(screen.UNSAFE_getByType(ScrollView), {
    nativeEvent: {
      layoutMeasurement: { height: 800, width: 375 },
      contentOffset: { y: 1000, x: 0 },
      contentSize: { height: 1800, width: 375 },
    },
  });

beforeEach(() => {
  jest.clearAllMocks();
  mockFetchGetChannels.mockResolvedValue({
    data: page([channel('channel-1', 'General'), channel('channel-2', 'Random')]),
  });
});

describe('AllChannelList', () => {
  it('shows the loading screen until the first page arrives', async () => {
    let resolveFetch: (value: unknown) => void = () => {};
    mockFetchGetChannels.mockReturnValue(new Promise(resolve => (resolveFetch = resolve)));

    renderWithProviders(<AllChannelList />);

    expect(screen.getByText('Please wait while channels load ...')).toBeTruthy();

    await act(async () => resolveFetch({ data: page([channel('channel-1', 'General')]) }));

    expect(screen.queryByText('Please wait while channels load ...')).toBeNull();
    expect(screen.getByText('General')).toBeTruthy();
  });

  it('requests the first page without a search term', async () => {
    renderWithProviders(<AllChannelList />);
    await flush();

    expect(mockFetchGetChannels).toHaveBeenCalledWith({
      title: undefined,
      index: 0,
      size: 10,
    });
    expect(screen.getByText('General')).toBeTruthy();
    expect(screen.getByText('Random')).toBeTruthy();
  });

  it('shows the error screen with a retry action when the first page fails', async () => {
    mockFetchGetChannels.mockRejectedValue(new Error('network down'));
    renderWithProviders(<AllChannelList />);
    await flush();

    expect(screen.getByText('Failed to load channels. Please try again ...')).toBeTruthy();

    mockFetchGetChannels.mockResolvedValue({ data: page([channel('channel-1', 'General')]) });
    fireEvent.press(screen.getByText('Try Again'));
    await flush();

    expect(screen.getByText('General')).toBeTruthy();
  });

  it('shows the generic empty state when no channels come back', async () => {
    mockFetchGetChannels.mockResolvedValue({ data: page([]) });
    renderWithProviders(<AllChannelList />);
    await flush();

    expect(screen.getByText('No Channels Found')).toBeTruthy();
    expect(screen.getByText('Try searching with a different keyword.')).toBeTruthy();
  });

  it('refetches with the debounced search term and reports an empty search result', async () => {
    jest.useFakeTimers();
    try {
      renderWithProviders(<AllChannelList />);
      await act(async () => {});

      mockFetchGetChannels.mockResolvedValue({ data: page([]) });
      fireEvent.changeText(screen.getByPlaceholderText('Search channels...'), '  design  ');

      // Nothing is requested until the 400ms debounce elapses.
      expect(mockFetchGetChannels).toHaveBeenCalledTimes(1);

      await act(async () => {
        jest.advanceTimersByTime(400);
      });
      await act(async () => {});

      expect(mockFetchGetChannels).toHaveBeenLastCalledWith({
        title: 'design',
        index: 0,
        size: 10,
      });
      expect(screen.getByText('No channels found matching "design".')).toBeTruthy();
    } finally {
      jest.useRealTimers();
    }
  });

  it('appends the next page when the list is scrolled to the bottom', async () => {
    mockFetchGetChannels.mockResolvedValue({ data: page([channel('channel-1', 'General')], true) });
    renderWithProviders(<AllChannelList />);
    await flush();

    mockFetchGetChannels.mockResolvedValue({ data: page([channel('channel-2', 'Random')]) });
    scrollToBottom();
    await flush();

    expect(mockFetchGetChannels).toHaveBeenLastCalledWith({
      title: undefined,
      index: 1,
      size: 10,
    });
    expect(screen.getByText('General')).toBeTruthy();
    expect(screen.getByText('Random')).toBeTruthy();
  });

  it('does not request another page when the last page is already loaded', async () => {
    renderWithProviders(<AllChannelList />);
    await flush();

    scrollToBottom();
    await flush();

    expect(mockFetchGetChannels).toHaveBeenCalledTimes(1);
  });

  it('does not duplicate channels that arrive again in a later page', async () => {
    mockFetchGetChannels.mockResolvedValue({ data: page([channel('channel-1', 'General')], true) });
    renderWithProviders(<AllChannelList />);
    await flush();

    // The next page repeats a channel the list already holds.
    mockFetchGetChannels.mockResolvedValue({
      data: page([channel('channel-1', 'General'), channel('channel-2', 'Random')]),
    });
    scrollToBottom();
    await flush();

    expect(screen.getAllByText('General')).toHaveLength(1);
    expect(screen.getByText('Random')).toBeTruthy();
  });
});
