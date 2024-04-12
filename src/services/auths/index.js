import axios from "axios";

export const fetchSignUp = (input) => {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  return axios.post(`${apiUrl}/auth/register`, input);
};

export const fetchLogin = (input) => {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  return axios.post(`${apiUrl}/auth/login`, input);
};
