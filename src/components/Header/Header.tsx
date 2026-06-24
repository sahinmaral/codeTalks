import Text from '@/components/Text';
import useThemedStyles from '@/hooks/useThemedStyles';
import colors from '@/styles/colors';
import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-remix-icon';
import { SafeAreaView } from 'react-native-safe-area-context';
import makeStyles from './Header.styles';

interface HeaderProps {
  title: string;
  theme?: 'primary' | 'danger';
  description?: string;
  onBackPress?: () => void;
  rightIcon?: string;
  onRightIconPress?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  title,
  description,
  onBackPress,
  rightIcon,
  onRightIconPress,
  theme = 'primary',
}) => {
  const styles = useThemedStyles(makeStyles);
  const backgroundColorStyles = StyleSheet.create({
    primary: { backgroundColor: colors.orange[500] },
    danger: { backgroundColor: colors.red[600] },
  });

  const iconButtonBackgroundColorStyles = StyleSheet.create({
    primary: { backgroundColor: colors.orange[400] },
    danger: { backgroundColor: colors.red[500] },
  });

  return (
    <View style={styles.container}>
      <SafeAreaView edges={['top']} style={[styles.headerContainer, backgroundColorStyles[theme]]}>
        <View style={styles.content}>
          <View style={styles.firstSection}>
            <View style={{ width: 50, alignItems: 'flex-start' }}>
              {onBackPress ? (
                <TouchableOpacity
                  onPress={onBackPress}
                  style={[styles.backButtonContainer, iconButtonBackgroundColorStyles[theme]]}
                >
                  <Icon name="arrow-left-line" color={colors.white} size={24} />
                </TouchableOpacity>
              ) : (
                <View style={[styles.iconButtonContainer, iconButtonBackgroundColorStyles[theme]]}>
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
                <TouchableOpacity
                  onPress={onRightIconPress}
                  style={[styles.iconButtonContainer, iconButtonBackgroundColorStyles[theme]]}
                >
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
