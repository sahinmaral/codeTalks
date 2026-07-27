import { renderWithProviders } from '@/test/renderWithProviders';
import { screen } from '@testing-library/react-native';
import React from 'react';
import CheckInternet from './CheckInternet';

// The Lottie animation needs its native view; nothing here depends on it rendering.
jest.mock('lottie-react-native', () => 'LottieView');

describe('CheckInternet', () => {
  it('tells the user an internet connection is required', () => {
    renderWithProviders(<CheckInternet styles={{ container: {}, text: {} }} />);

    expect(screen.getByText('You need an internet connection to use the app.')).toBeTruthy();
  });
});
