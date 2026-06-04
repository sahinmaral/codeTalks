import React from 'react';
import { View, TouchableOpacity, StyleSheet, Image } from 'react-native';
import Icon from 'react-native-remix-icon';
import { SafeAreaView } from 'react-native-safe-area-context';
import colors from '@/styles/colors';
import styles from './Header.styles';
import Text from '@/components/Text';

interface HeaderProps {
  title: string;
  description?: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  rightIcon?: string;
  onRightIconPress?: () => void;
  showRightIcon?: boolean;
}

const Header: React.FC<HeaderProps> = ({
  title,
  description,
  showBackButton = false,
  onBackPress,
  rightIcon,
  onRightIconPress,
  showRightIcon = false,
}) => {
  return (
    <View style={styles.container}>
      <SafeAreaView edges={['top']} style={styles.headerContainer}>
        <View style={styles.content}>
          <View style={styles.firstSection}>
            <View style={{ width: 50, alignItems: 'flex-start' }}>
              {showBackButton && onBackPress ? (
                <TouchableOpacity onPress={onBackPress} style={styles.backButtonContainer}>
                  <Icon name="arrow-left-line" color={colors.white} size={24} />
                </TouchableOpacity>
              ) : (
                <View style={styles.iconButtonContainer}>
                  <Image source={require('@/assets/images/logo.png')} style={styles.logo} />
                </View>
              )}
            </View>
            <View style={{ flex: 1, paddingHorizontal: 8 }}>
              <Text
                style={{ textAlign: 'center' }}
                size="large"
                color={colors.white}
                fontWeight="700"
                numberOfLines={2}
                ellipsizeMode="tail"
              >
                {title}
              </Text>
            </View>
            <View style={{ width: 50, alignItems: 'flex-end' }}>
              {rightIcon ? (
                <TouchableOpacity onPress={onRightIconPress} style={styles.iconButtonContainer}>
                  <Icon name={rightIcon} color={colors.white} size={24} />
                </TouchableOpacity>
              ) : null}
            </View>
          </View>

          {description ? (
            <View style={styles.secondSection}>
              <Text size="medium" color={colors.white} fontWeight="300">
                {description}
              </Text>
            </View>
          ) : null}
        </View>
      </SafeAreaView>
    </View>
  );
};

export default Header;
