import axios from 'axios';

interface CreateMessageInput {
  userId: string;
  channelId: string;
  content: string;
}

export const fetchCreateMessage = (input: CreateMessageInput) => {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  return axios.post(`${apiUrl}/messages`, input);
};
