import { MyProfileDto, User } from '@/types';
import { AxiosResponse } from 'axios';
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
}

export const fetchSignUp = (input: SignUpInput) => {
  return axiosInstance.post('/auth/register', input);
};

export const fetchLogin: (input: LoginInput) => Promise<AxiosResponse<User, LoginInput>> = (
  input: LoginInput,
) => {
  return axiosInstance.post('/auth/login', input);
};

export const fetchMe: () => Promise<AxiosResponse<MyProfileDto>> = () => {
  return axiosInstance.get('/auth/me');
};
