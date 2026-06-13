import CustomToggleSwitch from '@/components/CustomToggleSwitch';
import Header from '@/components/Header';
import Text from '@/components/Text';
import colors from '@/styles/colors';
import { ProfileStackParamList } from '@/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-remix-icon';
import styles from './Settings.styles';

type SettingsProps = {
  navigation: NativeStackNavigationProp<ProfileStackParamList, 'Settings'>;
};

const Settings = ({ navigation }: SettingsProps) => {
  const [settingValues, setSettingValues] = useState({
    showMessageNotification: false,
    alertSound: false,
    darkMode: false,
  });

  return (
    <View style={styles.container}>
      <Header
        onBackPress={() => navigation.navigate('MyProfile')}
        title="Settings"
        rightIcon="settings-5-line"
      />

      <ScrollView>
        <View style={styles.cardListContainer}>
          <Text fontWeight="700" color={colors.gray[500]}>
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
          <Text fontWeight="700" color={colors.gray[500]}>
            APPEARANCE
          </Text>
          <View style={styles.listContainer}>
            <TouchableOpacity style={styles.listTopItemContainer}>
              <View style={styles.listItemContentContainer}>
                <Text fontWeight="700">Dark Mode</Text>
              </View>
              <View style={styles.listItemOptionContainer}>
                <CustomToggleSwitch
                  value={settingValues.darkMode}
                  onValueChange={() => {
                    setSettingValues(prev => ({
                      ...prev,
                      darkMode: !prev.darkMode,
                    }));
                  }}
                />
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.listBottomItemContainer}>
              <View style={styles.listItemContentContainer}>
                <Text fontWeight="700">Language</Text>
              </View>
              <View style={styles.listItemOptionContainer}></View>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.cardListContainer}>
          <Text fontWeight="700" color={colors.gray[500]}>
            PRIVACY & SECURITY
          </Text>
          <View style={styles.listContainer}>
            <TouchableOpacity
              style={styles.listTopItemContainer}
              onPress={() => {
                navigation.navigate('ChangePassword');
              }}
            >
              <View style={styles.listItemContentContainer}>
                <Text fontWeight="700">Change Password</Text>
              </View>
              <View style={styles.listItemOptionContainer}>
                <View style={styles.listItemIconContainer}>
                  <Icon name={'ri-arrow-right-s-line'} color={colors.gray[400]} size={24} />
                </View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.listBottomItemContainer}>
              <View style={styles.listItemContentContainer}>
                <Text fontWeight="700">Block List</Text>
              </View>
              <View style={styles.listItemOptionContainer}>
                <View style={styles.listItemIconContainer}>
                  <Icon name={'ri-arrow-right-s-line'} color={colors.gray[400]} size={24} />
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.cardListContainer}>
          <Text fontWeight="700" color={colors.gray[500]}>
            ABOUT
          </Text>
          <View style={styles.listContainer}>
            <TouchableOpacity style={styles.listTopItemContainer}>
              <View style={styles.listItemContentContainer}>
                <Text fontWeight="700">App Version</Text>
              </View>
              <View style={styles.listItemOptionContainer}>
                <Text fontWeight="500" color={colors.gray[400]}>
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
                  <Icon name={'ri-arrow-right-s-line'} color={colors.gray[400]} size={24} />
                </View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.listItemContainer}>
              <View style={styles.listItemContentContainer}>
                <Text fontWeight="700">Privacy Policy</Text>
              </View>
              <View style={styles.listItemOptionContainer}>
                <View style={styles.listItemIconContainer}>
                  <Icon name={'ri-arrow-right-s-line'} color={colors.gray[400]} size={24} />
                </View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.listBottomItemContainer}>
              <View style={styles.listItemContentContainer}>
                <Text fontWeight="700">Rate App</Text>
              </View>
              <View style={styles.listItemOptionContainer}>
                <View style={styles.listItemIconContainer}>
                  <Icon name={'ri-arrow-right-s-line'} color={colors.gray[400]} size={24} />
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
