import LottieView from 'lottie-react-native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text, Dimensions, ViewStyle, TextStyle } from 'react-native';

interface CheckInternetStyles {
  container: ViewStyle;
  text: TextStyle;
}

interface CheckInternetProps {
  styles: CheckInternetStyles;
}

function CheckInternet({ styles }: CheckInternetProps) {
  const { t } = useTranslation();
  return (
    <View style={[{ flex: 1, flexDirection: 'column', alignItems: 'center' }, styles.container]}>
      <LottieView
        style={{ flex: 3, width: Dimensions.get('window').width / 2 }}
        source={require('../../../assets/check-internet.json')}
        autoPlay
        loop
      />
      <Text
        style={[{ flex: 2, fontSize: 30, textAlign: 'center', fontWeight: 'bold' }, styles.text]}
      >
        {t('common.noInternet')}
      </Text>
    </View>
  );
}

export default CheckInternet;
