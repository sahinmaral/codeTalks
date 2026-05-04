import React from 'react';
import { Modal, TouchableOpacity } from 'react-native';
import styles from './CustomModal.styles';

interface CustomModalProps {
  children: React.ReactNode;
  closeAllModals: () => void;
  containerModalVisible: boolean;
}

function CustomModal({ children, closeAllModals, containerModalVisible }: CustomModalProps) {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={containerModalVisible}
      onRequestClose={closeAllModals}
    >
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={closeAllModals}>
        {children}
      </TouchableOpacity>
    </Modal>
  );
}

export default CustomModal;
