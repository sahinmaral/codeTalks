import Text from '@/components/Text';
import useTheme from '@/hooks/useTheme';
import useThemedStyles from '@/hooks/useThemedStyles';
import React, { useState } from 'react';
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
  containerStyle,
}: InputProps) {
  const styles = useThemedStyles(makeStyles);
  const theme = useTheme();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.container}>
      {label ? (
        <Text style={styles.label} fontWeight="bold">
          {label}
        </Text>
      ) : null}
      <View
        style={[styles.inputContainer, focused && styles.inputContainerFocused, containerStyle]}
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
          style={styles.input}
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
    </View>
  );
}

export default Input;
