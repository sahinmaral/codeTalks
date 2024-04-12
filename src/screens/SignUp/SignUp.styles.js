import {StyleSheet} from 'react-native';
import colors from '../../styles/colors';

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    flex: 1,
    backgroundColor: colors.orange['500'],
  },
  header:{
    container:{flex: 1, justifyContent: 'center', alignItems: 'center'},
    text : {fontSize: 25, color: colors['white']}
  },
  form : {
    container: {flex: 1, gap: 20},
    inputGroup:{gap: 10},
    buttonGroup:{gap: 20,marginTop:20}
  },
});

export default styles;
