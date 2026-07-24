import Text from '@/components/Text';
import useTheme from '@/hooks/useTheme';
import useThemedStyles from '@/hooks/useThemedStyles';
import React, { ReactNode, useState } from 'react';
import { TextInput, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-remix-icon';
import makeStyles from './Input.styles';

interface InputProps {
  placeholder?: string;
  onChangeText?: (text: string) => void;
  onBlur?: (e: any) => void;
  onFocus?: () => void;
  value?: string;
  isSecure?: boolean;
  icon?: string;
  label?: string;
  labelRight?: ReactNode;
  helperText?: string;
  multiline?: boolean;
  numberOfLines?: number;
  maxLength?: number;
  showCharacterCount?: boolean;
  style?: any;
  containerStyle?: any;
}

function Input({
  placeholder,
  onChangeText,
  onBlur,
  onFocus,
  value,
  isSecure,
  icon,
  label,
  labelRight,
  helperText,
  multiline,
  numberOfLines,
  maxLength,
  showCharacterCount,
  containerStyle,
}: InputProps) {
  const styles = useThemedStyles(makeStyles);
  const theme = useTheme();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.container}>
      {label || labelRight ? (
        <View style={styles.labelRow}>
          {label ? (
            <Text style={styles.label} fontWeight="bold">
              {label}
            </Text>
          ) : (
            <View />
          )}
          {labelRight}
        </View>
      ) : null}
      <View
        style={[
          styles.inputContainer,
          multiline && styles.inputContainerMultiline,
          focused && styles.inputContainerFocused,
          containerStyle,
        ]}
      >
        {icon ? <Icon name={icon} color={theme.text.secondary} size={20} /> : null}
        <TextInput
          placeholder={placeholder}
          onChangeText={onChangeText}
          onBlur={e => {
            setFocused(false);
            onBlur?.(e);
          }}
          onFocus={() => {
            setFocused(true);
            onFocus?.();
          }}
          value={value ?? ''}
          secureTextEntry={isSecure && !passwordVisible}
          placeholderTextColor={theme.text.secondary}
          multiline={multiline}
          numberOfLines={multiline ? numberOfLines : undefined}
          maxLength={maxLength}
          style={[styles.input, multiline && styles.inputMultiline]}
        />
        {isSecure ? (
          <TouchableOpacity onPress={() => setPasswordVisible(prev => !prev)}>
            <Icon
              name={passwordVisible ? 'eye-line' : 'eye-off-line'}
              color={theme.text.secondary}
              size={20}
            />
          </TouchableOpacity>
        ) : null}
      </View>
      {helperText || (showCharacterCount && maxLength) ? (
        <View style={styles.footerRow}>
          {helperText ? (
            <Text size="small" color={theme.text.tertiary} style={styles.helperText}>
              {helperText}
            </Text>
          ) : (
            <View />
          )}
          {showCharacterCount && maxLength ? (
            <Text size="small" color={theme.text.tertiary}>
              {(value ?? '').length}/{maxLength}
            </Text>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

export default Input;
