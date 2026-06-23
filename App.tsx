import { BubbleContentMenuProvider } from '@/components/BubbleContentMenu';
import { ConfirmationDialogProvider } from '@/components/ConfirmationDialog';
import CustomBottomTab from '@/components/CustomBottomTab';
import ChangePassword from '@/screens/ChangePassword';
import ChannelBannedMembersList from '@/screens/ChannelBannedMembersList';
import ChannelMembersList from '@/screens/ChannelMembersList';
import ChannelPendingJoinRequestsList from '@/screens/ChannelPendingJoinRequestsList';
import MyProfile from '@/screens/MyProfile';
import RemoveMemberFromChannel from '@/screens/RemoveMemberFromChannel';
import Settings from '@/screens/Settings';
import {
  Montserrat_100Thin,
  Montserrat_200ExtraLight,
  Montserrat_300Light,
  Montserrat_400Regular,
  Montserrat_500Medium,
  Montserrat_600SemiBold,
  Montserrat_700Bold,
  Montserrat_800ExtraBold,
  Montserrat_900Black,
  useFonts,
} from '@expo-google-fonts/montserrat';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import useCheckInternet from './src/hooks/useCheckInternet';
import { useAppSelector } from './src/redux/hooks';
import ChannelDetail from './src/screens/ChannelDetail';
import ActiveChannelList from './src/screens/ChannelList/ActiveChannelList';
import AllChannelList from './src/screens/ChannelList/AllChannelList';
import ChannelMessagesList from './src/screens/ChannelMessagesList';
import CheckInternet from './src/screens/CheckInternet';
import ContinueSignUp from './src/screens/ContinueSignUp';
import Login from './src/screens/Login';
import SignUp from './src/screens/SignUp';
import colors from './src/styles/colors';
import { MainStackParamList, ProfileStackParamList, RootStackParamList } from './src/types';

const Stack = createNativeStackNavigator<RootStackParamList>();
const ProfileStackNav = createNativeStackNavigator<ProfileStackParamList>();
const Tab = createBottomTabNavigator<MainStackParamList>();

const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={Login} />
    <Stack.Screen name="SignUp" component={SignUp} />
    <Stack.Screen name="ContinueSignUp" component={ContinueSignUp} />
  </Stack.Navigator>
);

const ChannelStack = () => (
  <Stack.Navigator initialRouteName="ActiveChannelList" screenOptions={{ headerShown: false }}>
    <Stack.Screen name="ActiveChannelList" component={ActiveChannelList} />
    <Stack.Screen name="ChannelMessagesList" component={ChannelMessagesList} />
    <Stack.Screen name="ChannelDetail" component={ChannelDetail} />
    <Stack.Screen name="ChannelMembersList" component={ChannelMembersList} />
    <Stack.Screen
      name="ChannelPendingJoinRequestsList"
      component={ChannelPendingJoinRequestsList}
    />
    <Stack.Screen name="ChannelBannedMembersList" component={ChannelBannedMembersList} />
    <Stack.Screen name="RemoveMemberFromChannel" component={RemoveMemberFromChannel} />
  </Stack.Navigator>
);

const ExploreStack = () => (
  <Stack.Navigator initialRouteName="AllChannelList" screenOptions={{ headerShown: false }}>
    <Stack.Screen name="AllChannelList" component={AllChannelList} />
  </Stack.Navigator>
);

const ProfileStack = () => (
  <ProfileStackNav.Navigator initialRouteName="MyProfile" screenOptions={{ headerShown: false }}>
    <ProfileStackNav.Screen name="MyProfile" component={MyProfile} />
    <ProfileStackNav.Screen name="Settings" component={Settings} />
    <ProfileStackNav.Screen name="ChangePassword" component={ChangePassword} />
  </ProfileStackNav.Navigator>
);

const MainStack = () => (
  <Tab.Navigator
    screenOptions={{ headerShown: false }}
    tabBar={props => <CustomBottomTab {...props} />}
  >
    <Tab.Screen name="Channels" component={ChannelStack} />
    <Tab.Screen name="Explore" component={ExploreStack} />
    <Tab.Screen name="Profile" component={ProfileStack} />
  </Tab.Navigator>
);

function App() {
  const user = useAppSelector(state => state.app.user);
  const { isConnected } = useCheckInternet();
  const [fontsLoaded] = useFonts({
    Montserrat_100: Montserrat_100Thin,
    Montserrat_200: Montserrat_200ExtraLight,
    Montserrat_300: Montserrat_300Light,
    Montserrat_400: Montserrat_400Regular,
    Montserrat_500: Montserrat_500Medium,
    Montserrat_600: Montserrat_600SemiBold,
    Montserrat_700: Montserrat_700Bold,
    Montserrat_800: Montserrat_800ExtraBold,
    Montserrat_900: Montserrat_900Black,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  if (!isConnected) {
    return (
      <CheckInternet
        styles={{
          container: { backgroundColor: colors.orange[500] },
          text: { color: colors.white },
        }}
      />
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ConfirmationDialogProvider>
        <NavigationContainer>
          <BubbleContentMenuProvider>
            {!user ? <AuthStack /> : <MainStack />}
          </BubbleContentMenuProvider>
        </NavigationContainer>
      </ConfirmationDialogProvider>
    </GestureHandlerRootView>
  );
}

export default App;
