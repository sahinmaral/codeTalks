import Text from '@/components/Text';
import React from 'react';
import { ActivityIndicator, TouchableOpacity, ViewStyle } from 'react-native';
import Icon from 'react-native-remix-icon';
import styles from './Button.styles';

type ButtonTheme = 'primary' | 'primary-outline';

interface ButtonProps {
  title: string;
  icon?: string;
  style?: ViewStyle;
  disabled?: boolean;
  onPress?: () => void;
  theme?: ButtonTheme;
  loading?: boolean;
}

function Button({
  title,
  icon,
  style,
  disabled,
  onPress,
  theme = 'primary',
  loading,
}: ButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.button[theme].container, style]}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator size="small" color={styles.button[theme].text.color} />
      ) : icon ? (
        <Icon name={icon} color={styles.button[theme].text.color} size={20} />
      ) : null}
      <Text size="medium" fontWeight="600" style={styles.button[theme].text}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

export default Button;
