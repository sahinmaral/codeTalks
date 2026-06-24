import { configureStore } from '@reduxjs/toolkit';
import appReducer from './reducers/appReducer';
import activeChannelReducer from './reducers/activeChannelReducer';
import themeReducer from './reducers/themeReducer';

export const store = configureStore({
  reducer: {
    app: appReducer,
    activeChannel: activeChannelReducer,
    theme: themeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
