import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignUp from './src/screens/SignUp';
import Login from './src/screens/Login';
import ContinueSignUp from './src/screens/ContinueSignUp';
import colors from './src/styles/colors';
import Icon from 'react-native-remix-icon';
import { TouchableOpacity } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import useCheckInternet from './src/hooks/useCheckInternet';
import ActiveChannelList from './src/screens/ChannelList/ActiveChannelList';
import AllChannelList from './src/screens/ChannelList/AllChannelList';
import ChannelMessagesList from './src/screens/ChannelMessagesList';
import CheckInternet from './src/screens/CheckInternet';
import ChannelDetail from './src/screens/ChannelDetail';
import { useAppSelector } from './src/redux/hooks';
import { RootStackParamList } from './src/types';
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

const Stack = createNativeStackNavigator<RootStackParamList>();

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

  const AuthStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="SignUp" component={SignUp} />
      <Stack.Screen name="ContinueSignUp" component={ContinueSignUp} />
    </Stack.Navigator>
  );

  const ChannelStack = () => (
    <Stack.Navigator
      screenOptions={() => ({
        headerShown: true,
        headerTitleStyle: { color: colors.orange[400], fontWeight: 'bold' },
      })}
    >
      <Stack.Screen
        name="ActiveChannelList"
        component={ActiveChannelList}
        options={{
          title: 'Aktif Kanallar',
          headerRight: () => (
            <TouchableOpacity onPress={() => console.log('Logged out')}>
              <Icon name="logout-box-r-line" color={colors.orange[400]} size={24} />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="ChannelMessagesList"
        component={ChannelMessagesList}
        options={({ navigation, route }) => ({
          title: route.params.channelName,
          headerRight: () => (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('ChannelDetail', {
                  channelName: route.params.channelName,
                  channelId: route.params.channelId,
                })
              }
            >
              <Icon name="settings-5-line" color={colors.black} size={24} />
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen
        name="ChannelDetail"
        component={ChannelDetail}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AllChannelList"
        component={AllChannelList}
        options={{ title: 'Bütün Kanallar' }}
      />
    </Stack.Navigator>
  );

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
    <NavigationContainer>{!user ? <AuthStack /> : <ChannelStack />}</NavigationContainer>
  );
}

export default App;
