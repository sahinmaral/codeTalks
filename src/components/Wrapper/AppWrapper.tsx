import '@/localization/i18n';
import { persistor, store } from '@/redux/store';
import ErrorScreen from '@/screens/Error';
import * as Sentry from '@sentry/react-native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import FlashMessage from 'react-native-flash-message';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import App from '../../../App';
import Toast from '../Toast';

function AppWrapper() {
  const { t } = useTranslation();

  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Sentry.ErrorBoundary
            fallback={({ resetError }) => (
              <ErrorScreen
                description={t('errorScreen.unexpectedErrorDescription')}
                onRetry={resetError}
              />
            )}
          >
            <App />
          </Sentry.ErrorBoundary>
          <FlashMessage position="top" duration={3000} MessageComponent={Toast} />
        </PersistGate>
      </Provider>
    </SafeAreaProvider>
  );
}

export default AppWrapper;
