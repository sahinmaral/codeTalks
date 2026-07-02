import { persistor, store } from '@/redux/store';
import React from 'react';
import FlashMessage from 'react-native-flash-message';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import App from '../../../App';
import Toast from '../Toast';

function AppWrapper() {
  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <App />
          <FlashMessage position="top" duration={3000} MessageComponent={Toast} />
        </PersistGate>
      </Provider>
    </SafeAreaProvider>
  );
}

export default AppWrapper;
