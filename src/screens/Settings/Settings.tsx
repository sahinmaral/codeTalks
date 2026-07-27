import { useConfirmationDialog } from '@/components/ConfirmationDialog';
import CustomToggleSwitch from '@/components/CustomToggleSwitch';
import Header from '@/components/Header';
import Text from '@/components/Text';
import useLogout from '@/hooks/useLogout';
import useTheme from '@/hooks/useTheme';
import useThemedStyles from '@/hooks/useThemedStyles';
import { LanguageMode } from '@/localization/i18n';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setNotificationSettings } from '@/redux/reducers/appReducer';
import { setLanguageMode } from '@/redux/reducers/languageReducer';
import { setThemeMode } from '@/redux/reducers/themeReducer';
import { fetchUpdateUserNotificationSettings } from '@/services/apiServices/users';
import { ThemeMode } from '@/styles/themes';
import { ProfileStackParamList } from '@/types';
import { getApiErrorMessage } from '@/utils/getApiErrorMessage';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AxiosError } from 'axios';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { showMessage } from 'react-native-flash-message';
import Icon from 'react-native-remix-icon';
import makeStyles from './Settings.styles';

type SettingsProps = {
  navigation: NativeStackNavigationProp<ProfileStackParamList, 'Settings'>;
};

const THEME_OPTIONS: { labelKey: string; value: ThemeMode }[] = [
  { labelKey: 'settings.themeLight', value: 'light' },
  { labelKey: 'settings.themeDark', value: 'dark' },
  { labelKey: 'settings.themeSystem', value: 'system' },
];

const LANGUAGE_OPTIONS: { labelKey: string; value: LanguageMode }[] = [
  { labelKey: 'settings.languageEnglish', value: 'en' },
  { labelKey: 'settings.languageTurkish', value: 'tr' },
  { labelKey: 'settings.languageSystem', value: 'system' },
];

