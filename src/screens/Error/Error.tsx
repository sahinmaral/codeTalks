import LottieView from 'lottie-react-native';
import React from 'react';
import { View, Text, Dimensions, ViewStyle, TextStyle } from 'react-native';

interface ErrorStyles {
  container: ViewStyle;
  text: TextStyle;
}

interface ErrorProps {
  error: string;
  styles: ErrorStyles;
}

function Error({ error, styles }: ErrorProps) {
  return (
    <View style={[{ flex: 1, flexDirection: 'column', alignItems: 'center' }, styles.container]}>
      <LottieView
        style={{ flex: 3, width: Dimensions.get('window').width / 2 }}
        source={require('../../../assets/error.json')}
        autoPlay
        loop
      />
      <Text
        style={[{ flex: 2, fontSize: 30, textAlign: 'center', fontWeight: 'bold' }, styles.text]}
      >
        {error}
      </Text>
    </View>
  );
}

export default Error;
