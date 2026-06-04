import React, { useRef, useState } from 'react';
import { ActivityIndicator, Image, SafeAreaView, TouchableOpacity, View } from 'react-native';
import PhoneInput from 'react-native-phone-number-input';
import { showMessage } from 'react-native-flash-message';
import { Formik } from 'formik';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import * as Yup from 'yup';
import Input from '../../components/Input/Input';
import Button from '../../components/Button';
import Text from '@/components/Text';
import Footer from '@/components/Footer';
import styles from './ContinueSignUp.styles';
import validationSchema from '../../schemas/ContinueSignUpSchema';
import { fetchSignUp } from '../../services/auths';
import colors from '../../styles/colors';
import { ApiError, RootStackParamList } from '../../types';
import { AxiosError } from 'axios';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import useKeyboardVisible from '@/hooks/useKeyboardVisible';

interface ContinueSignUpProps {
  navigation: NativeStackNavigationProp<RootStackParamList, 'ContinueSignUp'>;
  route: RouteProp<RootStackParamList, 'ContinueSignUp'>;
}

function ContinueSignUp({ navigation, route }: ContinueSignUpProps) {
  const [loading, setLoading] = useState(false);
  const phoneInputRef = useRef<PhoneInput>(null);
  const { isKeyboardVisible } = useKeyboardVisible();

  const initialValues = {
    firstName: 'Mehmet',
    middleName: null as string | null,
    lastName: 'Kesici',
    ...route.params,
  };

  const handleSignUp = async (user: typeof initialValues) => {
    try {
      setLoading(true);
      await fetchSignUp({
        ...user,
        middleName: user.middleName ?? undefined,
      });
      showMessage({ message: 'Başarıyla kaydınız gerçekleşti', type: 'info' });
      navigation.navigate('Login');
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        showMessage({ message: 'Please enter remaining inputs', type: 'warning' });
      } else if (error instanceof AxiosError) {
        const apiError = error.response?.data as ApiError;
        showMessage({ message: apiError.detail, type: 'danger' });
      } else {
        showMessage({ message: 'Bir hata oluştu', type: 'danger' });
      }
    }
  };

  const handleSubmit = async (values: typeof initialValues) => {
    try {
      await validationSchema.validate(values, { abortEarly: false });
      await handleSignUp(values);
    } catch (exception) {
      showMessage({ message: String(exception), type: 'danger' });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAwareScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        bounces={false}
        overScrollMode="never"
        enableOnAndroid
        extraScrollHeight={20}
        enableResetScrollToCoords={false}
        enableAutomaticScroll={false}
        scrollEnabled={isKeyboardVisible}
      >
        <View style={styles.headerContainer}>
          <View style={styles.logoContainer}>
            <Image source={require('@/assets/images/logo.png')} style={styles.logo} />
          </View>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.description}>
            <Text size="large" fontWeight="800">
              Personal Details
            </Text>
            <Text size="medium">Complete your profile to join the Codetalks community.</Text>
          </View>

          <View style={styles.formInputsContainer}>
            <Formik initialValues={initialValues} onSubmit={handleSubmit}>
              {({ handleChange, handleBlur, handleSubmit: formikSubmit, values }) => (
                <View style={{ flex: 1 }}>
                  <View style={styles.inputGroup}>
                    <Input
                      label="First Name"
                      placeholder="John"
                      onChangeText={handleChange('firstName')}
                      onBlur={handleBlur('firstName')}
                      value={values.firstName}
                    />
                    <Input
                      label="Middle Name (optional)"
                      placeholder="Jae"
                      onChangeText={handleChange('middleName')}
                      onBlur={handleBlur('middleName')}
                      value={values.middleName ?? ''}
                    />
                    <Input
                      label="Last Name"
                      placeholder="Doe"
                      onChangeText={handleChange('lastName')}
                      onBlur={handleBlur('lastName')}
                      value={values.lastName}
                    />
                  </View>

                  <View style={styles.buttonGroup}>
                    <Button title="Create Account" theme="primary" onPress={formikSubmit} />
                    <Button
                      title="Back"
                      icon="arrow-left-line"
                      theme="primary-outline"
                      onPress={() => navigation.goBack()}
                    />
                  </View>
                </View>
              )}
            </Formik>
          </View>
          <Footer />
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

export default ContinueSignUp;
