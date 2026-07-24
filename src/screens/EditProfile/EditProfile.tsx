import { useBubbleContentMenu } from '@/components/BubbleContentMenu';
import UpdateProfilePhotoModal from '@/components/BubbleContentMenu/Contents/UpdateProfilePhotoModal';
import Button from '@/components/Button';
import Header from '@/components/Header';
import Input from '@/components/Input';
import Text from '@/components/Text';
import UserAvatar from '@/components/UserAvatar';
import useTheme from '@/hooks/useTheme';
import useThemedStyles from '@/hooks/useThemedStyles';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setProfile, setUser } from '@/redux/reducers/appReducer';
import validationSchema from '@/schemas/EditProfileSchema';
import { fetchUpdateUserProfile } from '@/services/apiServices/users';
import colors from '@/styles/colors';
import { ProfileStackParamList } from '@/types';
import { notifyApiError } from '@/utils/notifyApiError';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Formik } from 'formik';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, View } from 'react-native';
import { showMessage } from 'react-native-flash-message';
import Icon from 'react-native-remix-icon';
import * as Yup from 'yup';
import makeStyles from './EditProfile.styles';

const BIO_MAX_LENGTH = 300;

type EditProfileProps = {
  navigation: NativeStackNavigationProp<ProfileStackParamList, 'EditProfile'>;
};

function EditProfile({ navigation }: EditProfileProps) {
  const { t } = useTranslation();
  const styles = useThemedStyles(makeStyles);
  const theme = useTheme();
  const [loading, setLoading] = useState(false);

  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.app.user);
  const profile = user?.profile ?? null;

  const { show } = useBubbleContentMenu();

  const initialFormValues = {
    firstName: user?.firstName ?? '',
    middleName: user?.middleName ?? '',
    lastName: user?.lastName ?? '',
    bio: profile?.bio ?? '',
  };

  const handleSubmit = async (values: typeof initialFormValues) => {
    try {
      setLoading(true);
      await validationSchema.validate(values, { abortEarly: false });

      const firstName = values.firstName.trim();
      const middleName = values.middleName.trim() || null;
      const lastName = values.lastName.trim();
      const bio = values.bio.trim() || null;

      await fetchUpdateUserProfile({ firstName, middleName, lastName, bio });

      if (user) {
        dispatch(setUser({ ...user, firstName, middleName, lastName }));
      }
      if (profile) {
        dispatch(setProfile({ ...profile, bio }));
      }

      showMessage({ message: t('profile.profileUpdated'), type: 'success' });
      navigation.goBack();
    } catch (exception) {
      if (exception instanceof Yup.ValidationError) {
        showMessage({ message: t(exception.errors[0]), type: 'warning' });
      } else {
        notifyApiError(exception);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header title={t('profile.editProfile')} onBackPress={() => navigation.goBack()} />

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
              <View style={styles.avatarSection}>
                <TouchableOpacity
                  style={styles.avatarWrapper}
                  onPress={() => show(<UpdateProfilePhotoModal />)}
                >
                  <UserAvatar uri={user?.profilePhotoURL} size={90} />
                  <View style={styles.cameraBadge}>
                    <Icon name="camera-fill" color={colors.white} size={16} />
                  </View>
                </TouchableOpacity>
                <Text color={colors.orange[500]} fontWeight="600">
                  {t('profile.changePhoto')}
                </Text>
              </View>

              <Text
                size="small"
                fontWeight="700"
                color={theme.text.secondary}
                uppercase
                style={styles.sectionLabel}
              >
                {t('profile.personalInfo')}
              </Text>

              <View style={styles.card}>
                <Input
                  label={t('profile.firstNameLabel')}
                  icon="user-line"
                  placeholder={t('profile.firstNamePlaceholder')}
                  onChangeText={handleChange('firstName')}
                  onBlur={handleBlur('firstName')}
                  value={values.firstName}
                />

                <Input
                  label={t('profile.middleNameLabel')}
                  icon="user-line"
                  placeholder={t('profile.middleNamePlaceholder')}
                  labelRight={
                    <View style={styles.optionalBadge}>
                      <Text size="small" fontWeight="600" color={theme.text.tertiary}>
                        {t('profile.optional')}
                      </Text>
                    </View>
                  }
                  onChangeText={handleChange('middleName')}
                  onBlur={handleBlur('middleName')}
                  value={values.middleName}
                />

                <Input
                  label={t('profile.lastNameLabel')}
                  icon="user-line"
                  placeholder={t('profile.lastNamePlaceholder')}
                  onChangeText={handleChange('lastName')}
                  onBlur={handleBlur('lastName')}
                  value={values.lastName}
                />

                <Input
                  label={t('profile.bioLabel')}
                  placeholder={t('profile.bioPlaceholder')}
                  multiline
                  numberOfLines={4}
                  maxLength={BIO_MAX_LENGTH}
                  showCharacterCount
                  helperText={t('profile.bioPlaceholder')}
                  onChangeText={handleChange('bio')}
                  onBlur={handleBlur('bio')}
                  value={values.bio}
                />
              </View>

              <Button
                title={loading ? t('profile.savingChanges') : t('profile.saveChanges')}
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

export default EditProfile;
