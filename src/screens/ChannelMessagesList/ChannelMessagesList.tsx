import React, { useLayoutEffect, useRef, useState } from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import colors from '../../styles/colors';
import Icon from 'react-native-remix-icon';
import CustomModal from '../../components/CustomModal';
import AddMessageModalContent from '../../components/ModalContent/AddMessageModalContent';
import styles from './ChannelMessagesList.styles';
import Loading from '../Loading';
import { useAppSelector } from '../../redux/hooks';
import MessageCard from '../../components/MessageCard';
import ChannelCreatedMessageCard from '../../components/ChannelCreatedMessageCard';
import { Message, PaginatedResult, RootStackParamList } from '../../types';
import useSignalRConnection from '../../hooks/useSignalRConnection';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';

interface ChannelMessagesListProps {
  navigation: NativeStackNavigationProp<RootStackParamList, 'ChannelMessagesList'>;
  route: RouteProp<RootStackParamList, 'ChannelMessagesList'>;
}

function ChannelMessagesList({ navigation, route }: ChannelMessagesListProps) {
  const { channelId, channelName } = route.params;
  const scrollViewRef = useRef<ScrollView>(null);
  const user = useAppSelector(state => state.app.user);

  const { data: messages, isLoading } = useSignalRConnection<PaginatedResult<Message>>({
    receiveEvent: 'ReceiveMessagesOfChannel',
    sendMethod: 'SendMessagesOfChannel',
    invokeArgs: [channelId],
  });

  const [modalVisible, setModalVisible] = useState(false);

  const toggleModal = () => setModalVisible(v => !v);

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: !isLoading });
  }, [isLoading, navigation]);

  if (isLoading) {
    return <Loading text="Mesajlar yüklenirken lütfen bekleyiniz ..." />;
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.messagesContainer}
        ref={scrollViewRef}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
      >
        {messages && messages.count === 0 && (
          <ChannelCreatedMessageCard channelName={channelName} />
        )}
        {messages?.items.map(messageDetail => (
          <MessageCard key={messageDetail.id} messageDetail={messageDetail} />
        ))}
      </ScrollView>

      <TouchableOpacity onPress={toggleModal} style={styles.addMessageButton}>
        <Icon name="add-line" size={24} color={colors.white} />
      </TouchableOpacity>

      <CustomModal closeAllModals={toggleModal} containerModalVisible={modalVisible}>
        <AddMessageModalContent channelId={channelId} userId={user!.id} toggleModal={toggleModal} />
      </CustomModal>
    </View>
  );
}

export default ChannelMessagesList;
