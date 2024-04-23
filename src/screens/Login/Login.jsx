import { ActivityIndicator, SafeAreaView, Text, View } from "react-native";
import Input from "../../components/Input/Input";
import { showMessage } from "react-native-flash-message";
import Button from "../../components/Button/";
import styles from "./Login.styles";
import { Formik } from "formik";
import validationSchema from "../../schemas/LoginSchema";
import { useDispatch } from "react-redux";
import { setUser } from "../../redux/reducers/appReducer";
import { useState } from "react";
import colors from "../../styles/colors";
import { fetchLogin } from "../../services/auths";

function Login({ navigation }) {
  const initialValues = {
    email: "mehmetkesici@hotmail.com",
    password: "Abc1234.",
  };

  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const handleLogin = async (userInformations) => {
    try {
      setLoading(true);

      const result = await fetchLogin(userInformations);
      
      dispatch(setUser(result.data));
      showMessage({
        message: 'Başarıyla giriş yaptınız',
        type: 'info',
      });
      navigation.navigate('ActiveChannelList');
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values) => {
    try {
      await validationSchema.validate(values, { abortEarly: false });

      await handleLogin({
        usernameOrEmail: values.email,
        password: values.password,
      });
    } catch (exception) {
      console.log(exception);

      showMessage({
        message: "Bir hata oluştu",
        type: "danger",
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header.container}>
        <Text style={styles.header.text}>codetalks</Text>
      </View>

      <View style={styles.form.container}>
        <Formik initialValues={initialValues} onSubmit={handleSubmit}>
          {({ handleChange, handleBlur, handleSubmit, values }) => (
            <View>
              <View style={styles.form.inputGroup}>
                <Input
                  placeholder={"e-postanızı giriniz ..."}
                  onChangeText={handleChange("email")}
                  onBlur={handleBlur("email")}
                  value={values.email}
                />
                <Input
                  placeholder={"şifrenizi giriniz ..."}
                  onChangeText={handleChange("password")}
                  onBlur={handleBlur("password")}
                  value={values.password}
                  isSecure
                />
              </View>

              <View style={styles.form.buttonGroup}>
                <Button
                  disabled={loading}
                  icon={
                    loading && (
                      <ActivityIndicator size={"small"} color={colors.white} />
                    )
                  }
                  title={"Giriş yap"}
                  theme={"primary"}
                  onPress={handleSubmit}
                />
                <Button
                  disabled={loading}
                  title={"Kayıt ol"}
                  theme={"secondary"}
                  onPress={() => {
                    navigation.navigate("SignUp");
                  }}
                />
              </View>
            </View>
          )}
        </Formik>
      </View>
    </SafeAreaView>
  );
}

export default Login;
