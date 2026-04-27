import React, { useState } from 'react';
import { ActivityIndicator, SafeAreaView, Text, View } from 'react-native';
import Input from '../../components/Input/Input';
import { showMessage } from 'react-native-flash-message';
import Button from '../../components/Button/';
import styles from './Login.styles';
import { Formik } from 'formik';
import validationSchema from '../../schemas/LoginSchema';
import { useAppDispatch } from '../../redux/hooks';
import { setUser } from '../../redux/reducers/appReducer';
import colors from '../../styles/colors';
import { fetchLogin } from '../../services/auths';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';

interface LoginProps {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Login'>;
}

function Login({ navigation }: LoginProps) {
  const initialValues = {
    email: 'mehmetkesici@hotmail.com',
    password: 'Abc1234.',
  };

  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();

  const handleLogin = async (userInformations: typeof initialValues) => {
    try {
      setLoading(true);
      const result = await fetchLogin({
        usernameOrEmail: userInformations.email,
        password: userInformations.password,
      });
      dispatch(setUser(result.data));
      showMessage({ message: 'Başarıyla giriş yaptınız', type: 'info' });
      navigation.navigate('ActiveChannelList');
    } catch {
      throw new Error();
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values: typeof initialValues) => {
    try {
      await validationSchema.validate(values, { abortEarly: false });
      await handleLogin(values);
    } catch {
      showMessage({ message: 'Bir hata oluştu', type: 'danger' });
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
                  placeholder="şifrenizi giriniz ..."
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                  value={values.password}
                  isSecure
                />
              </View>

              <View style={styles.buttonGroup}>
                <Button
                  disabled={loading}
                  icon={loading && <ActivityIndicator size="small" color={colors.white} />}
                  title="Giriş yap"
                  theme="primary"
                  onPress={formikSubmit}
                />
                <Button
                  disabled={loading}
                  title="Kayıt ol"
                  theme="secondary"
                  onPress={() => navigation.navigate('SignUp')}
                />
              </View>
            </View>
          )}
        </Formik>
      </View>
    </SafeAreaView>
  );
}

export default Login;
