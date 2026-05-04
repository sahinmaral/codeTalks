import React from 'react';
import { TouchableOpacity, View, ViewStyle } from 'react-native';
import { Feather } from '@expo/vector-icons';
import styles from './Checkbox.styles';
import Text from '@/components/Text';
import colors from '@/styles/colors';

interface CheckboxProps {
  label: string;
  checked: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  onChange?: (value: boolean) => void;
}

function Checkbox({ label, checked, disabled = false, style, onChange }: CheckboxProps) {
  return (
    <TouchableOpacity
      style={[styles.row, style]}
      onPress={() => onChange?.(!checked)}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <View style={[styles.box, checked && styles.boxChecked, disabled && styles.boxDisabled]}>
        {checked && !disabled && <Feather name="check" size={14} color={colors.white} />}
      </View>
      <Text size="medium" style={disabled && styles.labelDisabled}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

export default Checkbox;
