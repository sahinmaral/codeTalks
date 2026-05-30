import { UserStatusType } from '@/enums/UserStatusType';

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

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  refreshTokenExpires: string;
}

export interface User extends TokenResponse {
  id: string;
  userName: string;
  firstName: string;
  middleName?: string | null;
  lastName: string;
  profilePhotoURL?: string | null;
}

export interface MyProfileDto {
  id: string;
  userName: string;
  firstName: string;
  middleName?: string | null;
  lastName: string;
  profilePhotoURL?: string | null;
  bio?: string | null;
  email: string;
  joinedChannelCount: number;
  createdAt: string;
  userStatus: UserStatus;
}

export interface UserStatusOption {
  status: UserStatusType;
  statusType: number;
  color: string;
  label: string;
  description: string;
}

export interface UserStatus {
  status: UserStatusType;
  lastUpdated: string;
}

export interface Channel {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  createdAt: string;
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
    id: string;
    userName: string;
    profilePhotoURL: string;
  };
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

export type ProfileStackParamList = {
  MyProfile: undefined;
  Settings: undefined;
};

declare module '@react-navigation/native-stack' {
  interface NativeStackNavigationOptions {
    headerDescription?: string;
  }
}
