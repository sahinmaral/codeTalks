import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { showMessage } from 'react-native-flash-message';
import { fetchDeleteChannel, fetchLeaveChannel } from '../../../services/channels';
import { Channel, User } from '../../../types';
import styles from './ShowChannelOptionsModalContent.styles';

interface ShowChannelOptionsModalContentProps {
  selectedChannel: Channel;
  user: User;
  closeAllModals: () => void;
}

function ShowChannelOptionsModalContent({
  selectedChannel,
  user,
  closeAllModals,
}: ShowChannelOptionsModalContentProps) {
  const handleLeaveChannel = async () => {
    try {
      await fetchLeaveChannel(selectedChannel.id);
      closeAllModals();
      showMessage({ message: 'Kanal başarıyla silindi', type: 'info' });
    } catch (err: any) {
      showMessage({ message: err?.response?.data ?? 'Bir hata oluştu', type: 'danger' });
    }
  };

  const handleDeleteChannel = async () => {
    try {
      await fetchDeleteChannel(selectedChannel.id);
      closeAllModals();
      showMessage({ message: 'Kanal başarıyla silindi', type: 'info' });
    } catch {
      showMessage({ message: 'Bir hata oluştu', type: 'danger' });
    }
  };

  return (
    <TouchableOpacity
      style={styles.modalContainer}
      activeOpacity={1}
      onPress={event => event.stopPropagation()}
    >
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>{selectedChannel.name} kanalı hakkında</Text>
        <Text style={styles.description}>{selectedChannel.description}</Text>
      </View>

      <View style={styles.tooltipContainer}>
        <TouchableOpacity style={styles.menuItemContainer} onPress={handleLeaveChannel}>
          <Text style={styles.menuItemText}>Kanaldan ayrılın</Text>
        </TouchableOpacity>
        {selectedChannel.role.name === 'Moderator' ? (
          <TouchableOpacity style={styles.menuItemContainer} onPress={handleDeleteChannel}>
            <Text style={[styles.menuItemText, { fontWeight: 'bold', color: 'red' }]}>
              Kanalı silin
            </Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </TouchableOpacity>
  );
}

export default ShowChannelOptionsModalContent;
