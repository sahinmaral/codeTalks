import React, { useState } from 'react';
import Button from '../../Button';
import { ActivityIndicator, Text, TextInput, TouchableOpacity, View } from 'react-native';
import styles from './UpdateChannelNameModalContent.styles';
import { showMessage } from 'react-native-flash-message';
import colors from '../../../styles/colors';
import { fetchUpdateChannel } from '../../../services/channels';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../types';

interface UpdateChannelNameModalContentProps {
  channelId: string;
  channelName: string;
  userId: string;
  navigation: NativeStackNavigationProp<RootStackParamList>;
  toggleModal: () => void;
}

function UpdateChannelNameModalContent({
  channelId,
  channelName,
  userId,
  navigation,
  toggleModal,
}: UpdateChannelNameModalContentProps) {
  const [updatedChannelName, setUpdatedChannelName] = useState(channelName);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUpdateChannelName = async () => {
    if (updatedChannelName.length === 0) {
      setError('Lütfen güncellemek istediğiniz kanal adı giriniz');
      return;
    }

    try {
      setLoading(true);
      await fetchUpdateChannel({ userId, id: channelId, name: updatedChannelName });
      toggleModal();
      showMessage({ message: 'Kanalın ismi başarıyla güncellendi', type: 'info' });
      navigation.navigate('ActiveChannelList');
    } catch {
      showMessage({ message: 'Kanalın ismini güncellerken hata oluştu', type: 'danger' });
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
        <Text style={styles.headerText}>Kanal adı güncelleme</Text>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          value={updatedChannelName}
          onChangeText={setUpdatedChannelName}
          placeholder="Kanal adını giriniz"
          style={styles.inputItem}
        />
        {error.length > 0 && <Text style={styles.inputError}>* {error}</Text>}
      </View>

      <Button
        title="Güncelle"
        style={styles.button}
        disabled={loading}
        icon={loading && <ActivityIndicator size="small" color={colors.white} />}
        onPress={handleUpdateChannelName}
      />
    </TouchableOpacity>
  );
}

export default UpdateChannelNameModalContent;
