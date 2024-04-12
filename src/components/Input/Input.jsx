import React from 'react';
import {TextInput} from 'react-native';
import colors from '../../styles/colors';
import styles from './Input.styles';

function Input({placeholder,onChangeText,onBlur,value,isSecure}) {
  return (
    <TextInput
      placeholder={placeholder}
      onChangeText={onChangeText}
      onBlur={onBlur}
      value={value}
      secureTextEntry={isSecure}
      placeholderTextColor={colors['white']}
      style={styles}
    />
  );
}

export default Input;
