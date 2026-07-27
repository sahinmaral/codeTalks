import { act, renderHook } from '@testing-library/react-native';
import { AppState } from 'react-native';
import useSignalRConnection from './useSignalRConnection';

const mockConnection = {
  state: 'Connected',
  on: jest.fn(),
  off: jest.fn(),
  invoke: jest.fn().mockResolvedValue(undefined),
  start: jest.fn().mockResolvedValue(undefined),
  stop: jest.fn().mockResolvedValue(undefined),
  onreconnecting: jest.fn(),
  onreconnected: jest.fn(),
  onclose: jest.fn(),
};

jest.mock('@microsoft/signalr', () => {
  const builder: Record<string, jest.Mock> = {
    withUrl: jest.fn(() => builder),
    withAutomaticReconnect: jest.fn(() => builder),
    build: jest.fn(() => mockConnection),
  };

  return {
    HubConnectionBuilder: jest.fn(() => builder),
    HubConnectionState: {
      Connected: 'Connected',
      Disconnected: 'Disconnected',
      Reconnecting: 'Reconnecting',
    },
  };
});

jest.mock('@/utils/tokenManager', () => ({ getValidAccessToken: jest.fn() }));

const options = {
  receiveEvent: 'ReceiveActiveChannelsByUserId',
  sendMethod: 'SendActiveChannelsByUserId',
  invokeArgs: [{ page: 1 }],
};

// The hook subscribes to AppState internally; this plays the OS telling it the app moved.
const changeAppState = (next: string) =>
  act(() => {
    const listener = (AppState.addEventListener as jest.Mock).mock.calls.at(-1)?.[1];
    listener?.(next);
  });

beforeEach(() => {
  jest.clearAllMocks();
  jest.useFakeTimers();
  mockConnection.state = 'Connected';
  jest.spyOn(AppState, 'addEventListener').mockReturnValue({ remove: jest.fn() } as never);
});

afterEach(() => {
  jest.useRealTimers();
  jest.restoreAllMocks();
});

const renderConnection = async () => {
  const view = renderHook(() => useSignalRConnection(options));
  // Let the connection promise settle so polling starts.
  await act(async () => {});
  return view;
};

describe('useSignalRConnection', () => {
  it('polls the hub once a second while the app is in use', async () => {
    await renderConnection();

    expect(mockConnection.invoke).toHaveBeenCalledTimes(1);

    act(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(mockConnection.invoke).toHaveBeenCalledTimes(4);
  });

  it('stops polling while the app is in the background', async () => {
    await renderConnection();
    mockConnection.invoke.mockClear();

    changeAppState('background');
    act(() => {
      jest.advanceTimersByTime(5000);
    });

    expect(mockConnection.invoke).not.toHaveBeenCalled();
  });

  it('polls immediately and resumes when the app comes back', async () => {
    await renderConnection();
    changeAppState('background');
    mockConnection.invoke.mockClear();

    changeAppState('active');

    expect(mockConnection.invoke).toHaveBeenCalledTimes(1);

    act(() => {
      jest.advanceTimersByTime(2000);
    });

    expect(mockConnection.invoke).toHaveBeenCalledTimes(3);
  });

  it('does not double up the interval when the app is foregrounded twice', async () => {
    await renderConnection();
    changeAppState('active');
    changeAppState('active');
    mockConnection.invoke.mockClear();

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(mockConnection.invoke).toHaveBeenCalledTimes(1);
  });

  it('stops polling once the screen unmounts', async () => {
    const { unmount } = await renderConnection();
    unmount();
    mockConnection.invoke.mockClear();

    act(() => {
      jest.advanceTimersByTime(5000);
    });

    expect(mockConnection.invoke).not.toHaveBeenCalled();
  });
});
