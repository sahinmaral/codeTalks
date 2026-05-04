import React, { useState } from 'react';
import Button from '../../Button';
import { ActivityIndicator, Text, TextInput, TouchableOpacity, View } from 'react-native';
import styles from './AddMessageModalContent.styles';
import { showMessage } from 'react-native-flash-message';
import colors from '../../../styles/colors';
import { fetchCreateMessage } from '../../../services/messages';

interface AddMessageModalContentProps {
  channelId: string;
  userId: string;
  toggleModal: () => void;
}

function AddMessageModalContent({ channelId, userId, toggleModal }: AddMessageModalContentProps) {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async () => {
    if (message.length === 0) {
      setError('Lütfen mesajınızı giriniz');
      return;
    }

    try {
      setLoading(true);
      await fetchCreateMessage({ userId, channelId, content: message });
      setMessage('');
      toggleModal();
      showMessage({ message: 'Mesajınız başarıyla oluşturuldu', type: 'info' });
    } catch {
      showMessage({ message: 'Mesajı gönderirken hata oluştu', type: 'danger' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableOpacity
      style={styles.modalContainer}
      activeOpacity={1}
      onPress={event => event.stopPropagation()}
    >
      <View>
        <TextInput
          value={message}
          onChangeText={setMessage}
          placeholder="Mesajın..."
          style={styles.input}
        />
        {error.length > 0 && <Text style={styles.inputError}>* {error}</Text>}
      </View>

      <Button
        title="Ekle"
        style={styles.button}
        disabled={loading}
        icon={loading && <ActivityIndicator size="small" color={colors.white} />}
        onPress={handleSendMessage}
      />
    </TouchableOpacity>
  );
}

export default AddMessageModalContent;
