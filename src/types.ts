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
  status: string;
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
  description?: string;
  inviteCode: string;
  memberCount: number;
  createdAt: string;
  status: number;
  role: Role;
}

export interface ChannelDetailDto {
  id: string;
  name: string;
  description?: string;
  inviteCode: string;
  memberCount: number;
  createdAt: string;
  role: Role;
}

export interface ChannelUser {
  id: string;
  firstName: string;
  middleName?: string | null;
  lastName: string;
  userName: string;
  profilePhotoURL?: string | null;
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

export interface UsersAtChannelListModel extends PaginatedResult<ChannelUser> {
  admins: ChannelUser[];
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
  ChannelMessagesList: { channelId: string };
  ChannelDetail: { channelId: string };
  AllChannelList: undefined;
  ChannelMembersList: { channelId: string };
};

export type ProfileStackParamList = {
  MyProfile: undefined;
  Settings: undefined;
};
