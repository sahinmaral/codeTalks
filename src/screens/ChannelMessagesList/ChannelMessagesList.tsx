import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
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
import * as SignalR from '@microsoft/signalr';
import { Message, PaginatedResult, RootStackParamList } from '../../types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';

interface ChannelMessagesListProps {
  navigation: NativeStackNavigationProp<RootStackParamList, 'ChannelMessagesList'>;
  route: RouteProp<RootStackParamList, 'ChannelMessagesList'>;
}

function ChannelMessagesList({ navigation, route }: ChannelMessagesListProps) {
  const { channelId, channelName } = route.params;
  const scrollViewRef = useRef<ScrollView>(null);
  const user = useAppSelector((state) => state.app.user);

  const [connection, setConnection] = useState<SignalR.HubConnection | null>(null);
  const [messages, setMessages] = useState<PaginatedResult<Message> | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const loading = useMemo(() => {
    return connection === null || connection.state !== 'Connected';
  }, [connection]);

  const toggleModal = () => setModalVisible((v) => !v);

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: !loading });
  }, [loading, navigation]);

  useEffect(() => {
    const newConnection = new SignalR.HubConnectionBuilder()
      .withUrl(process.env.EXPO_PUBLIC_SIGNALR_API_URL!)
      .build();

    setConnection(newConnection);

    return () => {
      newConnection.stop().catch(console.error);
    };
  }, []);

  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval>;

    if (connection) {
      connection
        .start()
        .then(() => {
          connection.invoke('SendMessagesOfChannel', channelId);
          intervalId = setInterval(() => {
            connection.invoke('SendMessagesOfChannel', channelId);
          }, 1000);
        })
        .catch(console.error);

      connection.on('ReceiveMessagesOfChannel', (data: PaginatedResult<Message>) => {
        setMessages(data);
      });
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [connection, channelId]);

  if (loading) {
    return (
      <Loading
        text="Mesajlar yüklenirken lütfen bekleyiniz ..."
      />
    );
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
        {messages?.items.map((messageDetail) => (
          <MessageCard key={messageDetail.id} messageDetail={messageDetail} />
        ))}
      </ScrollView>

      <TouchableOpacity onPress={toggleModal} style={styles.addMessageButton}>
        <Icon name="add-line" size={24} color={colors.white} />
      </TouchableOpacity>

      <CustomModal closeAllModals={toggleModal} containerModalVisible={modalVisible}>
        <AddMessageModalContent
          channelId={channelId}
          userId={user!.id}
          toggleModal={toggleModal}
        />
      </CustomModal>
    </View>
  );
}

export default ChannelMessagesList;
