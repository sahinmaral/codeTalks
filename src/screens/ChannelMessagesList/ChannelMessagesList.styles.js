import {Dimensions, StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.orange[400],
  },
  messagesContainer: {
    flex: 1,
    padding: 10,
    marginBottom:70,
    backgroundColor: colors.orange[400],
  },
  addMessageButton:{
    position: 'absolute',
    bottom: 10,
    right: 10,
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.orange[500],
  },
  modal: {
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'flex-end',
    },
  },
});

export default styles;
