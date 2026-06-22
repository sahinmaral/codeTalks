import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MyProfileDto, User } from '../../types';

interface AppState {
  user: User | null;
}

const initialState: AppState = {
  user: null,
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
    },
    setProfile: (state, action: PayloadAction<MyProfileDto | null>) => {
      if (state.user) {
        state.user.profile = action.payload;
      }
    },
  },
});

export const { setUser, setProfile } = appSlice.actions;

export default appSlice.reducer;
