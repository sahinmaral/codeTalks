import { View } from 'react-native';
import Text from '@/components/Text';
import styles from './Divider.styles';
import colors from '@/styles/colors';

type DividerProps = {
  text?: string;
};

function Divider({ text, fontWeight }: DividerProps) {
  return (
    <View style={styles.dividerContainer}>
      {text ? (
        <>
          <View style={styles.line} />
          <Text uppercase size="small" color={colors.gray[500]} style={styles.text}>
            {text}
          </Text>
          <View style={styles.line} />
        </>
      ) : (
        <>
          <View style={styles.line} />
        </>
      )}
    </View>
  );
}

export default Divider;
