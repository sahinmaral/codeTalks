import { UserStatusType } from '@/enums/UserStatusType';
import axiosInstance from '../axiosConfig';

interface UpdateUserStatusInput {
  status: UserStatusType;
}

export const fetchUpdateUserStatus = (input: UpdateUserStatusInput) => {
  return axiosInstance.put('/users/status', input);
};
