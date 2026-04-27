import React from 'react';
import { SafeAreaView, Text, View } from 'react-native';
import Input from '../../components/Input/Input';
import { showMessage } from 'react-native-flash-message';
import Button from '../../components/Button/';
import styles from './SignUp.styles';
import { Formik } from 'formik';
import validationSchema from '../../schemas/SignUpSchema';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';

interface SignUpProps {
  navigation: NativeStackNavigationProp<RootStackParamList, 'SignUp'>;
}

function SignUp({ navigation }: SignUpProps) {
  const initialValues = {
    email: 'mehmetkesici@hotmail.com',
    username: 'mehmetkesici',
    password: 'Abc1234.',
    passwordConfirm: 'Abc1234.',
  };

  const handleSubmit = async (values: typeof initialValues) => {
    try {
      await validationSchema.validate(values, { abortEarly: false });
      navigation.navigate('ContinueSignUp', {
        email: values.email,
        password: values.password,
        username: values.username,
      });
    } catch (exception) {
      showMessage({ message: String(exception), type: 'danger' });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>codetalks</Text>
      </View>

      <View style={styles.formContainer}>
        <Formik initialValues={initialValues} onSubmit={handleSubmit}>
          {({ handleChange, handleBlur, handleSubmit: formikSubmit, values }) => (
            <View>
              <View style={styles.inputGroup}>
                <Input
                  placeholder="e-postanızı giriniz ..."
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  value={values.email}
                />
                <Input
                  placeholder="kullanıcı adınızı giriniz ..."
                  onChangeText={handleChange('username')}
                  onBlur={handleBlur('username')}
                  value={values.username}
                />
                <Input
                  placeholder="şifrenizi giriniz ..."
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                  value={values.password}
                  isSecure
                />
                <Input
                  placeholder="şifrenizi tekrar giriniz ..."
                  onChangeText={handleChange('passwordConfirm')}
                  onBlur={handleBlur('passwordConfirm')}
                  value={values.passwordConfirm}
                  isSecure
                />
              </View>

              <View style={styles.buttonGroup}>
                <Button title="Kayıt ol" theme="primary" onPress={formikSubmit} />
                <Button
                  title="Geri"
                  theme="secondary"
                  onPress={() => navigation.goBack()}
                />
              </View>
            </View>
          )}
        </Formik>
      </View>
    </SafeAreaView>
  );
}

export default SignUp;
