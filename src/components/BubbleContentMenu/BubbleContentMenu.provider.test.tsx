import { renderWithProviders } from '@/test/renderWithProviders';
import { fireEvent, screen } from '@testing-library/react-native';
import React from 'react';
import { Button, Text } from 'react-native';
import { BubbleContentMenuProvider, useBubbleContentMenu } from './BubbleContentMenu.provider';

// The mock module lacks the `__esModule` marker, so Babel's default-import interop
// would otherwise bind the default import to the whole exports object instead of `.default`.
jest.mock('@gorhom/bottom-sheet', () => ({
  __esModule: true,
  ...require('@gorhom/bottom-sheet/mock'),
}));

function Consumer() {
  const { show, hide } = useBubbleContentMenu();
  return (
    <>
      <Button title="Open" onPress={() => show(<Text>Menu content</Text>)} />
      <Button title="Close" onPress={hide} />
    </>
  );
}

describe('BubbleContentMenuProvider', () => {
  it('does not render the menu until show is called', () => {
    renderWithProviders(
      <BubbleContentMenuProvider>
        <Consumer />
      </BubbleContentMenuProvider>,
    );

    expect(screen.queryByText('Menu content')).toBeNull();
  });

  it('renders the given content after show is called', () => {
    renderWithProviders(
      <BubbleContentMenuProvider>
        <Consumer />
      </BubbleContentMenuProvider>,
    );

    fireEvent.press(screen.getByText('Open'));

    expect(screen.getByText('Menu content')).toBeTruthy();
  });

  it('hides the menu when hide is called', () => {
    renderWithProviders(
      <BubbleContentMenuProvider>
        <Consumer />
      </BubbleContentMenuProvider>,
    );

    fireEvent.press(screen.getByText('Open'));
    expect(screen.getByText('Menu content')).toBeTruthy();

    fireEvent.press(screen.getByText('Close'));
    expect(screen.queryByText('Menu content')).toBeNull();
  });

  it('hides the menu when its cancel button is pressed', () => {
    renderWithProviders(
      <BubbleContentMenuProvider>
        <Consumer />
      </BubbleContentMenuProvider>,
    );

    fireEvent.press(screen.getByText('Open'));
    fireEvent.press(screen.getByText('Cancel'));

    expect(screen.queryByText('Menu content')).toBeNull();
  });
});
