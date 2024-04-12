import React from 'react';
import {Text, TouchableOpacity} from 'react-native';
import styles from './Button.styles';

function Button({title, icon, style, disabled, onPress, theme = 'primary'}) {
  return (
    <TouchableOpacity style={[styles.button[theme].container,style]} onPress={onPress} disabled={disabled}>
      {icon}
      <Text style={styles.button[theme].text}>{title}</Text>
    </TouchableOpacity>
  );
}

export default Button;
