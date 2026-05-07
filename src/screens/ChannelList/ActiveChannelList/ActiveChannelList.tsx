import React, { useLayoutEffect, useMemo, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useAppSelector } from '@/redux/hooks';
import colors from '@/styles/colors';
import Icon from 'react-native-remix-icon';
import CustomModal from '@/components/CustomModal';
import ChannelCreateModalContent from '@/components/ModalContent/ChannelCreateModalContent';
import styles from '../ChannelList.styles';
import ActiveChannelCard from '@/components/ActiveChannelCard';
import Loading from '@/screens/Loading';
import ModalType from '@/enums/ModalType';
import ShowChannelOptionsModalContent from '@/components/ModalContent/ShowChannelOptionsModalContent';
import NoChannelRegisteredCard from '@/components/NoChannelRegisteredCard';
import BubbleContentMenu from '@/components/BubbleContentMenu';
import bubbleContentMenuStyles from '@/components/BubbleContentMenu/BubbleContentMenu.styles';
import SendInviteToChannelModalContent from '@/components/ModalContent/SendInviteToChannelModalContent/SendInviteToChannelModalContent';
import { Channel, PaginatedResult, RootStackParamList } from '@/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import useSignalRConnection from '@/hooks/useSignalRConnection';

type ModalsVisible = {
  [ModalType.ChannelCreate]: boolean;
  [ModalType.ShowChannelOptions]: boolean;
  [ModalType.SendInviteToChannel]: boolean;
};

interface ActiveChannelListProps {
  navigation: NativeStackNavigationProp<RootStackParamList, 'ActiveChannelList'>;
}

function ActiveChannelList({ navigation }: ActiveChannelListProps) {
  const user = useAppSelector(state => state.app.user);

  const [isLoading] = useState(false);
  const [channels] = useState({
    items: [
      {
        id: 1,
        name: 'react-devs',
        description: 'General discussion about React ecosystem',
        status: 2,
        role: {
          id: 1,
          name: 'Moderator',
        },
      },
      {
        id: 2,
        name: 'react-devs',
        description: 'General discussion about React ecosystem',
        status: 2,
        role: {
          id: 1,
          name: 'Moderator',
        },
      },
      {
        id: 3,
        name: 'react-devs',
        description: 'General discussion about React ecosystem',
        status: 2,
        role: {
          id: 1,
          name: 'Moderator',
        },
      },
      {
        id: 4,
        name: 'react-devs',
        description: 'General discussion about React ecosystem',
        status: 2,
        role: {
          id: 1,
          name: 'Moderator',
        },
      },
      {
        id: 5,
        name: 'react-devs',
        description: 'General discussion about React ecosystem',
        status: 2,
        role: {
          id: 1,
          name: 'Moderator',
        },
      },
    ],
  });

  //   const { data: channels, isLoading } = useSignalRConnection<PaginatedResult<Channel>>({
  //     receiveEvent: 'ReceiveActiveChannelsByUserId',
  //     sendMethod: 'SendActiveChannelsByUserId',
  //     invokeArgs: [{ userId: user?.id, page: 1, pageSize: 10 }],
  //   });

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

  //   useLayoutEffect(() => {
  //     navigation.setOptions({ headerShown: !isLoading });
  //   }, [isLoading, navigation]);

  useLayoutEffect(() => {
    navigation.setOptions({ headerDescription: `Welcome back! You have 15 unread messages` });
  }, [isLoading, navigation]);

  const containerModalVisible = useMemo(() => {
    return Object.values(modalsVisible).some(v => v);
  }, [modalsVisible]);

  if (isLoading) {
    return <Loading text="Kanallar yüklenirken lütfen bekleyiniz ..." />;
  }

  //   return (
  //     <View style={styles.container}>
  //       {channels && channels.items.length === 0 ? (
  //         <View style={styles.container}>
  //           <NoChannelRegisteredCard />
  //         </View>
  //       ) : (
  //         <ScrollView style={styles.channelListContainer}>
  //           {channels?.items.map(channel => (
  //             <ChannelCard
  //               key={channel.id}
  //               navigation={navigation}
  //               channel={channel}
  //               handleSelectChannel={handleSelectChannel}
  //               toggleModal={() => toggleModal(ModalType.ShowChannelOptions)}
  //             />
  //           ))}
  //         </ScrollView>
  //       )}

  //       <TouchableOpacity
  //         onPress={() => setBubbleContentMenuVisible(!bubbleContentMenuVisible)}
  //         style={styles.showBubbleContentMenuButton}
  //       >
  //         <Icon
  //           name={bubbleContentMenuVisible ? 'information-line' : 'information-fill'}
  //           size={24}
  //           color={colors.white}
  //         />
  //       </TouchableOpacity>

  //       {bubbleContentMenuVisible ? (
  //         <BubbleContentMenu>
  //           <View>
  //             <TouchableOpacity
  //               style={bubbleContentMenuStyles.menuItemContainer}
  //               onPress={() => toggleModal(ModalType.ChannelCreate)}
  //             >
  //               <Text style={bubbleContentMenuStyles.menuItemText}>Kanal oluştur</Text>
  //             </TouchableOpacity>
  //             <TouchableOpacity
  //               style={bubbleContentMenuStyles.menuItemContainer}
  //               onPress={() => toggleModal(ModalType.SendInviteToChannel)}
  //             >
  //               <Text style={bubbleContentMenuStyles.menuItemText}>Kanala istek at</Text>
  //             </TouchableOpacity>
  //             <TouchableOpacity
  //               style={bubbleContentMenuStyles.menuItemContainer}
  //               onPress={() => navigation.navigate('AllChannelList')}
  //             >
  //               <Text style={bubbleContentMenuStyles.menuItemText}>Bütün kanalları görüntüle</Text>
  //             </TouchableOpacity>
  //           </View>
  //         </BubbleContentMenu>
  //       ) : null}

  //       <CustomModal closeAllModals={closeAllModals} containerModalVisible={containerModalVisible}>
  //         {modalsVisible[ModalType.ChannelCreate] ? (
  //           <ChannelCreateModalContent closeAllModals={closeAllModals} />
  //         ) : null}
  //         {modalsVisible[ModalType.ShowChannelOptions] && selectedChannel && user ? (
  //           <ShowChannelOptionsModalContent
  //             user={user}
  //             closeAllModals={closeAllModals}
  //             selectedChannel={selectedChannel}
  //           />
  //         ) : null}
  //         {modalsVisible[ModalType.SendInviteToChannel] && user ? (
  //           <SendInviteToChannelModalContent user={user} closeAllModals={closeAllModals} />
  //         ) : null}
  //       </CustomModal>
  //     </View>
  //   );

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.channelListContainer}
        contentContainerStyle={styles.channelListContainerContent}
      >
        {channels?.items.map(channel => (
          <ActiveChannelCard
            key={channel.id}
            navigation={navigation}
            channel={channel}
            handleSelectChannel={handleSelectChannel}
            toggleModal={() => toggleModal(ModalType.ShowChannelOptions)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

export default ActiveChannelList;
