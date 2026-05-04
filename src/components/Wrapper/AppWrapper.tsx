import React from 'react';
import { Provider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import App from '../../../App';
import { store } from '../../redux/store';
import FlashMessage from 'react-native-flash-message';
import Toast from '../Toast';

function AppWrapper() {
  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <App />
        <FlashMessage position="top" duration={3000} MessageComponent={Toast} />
      </Provider>
    </SafeAreaProvider>
  );
}

export default AppWrapper;
