import React, { useEffect, useMemo, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useAppSelector } from '../../../redux/hooks';
import colors from '../../../styles/colors';
import Icon from 'react-native-remix-icon';
import CustomModal from '../../../components/CustomModal';
import ChannelCreateModalContent from '../../../components/ModalContent/ChannelCreateModalContent';
import styles from '../ChannelList.styles';
import ChannelCard from '../../../components/ActiveChannelCard';
import * as SignalR from '@microsoft/signalr';
import Loading from '../../Loading';
import ModalType from '../../../enums/ModalType';
import ShowChannelOptionsModalContent from '../../../components/ModalContent/ShowChannelOptionsModalContent';
import NoChannelRegisteredCard from '../../../components/NoChannelRegisteredCard';
import BubbleContentMenu from '../../../components/BubbleContentMenu';
import bubbleContentMenuStyles from '../../../components/BubbleContentMenu/BubbleContentMenu.styles';
import SendInviteToChannelModalContent from '../../../components/ModalContent/SendInviteToChannelModalContent/SendInviteToChannelModalContent';
import { Channel, PaginatedResult, RootStackParamList } from '../../../types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type ModalsVisible = {
  [ModalType.ChannelCreate]: boolean;
  [ModalType.ShowChannelOptions]: boolean;
  [ModalType.SendInviteToChannel]: boolean;
};

interface AllChannelListProps {
  navigation: NativeStackNavigationProp<RootStackParamList, 'AllChannelList'>;
}

function AllChannelList({ navigation }: AllChannelListProps) {
  const user = useAppSelector(state => state.app.user);

  const [connection, setConnection] = useState<SignalR.HubConnection | null>(null);
  const [channels, setChannels] = useState<PaginatedResult<Channel> | null>(null);
  const [bubbleContentMenuVisible, setBubbleContentMenuVisible] = useState(false);
  const [modalsVisible, setModalsVisible] = useState<ModalsVisible>({
    [ModalType.ChannelCreate]: false,
    [ModalType.ShowChannelOptions]: false,
    [ModalType.SendInviteToChannel]: false,
  });
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);

  const toggleModal = (modalType: ModalType) => {
    const updated = { ...modalsVisible };
    (Object.keys(updated) as ModalType[]).forEach(key => {
      updated[key] = key === modalType ? !updated[key] : false;
    });
    setModalsVisible(updated);
    setBubbleContentMenuVisible(false);
  };

  const closeAllModals = () => {
    const updated = { ...modalsVisible };
    (Object.keys(updated) as ModalType[]).forEach(key => {
      updated[key] = false;
    });
    setModalsVisible(updated);
  };

  const handleSelectChannel = (channel: Channel) => setSelectedChannel(channel);

  const containerModalVisible = useMemo(() => {
    return Object.values(modalsVisible).some(v => v);
  }, [modalsVisible]);

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
    if (!connection) return;

    let intervalId: ReturnType<typeof setInterval>;

    const handler = (data: PaginatedResult<Channel>) => setChannels(data);
    connection.on('ReceiveAllChannelsByUserId', handler);

    const startAndPoll = async () => {
      if (connection.state === SignalR.HubConnectionState.Disconnected) {
        await connection.start();
      }
      intervalId = setInterval(() => {
        if (connection.state === SignalR.HubConnectionState.Connected) {
          connection.invoke('SendAllChannelsByUserId', user?.id, null, null).catch(console.error);
        }
      }, 1000);
    };

    startAndPoll().catch(console.error);

    return () => {
      clearInterval(intervalId);
      connection.off('ReceiveAllChannelsByUserId', handler);
    };
  }, [connection, user?.id]);

  if (!connection || connection.state !== 'Connected') {
    return <Loading text="Kanallar yüklenirken lütfen bekleyiniz ..." />;
  }

  return (
    <View style={styles.container}>
      {channels && channels.items.length === 0 ? (
        <View style={styles.container}>
          <NoChannelRegisteredCard />
        </View>
      ) : (
        <ScrollView style={styles.channelListContainer}>
          {channels?.items.map(channel => (
            <ChannelCard
              key={channel.id}
              navigation={navigation}
              channel={channel}
              handleSelectChannel={handleSelectChannel}
              toggleModal={() => toggleModal(ModalType.ShowChannelOptions)}
            />
          ))}
        </ScrollView>
      )}

      <TouchableOpacity
        onPress={() => setBubbleContentMenuVisible(!bubbleContentMenuVisible)}
        style={styles.showBubbleContentMenuButton}
      >
        <Icon
          name={bubbleContentMenuVisible ? 'information-line' : 'information-fill'}
          size={24}
          color={colors.white}
        />
      </TouchableOpacity>

      {bubbleContentMenuVisible ? (
        <BubbleContentMenu>
          <View>
            <TouchableOpacity
              style={bubbleContentMenuStyles.menuItemContainer}
              onPress={() => toggleModal(ModalType.ChannelCreate)}
            >
              <Text style={bubbleContentMenuStyles.menuItemText}>Kanal oluştur</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={bubbleContentMenuStyles.menuItemContainer}
              onPress={() => toggleModal(ModalType.SendInviteToChannel)}
            >
              <Text style={bubbleContentMenuStyles.menuItemText}>Kanala istek at</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={bubbleContentMenuStyles.menuItemContainer}
              onPress={() => navigation.navigate('AllChannelList')}
            >
              <Text style={bubbleContentMenuStyles.menuItemText}>Bütün kanalları görüntüle</Text>
            </TouchableOpacity>
          </View>
        </BubbleContentMenu>
      ) : null}

      <CustomModal closeAllModals={closeAllModals} containerModalVisible={containerModalVisible}>
        {modalsVisible[ModalType.ChannelCreate] ? (
          <ChannelCreateModalContent closeAllModals={closeAllModals} />
        ) : null}
        {modalsVisible[ModalType.ShowChannelOptions] && selectedChannel && user ? (
          <ShowChannelOptionsModalContent
            user={user}
            closeAllModals={closeAllModals}
            selectedChannel={selectedChannel}
          />
        ) : null}
        {modalsVisible[ModalType.SendInviteToChannel] && user ? (
          <SendInviteToChannelModalContent user={user} closeAllModals={closeAllModals} />
        ) : null}
      </CustomModal>
    </View>
  );
}

export default AllChannelList;
