import React, { useState } from "react";
import { SafeAreaView, ActivityIndicator, Text, View } from "react-native";
import Input from "../../components/Input/Input";
import { showMessage } from "react-native-flash-message";
import Button from "../../components/Button/";
import styles from "./SignUp.styles";
import { Formik } from "formik";
import validationSchema from "../../schemas/SignUpSchema";

function SignUp({ navigation }) {
  const initialValues = {
    email: "mehmetkesici@hotmail.com",
    username: "mehmetkesici",
    password: "Abc1234.",
    passwordConfirm: "Abc1234.",
  };

  const handleSubmit = async (values) => {
    try {
      await validationSchema.validate(values, { abortEarly: false });

      navigation.navigate("ContinueSignUp", {
        email: values.email,
        password: values.password,
        username: values.username,
      });
    } catch (exception) {
      showMessage({
        message: exception,
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
                  placeholder={"kullanıcı adınızı giriniz ..."}
                  onChangeText={handleChange("username")}
                  onBlur={handleBlur("username")}
                  value={values.username}
                />
                <Input
                  placeholder={"şifrenizi giriniz ..."}
                  onChangeText={handleChange("password")}
                  onBlur={handleBlur("password")}
                  value={values.password}
                  isSecure
                />
                <Input
                  placeholder={"şifrenizi tekrar giriniz ..."}
                  onChangeText={handleChange("passwordConfirm")}
                  onBlur={handleBlur("passwordConfirm")}
                  value={values.passwordConfirm}
                  isSecure
                />
              </View>

              <View style={styles.form.buttonGroup}>
                <Button
                  title={"Kayıt ol"}
                  theme={"primary"}
                  onPress={handleSubmit}
                />
                <Button
                  title={"Geri"}
                  theme={"secondary"}
                  onPress={() => {
                    navigation.goBack();
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

export default SignUp;
