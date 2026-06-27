import { TokenResponse, User } from '@/types';
import axios, { AxiosResponse } from 'axios';
import axiosInstance from '../axiosConfig';

interface SignUpInput {
  username: string;
  email: string;
  password: string;
  firstName: string;
  middleName?: string | null;
  lastName: string;
}

interface LoginInput {
  usernameOrEmail: string;
  password: string;
  rememberMe?: boolean;
}

export const fetchSignUp = (input: SignUpInput) => {
  return axiosInstance.post('/auth/register', input);
};

export const fetchLogin: (input: LoginInput) => Promise<AxiosResponse<User, LoginInput>> = (
  input: LoginInput,
) => {
  return axiosInstance.post('/auth/login', input);
};

export const fetchRefreshToken = (refreshToken: string): Promise<AxiosResponse<TokenResponse>> => {
  return axios.post(`${process.env.EXPO_PUBLIC_API_BASE_URL}/api/auth/refresh`, {
    refreshToken,
  });
};
