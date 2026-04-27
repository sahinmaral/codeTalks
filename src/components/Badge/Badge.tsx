import React from 'react';
import { View, Text } from 'react-native';
import styles from './Badge.styles';
import colors from '../../styles/colors';

type ColorKey = keyof typeof colors;

interface BadgeProps {
  text: string;
  color: ColorKey;
}

const Badge = ({ text, color }: BadgeProps) => {
  const bg = colors[color];
  const backgroundColor = typeof bg === 'string' ? bg : undefined;

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

export default Badge;
