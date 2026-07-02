import axiosInstance from '../axiosConfig';

export const fetchRegisterDevice = (deviceToken: string) => {
  return axiosInstance.post('/devices/register', { deviceToken });
};

export const fetchRemoveDevice = (deviceToken: string) => {
  return axiosInstance.delete('/devices/remove', { data: { deviceToken } });
};
