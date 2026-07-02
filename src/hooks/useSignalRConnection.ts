import { getValidAccessToken } from '@/utils/tokenManager';
import * as SignalR from '@microsoft/signalr';
import { useCallback, useEffect, useRef, useState } from 'react';

interface UseSignalRConnectionOptions {
  receiveEvent: string;
  sendMethod: string;
  invokeArgs: unknown[];
}

function useSignalRConnection<T>({
  receiveEvent,
  sendMethod,
  invokeArgs,
}: UseSignalRConnectionOptions) {
  const [connection, setConnection] = useState<SignalR.HubConnection | null>(null);
  const [connectionState, setConnectionState] = useState<SignalR.HubConnectionState>(
    SignalR.HubConnectionState.Disconnected,
  );
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);

  // Points at the current effect's start() so retry() can trigger a fresh
  // connection attempt without re-running the effect.
  const startRef = useRef<() => void>(() => {});

  // Derived from reactive state so the UI updates whenever the connection
  // drops, reconnects, or comes back after a server restart.
  const isLoading = connectionState !== SignalR.HubConnectionState.Connected;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const serializedArgs = JSON.stringify(invokeArgs);

  useEffect(() => {
    const newConnection = new SignalR.HubConnectionBuilder()
      .withUrl(`${process.env.EXPO_PUBLIC_API_BASE_URL}/hubs/chat`, {
        accessTokenFactory: () => getValidAccessToken(),
      })
      .withAutomaticReconnect()
      .build();

    setConnection(newConnection);

    return () => {
      newConnection.stop().catch(console.error);
    };
  }, []);

  useEffect(() => {
    if (!connection) return;

    let intervalId: ReturnType<typeof setInterval>;
    let retryTimeoutId: ReturnType<typeof setTimeout>;
    let cancelled = false;
    const args = JSON.parse(serializedArgs) as unknown[];

    const handler = (payload: T) => setData(payload);
    connection.on(receiveEvent, handler);

    const poll = () => {
      if (connection.state === SignalR.HubConnectionState.Connected) {
        connection.invoke(sendMethod, ...args).catch(console.error);
      }
    };

    const start = async () => {
      // Make re-entry (onclose retry / manual retry) idempotent so we never
      // leak a polling interval, stack timers, or double-poll.
      clearInterval(intervalId);
      clearTimeout(retryTimeoutId);
      try {
        if (connection.state === SignalR.HubConnectionState.Disconnected) {
          await connection.start();
          console.log('SignalR Connected');
        }
        if (cancelled) return;

        setError(null);
        setConnectionState(connection.state);
        poll();
        intervalId = setInterval(poll, 1000);
      } catch (err) {
        console.error('SignalR connection error:', err);
        if (cancelled) return;

        setError(err instanceof Error ? err : new Error(String(err)));
        // Automatic reconnect only handles drops AFTER a successful start, so
        // retry the initial connection (e.g. server still restarting).
        retryTimeoutId = setTimeout(start, 2000);
      }
    };

    // Keep the reactive connection state in sync with the underlying client so
    // isLoading reflects reconnecting / closed transitions.
    connection.onreconnecting(err => {
      setConnectionState(SignalR.HubConnectionState.Reconnecting);
      if (err) setError(err);
    });
    connection.onreconnected(() => {
      setError(null);
      setConnectionState(SignalR.HubConnectionState.Connected);
      poll();
    });
    connection.onclose(err => {
      setConnectionState(SignalR.HubConnectionState.Disconnected);
      if (err) setError(err);
      // Automatic reconnect has given up by the time onclose fires; keep
      // retrying so the connection self-heals once the server is back.
      if (!cancelled) retryTimeoutId = setTimeout(start, 2000);
    });

    startRef.current = start;
    start();

    return () => {
      cancelled = true;
      clearInterval(intervalId);
      clearTimeout(retryTimeoutId);
      connection.off(receiveEvent, handler);
    };
  }, [connection, receiveEvent, sendMethod, serializedArgs]);

  const retry = useCallback(() => {
    setError(null);
    startRef.current();
  }, []);

  return { data, isLoading, error, retry };
}

export default useSignalRConnection;
