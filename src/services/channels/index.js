import axios from "axios";

export const fetchCreateChannel = (input) => {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  return axios.post(`${apiUrl}/channels`, input);
};
