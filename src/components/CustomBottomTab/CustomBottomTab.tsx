import useTheme from '@/hooks/useTheme';
import useThemedStyles from '@/hooks/useThemedStyles';
import { useAppSelector } from '@/redux/hooks';
import colors from '@/styles/colors';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-remix-icon';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import makeStyles from './CustomBottomTab.styles';

const TAB_ICONS: Record<string, { active: string; inactive: string }> = {
  Channels: { active: 'chat-3-fill', inactive: 'chat-3-line' },
  Explore: { active: 'compass-3-fill', inactive: 'compass-3-line' },
  Profile: { active: 'user-3-fill', inactive: 'user-3-line' },
};

const HIDDEN_ON_ROUTES = ['ChannelMessagesList'];

const CustomBottomTab: React.FC<BottomTabBarProps> = ({ state, descriptors, navigation }) => {
  const styles = useThemedStyles(makeStyles);
  const theme = useTheme();
  const totalUnreadCount = useAppSelector(state => state.app.totalUnreadCount);
  const focusedRoute = state.routes[state.index];
  const focusedChildName = getFocusedRouteNameFromRoute(focusedRoute);
  if (focusedChildName && HIDDEN_ON_ROUTES.includes(focusedChildName)) {
    return null;
  }

  const { bottom } = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingBottom: bottom }]}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;
        const icons = TAB_ICONS[route.name] ?? { active: 'circle-fill', inactive: 'circle-line' };
        const label =
          options.tabBarLabel !== undefined
            ? String(options.tabBarLabel)
            : options.title !== undefined
              ? options.title
              : route.name;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({ type: 'tabLongPress', target: route.key });
        };

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.tab}
          >
            <View>
              <Icon
                name={isFocused ? icons.active : icons.inactive}
                size={24}
                color={isFocused ? colors.orange[500] : theme.text.tertiary}
              />
              {route.name === 'Channels' && totalUnreadCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>
                    {totalUnreadCount > 99 ? '99+' : totalUnreadCount}
                  </Text>
                </View>
              )}
            </View>
            <Text
              style={[
                styles.label,
                { color: isFocused ? colors.orange[500] : theme.text.tertiary },
              ]}
            >
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default CustomBottomTab;
