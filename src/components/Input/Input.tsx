import React from 'react';
import { TextInput } from 'react-native';
import colors from '../../styles/colors';
import styles from './Input.styles';

interface InputProps {
  placeholder?: string;
  onChangeText?: (text: string) => void;
  onBlur?: (e: any) => void;
  value?: string;
  isSecure?: boolean;
}

function Input({ placeholder, onChangeText, onBlur, value, isSecure }: InputProps) {
  return (
    <TextInput
      placeholder={placeholder}
      onChangeText={onChangeText}
      onBlur={onBlur}
      value={value ?? ''}
      secureTextEntry={isSecure}
      placeholderTextColor={colors.white}
      style={styles.input}
    />
  );
}

export default Input;
