import ChannelJoinPolicy from '@/enums/ChannelJoinPolicy';
import { UserRole } from '@/enums/UserRole';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ActiveChannel {
  id: string;
  name: string;
  description?: string;
  thumbnailPhotoURL?: string | null;
  joinPolicy: ChannelJoinPolicy;
  inviteCode: string;
  createdAt: string;
  role?: UserRole;
}

interface ActiveChannelState {
  channel: ActiveChannel | null;
}

const initialState: ActiveChannelState = {
  channel: null,
};

export const activeChannelSlice = createSlice({
  name: 'activeChannel',
  initialState,
  reducers: {
    setActiveChannel: (state, action: PayloadAction<ActiveChannel>) => {
      state.channel = action.payload;
    },
    setActiveChannelName: (state, action: PayloadAction<string>) => {
      if (state.channel) {
        state.channel.name = action.payload;
      }
    },
    setActiveChannelDescription: (state, action: PayloadAction<string>) => {
      if (state.channel) {
        state.channel.description = action.payload;
      }
    },
    setActiveChannelJoinPolicy: (state, action: PayloadAction<ChannelJoinPolicy>) => {
      if (state.channel) {
        state.channel.joinPolicy = action.payload;
      }
    },
    setRoleOfCurrentUser: (state, action: PayloadAction<UserRole>) => {
      if (state.channel) {
        state.channel.role = action.payload;
      }
    },
  },
});

export const {
  setActiveChannel,
  setActiveChannelName,
  setActiveChannelDescription,
  setActiveChannelJoinPolicy,
  setRoleOfCurrentUser,
} = activeChannelSlice.actions;

export default activeChannelSlice.reducer;
