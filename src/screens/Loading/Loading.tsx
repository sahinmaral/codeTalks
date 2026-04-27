import LottieView from 'lottie-react-native';
import React from 'react';
import { View, Text } from 'react-native';

interface LoadingProps {
  text: string;
}

function Loading({ text }: LoadingProps) {
  return (
    <View style={{ flex: 1, justifyContent: 'center' }}>
      <LottieView
        style={{ flex: 3 }}
        source={require('../../../assets/loading.json')}
        autoPlay
        loop
      />
      <Text style={{ flex: 2, fontSize: 30, textAlign: 'center', fontWeight: 'bold' }}>
        {text}
      </Text>
    </View>
  );
}

export default Loading;
