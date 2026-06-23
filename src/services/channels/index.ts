import ChannelJoinPolicy from '@/enums/ChannelJoinPolicy';
import ChannelUserStatus from '@/enums/ChannelUserStatus';
import { UserRole } from '@/enums/UserRole';
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
  joinPolicy?: ChannelJoinPolicy;
}

interface JoinChannelInput {
  inviteCode: string;
}

interface JoinChannelInputResponse {
  status: ChannelUserStatus;
}

interface UpdateChannelThumbnailPhotoResponse {
  newThumbnailPhotoPath: string;
}

export const fetchGetChannels = ({
  title,
  size = 10,
  index = 0,
}: { title?: string; size?: number; index?: number } = {}) => {
  return axiosInstance.get(`/channels`, {
    params: {
      page: index + 1,
      pageSize: size,
      title: title,
    },
  });
};

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

export const fetchJoinChannel = (
  input: JoinChannelInput,
): Promise<AxiosResponse<JoinChannelInputResponse>> => {
  return axiosInstance.post(`/channels/join`, input);
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

export const fetchPatchUserRole = (channelId: string, userId: string, role: UserRole) => {
  return axiosInstance.patch(`/channels/${channelId}/users/${userId}/role`, { role });
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

export const fetchUpdateChannelThumbnailPhoto = (channelId: string, formData: FormData) => {
  return axiosInstance.put<UpdateChannelThumbnailPhotoResponse>(
    `/channels/${channelId}/thumbnail-photo`,
    formData,
    {
      headers: { 'Content-Type': 'multipart/form-data' },
    },
  );
};

export const fetchDeleteChannelThumbnailPhoto = (channelId: string) => {
  return axiosInstance.delete(`/channels/${channelId}/thumbnail-photo`);
};
