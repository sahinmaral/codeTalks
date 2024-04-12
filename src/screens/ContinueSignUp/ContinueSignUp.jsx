import React, { useState } from "react";
import { SafeAreaView, ActivityIndicator, Text, View } from "react-native";
import Input from "../../components/Input/Input";
import { showMessage } from "react-native-flash-message";
import Button from "../../components/Button";
import styles from "./ContinueSignUp.styles";
import { Formik } from "formik";
import validationSchema from "../../schemas/ContinueSignUpSchema";
import { fetchSignUp } from "../../services/auths";

function ContinueSignUp({ navigation, route }) {
  const [loading, setLoading] = useState(false);

  const initialValues = {
    firstName: "Mehmet",
    middleName: null,
    lastName: "Kesici",
    phoneNumber: "05385526462",
    ...route.params,
  };

  const handleSignUp = async (user) => {
    try {
      setLoading(true);

      const result = await fetchSignUp(user);
      console.log(result);

      showMessage({
        message: "Başarıyla kaydınız gerçekleşti",
        type: "info",
      });

      navigation.navigate("Login");
    } catch (error) {
      console.log(error);
      showMessage({
        message: "Bir hata oluştu",
        type: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values) => {
    try {
      await validationSchema.validate(values, { abortEarly: false });

      console.log(values);
      await handleSignUp(values);
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
                  placeholder={"adınızı giriniz ..."}
                  onChangeText={handleChange("firstName")}
                  onBlur={handleBlur("firstName")}
                  value={values.firstName}
                />
                <Input
                  placeholder={"varsa ikinci adınızı giriniz ..."}
                  onChangeText={handleChange("middleName")}
                  onBlur={handleBlur("middleName")}
                  value={values.middleName}
                />
                <Input
                  placeholder={"soyadınızı giriniz ..."}
                  onChangeText={handleChange("lastName")}
                  onBlur={handleBlur("lastName")}
                  value={values.lastName}
                />
                <Input
                  placeholder={"telefon numaranızı giriniz ..."}
                  onChangeText={handleChange("phoneNumber")}
                  onBlur={handleBlur("phoneNumber")}
                  value={values.phoneNumber}
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

export default ContinueSignUp;
