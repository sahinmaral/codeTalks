import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MyProfileDto, User, UserChannelMuteSetting, UserNotificationSetting } from '../../types';

interface AppState {
  user: User | null;
  notificationSettings: UserNotificationSetting | null;
  channelMuteSettings: UserChannelMuteSetting[];
  totalUnreadCount: number;
  channelUnreadCounts: Record<string, number>;
}

const initialState: AppState = {
  user: null,
  notificationSettings: null,
  channelMuteSettings: [],
  totalUnreadCount: 0,
  channelUnreadCounts: {},
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    clearUser: state => {
      state.user = null;
      state.notificationSettings = null;
      state.totalUnreadCount = 0;
      state.channelMuteSettings = [];
      state.channelUnreadCounts = {};
    },
    setProfile: (state, action: PayloadAction<MyProfileDto | null>) => {
      if (state.user) {
        state.user.profile = action.payload;
      }
    },
    setNotificationSettings: (state, action: PayloadAction<UserNotificationSetting | null>) => {
      state.notificationSettings = action.payload;
    },
    setChannelMuteSettings: (state, action: PayloadAction<UserChannelMuteSetting[]>) => {
      state.channelMuteSettings = action.payload;
    },
    upsertChannelMuteSetting: (state, action: PayloadAction<UserChannelMuteSetting>) => {
      const existingIndex = state.channelMuteSettings.findIndex(
        setting => setting.channelId === action.payload.channelId,
      );
      if (existingIndex === -1) {
        state.channelMuteSettings.push(action.payload);
      } else {
        state.channelMuteSettings[existingIndex] = action.payload;
      }
    },
    removeChannelMuteSetting: (state, action: PayloadAction<string>) => {
      state.channelMuteSettings = state.channelMuteSettings.filter(
        setting => setting.channelId !== action.payload,
      );
    },
    setTotalUnreadCount: (state, action: PayloadAction<number>) => {
      state.totalUnreadCount = action.payload;
    },
    incrementTotalUnreadCount: state => {
      state.totalUnreadCount += 1;
    },
    resetTotalUnreadCount: state => {
      state.totalUnreadCount = 0;
    },
    setChannelUnreadCount: (state, action: PayloadAction<{ channelId: string; count: number }>) => {
      if (!state.channelUnreadCounts) state.channelUnreadCounts = {};
      state.channelUnreadCounts[action.payload.channelId] = action.payload.count;
    },
    incrementChannelUnreadCount: (state, action: PayloadAction<string>) => {
      if (!state.channelUnreadCounts) state.channelUnreadCounts = {};
      const channelId = action.payload;
      state.channelUnreadCounts[channelId] = (state.channelUnreadCounts[channelId] ?? 0) + 1;
    },
    resetChannelUnreadCount: (state, action: PayloadAction<string>) => {
      if (!state.channelUnreadCounts) state.channelUnreadCounts = {};
      state.channelUnreadCounts[action.payload] = 0;
    },
  },
});

export const {
  setUser,
  clearUser,
  setProfile,
  setNotificationSettings,
  resetTotalUnreadCount,
  setChannelMuteSettings,
  upsertChannelMuteSetting,
  removeChannelMuteSetting,
  incrementTotalUnreadCount,
  setTotalUnreadCount,
  setChannelUnreadCount,
  incrementChannelUnreadCount,
  resetChannelUnreadCount,
} = appSlice.actions;

export default appSlice.reducer;
