import {Modal, TouchableOpacity} from 'react-native';
import styles from './CustomModal.styles';

function CustomModal({children,toggleModal,modalVisible}) {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={modalVisible}
      onRequestClose={toggleModal}>
      <TouchableOpacity
        style={styles.modal.overlay}
        activeOpacity={1}
        onPress={toggleModal}>
        {children}
      </TouchableOpacity>
    </Modal>
  );
}

export default CustomModal;
