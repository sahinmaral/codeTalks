import axios from "axios";

export const fetchCreateMessage = (input) => {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  return axios.post(`${apiUrl}/messages`, input);
};
