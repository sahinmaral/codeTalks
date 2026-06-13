import { UserStatusType } from '@/enums/UserStatusType';
import axiosInstance from '../axiosConfig';

interface UpdateUserStatusInput {
  status: UserStatusType;
}

interface ChangeUserPasswordInput {
  currentPassword: string;
  newPassword: string;
}

export const fetchUpdateUserStatus = (input: UpdateUserStatusInput) => {
  return axiosInstance.put('/users/status', input);
};

export const fetchChangeUserPassword = (input: ChangeUserPasswordInput) => {
  return axiosInstance.put('/users/password', input);
};
