import axios from "axios";

export const fetchCreateChannel = (input) => {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  return axios.post(`${apiUrl}/channels`, input);
};

export const fetchUpdateChannel = (input) => {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  return axios.put(`${apiUrl}/channels`, input);
};

export const fetchDeleteChannel = (id, accessToken) => {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;

  const config = {
    headers: { Authorization: `Bearer ${accessToken}` },
  };

  return axios.delete(`${apiUrl}/channels/${id}`, config);
};

export const fetchLeaveChannel = (id, accessToken) => {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;

  const config = {
    headers: { Authorization: `Bearer ${accessToken}` },
  };

  return axios.post(`${apiUrl}/channels/leave/${id}`, null, config);
};

export const fetchSendInviteToChannel = (id, accessToken) => {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;

  const config = {
    headers: { Authorization: `Bearer ${accessToken}` },
  };

  return axios.post(`${apiUrl}/channels/sendinvite/${id}`, null, config);
};

export const fetchGetUsersDetailAtChannelByChannelId = (channelId, userId) => {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  return axios.get(`${apiUrl}/channels/userDetail/${channelId}/${userId}`);
};
