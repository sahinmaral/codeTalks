import { renderWithProviders } from '@/test/renderWithProviders';
import { fireEvent, screen } from '@testing-library/react-native';
import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import CustomModal from './CustomModal';

describe('CustomModal', () => {
  it('renders its children when visible', () => {
    renderWithProviders(
      <CustomModal closeAllModals={jest.fn()} containerModalVisible>
        <Text>Modal content</Text>
      </CustomModal>,
    );
    expect(screen.getByText('Modal content')).toBeTruthy();
  });

  it('calls closeAllModals when the backdrop is pressed', () => {
    const closeAllModals = jest.fn();
    renderWithProviders(
      <CustomModal closeAllModals={closeAllModals} containerModalVisible>
        <Text>Modal content</Text>
      </CustomModal>,
    );

    fireEvent.press(screen.UNSAFE_getByType(TouchableOpacity));

    expect(closeAllModals).toHaveBeenCalledTimes(1);
  });
});
