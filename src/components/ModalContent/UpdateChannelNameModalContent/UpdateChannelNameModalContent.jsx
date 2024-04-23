import React, { useState } from "react";
import Button from "../../Button";
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import styles from "./UpdateChannelNameModalContent.styles";
import { showMessage } from "react-native-flash-message";
import colors from "../../../styles/colors";
import { fetchUpdateChannel } from "../../../services/channels";

function UpdateChannelNameModalContent({
  channelId,
  channelName,
  userId,
  navigation,
  toggleModal,
}) {
  const [updatedChannelName, setUpdatedChannelName] = useState(channelName);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpdateChannelName = async () => {
    if (updatedChannelName.length === 0) {
      setError("Lütfen güncellemek istediğiniz kanal adı giriniz");
      return;
    }

    try {
      setLoading(true);

      await fetchUpdateChannel({
        userId,
        id:channelId,
        name: updatedChannelName
      });

      toggleModal();
      showMessage({
        message: "Kanalın ismi başarıyla güncellendi",
        type: "info",
      });
      navigation.navigate("ActiveChannelList")
    } catch (error) {
      console.log(error);
      showMessage({
        message: "Kanalın ismini güncellerken hata oluştu",
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
      <View style={styles.modal.header.container}>
        <Text style={styles.modal.header.text}>Kanal adı güncelleme</Text>
      </View>

      <View style={styles.modal.input.container}>
        <TextInput
          value={updatedChannelName}
          onChangeText={setUpdatedChannelName}
          placeholder="Kanal adını giriniz"
          style={styles.modal.input.item}
        />
        {error.length > 0 && (
          <Text style={styles.modal.input.error}>* {error}</Text>
        )}
      </View>

      <Button
        title="Güncelle"
        style={styles.modal.button}
        disabled={loading}
        icon={
          loading && <ActivityIndicator size={"small"} color={colors.white} />
        }
        onPress={handleUpdateChannelName}
      />
    </TouchableOpacity>
  );
}

export default UpdateChannelNameModalContent;
