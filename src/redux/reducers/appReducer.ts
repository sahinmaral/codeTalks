import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../types';

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
  },
});

export const { setUser } = appSlice.actions;

export default appSlice.reducer;
