import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import styles from './Text.styles';
import colors from '@/styles/colors';

type AppTextProps = TextProps & {
  size?: 'small' | 'medium' | 'large' | 'xlarge' | 'xxlarge';
  color?: string;
  uppercase?: boolean;
  fontWeight?:
    | '100'
    | '200'
    | '300'
    | '400'
    | '500'
    | '600'
    | '700'
    | '800'
    | '900'
    | 'normal'
    | 'bold';
};

const sizeStyles = StyleSheet.create({
  small: { fontSize: 12 },
  medium: { fontSize: 16 },
  large: { fontSize: 20 },
  xlarge: { fontSize: 24 },
  xxlarge: { fontSize: 28 },
});

const weightMap: Record<string, string> = {
  '100': 'Montserrat_100',
  '200': 'Montserrat_200',
  '300': 'Montserrat_300',
  '400': 'Montserrat_400',
  '500': 'Montserrat_500',
  '600': 'Montserrat_600',
  '700': 'Montserrat_700',
  '800': 'Montserrat_800',
  '900': 'Montserrat_900',
  normal: 'Montserrat_400',
  bold: 'Montserrat_700',
};

function AppText({
  size = 'medium',
  fontWeight = '400',
  color = 'black',
  uppercase,
  style,
  ...props
}: AppTextProps) {
  const flat = StyleSheet.flatten(style) ?? {};
  const fontFamily = weightMap[String(flat.fontWeight ?? fontWeight)] ?? 'Montserrat_400';

  return (
    <Text
      style={[
        sizeStyles[size],
        { color },
        style,
        { fontFamily, fontWeight: undefined },
        uppercase && styles.uppercase,
      ]}
      {...props}
    />
  );
}

export default AppText;
