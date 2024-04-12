import axios from "axios";

export const fetchGetUsersByChannelId = (channelId, index = 0, size = 2) => {
  const params =  {
    channelId,
    index,
    size
  }

  const apiUrl = process.env.EXPO_PUBLIC_API_URL;

  return axios.get(`${apiUrl}/users`, {
    params
  });
};
