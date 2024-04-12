import LottieView from 'lottie-react-native';
import {View, Text, Dimensions} from 'react-native';

function CheckInternet({styles}) {
  return (
    <View
      style={[
        {flex: 1, flexDirection: 'column', alignItems: 'center'},
        styles.container,
      ]}>
      <LottieView
        style={{
          flex: 3,
          width: Dimensions.get('window').width / 2,
        }}
        source={require('../../../assets/check-internet.json')}
        autoPlay
        loop
      />
      <Text
        style={[
          {
            flex: 2,
            fontSize: 30,
            textAlign: 'center',
            fontWeight: 'bold',
          },
          styles.text,
        ]}>
        Uygulamayı kullanabilmeniz için internet bağlantınızın olması
        gerekmektedir.
      </Text>
    </View>
  );
}

export default CheckInternet;
