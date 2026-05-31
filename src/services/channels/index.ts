import { ChannelDetailDto } from '@/types';
import axiosInstance from '../axiosConfig';

interface CreateChannelInput {
  name: string;
  description: string;
  userId: string;
}

interface UpdateChannelInput {
  id: string;
  name: string;
  userId: string;
}

export const fetchGetChannelById = (id: string): Promise<AxiosResponse<ChannelDetailDto>> => {
  return axiosInstance.get(`/channels/${id}`);
};

export const fetchCreateChannel = (input: CreateChannelInput) => {
  return axiosInstance.post('/channels', input);
};

export const fetchUpdateChannel = (input: UpdateChannelInput) => {
  return axiosInstance.put('/channels', input);
};

export const fetchDeleteChannel = (id: string) => {
  return axiosInstance.delete(`/channels/${id}`);
};

export const fetchLeaveChannel = (id: string) => {
  return axiosInstance.post(`/channels/leave/${id}`, null);
};

export const fetchSendInviteToChannel = (id: string) => {
  return axiosInstance.post(`/channels/send-invite/${id}`, null);
};

export const fetchGetUsersDetailAtChannelByChannelId = (channelId: string, userId: string) => {
  return axiosInstance.get(`/channels/${channelId}/users/${userId}`);
};
