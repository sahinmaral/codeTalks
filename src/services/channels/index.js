import axios from "axios";

export const fetchCreateChannel = (input) => {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  return axios.post(`${apiUrl}/channels`, input);
};

export const fetchUpdateChannel = (input) => {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  return axios.put(`${apiUrl}/channels`, input);
};

export const fetchGetUsersDetailAtChannelByChannelId = (channelId, userId) => {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  return axios.get(`${apiUrl}/channels/userDetail/${channelId}/${userId}`);
}
