import { configureStore } from '@reduxjs/toolkit';
import appReducer from './reducers/appReducer';
import activeChannelReducer from './reducers/activeChannelReducer';

export const store = configureStore({
  reducer: {
    app: appReducer,
    activeChannel: activeChannelReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
