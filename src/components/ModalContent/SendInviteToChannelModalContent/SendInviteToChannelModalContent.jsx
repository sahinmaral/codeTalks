import React, { useState } from "react";
import Button from "../../Button";
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import styles from "./SendInviteToChannelModalContent.styles";
import { showMessage } from "react-native-flash-message";
import colors from "../../../styles/colors";
import { fetchCreateMessage } from "../../../services/messages";

function SendInviteToChannelModalContent({ user, toggleModal }) {
  const [channelId, setChannelId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendInvite = async () => {
    if (message.length === 0) {
      setError("Lütfen istek göndermek istediğiniz kanalın ID sini giriniz");
      return;
    }

    try {
      setLoading(true);

      await fetchCreateMessage({
        userId,
        channelId,
        content: message,
      });

      setChannelId("");
      toggleModal();
      showMessage({
        message: "İsteiğiniz başarıyla gönderildi",
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
      style={styles.modalContainer}
      activeOpacity={1}
      onPress={(event) => event.stopPropagation()}
    >
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Kanala istek gönder</Text>
      </View>

      <View>
        <TextInput
          value={channelId}
          onChangeText={setChannelId}
          placeholder="İstek yollayacağınız kanalın ID si"
          style={styles.modalInput}
        />
        {error.length > 0 && (
          <Text style={styles.modalInputError}>* {error}</Text>
        )}
      </View>

      <Button
        title="Gönder"
        style={styles.submitButton}
        disabled={loading}
        icon={
          loading && <ActivityIndicator size={"small"} color={colors.white} />
        }
        onPress={handleSendInvite}
      />
    </TouchableOpacity>
  );
}

export default SendInviteToChannelModalContent;
