import { clearUser, setUser } from '@/redux/reducers/appReducer';
import { store } from '@/redux/store';
import axios, { AxiosRequestConfig } from 'axios';
import { fetchRefreshToken } from './auths';

const axiosInstance = axios.create({
  baseURL: `${process.env.EXPO_PUBLIC_API_BASE_URL}/api`,
  headers: { 'Content-Type': 'application/json' },
});

axiosInstance.interceptors.request.use(config => {
  const accessToken = store.getState().app.user?.accessToken;
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

let isRefreshing = false;
let pendingQueue: Array<{ resolve: (token: string) => void; reject: (err: unknown) => void }> = [];

function processQueue(error: unknown, token: string | null) {
  pendingQueue.forEach(p => (error ? p.reject(error) : p.resolve(token!)));
  pendingQueue = [];
}

axiosInstance.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    const refreshToken = store.getState().app.user?.refreshToken;
    if (!refreshToken) {
      store.dispatch(clearUser());
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        pendingQueue.push({ resolve, reject });
      }).then(token => {
        originalRequest.headers = { ...originalRequest.headers, Authorization: `Bearer ${token}` };
        return axiosInstance(originalRequest);
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const { data } = await fetchRefreshToken(refreshToken);
      const currentUser = store.getState().app.user!;
      store.dispatch(setUser({ ...currentUser, ...data }));
      processQueue(null, data.accessToken);
      originalRequest.headers = {
        ...originalRequest.headers,
        Authorization: `Bearer ${data.accessToken}`,
      };
      return axiosInstance(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      store.dispatch(clearUser());
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

export default axiosInstance;
