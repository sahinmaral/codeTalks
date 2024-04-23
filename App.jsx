import { NavigationContainer } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SignUp from "./src/screens/SignUp";
import Login from "./src/screens/Login";
import ContinueSignUp from "./src/screens/ContinueSignUp";
import colors from "./src/styles/colors";
import Icon from "react-native-remix-icon";
import { Platform, TouchableOpacity } from "react-native";
import { setUser } from "./src/redux/reducers/appReducer";
import { showMessage } from "react-native-flash-message";
import SplashScreen from "react-native-splash-screen";
import { useEffect } from "react";
import useCheckInternet from "./src/hooks/useCheckInternet";
import ActiveChannelList from "./src/screens/ChannelList/ActiveChannelList";
import AllChannelList from "./src/screens/ChannelList/AllChannelList";
import ChannelMessagesList from "./src/screens/ChannelMessagesList";
import CheckInternet from "./src/screens/CheckInternet";
import ChannelDetail from "./src/screens/ChannelDetail";

const Stack = createNativeStackNavigator();

function App() {
  const { user } = useSelector((state) => state.app);

  const { isConnected } = useCheckInternet();

  const dispatch = useDispatch();

  useEffect(() => {
    if (Platform.OS === "android") {
      SplashScreen.hide();
    }
  }, []);

  // const handleLogout = navigation => {
  //   auth()
  //     .signOut()
  //     .then(() => {
  //       dispatch(setUser(null));
  //       showMessage({message: 'Başarıyla çıkış yaptınız', type: 'info'});
  //       navigation.navigate('Login');
  //     });
  // };

  const AuthStack = () => {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="ContinueSignUp" component={ContinueSignUp} />
      </Stack.Navigator>
    );
  };

  const ChannelStack = () => {
    return (
      <Stack.Navigator
        screenOptions={({ navigation }) => ({
          headerShown: true,
          headerTitleStyle: { color: colors.orange[400], fontWeight: "bold" },
        })}
      >
        <Stack.Screen
          name="ActiveChannelList"
          component={ActiveChannelList}
          options={{
            title: "Aktif Kanallar",
            headerRight: () => (
              <TouchableOpacity onPress={() => console.log("Logged out")}>
                <Icon
                  name="logout-box-r-line"
                  color={colors.orange[400]}
                  size={24}
                />
              </TouchableOpacity>
            ),
          }}
        />
        <Stack.Screen
          name="ChannelMessagesList"
          component={ChannelMessagesList}
          options={({ navigation, route }) => ({
            title: `${route.params.channelName}`,
            headerRight: () => (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("ChannelDetail", {
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
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="AllChannelList"
          component={AllChannelList}
          options={{
            title: "Bütün Kanallar"
          }}
        />
      </Stack.Navigator>
    );
  };

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
    <NavigationContainer>
      {!user ? <AuthStack /> : <ChannelStack />}
    </NavigationContainer>
  );
}

export default App;
