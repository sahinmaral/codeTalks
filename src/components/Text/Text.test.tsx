import { renderWithProviders } from '@/test/renderWithProviders';
import { screen } from '@testing-library/react-native';
import React from 'react';
import { StyleSheet } from 'react-native';
import AppText from './Text';

describe('AppText', () => {
  it('renders its children', () => {
    renderWithProviders(<AppText>Hello</AppText>);
    expect(screen.getByText('Hello')).toBeTruthy();
  });

  it('maps the default fontWeight to the Montserrat_400 font family', () => {
    renderWithProviders(<AppText>Hello</AppText>);
    const flat = StyleSheet.flatten(screen.getByText('Hello').props.style);
    expect(flat.fontFamily).toBe('Montserrat_400');
  });

  it('maps a given fontWeight prop to the matching font family', () => {
    renderWithProviders(<AppText fontWeight="700">Hello</AppText>);
    const flat = StyleSheet.flatten(screen.getByText('Hello').props.style);
    expect(flat.fontFamily).toBe('Montserrat_700');
  });

  it('prefers a fontWeight set via the style prop over the fontWeight prop', () => {
    renderWithProviders(
      <AppText fontWeight="400" style={{ fontWeight: '800' }}>
        Hello
      </AppText>,
    );
    const flat = StyleSheet.flatten(screen.getByText('Hello').props.style);
    expect(flat.fontFamily).toBe('Montserrat_800');
  });

  it('uses the given color over the theme default', () => {
    renderWithProviders(<AppText color="#123456">Hello</AppText>);
    const flat = StyleSheet.flatten(screen.getByText('Hello').props.style);
    expect(flat.color).toBe('#123456');
  });

  it('applies the uppercase style when uppercase is true', () => {
    renderWithProviders(<AppText uppercase>Hello</AppText>);
    const flat = StyleSheet.flatten(screen.getByText('Hello').props.style);
    expect(flat.textTransform).toBe('uppercase');
  });
});
