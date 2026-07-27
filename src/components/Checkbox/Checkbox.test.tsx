import { renderWithProviders } from '@/test/renderWithProviders';
import { fireEvent, screen } from '@testing-library/react-native';
import React from 'react';
import Checkbox from './Checkbox';

describe('Checkbox', () => {
  it('renders the label', () => {
    renderWithProviders(<Checkbox label="Remember me" checked={false} />);
    expect(screen.getByText('Remember me')).toBeTruthy();
  });

  it('calls onChange with the inverted value when pressed', () => {
    const onChange = jest.fn();
    renderWithProviders(<Checkbox label="Remember me" checked={false} onChange={onChange} />);

    fireEvent.press(screen.getByText('Remember me'));

    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('does not call onChange when disabled', () => {
    const onChange = jest.fn();
    renderWithProviders(
      <Checkbox label="Remember me" checked={false} disabled onChange={onChange} />,
    );

    fireEvent.press(screen.getByText('Remember me'));

    expect(onChange).not.toHaveBeenCalled();
  });
});
