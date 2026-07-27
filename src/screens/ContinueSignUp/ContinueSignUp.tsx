import Footer from '@/components/Footer';
import Text from '@/components/Text';
import useKeyboardVisible from '@/hooks/useKeyboardVisible';
import useThemedStyles from '@/hooks/useThemedStyles';
import { fetchSignUp } from '@/services/apiServices/auths';
import { getApiErrorMessage } from '@/utils/getApiErrorMessage';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AxiosError } from 'axios';
import { Formik } from 'formik';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, SafeAreaView, View } from 'react-native';
import { showMessage } from 'react-native-flash-message';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import * as Yup from 'yup';
import Button from '../../components/Button';
import Input from '../../components/Input/Input';
import validationSchema from '../../schemas/ContinueSignUpSchema';
import { RootStackParamList } from '../../types';
import makeStyles from './ContinueSignUp.styles';

interface ContinueSignUpProps {
  navigation: NativeStackNavigationProp<RootStackParamList, 'ContinueSignUp'>;
  route: RouteProp<RootStackParamList, 'ContinueSignUp'>;
}

function ContinueSignUp({ navigation, route }: ContinueSignUpProps) {
  const { t } = useTranslation();
  const styles = useThemedStyles(makeStyles);
  const [loading, setLoading] = useState(false);
  const { isKeyboardVisible } = useKeyboardVisible();

  const initialValues = {
    firstName: '',
    middleName: null as string | null,
    lastName: '',
    ...route.params,
  };

  const handleSignUp = async (user: typeof initialValues) => {
    try {
      setLoading(true);
      await fetchSignUp({
        ...user,
        middleName: user.middleName ?? undefined,
      });
      showMessage({ message: t('auth.signUpSuccess'), type: 'info' });
      navigation.navigate('Login');
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        showMessage({ message: t('auth.enterRemainingInputs'), type: 'warning' });
      } else if (error instanceof AxiosError) {
        showMessage({ message: getApiErrorMessage(error), type: 'danger' });
      } else {
        showMessage({ message: t('common.errorOccurred'), type: 'danger' });
      }
    }
  };

  const handleSubmit = async (values: typeof initialValues) => {
    try {
      await validationSchema.validate(values, { abortEarly: false });
      await handleSignUp(values);
    } catch (exception) {
      if (exception instanceof Yup.ValidationError) {
        showMessage({ message: t(exception.errors[0]), type: 'warning' });
      } else {
        showMessage({ message: t('common.errorOccurred'), type: 'danger' });
      }
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
              {t('auth.personalDetailsTitle')}
            </Text>
            <Text size="medium">{t('auth.personalDetailsSubtitle')}</Text>
          </View>

          <View style={styles.formInputsContainer}>
            <Formik initialValues={initialValues} onSubmit={handleSubmit}>
              {({ handleChange, handleBlur, handleSubmit: formikSubmit, values }) => (
                <View style={{ flex: 1 }}>
                  <View style={styles.inputGroup}>
                    <Input
                      label={t('auth.firstNameLabel')}
                      placeholder="John"
                      onChangeText={handleChange('firstName')}
                      onBlur={handleBlur('firstName')}
                      value={values.firstName}
                    />
                    <Input
                      label={t('auth.middleNameLabel')}
                      placeholder="Jae"
                      onChangeText={handleChange('middleName')}
                      onBlur={handleBlur('middleName')}
                      value={values.middleName ?? ''}
                    />
                    <Input
                      label={t('auth.lastNameLabel')}
                      placeholder="Doe"
                      onChangeText={handleChange('lastName')}
                      onBlur={handleBlur('lastName')}
                      value={values.lastName}
                    />
                  </View>

                  <View style={styles.buttonGroup}>
                    <Button
                      loading={loading}
                      title={t('auth.createAccountTitle')}
                      theme="primary"
                      onPress={formikSubmit}
                    />
                    <Button
                      title={t('auth.backButton')}
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
