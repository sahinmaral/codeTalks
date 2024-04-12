import React, { useState } from "react";
import Button from "../../Button";
import { ActivityIndicator, Text, TextInput, TouchableOpacity, View } from "react-native";
import styles from "./ChannelCreateModalContent.styles";
import { showMessage } from "react-native-flash-message";
import { Formik } from "formik";
import validationSchema from "../../../schemas/CreateChannelSchema";
import { useSelector } from "react-redux";
import { fetchCreateChannel } from "../../../services/channels";
import colors from "../../../styles/colors";

function ChannelCreateModalContent({ toggleModal }) {
  const initialValues = {
    name: "",
    description: "",
  };

  const [loading, setLoading] = useState(false);
  const { user } = useSelector((state) => state.app);

  const handleCreateChannel = async (values) => {
    try {
      await fetchCreateChannel({ ...values, userId: user.id });

      toggleModal();
      showMessage({
        message: "Oda başarıyla oluşturuldu",
        type: "info",
      });
    } catch (error) {
      throw error;
    }
  };

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      await validationSchema.validate(values, { abortEarly: false });

      await handleCreateChannel(values);
    } catch (exception) {
      console.log(exception);
      showMessage({
        message: "Bir hata oluştu",
        type: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableOpacity
      style={styles.modal.container}
      activeOpacity={1}
      onPress={(event) => event.stopPropagation()}
    >
      <Formik initialValues={initialValues} onSubmit={handleSubmit}>
        {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
          <View>
            <View>
              <TextInput
                onChangeText={handleChange("name")}
                onBlur={handleBlur("name")}
                value={values.name}
                placeholder="Oda adı..."
                style={styles.modal.input}
              />
              {errors.name > 0 && (
                <Text style={styles.modal.inputError}>* {errors.name}</Text>
              )}
            </View>

            <View>
              <TextInput
                multiline={true}
                numberOfLines={4}
                placeholder="Açıklama..."
                onChangeText={handleChange("description")}
                onBlur={handleBlur("description")}
                value={values.description}
                style={styles.modal.input}
              />
              {errors.description > 0 && (
                <Text style={styles.modal.inputError}>
                  * {errors.description}
                </Text>
              )}
            </View>

            <Button
              title={loading ? "Kanal oluşturuluyor ..." : "Oluştur"}
              icon={
                loading && (
                  <ActivityIndicator size={"small"} color={colors.white} />
                )
              }
              disabled={loading}
              style={styles.modal.button}
              onPress={handleSubmit}
            />
          </View>
        )}
      </Formik>
    </TouchableOpacity>
  );
}

export default ChannelCreateModalContent;
