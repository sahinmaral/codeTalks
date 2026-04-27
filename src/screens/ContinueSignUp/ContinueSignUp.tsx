import React, { useState } from 'react';
import { SafeAreaView, ActivityIndicator, Text, View } from 'react-native';
import Input from '../../components/Input/Input';
import { showMessage } from 'react-native-flash-message';
import Button from '../../components/Button';
import styles from './ContinueSignUp.styles';
import { Formik } from 'formik';
import validationSchema from '../../schemas/ContinueSignUpSchema';
import { fetchSignUp } from '../../services/auths';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../types';

interface ContinueSignUpProps {
  navigation: NativeStackNavigationProp<RootStackParamList, 'ContinueSignUp'>;
  route: RouteProp<RootStackParamList, 'ContinueSignUp'>;
}

function ContinueSignUp({ navigation, route }: ContinueSignUpProps) {
  const [loading, setLoading] = useState(false);

  const initialValues = {
    firstName: 'Mehmet',
    middleName: null as string | null,
    lastName: 'Kesici',
    phoneNumber: '05385526462',
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
    } catch {
      showMessage({ message: 'Bir hata oluştu', type: 'danger' });
    } finally {
      setLoading(false);
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
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>codetalks</Text>
      </View>

      <View style={styles.formContainer}>
        <Formik initialValues={initialValues} onSubmit={handleSubmit}>
          {({ handleChange, handleBlur, handleSubmit: formikSubmit, values }) => (
            <View>
              <View style={styles.inputGroup}>
                <Input
                  placeholder="adınızı giriniz ..."
                  onChangeText={handleChange('firstName')}
                  onBlur={handleBlur('firstName')}
                  value={values.firstName}
                />
                <Input
                  placeholder="varsa ikinci adınızı giriniz ..."
                  onChangeText={handleChange('middleName')}
                  onBlur={handleBlur('middleName')}
                  value={values.middleName ?? ''}
                />
                <Input
                  placeholder="soyadınızı giriniz ..."
                  onChangeText={handleChange('lastName')}
                  onBlur={handleBlur('lastName')}
                  value={values.lastName}
                />
                <Input
                  placeholder="telefon numaranızı giriniz ..."
                  onChangeText={handleChange('phoneNumber')}
                  onBlur={handleBlur('phoneNumber')}
                  value={values.phoneNumber}
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

export default ContinueSignUp;
