import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ActiveChannel {
  id: string;
  name: string;
  description?: string;
  inviteCode: string;
  createdAt: string;
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
  },
});

export const { setActiveChannel, setActiveChannelName, setActiveChannelDescription } =
  activeChannelSlice.actions;

export default activeChannelSlice.reducer;
