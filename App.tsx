import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as SplashScreen from 'expo-splash-screen';
import {
  useFonts,
  Montserrat_400Regular,
  Montserrat_700Bold,
  Montserrat_300Light,
  Montserrat_200ExtraLight,
  Montserrat_100Thin,
  Montserrat_800ExtraBold,
  Montserrat_900Black,
  Montserrat_600SemiBold,
  Montserrat_500Medium,
} from '@expo-google-fonts/montserrat';
import { useAppSelector } from './src/redux/hooks';
import { RootStackParamList, MainStackParamList, ProfileStackParamList } from './src/types';
import SignUp from './src/screens/SignUp';
import Login from './src/screens/Login';
import ContinueSignUp from './src/screens/ContinueSignUp';
import ActiveChannelList from './src/screens/ChannelList/ActiveChannelList';
import AllChannelList from './src/screens/ChannelList/AllChannelList';
import ChannelMessagesList from './src/screens/ChannelMessagesList';
import ChannelDetail from './src/screens/ChannelDetail';
import CheckInternet from './src/screens/CheckInternet';
import Header from '@/components/Header';
import CustomBottomTab from '@/components/CustomBottomTab';
import colors from './src/styles/colors';
import useCheckInternet from './src/hooks/useCheckInternet';
import MyProfile from '@/screens/MyProfile';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BubbleContentMenuProvider } from '@/components/BubbleContentMenu';
import Settings from '@/screens/Settings';

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
  <Stack.Navigator
    initialRouteName="ActiveChannelList"
    screenOptions={{
      headerShown: true,
      header: ({ navigation, route, options }) => {
        const { name, params } = route;

        if (name === 'ActiveChannelList') {
          return null;
        }

        if (name === 'ChannelMessagesList') {
          return null;
        }

        if (name === 'ChannelDetail') {
          return (
            <Header
              title="Kanal Detayları"
              showBackButton={true}
              onBackPress={() => navigation.goBack()}
            />
          );
        }

        if (name === 'AllChannelList') {
          return (
            <Header
              title="Bütün Kanallar"
              showBackButton={true}
              onBackPress={() => navigation.goBack()}
            />
          );
        }

        return <Header title="App" />;
      },
    }}
  >
    <Stack.Screen name="ActiveChannelList" component={ActiveChannelList} />
    <Stack.Screen name="ChannelMessagesList" component={ChannelMessagesList} />
    <Stack.Screen name="ChannelDetail" component={ChannelDetail} />
    <Stack.Screen name="AllChannelList" component={AllChannelList} />
  </Stack.Navigator>
);

const ProfileStack = () => (
  <ProfileStackNav.Navigator initialRouteName="MyProfile" screenOptions={{ headerShown: false }}>
    <ProfileStackNav.Screen name="MyProfile" component={MyProfile} />
    <ProfileStackNav.Screen name="Settings" component={Settings} />
  </ProfileStackNav.Navigator>
);

const MainStack = () => (
  <Tab.Navigator
    screenOptions={{ headerShown: false }}
    tabBar={props => <CustomBottomTab {...props} />}
  >
    <Tab.Screen name="Channels" component={ChannelStack} />
    <Tab.Screen name="Explore" component={ChannelStack} />
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
    <GestureHandlerRootView>
      <BubbleContentMenuProvider>
        <NavigationContainer>{!user ? <AuthStack /> : <MainStack />}</NavigationContainer>
      </BubbleContentMenuProvider>
    </GestureHandlerRootView>
  );
}

export default App;
