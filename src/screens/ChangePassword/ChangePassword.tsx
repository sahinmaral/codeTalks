import Button from '@/components/Button';
import Header from '@/components/Header';
import Input from '@/components/Input';
import Text from '@/components/Text';
import validationSchema from '@/schemas/ChangePasswordSchema';
import { fetchChangeUserPassword } from '@/services/users';
import colors from '@/styles/colors';
import { ProfileStackParamList } from '@/types';
import { getApiErrorMessage } from '@/utils/getApiErrorMessage';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AxiosError } from 'axios';
import { Formik } from 'formik';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { showMessage } from 'react-native-flash-message';
import * as Yup from 'yup';
import styles from './ChangePassword.styles';
import PasswordRequirementsList from './PasswordRequirementsList';

export type PasswordRequirementsType = {
  minLength: boolean;
  includeLowercase: boolean;
  includeUppercase: boolean;
  includeSpecialCharacter: boolean;
};

export const evaluatePasswordRequirements = (password: string): PasswordRequirementsType => ({
  minLength: password.length >= 6,
  includeLowercase: /[a-z]/.test(password),
  includeUppercase: /[A-Z]/.test(password),
  includeSpecialCharacter: /[^A-Za-z0-9]/.test(password),
});

const initialFormValues = { currentPassword: '', newPassword: '', newPasswordRepeat: '' };

type ChangePasswordProps = {
  navigation: NativeStackNavigationProp<ProfileStackParamList, 'ChangePassword'>;
};

function ChangePassword({ navigation }: ChangePasswordProps) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: typeof initialFormValues) => {
    try {
      setLoading(true);
      await validationSchema.validate(values, { abortEarly: false });
      await fetchChangeUserPassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      showMessage({ message: 'Password changed successfully', type: 'success' });
      navigation.goBack();
    } catch (exception) {
      if (exception instanceof Yup.ValidationError) {
        showMessage({ message: exception.errors[0], type: 'warning' });
      } else if (exception instanceof AxiosError) {
        showMessage({ message: getApiErrorMessage(exception), type: 'danger' });
      } else {
        showMessage({ message: 'An error occurred', type: 'danger' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Change Password" onBackPress={() => navigation.goBack()} />

      <Formik initialValues={initialFormValues} onSubmit={handleSubmit}>
        {({ handleChange, handleBlur, handleSubmit: formikSubmit, values }) => (
          <KeyboardAvoidingView
            style={styles.scrollView}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          >
            <ScrollView
              style={styles.scrollView}
              contentContainerStyle={styles.scrollContent}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.description}>
                <Text size="medium" color={colors.gray[400]}>
                  Keep your account secure with a strong password.
                </Text>
              </View>

              <Input
                label="Current Password"
                placeholder="********"
                isSecure
                onChangeText={handleChange('currentPassword')}
                onBlur={handleBlur('currentPassword')}
                value={values.currentPassword}
              />

              <Input
                label="New Password"
                placeholder="********"
                isSecure
                onChangeText={handleChange('newPassword')}
                onBlur={handleBlur('newPassword')}
                value={values.newPassword}
              />

              <Input
                label="Confirm New Password"
                placeholder="********"
                isSecure
                onChangeText={handleChange('newPasswordRepeat')}
                onBlur={handleBlur('newPasswordRepeat')}
                value={values.newPasswordRepeat}
              />

              <PasswordRequirementsList
                passwordRequirements={evaluatePasswordRequirements(values.newPassword)}
              />

              <Button
                title={loading ? 'Saving password...' : 'Save Password'}
                disabled={loading}
                loading={loading}
                onPress={formikSubmit}
              />
            </ScrollView>
          </KeyboardAvoidingView>
        )}
      </Formik>
    </View>
  );
}

export default ChangePassword;
