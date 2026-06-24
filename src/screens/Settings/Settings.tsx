import CustomToggleSwitch from '@/components/CustomToggleSwitch';
import Header from '@/components/Header';
import Text from '@/components/Text';
import useTheme from '@/hooks/useTheme';
import useThemedStyles from '@/hooks/useThemedStyles';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setThemeMode } from '@/redux/reducers/themeReducer';
import { ThemeMode } from '@/styles/themes';
import { ProfileStackParamList } from '@/types';
import { saveThemeMode } from '@/utils/themeStorage';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-remix-icon';
import makeStyles from './Settings.styles';

type SettingsProps = {
  navigation: NativeStackNavigationProp<ProfileStackParamList, 'Settings'>;
};

const THEME_OPTIONS: { label: string; value: ThemeMode }[] = [
  { label: 'Light', value: 'light' },
  { label: 'Dark', value: 'dark' },
  { label: 'System', value: 'system' },
];

const Settings = ({ navigation }: SettingsProps) => {
  const styles = useThemedStyles(makeStyles);
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const themeMode = useAppSelector(state => state.theme.mode);
  const [settingValues, setSettingValues] = useState({
    showMessageNotification: false,
    alertSound: false,
  });

  const handleThemeModeChange = (mode: ThemeMode) => {
    dispatch(setThemeMode(mode));
    saveThemeMode(mode);
  };

  return (
    <View style={styles.container}>
      <Header
        onBackPress={() => navigation.navigate('MyProfile')}
        title="Settings"
        rightIcon="settings-5-line"
      />

      <ScrollView>
        <View style={styles.cardListContainer}>
          <Text fontWeight="700" color={theme.text.secondary}>
            NOTIFICATIONS
          </Text>
          <View style={styles.listContainer}>
            <TouchableOpacity style={styles.listTopItemContainer}>
              <View style={styles.listItemContentContainer}>
                <Text fontWeight="700">Message Notification</Text>
              </View>
              <View style={styles.listItemOptionContainer}>
                <CustomToggleSwitch
                  value={settingValues.showMessageNotification}
                  onValueChange={() => {
                    setSettingValues(prev => ({
                      ...prev,
                      showMessageNotification: !prev.showMessageNotification,
                    }));
                  }}
                />
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.listBottomItemContainer}>
              <View style={styles.listItemContentContainer}>
                <Text fontWeight="700">Sound</Text>
              </View>
              <View style={styles.listItemOptionContainer}>
                <CustomToggleSwitch
                  value={settingValues.alertSound}
                  onValueChange={() => {
                    setSettingValues(prev => ({
                      ...prev,
                      alertSound: !prev.alertSound,
                    }));
                  }}
                />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.cardListContainer}>
          <Text fontWeight="700" color={theme.text.secondary}>
            APPEARANCE
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
                    <Text fontWeight="700">{option.label}</Text>
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
            PRIVACY & SECURITY
          </Text>
          <View style={styles.listContainer}>
            <TouchableOpacity
              style={styles.listBottomItemContainer}
              onPress={() => {
                navigation.navigate('ChangePassword');
              }}
            >
              <View style={styles.listItemContentContainer}>
                <Text fontWeight="700">Change Password</Text>
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
            ABOUT
          </Text>
          <View style={styles.listContainer}>
            <TouchableOpacity style={styles.listTopItemContainer}>
              <View style={styles.listItemContentContainer}>
                <Text fontWeight="700">App Version</Text>
              </View>
              <View style={styles.listItemOptionContainer}>
                <Text fontWeight="500" color={theme.text.tertiary}>
                  1.0.0
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.listItemContainer}>
              <View style={styles.listItemContentContainer}>
                <Text fontWeight="700">Terms Of Service</Text>
              </View>
              <View style={styles.listItemOptionContainer}>
                <View style={styles.listItemIconContainer}>
                  <Icon name={'ri-arrow-right-s-line'} color={theme.text.tertiary} size={24} />
                </View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.listItemContainer}>
              <View style={styles.listItemContentContainer}>
                <Text fontWeight="700">Privacy Policy</Text>
              </View>
              <View style={styles.listItemOptionContainer}>
                <View style={styles.listItemIconContainer}>
                  <Icon name={'ri-arrow-right-s-line'} color={theme.text.tertiary} size={24} />
                </View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.listBottomItemContainer}>
              <View style={styles.listItemContentContainer}>
                <Text fontWeight="700">Rate App</Text>
              </View>
              <View style={styles.listItemOptionContainer}>
                <View style={styles.listItemIconContainer}>
                  <Icon name={'ri-arrow-right-s-line'} color={theme.text.tertiary} size={24} />
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
