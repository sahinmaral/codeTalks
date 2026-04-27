import axios from 'axios';

export const fetchGetUsersByChannelId = (
  channelId: string,
  index: number = 0,
  size: number = 10,
) => {
  const params = { channelId, index, size };
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  return axios.get(`${apiUrl}/users`, { params });
};
