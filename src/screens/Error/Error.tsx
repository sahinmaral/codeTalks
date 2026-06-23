import Button from '@/components/Button';
import Text from '@/components/Text';
import { useAppDispatch } from '@/redux/hooks';
import { clearUser } from '@/redux/reducers/appReducer';
import React from 'react';
import { Image, View } from 'react-native';
import styles from './Error.styles';

interface ErrorProps {
  title?: string;
  description: string;
  onRetry?: () => void;
}

function Error({ description, title = 'Something went wrong', onRetry }: ErrorProps) {
  const dispatch = useAppDispatch();

  const handleGoToLogin = () => {
    dispatch(clearUser());
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
          {onRetry && (
            <Button
              title={'Try Again'}
              icon="ri-restart-line"
              style={styles.button}
              onPress={onRetry}
            />
          )}
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
