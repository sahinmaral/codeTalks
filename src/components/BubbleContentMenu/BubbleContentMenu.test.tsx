import { renderWithProviders } from '@/test/renderWithProviders';
import { fireEvent, screen } from '@testing-library/react-native';
import React from 'react';
import { Text } from 'react-native';
import BubbleContentMenu from './BubbleContentMenu';

// The mock module lacks the `__esModule` marker, so Babel's default-import interop
// would otherwise bind the default import to the whole exports object instead of `.default`.
jest.mock('@gorhom/bottom-sheet', () => ({
  __esModule: true,
  ...require('@gorhom/bottom-sheet/mock'),
}));

describe('BubbleContentMenu', () => {
  it('renders its children content', () => {
    renderWithProviders(
      <BubbleContentMenu onClose={jest.fn()}>
        <Text>Modal content</Text>
      </BubbleContentMenu>,
    );

    expect(screen.getByText('Modal content')).toBeTruthy();
  });

  it('renders a cancel button that calls onClose when pressed', () => {
    const onClose = jest.fn();
    renderWithProviders(
      <BubbleContentMenu onClose={onClose}>
        <Text>Modal content</Text>
      </BubbleContentMenu>,
    );

    fireEvent.press(screen.getByText('Cancel'));

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
