import React, { useState } from 'react';
import { TextInput, TouchableOpacity, View } from 'react-native';
import colors from '../../styles/colors';
import styles from './Input.styles';
import Icon from 'react-native-remix-icon';
import Text from '@/components/Text';

interface InputProps {
  placeholder?: string;
  onChangeText?: (text: string) => void;
  onBlur?: (e: any) => void;
  onFocus?: () => void;
  value?: string;
  isSecure?: boolean;
  icon?: string;
  label?: string;
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
}: InputProps) {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.container}>
      {label ? (
        <Text style={styles.label} fontWeight="bold">
          {label}
        </Text>
      ) : null}
      <View style={[styles.inputContainer, focused && styles.inputContainerFocused]}>
        {icon ? <Icon name={icon} color={colors.gray[500]} size={20} /> : null}
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
          placeholderTextColor={colors.gray[500]}
          style={styles.input}
        />
        {isSecure ? (
          <TouchableOpacity onPress={() => setPasswordVisible(prev => !prev)}>
            <Icon
              name={passwordVisible ? 'eye-line' : 'eye-off-line'}
              color={colors.gray[500]}
              size={20}
            />
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
}

export default Input;
