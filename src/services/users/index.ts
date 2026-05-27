import { UserStatusType } from '@/enums/UserStatusType';
import axiosInstance from '../axiosConfig';

interface UpdateUserStatusInput {
  status: UserStatusType;
}

export const fetchGetUsersByChannelId = (
  channelId: string,
  index: number = 0,
  size: number = 10,
) => {
  const params = { index, size };
  return axiosInstance.get(`/users/channels/${channelId}`, { params });
};

export const fetchUpdateUserStatus = (input: UpdateUserStatusInput) => {
  return axiosInstance.put('/users/status', input);
};
