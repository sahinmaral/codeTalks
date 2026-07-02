import { UserStatusType } from '@/enums/UserStatusType';
import { MyProfileDto, UserChannelMuteSetting, UserNotificationSetting } from '@/types';
import { AxiosResponse } from 'axios';
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

interface UpdateUserChannelMuteSettingInput {
  muteUntil: string;
}

interface UpdateUserNotificationSettingsInput {
  isSoundEnabled: boolean;
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

export const fetchMe: () => Promise<AxiosResponse<MyProfileDto>> = () => {
  return axiosInstance.get('/users/me');
};

export const fetchUserNotificationSettings: () => Promise<
  AxiosResponse<UserNotificationSetting>
> = () => {
  return axiosInstance.get('/users/me/notification-settings');
};

export const fetchUserChannelMuteSettings: () => Promise<
  AxiosResponse<UserChannelMuteSetting[]>
> = () => {
  return axiosInstance.get('/users/me/channel-mute-settings');
};

export const fetchUpdateUserChannelMuteSettingOfChannel = (
  channelId: string,
  input: UpdateUserChannelMuteSettingInput,
) => {
  return axiosInstance.put(`/users/me/channel-mute-settings/${channelId}`, input);
};

export const fetchUnmuteChannel = (channelId: string) => {
  return axiosInstance.delete(`/users/me/channel-mute-settings/${channelId}`);
};

export const fetchUpdateUserNotificationSettings = (input: UpdateUserNotificationSettingsInput) => {
  return axiosInstance.put('/users/me/notification-settings', input);
};
