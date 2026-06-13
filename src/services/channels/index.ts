import ChannelUserStatus from '@/enums/ChannelUserStatus';
import { ChannelDetailDto } from '@/types';
import { AxiosResponse } from 'axios';
import axiosInstance from '../axiosConfig';

interface CreateChannelInput {
  name: string;
  description: string;
}

interface UpdateChannelInput {
  name: string;
  description: string;
}

interface PatchChannelInput {
  name?: string;
  description?: string;
}

export const fetchGetChannelById = (id: string): Promise<AxiosResponse<ChannelDetailDto>> => {
  return axiosInstance.get(`/channels/${id}`);
};

export const fetchCreateChannel = (input: CreateChannelInput) => {
  return axiosInstance.post('/channels', input);
};

export const fetchUpdateChannel = (id: string, input: UpdateChannelInput) => {
  return axiosInstance.put(`/channels/${id}`, input);
};

export const fetchPatchChannel = (id: string, input: PatchChannelInput) => {
  return axiosInstance.patch(`/channels/${id}`, input);
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

export const fetchRemoveMemberFromChannel = (id: string, userId: string) => {
  return axiosInstance.delete(`/channels/${id}/users/${userId}`);
};

export const fetchPatchUserStatus = (
  channelId: string,
  userId: string,
  status: ChannelUserStatus,
) => {
  return axiosInstance.patch(`/channels/${channelId}/users/${userId}/status`, { status });
};

export const fetchGetUsersByChannelId = (
  id: string,
  {
    status = ChannelUserStatus.Accepted,
    size = 10,
    index = 0,
    search = '',
  }: { status?: ChannelUserStatus; size?: number; index?: number; search?: string } = {},
) => {
  return axiosInstance.get(`/channels/${id}/users`, {
    params: {
      status,
      size,
      index,
      search,
    },
  });
};
