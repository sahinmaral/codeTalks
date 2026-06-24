import React, { useState, useEffect } from 'react';
import { Image, SafeAreaView, TouchableOpacity, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { showMessage } from 'react-native-flash-message';
import { Formik } from 'formik';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/';
import Text from '@/components/Text';
import Footer from '@/components/Footer';
import useThemedStyles from '@/hooks/useThemedStyles';
import makeStyles from './SignUp.styles';
import validationSchema from '../../schemas/SignUpSchema';
import colors from '../../styles/colors';
import { RootStackParamList } from '../../types';
import { ValidationError } from 'yup';
import useKeyboardVisible from '@/hooks/useKeyboardVisible';

interface SignUpProps {
  navigation: NativeStackNavigationProp<RootStackParamList, 'SignUp'>;
}

const initialValues = {
  email: 'mehmetkesici@hotmail.com',
  username: 'mehmetkesici',
  password: 'Abc1234.',
  passwordConfirm: 'Abc1234.',
};

function SignUp({ navigation }: SignUpProps) {
  const styles = useThemedStyles(makeStyles);
  const { isKeyboardVisible } = useKeyboardVisible();

  const handleSubmit = async (values: typeof initialValues) => {
    try {
      await validationSchema.validate(values, { abortEarly: false });
      navigation.navigate('ContinueSignUp', {
        email: values.email,
        password: values.password,
        username: values.username,
      });
    } catch (exception) {
      if (exception instanceof ValidationError) {
        showMessage({ message: exception.errors[0], type: 'warning' });
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAwareScrollView
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
              Create Account
            </Text>
            <Text size="medium">Join the community and start your journey.</Text>
          </View>

          <Formik initialValues={initialValues} onSubmit={handleSubmit}>
            {({ handleChange, handleBlur, handleSubmit: formikSubmit, values }) => (
              <View style={styles.formInputsContainer}>
                <View style={styles.inputGroup}>
                  <Input
                    label="E-mail Address"
                    placeholder="name@example.com"
                    onChangeText={handleChange('email')}
                    onBlur={handleBlur('email')}
                    value={values.email}
                    icon="mail-line"
                  />
                  <Input
                    label="Username"
                    placeholder="name.example"
                    onChangeText={handleChange('username')}
                    onBlur={handleBlur('username')}
                    value={values.username}
                    icon="user-line"
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
                  <Input
                    label="Confirm Password"
                    placeholder="********"
                    onChangeText={handleChange('passwordConfirm')}
                    onBlur={handleBlur('passwordConfirm')}
                    value={values.passwordConfirm}
                    isSecure
                    icon="lock-line"
                  />
                </View>

                <View style={styles.buttonGroup}>
                  <Button
                    title="Next"
                    icon="arrow-right-line"
                    theme="primary"
                    onPress={formikSubmit}
                  />
                  <View style={styles.signInOptionContainer}>
                    <Text>Already have an account? </Text>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                      <Text color={colors.orange[500]} fontWeight="700">
                        Sign In
                      </Text>
                    </TouchableOpacity>
                  </View>
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

export default SignUp;
