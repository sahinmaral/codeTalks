import { View } from 'react-native';
import Text from '@/components/Text';
import useTheme from '@/hooks/useTheme';
import useThemedStyles from '@/hooks/useThemedStyles';
import makeStyles from './Divider.styles';

type DividerProps = {
  text?: string;
};

function Divider({ text }: DividerProps) {
  const styles = useThemedStyles(makeStyles);
  const theme = useTheme();
  return (
    <View style={styles.dividerContainer}>
      {text ? (
        <>
          <View style={styles.line} />
          <Text uppercase size="small" color={theme.text.secondary} style={styles.text}>
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
