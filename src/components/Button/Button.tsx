import React from 'react';
import { Text, TouchableOpacity, ViewStyle } from 'react-native';
import styles from './Button.styles';

type ButtonTheme = 'primary' | 'secondary';

interface ButtonProps {
  title: string;
  icon?: React.ReactNode;
  style?: ViewStyle;
  disabled?: boolean;
  onPress?: () => void;
  theme?: ButtonTheme;
}

function Button({ title, icon, style, disabled, onPress, theme = 'primary' }: ButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.button[theme].container, style]}
      onPress={onPress}
      disabled={disabled}
    >
      {icon}
      <Text style={styles.button[theme].text}>{title}</Text>
    </TouchableOpacity>
  );
}

export default Button;
