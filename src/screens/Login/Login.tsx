import React, { useState } from 'react';
import { Image, SafeAreaView, TouchableOpacity, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { showMessage } from 'react-native-flash-message';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { AxiosError } from 'axios';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/';
import Text from '@/components/Text';
import Footer from '@/components/Footer';
import Checkbox from '@/components/Checkbox';
import Divider from '@/components/Divider';
import styles from './Login.styles';
import validationSchema from '../../schemas/LoginSchema';
import { useAppDispatch } from '../../redux/hooks';
import { setUser } from '../../redux/reducers/appReducer';
import colors from '../../styles/colors';
import { fetchLogin } from '../../services/auths';
import { ApiError, RootStackParamList } from '../../types';
import useKeyboardVisible from '@/hooks/useKeyboardVisible';

interface LoginProps {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Login'>;
}

const initialValues = {
  email: 'mehmetkesici@hotmail.com',
  password: 'Abc1234.',
  rememberMe: true,
};

function Login({ navigation }: LoginProps) {
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const { isKeyboardVisible } = useKeyboardVisible();

  const handleLogin = async (values: typeof initialValues) => {
    setLoading(true);
    try {
      const result = await fetchLogin({
        usernameOrEmail: values.email,
        password: values.password,
        rememberMe: values.rememberMe,
      });
      dispatch(setUser(result.data));
      showMessage({ message: 'Başarıyla giriş yaptınız', type: 'info' });
      navigation.navigate('ActiveChannelList');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values: typeof initialValues) => {
    try {
      await validationSchema.validate(values, { abortEarly: false });
      await handleLogin(values);
    } catch (exception) {
      if (exception instanceof Yup.ValidationError) {
        showMessage({ message: exception.errors[0], type: 'warning' });
      } else if (exception instanceof AxiosError) {
        const apiError = exception.response?.data as ApiError;
        showMessage({ message: apiError.detail, type: 'danger' });
      } else {
        showMessage({ message: 'Bir hata oluştu', type: 'danger' });
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAwareScrollView
        contentContainerStyle={styles.scrollContent}
        scrollEnabled={isKeyboardVisible}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        bounces={false}
        overScrollMode="never"
        enableOnAndroid
        extraScrollHeight={20}
        enableResetScrollToCoords={false}
        enableAutomaticScroll={false}
      >
        <View style={styles.headerContainer}>
          <View style={styles.logoContainer}>
            <Image source={require('@/assets/images/logo.png')} style={styles.logo} />
          </View>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.description}>
            <Text size="large" fontWeight="800">
              Sign In
            </Text>
            <Text size="medium">Welcome back! Please enter your details.</Text>
          </View>

          <Formik initialValues={initialValues} onSubmit={handleSubmit}>
            {({ handleChange, handleBlur, handleSubmit: formikSubmit, setFieldValue, values }) => (
              <View style={styles.formInputsContainer}>
                <View style={styles.inputGroup}>
                  <Input
                    label="Email Address"
                    placeholder="name@example.com"
                    onChangeText={handleChange('email')}
                    onBlur={handleBlur('email')}
                    value={values.email}
                    icon="mail-line"
                  />
                  <Input
                    label="Password"
                    placeholder="********"
                    onChangeText={handleChange('password')}
                    onBlur={handleBlur('password')}
                    value={values.password}
                    isSecure
                    icon="lock-line"
                  />
                  <View style={styles.additionalOptionsContainer}>
                    <Checkbox
                      label="Remember me"
                      checked={values.rememberMe}
                      onChange={value => setFieldValue('rememberMe', value)}
                    />
                    <TouchableOpacity>
                      <Text size="medium" fontWeight="400" color={colors.orange[500]}>
                        Forgot password?
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.buttonGroup}>
                  <Button
                    loading={loading}
                    title="Sign In"
                    theme="primary"
                    onPress={formikSubmit}
                  />

                  <Divider text="or" />

                  <Button
                    disabled={loading}
                    title="Create account"
                    theme="primary-outline"
                    onPress={() => navigation.navigate('SignUp')}
                  />

                  <Footer />
                </View>
              </View>
            )}
          </Formik>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

export default Login;
