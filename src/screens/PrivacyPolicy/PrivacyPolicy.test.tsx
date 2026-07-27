import { renderWithProviders } from '@/test/renderWithProviders';
import { ProfileStackParamList } from '@/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { act, fireEvent, screen } from '@testing-library/react-native';
import React from 'react';
import { ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import PrivacyPolicy from './PrivacyPolicy';

// The document is fetched over the network in an effect; flush that promise inside act().
const flush = () => act(async () => {});

jest.mock('react-native-webview', () => ({ WebView: 'WebView' }));

const navigation = { goBack: jest.fn() } as unknown as NativeStackNavigationProp<
  ProfileStackParamList,
  'PrivacyPolicy'
>;

const DOCUMENT_URL =
  'https://res.cloudinary.com/sahinmaral/raw/upload/v1783780173/code-talks/documents/en/privacy-policy.html';

const mockFetch = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
  mockFetch.mockResolvedValue({ text: async () => '<h1>Privacy</h1>' });
  global.fetch = mockFetch as unknown as typeof fetch;
});

describe('PrivacyPolicy', () => {
  it('shows a spinner until the document is fetched', async () => {
    let resolveFetch: (value: unknown) => void = () => {};
    mockFetch.mockReturnValue(new Promise(resolve => (resolveFetch = resolve)));

    renderWithProviders(<PrivacyPolicy navigation={navigation} />);

    expect(screen.UNSAFE_getByType(ActivityIndicator)).toBeTruthy();
    expect(screen.UNSAFE_queryByType(WebView)).toBeNull();

    await act(async () => resolveFetch({ text: async () => '<h1>Privacy</h1>' }));

    expect(screen.UNSAFE_queryByType(ActivityIndicator)).toBeNull();
  });

  it('fetches the English document and renders it in the web view', async () => {
    renderWithProviders(<PrivacyPolicy navigation={navigation} />);
    await flush();

    expect(mockFetch).toHaveBeenCalledWith(DOCUMENT_URL);

    const webView = screen.UNSAFE_getByType(WebView);
    expect(webView.props.source.html).toContain('<h1>Privacy</h1>');
    expect(webView.props.source.baseUrl).toBe(DOCUMENT_URL);
  });

  it('fetches the Turkish document when the app language is Turkish', async () => {
    renderWithProviders(<PrivacyPolicy navigation={navigation} />, {
      preloadedState: { language: { mode: 'tr' } },
    });
    await flush();

    expect(mockFetch).toHaveBeenCalledWith(DOCUMENT_URL.replace('/en/', '/tr/'));
  });

  it('still renders the web view when the document cannot be fetched', async () => {
    mockFetch.mockRejectedValue(new Error('offline'));
    renderWithProviders(<PrivacyPolicy navigation={navigation} />);
    await flush();

    expect(screen.UNSAFE_queryByType(ActivityIndicator)).toBeNull();
    expect(screen.UNSAFE_getByType(WebView)).toBeTruthy();
  });

  it('goes back from the header back button', async () => {
    renderWithProviders(<PrivacyPolicy navigation={navigation} />);
    await flush();

    fireEvent.press(screen.UNSAFE_getByProps({ name: 'arrow-left-line' }));

    expect(navigation.goBack).toHaveBeenCalled();
  });
});
