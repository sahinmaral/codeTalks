export interface ApiError {
  detail: string;
  extensions: Record<string, unknown>;
  instance: string;
  status: number;
  title: string;
  type: string;
}

export interface Role {
  name: string;
}

export interface User {
  id: string;
  accessToken: string;
  userName: string;
  firstName?: string;
  middleName?: string | null;
  lastName?: string;
}

export interface Channel {
  id: string;
  name: string;
  description: string;
  status: number;
  role: Role;
}

export interface ChannelUser {
  id: string;
  firstName: string;
  middleName?: string | null;
  lastName: string;
  userName: string;
  role: Role;
}

export interface Message {
  id: string;
  content: string;
  createdAt: string;
  sender: {
    userName: string;
  };
}

export interface UserStatusOption {
  status: UserPresenceStatus;
  label: string;
  description: string;
}

export interface PaginatedResult<T> {
  items: T[];
  count: number;
  size: number;
  index: number;
  pages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export type MainStackParamList = {
  Channels: undefined;
  Explore: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  Login: undefined;
  SignUp: undefined;
  ContinueSignUp: { email: string; password: string; username: string };
  ActiveChannelList: undefined;
  ChannelMessagesList: { channelId: string; channelName: string };
  ChannelDetail: { channelId: string; channelName: string };
  AllChannelList: undefined;
};

declare module '@react-navigation/native-stack' {
  interface NativeStackNavigationOptions {
    headerDescription?: string;
  }
}
