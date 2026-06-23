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
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    clearUser: state => {
      state.user = null;
    },
    setProfile: (state, action: PayloadAction<MyProfileDto | null>) => {
      if (state.user) {
        state.user.profile = action.payload;
      }
    },
  },
});

export const { setUser, clearUser, setProfile } = appSlice.actions;

export default appSlice.reducer;
