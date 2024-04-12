import React, { useState } from "react";
import Button from "../../Button";
import { ActivityIndicator, Text, TextInput, TouchableOpacity, View } from "react-native";
import styles from "./AddMessageModalContent.styles";
import { showMessage } from "react-native-flash-message";
import colors from "../../../styles/colors";
import {fetchCreateMessage} from '../../../services/messages'

function AddMessageModalContent({ channelId, userId, toggleModal }) {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async () => {
    if (message.length === 0) {
      setError("Lütfen mesajınızı giriniz");
      return;
    }

    try {
      setLoading(true);

      await fetchCreateMessage({
        userId,
        channelId,
        content: message,
      });

      setMessage("");
      toggleModal();
      showMessage({
        message: "Mesajınız başarıyla oluşturuldu",
        type: "info",
      });
    } catch (error) {
      console.log(error);
      showMessage({
        message: "Mesajı gönderirken hata oluştu",
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
      <View>
        <TextInput
          value={message}
          onChangeText={setMessage}
          placeholder="Mesajın..."
          style={styles.modal.input}
        />
        {error.length > 0 && (
          <Text style={styles.modal.inputError}>* {error}</Text>
        )}
      </View>

      <Button
        title="Ekle"
        style={styles.modal.button}
        disabled={loading}
        icon={
          loading && (
            <ActivityIndicator size={"small"} color={colors.white} />
          )
        }
        onPress={handleSendMessage}
      />
    </TouchableOpacity>
  );
}

export default AddMessageModalContent;
