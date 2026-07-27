import { renderWithProviders } from '@/test/renderWithProviders';
import { fireEvent, screen } from '@testing-library/react-native';
import React from 'react';
import { Pressable } from 'react-native';
import ConfirmationDialog from './ConfirmationDialog';

const baseProps = {
  title: 'Leave channel?',
  description: 'You will need to be invited back to rejoin.',
  icon: 'logout-box-line',
  confirmTitle: 'Leave',
  onConfirm: jest.fn(),
  onCancel: jest.fn(),
};

describe('ConfirmationDialog', () => {
  it('renders nothing when not visible', () => {
    renderWithProviders(<ConfirmationDialog {...baseProps} visible={false} />);
    expect(screen.queryByText('Leave channel?')).toBeNull();
  });

  it('renders the title, description and confirm button when visible', () => {
    renderWithProviders(<ConfirmationDialog {...baseProps} visible />);

    expect(screen.getByText('Leave channel?')).toBeTruthy();
    expect(screen.getByText('You will need to be invited back to rejoin.')).toBeTruthy();
    expect(screen.getByText('Leave')).toBeTruthy();
  });

  it('calls onConfirm when the confirm button is pressed', () => {
    const onConfirm = jest.fn();
    renderWithProviders(<ConfirmationDialog {...baseProps} onConfirm={onConfirm} visible />);

    fireEvent.press(screen.getByText('Leave'));

    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it('calls onCancel when the cancel button is pressed', () => {
    const onCancel = jest.fn();
    renderWithProviders(
      <ConfirmationDialog {...baseProps} cancelTitle="Cancel" onCancel={onCancel} visible />,
    );

    fireEvent.press(screen.getByText('Cancel'));

    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('calls onCancel when the overlay is pressed', () => {
    const onCancel = jest.fn();
    renderWithProviders(
      <ConfirmationDialog {...baseProps} cancelTitle="Cancel" onCancel={onCancel} visible />,
    );

    fireEvent.press(screen.UNSAFE_getAllByType(Pressable)[0]);

    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('disables the cancel button while loading', () => {
    const onCancel = jest.fn();
    renderWithProviders(
      <ConfirmationDialog
        {...baseProps}
        cancelTitle="Cancel"
        onCancel={onCancel}
        loading
        visible
      />,
    );

    fireEvent.press(screen.getByText('Cancel'));

    expect(onCancel).not.toHaveBeenCalled();
  });
});
