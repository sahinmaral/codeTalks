import React from 'react';
import Text from '@/components/Text';
import { View, Image } from 'react-native';
import styles from './Error.styles';
import Button from '@/components/Button';
import { useAppDispatch } from '@/redux/hooks';
import { setUser } from '@/redux/reducers/appReducer';

interface ErrorProps {
  title?: string;
  description: string;
}

function Error({ description, title = 'Something went wrong' }: ErrorProps) {
  const dispatch = useAppDispatch();

  const handleGoToLogin = () => {
    dispatch(setUser(null));
  };

  return (
    <View style={styles.container}>
      <View style={styles.main}>
        <Image
          source={require('@/assets/images/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.appName}>codeTalks</Text>
      </View>
      <View style={styles.errorSection}>
        <Text size="large" fontWeight="800" style={styles.errorText}>
          {title}
        </Text>
        <Text style={styles.errorTextDescription}>{description}</Text>
        <View style={styles.buttonGroup}>
          <Button title={'Try Again'} icon="ri-restart-line" style={styles.button} />
          <Button
            title={'Go To Login'}
            theme="primary-outline"
            style={styles.button}
            onPress={handleGoToLogin}
          />
        </View>
      </View>
      <Text style={styles.version}>v1.0.0</Text>
    </View>
  );
}

export default Error;
