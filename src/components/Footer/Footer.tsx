import { View } from 'react-native';
import Divider from '../Divider';
import styles from './Footer.styles';
import Text from '@/components/Text';
import colors from '@/styles/colors';

function Footer() {
  return (
    <View style={styles.container}>
      <View style={styles.line} />
      <Text uppercase size="small" color={colors.gray[500]} style={styles.text}>
        codeTalks
      </Text>
      <View style={styles.line} />
    </View>
  );
}

export default Footer;
