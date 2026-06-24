import { View } from 'react-native';
import Divider from '../Divider';
import makeStyles from './Footer.styles';
import Text from '@/components/Text';
import useTheme from '@/hooks/useTheme';
import useThemedStyles from '@/hooks/useThemedStyles';

function Footer() {
  const styles = useThemedStyles(makeStyles);
  const theme = useTheme();
  return (
    <View style={styles.container}>
      <View style={styles.line} />
      <Text uppercase size="small" color={theme.text.secondary} style={styles.text}>
        codeTalks
      </Text>
      <View style={styles.line} />
    </View>
  );
}

export default Footer;
