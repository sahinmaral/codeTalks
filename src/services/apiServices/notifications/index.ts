import axiosInstance from '../axiosConfig';

export const fetchGetUnreadCount = () => {
  return axiosInstance.get<number>('/notifications/unread-count');
};

export const fetchGetChannelUnreadCount = (channelId: string) =>
  axiosInstance.get<number>(`/notifications/unread-count/${channelId}`);

export const fetchResetChannelUnreadCount = (channelId: string) =>
  axiosInstance.post(`/notifications/reset/${channelId}`);
