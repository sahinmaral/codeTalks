import { useEffect, useMemo, useState } from 'react';
import * as SignalR from '@microsoft/signalr';

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
  const [data, setData] = useState<T | null>(null);

  const isLoading = useMemo(() => {
    return connection === null || connection.state !== 'Connected';
  }, [connection, connection?.state]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const serializedArgs = JSON.stringify(invokeArgs);

  useEffect(() => {
    const newConnection = new SignalR.HubConnectionBuilder()
      .withUrl(`${process.env.EXPO_PUBLIC_API_BASE_URL}/chatHub`)
      .build();

    setConnection(newConnection);

    return () => {
      newConnection.stop().catch(console.error);
    };
  }, []);

  useEffect(() => {
    if (!connection) return;

    let intervalId: ReturnType<typeof setInterval>;
    const args = JSON.parse(serializedArgs) as unknown[];

    const handler = (payload: T) => setData(payload);
    connection.on(receiveEvent, handler);

    const startAndPoll = async () => {
      try {
        if (connection.state === SignalR.HubConnectionState.Disconnected) {
          await connection.start();
          console.log('SignalR Connected');
        }

        // Now invoke after connection is established
        await connection.invoke(sendMethod, ...args);

        intervalId = setInterval(() => {
          if (connection.state === SignalR.HubConnectionState.Connected) {
            connection.invoke(sendMethod, ...args).catch(console.error);
          }
        }, 1000);
      } catch (error) {
        console.error('SignalR connection error:', error);
      }
    };

    startAndPoll();

    return () => {
      clearInterval(intervalId);
      connection.off(receiveEvent, handler);
    };
  }, [connection, receiveEvent, sendMethod, serializedArgs]);

  return { data, isLoading };
}

export default useSignalRConnection;
