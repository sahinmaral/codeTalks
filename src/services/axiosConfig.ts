import { store } from '@/redux/store';
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: `${process.env.EXPO_PUBLIC_API_BASE_URL}/api`,
  headers: { 'Content-Type': 'application/json' },
});

axiosInstance.interceptors.request.use((config) => {
  const accessToken = store.getState().app.user?.accessToken;
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

export default axiosInstance;
