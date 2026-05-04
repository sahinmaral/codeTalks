import axios from 'axios';

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

export const fetchCreateChannel = (input: CreateChannelInput) => {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  return axios.post(`${apiUrl}/channels`, input);
};

export const fetchUpdateChannel = (input: UpdateChannelInput) => {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  return axios.put(`${apiUrl}/channels`, input);
};

export const fetchDeleteChannel = (id: string, accessToken: string) => {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  const config = { headers: { Authorization: `Bearer ${accessToken}` } };
  return axios.delete(`${apiUrl}/channels/${id}`, config);
};

export const fetchLeaveChannel = (id: string, accessToken: string) => {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  const config = { headers: { Authorization: `Bearer ${accessToken}` } };
  return axios.post(`${apiUrl}/channels/leave/${id}`, null, config);
};

export const fetchSendInviteToChannel = (id: string, accessToken: string) => {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  const config = { headers: { Authorization: `Bearer ${accessToken}` } };
  return axios.post(`${apiUrl}/channels/sendinvite/${id}`, null, config);
};

export const fetchGetUsersDetailAtChannelByChannelId = (channelId: string, userId: string) => {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  return axios.get(`${apiUrl}/channels/userDetail/${channelId}/${userId}`);
};
