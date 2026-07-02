import { useAppDispatch } from '@/redux/hooks';
import {
  incrementChannelUnreadCount,
  incrementTotalUnreadCount,
} from '@/redux/reducers/appReducer';
import { getValidAccessToken } from '@/utils/tokenManager';
import * as SignalR from '@microsoft/signalr';
import { useEffect, useRef } from 'react';

// Mirrors the backend ChannelMessagePayload sent on ReceiveChannelMessage(Silent).
// channelId casing is read defensively since SignalR serialization may vary.
interface ChannelMessagePayload {
  channelId?: string;
}

export const useNotificationHub = (isAuthenticated: boolean) => {
  const connectionRef = useRef<SignalR.HubConnection | null>(null);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!isAuthenticated) return;

    const connection = new SignalR.HubConnectionBuilder()
      .withUrl(`${process.env.EXPO_PUBLIC_API_BASE_URL}/hubs/notifications`, {
        accessTokenFactory: () => getValidAccessToken(),
      })
      .withAutomaticReconnect()
      .build();

    const handleChannelMessage = (payload: ChannelMessagePayload) => {
      dispatch(incrementTotalUnreadCount());
      const channelId = payload?.channelId;
      if (channelId) dispatch(incrementChannelUnreadCount(channelId));
    };

    connection.on('ReceiveChannelMessage', handleChannelMessage);
    connection.on('ReceiveChannelMessageSilent', handleChannelMessage);

    connection.start().catch(console.error);
    connectionRef.current = connection;

    return () => {
      connection.stop().catch(console.error);
    };
  }, [isAuthenticated]);
};
