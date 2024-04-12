import LottieView from 'lottie-react-native';
import {View, Text} from 'react-native';

function Loading({text}) {
  return (
    <View style={{flex: 1, justifyContent: 'center'}}>
      <LottieView
        style={{flex: 3}}
        source={require('../../../assets/loading.json')}
        autoPlay
        loop
      />
      <Text
        style={{
          flex: 2,
          fontSize: 30,
          textAlign: 'center',
          fontWeight: 'bold',
        }}>
        {text}
      </Text>
    </View>
  );
}

export default Loading;
