import Button from '@/components/Button/';
import Checkbox from '@/components/Checkbox';
import Divider from '@/components/Divider';
import Footer from '@/components/Footer';
import Input from '@/components/Input/Input';
import Text from '@/components/Text';
import useKeyboardVisible from '@/hooks/useKeyboardVisible';
import useThemedStyles from '@/hooks/useThemedStyles';
import { useAppDispatch } from '@/redux/hooks';
import {
  setChannelMuteSettings,
  setNotificationSettings,
  setUser,
} from '@/redux/reducers/appReducer';
import validationSchema from '@/schemas/LoginSchema';
import { fetchLogin } from '@/services/apiServices/auths';
import {
  fetchUserChannelMuteSettings,
  fetchUserNotificationSettings,
} from '@/services/apiServices/users';
import colors from '@/styles/colors';
import { RootStackParamList } from '@/types';
import { getApiErrorMessage } from '@/utils/getApiErrorMessage';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AxiosError } from 'axios';
import { Formik } from 'formik';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, TouchableOpacity, View } from 'react-native';
import { showMessage } from 'react-native-flash-message';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Yup from 'yup';
import makeStyles from './Login.styles';

interface LoginProps {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Login'>;
}

const initialValues = {
  email: '',
  password: '',
  rememberMe: true,
};

function Login({ navigation }: LoginProps) {
  const { t } = useTranslation();
  const styles = useThemedStyles(makeStyles);
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const { isKeyboardVisible } = useKeyboardVisible();
  const insets = useSafeAreaInsets();

  const handleLogin = async (values: typeof initialValues) => {
    setLoading(true);
    try {
      const result = await fetchLogin({
        usernameOrEmail: values.email,
        password: values.password,
        rememberMe: values.rememberMe,
      });
      dispatch(setUser(result.data));

      const [notificationSettings, channelMuteSettings] = await Promise.all([
        fetchUserNotificationSettings(),
        fetchUserChannelMuteSettings(),
      ]);
      dispatch(setNotificationSettings(notificationSettings.data));
      dispatch(setChannelMuteSettings(channelMuteSettings.data));

      showMessage({ message: t('auth.loginSuccess'), type: 'success' });
    } catch (exception) {
      throw exception;
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
        showMessage({ message: t(exception.errors[0]), type: 'warning' });
      } else if (exception instanceof AxiosError) {
        showMessage({ message: getApiErrorMessage(exception), type: 'danger' });
      } else {
        showMessage({ message: t('common.errorOccurred'), type: 'danger' });
      }
    }
  };

  // Only the top inset is applied to the SafeAreaView: letting it reserve the bottom one too would
  // stop the form sheet short of the screen edge and leave a strip of the orange container showing
  // under it. The bottom inset is added as padding inside the sheet instead, so the white
  // background runs to the edge while the buttons still clear the home indicator.
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
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

        <View style={[styles.formContainer, { paddingBottom: Math.max(20, insets.bottom) }]}>
          <View style={styles.description}>
            <Text size="large" fontWeight="800">
              {t('auth.signInTitle')}
            </Text>
            <Text size="medium">{t('auth.signInSubtitle')}</Text>
          </View>

          <Formik initialValues={initialValues} onSubmit={handleSubmit}>
            {({ handleChange, handleBlur, handleSubmit: formikSubmit, setFieldValue, values }) => (
              <View style={styles.formInputsContainer}>
                <View style={styles.inputGroup}>
                  <Input
                    label={t('auth.emailLabel')}
                    placeholder="name@example.com"
                    onChangeText={handleChange('email')}
                    onBlur={handleBlur('email')}
                    value={values.email}
                    icon="mail-line"
                  />
                  <Input
                    label={t('auth.passwordLabel')}
                    placeholder="********"
                    onChangeText={handleChange('password')}
                    onBlur={handleBlur('password')}
                    value={values.password}
                    isSecure
                    icon="lock-line"
                  />
                  <View style={styles.additionalOptionsContainer}>
                    <Checkbox
                      label={t('auth.rememberMe')}
                      checked={values.rememberMe}
                      onChange={value => setFieldValue('rememberMe', value)}
                    />
                    <TouchableOpacity>
                      <Text size="medium" fontWeight="400" color={colors.orange[500]}>
                        {t('auth.forgotPassword')}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.buttonGroup}>
                  <Button
                    loading={loading}
                    title={t('auth.signInButton')}
                    theme="primary"
                    onPress={formikSubmit}
                  />

                  <Divider text={t('auth.or')} />

                  <Button
                    disabled={loading}
                    title={t('auth.createAccountButton')}
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
