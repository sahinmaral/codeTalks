import React from 'react';
import { View } from 'react-native';
import styles from './BubbleContentMenu.styles';

interface BubbleContentMenuProps {
  children: React.ReactNode;
}

function BubbleContentMenu({ children }: BubbleContentMenuProps) {
  return (
    <View>
      <View style={styles.container}>{children}</View>
      <View style={styles.bubbleNeedle} />
    </View>
  );
}

export default BubbleContentMenu;
