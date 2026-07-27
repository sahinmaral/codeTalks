import '@/localization/i18n';
import ErrorScreen from '@/screens/Error';
import appReducer from '@/redux/reducers/appReducer';
import themeReducer from '@/redux/reducers/themeReducer';
import { configureStore } from '@reduxjs/toolkit';
import * as Sentry from '@sentry/react-native';
import { render, screen } from '@testing-library/react-native';
import React from 'react';
import { Text } from 'react-native';
import { Provider } from 'react-redux';

// Mirrors the exact Sentry.ErrorBoundary + Error fallback pattern used in AppWrapper.tsx,
// without pulling in the full App/navigation tree or the real persisted store (deferred to a
// later, heavier test pass) — just the two slices Error.tsx actually reads/dispatches.
const testStore = configureStore({
  reducer: { app: appReducer, theme: themeReducer },
});

function Boundary({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={testStore}>
      <Sentry.ErrorBoundary
        fallback={({ resetError }) => (
          <ErrorScreen
            description="An unexpected error occurred. Please try again."
            onRetry={resetError}
          />
        )}
      >
        {children}
      </Sentry.ErrorBoundary>
    </Provider>
  );
}

function ThrowingChild(): React.ReactElement {
  throw new Error('boom');
}

function OkChild() {
  return <Text>all good</Text>;
}

describe('Sentry.ErrorBoundary + Error fallback wiring', () => {
  it('renders the fallback Error UI when a child throws during render', () => {
    // React logs the caught error via console.error by design when an error boundary
    // catches it — expected noise for this test, suppressed to keep output clean.
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <Boundary>
        <ThrowingChild />
      </Boundary>,
    );

    expect(screen.getByText('An unexpected error occurred. Please try again.')).toBeTruthy();

    consoleErrorSpy.mockRestore();
  });

  it('renders children normally when nothing throws', () => {
    render(
      <Boundary>
        <OkChild />
      </Boundary>,
    );

    expect(screen.getByText('all good')).toBeTruthy();
  });
});
