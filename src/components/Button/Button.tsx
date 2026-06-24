import Text from '@/components/Text';
import useThemedStyles from '@/hooks/useThemedStyles';
import React from 'react';
import { ActivityIndicator, TouchableOpacity, ViewStyle } from 'react-native';
import Icon from 'react-native-remix-icon';
import makeStyles from './Button.styles';

type ButtonTheme =
  | 'primary'
  | 'primary-outline'
  | 'success'
  | 'success-outline'
  | 'danger'
  | 'danger-outline'
  | 'warning'
  | 'warning-outline'
  | 'dark';

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
  const styles = useThemedStyles(makeStyles);
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
