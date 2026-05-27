import axiosInstance from '../axiosConfig';

interface CreateMessageInput {
  userId: string;
  channelId: string;
  content: string;
}

export const fetchCreateMessage = (input: CreateMessageInput) => {
  return axiosInstance.post('/messages', input);
};
