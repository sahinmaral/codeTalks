import {Modal, TouchableOpacity} from 'react-native';
import styles from './CustomModal.styles';

function CustomModal({children,closeAllModals,containerModalVisible}) {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={containerModalVisible}
      onRequestClose={closeAllModals}>
      <TouchableOpacity
        style={styles.modal.overlay}
        activeOpacity={1}
        onPress={closeAllModals}>
        {children}
      </TouchableOpacity>
    </Modal>
  );
}

export default CustomModal;
