import { renderWithProviders } from '@/test/renderWithProviders';
import { screen } from '@testing-library/react-native';
import React from 'react';
import PasswordRequirementsList from './PasswordRequirementsList';

const requirements = {
  minLength: false,
  includeLowercase: false,
  includeUppercase: false,
  includeSpecialCharacter: false,
};

describe('PasswordRequirementsList', () => {
  it('lists every requirement', () => {
    renderWithProviders(<PasswordRequirementsList passwordRequirements={requirements} />);

    expect(screen.getByText('Password Requirements')).toBeTruthy();
    expect(screen.getByText('Min 6 characters')).toBeTruthy();
    expect(screen.getByText('Include a lowercase letter')).toBeTruthy();
    expect(screen.getByText('Include an uppercase letter')).toBeTruthy();
    expect(screen.getByText('Include a special character')).toBeTruthy();
  });

  it('marks unmet requirements with a cross', () => {
    renderWithProviders(<PasswordRequirementsList passwordRequirements={requirements} />);

    expect(screen.UNSAFE_getAllByProps({ name: 'ri-close-line' })).toHaveLength(4);
    expect(screen.UNSAFE_queryAllByProps({ name: 'ri-check-line' })).toHaveLength(0);
  });

  it('marks met requirements with a check', () => {
    renderWithProviders(
      <PasswordRequirementsList
        passwordRequirements={{ ...requirements, minLength: true, includeUppercase: true }}
      />,
    );

    expect(screen.UNSAFE_getAllByProps({ name: 'ri-check-line' })).toHaveLength(2);
    expect(screen.UNSAFE_getAllByProps({ name: 'ri-close-line' })).toHaveLength(2);
  });
});
