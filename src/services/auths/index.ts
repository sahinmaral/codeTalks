import axios from 'axios';

interface SignUpInput {
  username: string;
  email: string;
  password: string;
  firstName: string;
  middleName?: string | null;
  lastName: string;
  phoneNumber: string;
}

interface LoginInput {
  usernameOrEmail: string;
  password: string;
}

export const fetchSignUp = (input: SignUpInput) => {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  return axios.post(`${apiUrl}/auth/register`, input);
};

export const fetchLogin = (input: LoginInput) => {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  return axios.post(`${apiUrl}/auth/login`, input);
};
