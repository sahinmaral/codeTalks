import { UserStatusType } from '@/enums/UserStatusType';

export interface ApiValidationError {
  propertyName: string;
  errorMessage: string;
  attemptedValue: unknown;
  errorCode: string;
}

export interface ApiError {
  detail: string;
  errors?: ApiValidationError[];
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
  profile?: MyProfileDto | null;
}

export interface MyProfileDto {
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
  thumbnailPhotoURL?: string | null;
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
  profilePhotoURL?: string;
  role: Role;
  statusCreatedAt: string;
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
  admins?: ChannelUser[];
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
  AllChannelList: undefined;
  ChannelMessagesList: undefined;
  ChannelDetail: undefined;
  ChannelMembersList: undefined;
  ChannelPendingJoinRequestsList: undefined;
  ChannelBannedMembersList: undefined;
  RemoveMemberFromChannel: undefined;
};

export type ProfileStackParamList = {
  MyProfile: undefined;
  Settings: undefined;
  ChangePassword: undefined;
};
