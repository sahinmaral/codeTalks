import { UserStatusType } from '@/enums/UserStatusType';
import axiosInstance from '../axiosConfig';

interface UpdateUserStatusInput {
  status: UserStatusType;
}

interface ChangeUserPasswordInput {
  currentPassword: string;
  newPassword: string;
}

interface UpdateUserProfilePhotoResponse {
  newProfilePhotoPath: string;
}

export const fetchUpdateUserStatus = (input: UpdateUserStatusInput) => {
  return axiosInstance.put('/users/status', input);
};

export const fetchChangeUserPassword = (input: ChangeUserPasswordInput) => {
  return axiosInstance.put('/users/password', input);
};

export const fetchUpdateUserProfilePhoto = (formData: FormData) => {
  return axiosInstance.put<UpdateUserProfilePhotoResponse>('/users/profile-photo', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const fetchDeleteUserProfilePhoto = () => {
  return axiosInstance.delete('/users/profile-photo');
};