const Settings = ({ navigation }: SettingsProps) => {
  const { t } = useTranslation();
  const styles = useThemedStyles(makeStyles);
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const logout = useLogout();
  const { confirm } = useConfirmationDialog();
  const themeMode = useAppSelector(state => state.theme.mode);
  const languageMode = useAppSelector(state => state.language.mode);
  const notificationSetting = useAppSelector(state => state.app.notificationSettings);

  // Derived from the store instead of copied into local state: keeping a second copy is what
  // previously let the screen and redux disagree about the sound setting.
  const isMessageNotificationEnabled = notificationSetting?.isEnabled ?? true;
  const isAlertSoundEnabled = notificationSetting?.isSoundEnabled ?? false;

  const [loading, setLoading] = useState(false);

  const handleThemeModeChange = (mode: ThemeMode) => {
    dispatch(setThemeMode(mode));
  };

  const handleLanguageModeChange = (mode: LanguageMode) => {
    dispatch(setLanguageMode(mode));
  };

  const handleUpdateNotificationSetting = async () => {
    const nextIsSoundEnabled = !isAlertSoundEnabled;
    try {
      setLoading(true);
      await fetchUpdateUserNotificationSettings({ isSoundEnabled: nextIsSoundEnabled });
      dispatch(
        setNotificationSettings({
          isEnabled: isMessageNotificationEnabled,
          isSoundEnabled: nextIsSoundEnabled,
        }),
      );
    } catch (exception) {
      if (exception instanceof AxiosError) {
        showMessage({ message: getApiErrorMessage(exception), type: 'danger' });
      } else {
        showMessage({ message: t('common.errorOccurred'), type: 'danger' });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    confirm({
      theme: 'danger',
      icon: 'logout-box-r-line',
      title: t('settings.logoutConfirmTitle'),
      description: t('settings.logoutConfirmMessage'),
      confirmTitle: t('settings.logout'),
      cancelTitle: t('common.cancel'),
      onConfirm: () => logout(),
    });
  };

  return (
    <View style={styles.container}>
      <Header
        onBackPress={() => navigation.navigate('MyProfile')}
        title={t('settings.title')}
        rightIcon="settings-5-line"
      />

      <ScrollView>
        <View style={styles.cardListContainer}>
          <Text fontWeight="700" color={theme.text.secondary}>
            {t('settings.notifications')}
          </Text>
          <View style={styles.listContainer}>
            <TouchableOpacity style={styles.listTopItemContainer}>
              <View style={styles.listItemContentContainer}>
                <Text fontWeight="700">{t('settings.messageNotification')}</Text>
              </View>
              <View style={styles.listItemOptionContainer}>
                {/* Read-only until the API accepts `isEnabled`; today it only takes
                    `isSoundEnabled`, so there is nothing to save this toggle to. */}
                <CustomToggleSwitch
                  disabled={true}
                  value={isMessageNotificationEnabled}
                  onValueChange={() => {}}
                />
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.listBottomItemContainer}>
              <View style={styles.listItemContentContainer}>
                <Text fontWeight="700">{t('settings.sound')}</Text>
              </View>
              <View style={styles.listItemOptionContainer}>
                <CustomToggleSwitch
                  disabled={loading}
                  value={isAlertSoundEnabled}
                  onValueChange={() => {
                    handleUpdateNotificationSetting();
                  }}
                />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.cardListContainer}>
          <Text fontWeight="700" color={theme.text.secondary}>
            {t('settings.appearance')}
          </Text>
          <View style={styles.listContainer}>
            {THEME_OPTIONS.map((option, index) => {
              const isLast = index === THEME_OPTIONS.length - 1;
              const selected = themeMode === option.value;
              return (
                <TouchableOpacity
                  key={option.value}
                  style={isLast ? styles.listBottomItemContainer : styles.listTopItemContainer}
                  onPress={() => handleThemeModeChange(option.value)}
                >
                  <View style={styles.listItemContentContainer}>
                    <Text fontWeight="700">{t(option.labelKey)}</Text>
                  </View>
                  <View style={styles.listItemOptionContainer}>
                    {selected ? (
                      <View style={styles.listItemIconContainer}>
                        <Icon name={'ri-check-line'} color={theme.primary} size={24} />
                      </View>
                    ) : null}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.cardListContainer}>
          <Text fontWeight="700" color={theme.text.secondary}>
            {t('settings.language')}
          </Text>
          <View style={styles.listContainer}>
            {LANGUAGE_OPTIONS.map((option, index) => {
              const isLast = index === LANGUAGE_OPTIONS.length - 1;
              const selected = languageMode === option.value;
              return (
                <TouchableOpacity
                  key={option.value}
                  style={isLast ? styles.listBottomItemContainer : styles.listTopItemContainer}
                  onPress={() => handleLanguageModeChange(option.value)}
                >
                  <View style={styles.listItemContentContainer}>
                    <Text fontWeight="700">{t(option.labelKey)}</Text>
                  </View>
                  <View style={styles.listItemOptionContainer}>
                    {selected ? (
                      <View style={styles.listItemIconContainer}>
                        <Icon name={'ri-check-line'} color={theme.primary} size={24} />
                      </View>
                    ) : null}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.cardListContainer}>
          <Text fontWeight="700" color={theme.text.secondary}>
            {t('settings.privacySecurity')}
          </Text>
          <View style={styles.listContainer}>
            <TouchableOpacity
              style={styles.listBottomItemContainer}
              onPress={() => {
                navigation.navigate('ChangePassword');
              }}
            >
              <View style={styles.listItemContentContainer}>
                <Text fontWeight="700">{t('settings.changePassword')}</Text>
              </View>
              <View style={styles.listItemOptionContainer}>
                <View style={styles.listItemIconContainer}>
                  <Icon name={'ri-arrow-right-s-line'} color={theme.text.tertiary} size={24} />
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.cardListContainer}>
          <Text fontWeight="700" color={theme.text.secondary}>
            {t('settings.about')}
          </Text>
          <View style={styles.listContainer}>
            <TouchableOpacity style={styles.listTopItemContainer}>
              <View style={styles.listItemContentContainer}>
                <Text fontWeight="700">{t('settings.appVersion')}</Text>
              </View>
              <View style={styles.listItemOptionContainer}>
                <Text fontWeight="500" color={theme.text.tertiary}>
                  1.0.0
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.listItemContainer}
              onPress={() => {
                navigation.navigate('TermsOfService');
              }}
            >
              <View style={styles.listItemContentContainer}>
                <Text fontWeight="700">{t('settings.termsOfService')}</Text>
              </View>
              <View style={styles.listItemOptionContainer}>
                <View style={styles.listItemIconContainer}>
                  <Icon name={'ri-arrow-right-s-line'} color={theme.text.tertiary} size={24} />
                </View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.listBottomItemContainer}
              onPress={() => {
                navigation.navigate('PrivacyPolicy');
              }}
            >
              <View style={styles.listItemContentContainer}>
                <Text fontWeight="700">{t('settings.privacyPolicy')}</Text>
              </View>
              <View style={styles.listItemOptionContainer}>
                <View style={styles.listItemIconContainer}>
                  <Icon name={'ri-arrow-right-s-line'} color={theme.text.tertiary} size={24} />
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.cardListContainer}>
          <View style={styles.listContainer}>
            <TouchableOpacity style={styles.listBottomItemContainer} onPress={handleLogout}>
              <View style={styles.listItemContentContainer}>
                <Text fontWeight="700" color={theme.danger}>
                  {t('settings.logout')}
                </Text>
              </View>
              <View style={styles.listItemOptionContainer}>
                <View style={styles.listItemIconContainer}>
                  <Icon name={'ri-logout-box-r-line'} color={theme.danger} size={24} />
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default Settings;
