import { useEffect, useMemo, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";
import colors from "../../../styles/colors";
import Icon from "react-native-remix-icon";
import CustomModal from "../../../components/CustomModal";
import ChannelCreateModalContent from "../../../components/ModalContent/ChannelCreateModalContent";
import styles from "../ChannelList.styles";
import ChannelCard from "../../../components/ChannelCard";
import * as SignalR from "@microsoft/signalr";
import Loading from "../../Loading";
import ModalType from "../../../enums/ModalType";
import ShowChannelOptionsModalContent from "../../../components/ModalContent/ShowChannelOptionsModalContent";
import NoChannelRegisteredCard from "../../../components/NoChannelRegisteredCard";
import BubbleContentMenu from "../../../components/BubbleContentMenu";
import { default as bubbleContentMenuStyles } from "../../../components/BubbleContentMenu/BubbleContentMenu.styles";
import SendInviteToChannelModalContent from "../../../components/ModalContent/SendInviteToChannelModalContent/SendInviteToChannelModalContent";

function ActiveChannelList({ navigation }) {
  const { user } = useSelector((state) => state.app);

  const [connection, setConnection] = useState(null);
  const [channels, setChannels] = useState(null);
  const [bubbleContentMenuVisible, setBubbleContentMenuVisible] =
    useState(false);
  const [modalsVisible, setModalsVisible] = useState({
    ChannelCreate: false,
    ShowChannelOptions: false,
    SendInviteToChannel: false,
  });
  const [selectedChannel, setSelectedChannel] = useState(null);

  const toggleModal = (modalType) => {
    Object.keys(modalsVisible).forEach((key) => {
      if (key === modalType) {
        modalsVisible[key] = !modalsVisible[key];
      } else {
        modalsVisible[key] = false;
      }
    });

    setModalsVisible({ ...modalsVisible });
    setBubbleContentMenuVisible(false);
  };

  const closeAllModals = () => {
    Object.keys(modalsVisible).forEach((key) => {
      modalsVisible[key] = false;
    });

    setModalsVisible({ ...modalsVisible });
  };

  const handleSelectChannel = (channel) => setSelectedChannel(channel);

  const containerModalVisible = useMemo(() => {
    return Object.values(modalsVisible).some((value) => value);
  }, [modalsVisible]);

  useEffect(() => {
    const newConnection = new SignalR.HubConnectionBuilder()
      .withUrl(process.env.EXPO_PUBLIC_SIGNALR_API_URL)
      .build();

    setConnection(newConnection);

    return () => {
      if (newConnection) {
        newConnection
          .stop()
          .then(() => console.log("Connection stopped"))
          .catch(console.error);
      }
    };
  }, []);

  useEffect(() => {
    let intervalId;

    if (connection) {
      connection
        .start()
        .then(() => {
          intervalId = setInterval(() => {
            connection
              .invoke("SendActiveChannelsByUserId", user.id, null, null)
              .catch((err) => console.log(err));
          }, 1000);
        })
        .catch((err) => {
          console.log(err);
        });

      connection.on("ReceiveActiveChannelsByUserId", (channels) => {
        setChannels(channels);
      });
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [connection, user.id]);

  if (!connection || connection.state !== "Connected") {
    return <Loading text={"Kanallar yüklenirken lütfen bekleyiniz ..."} />;
  }

  return (
    <View style={styles.container}>
      {channels && channels.items.length === 0 ? (
        <View style={styles.container}>
          <NoChannelRegisteredCard />
        </View>
      ) : (
        <ScrollView style={styles.channelListContainer}>
          {channels.items.map((channel) => {
            return (
              <ChannelCard
                key={channel.id}
                navigation={navigation}
                channel={channel}
                styles={styles}
                handleSelectChannel={handleSelectChannel}
                toggleModal={() => toggleModal(ModalType.ShowChannelOptions)}
              />
            );
          })}
        </ScrollView>
      )}

      <TouchableOpacity
        onPress={() => setBubbleContentMenuVisible(!bubbleContentMenuVisible)}
        style={styles.showBubbleContentMenuButton}
      >
        <Icon
          name={
            !bubbleContentMenuVisible ? "information-fill" : "information-line"
          }
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
              <Text style={bubbleContentMenuStyles.menuItemText}>
                Kanal oluştur
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={bubbleContentMenuStyles.menuItemContainer}
              onPress={() => toggleModal(ModalType.SendInviteToChannel)}
            >
              <Text style={bubbleContentMenuStyles.menuItemText}>
                Kanala istek at
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={bubbleContentMenuStyles.menuItemContainer}
              onPress={() => {
                navigation.navigate("AllChannelList");
              }}
            >
              <Text style={bubbleContentMenuStyles.menuItemText}>
                Bütün kanalları görüntüle
              </Text>
            </TouchableOpacity>
          </View>
        </BubbleContentMenu>
      ) : null}

      <CustomModal
        closeAllModals={closeAllModals}
        containerModalVisible={containerModalVisible}
      >
        {modalsVisible.ChannelCreate ? (
          <ChannelCreateModalContent
            channels={channels}
            closeAllModals={closeAllModals}
          />
        ) : null}
        {modalsVisible.ShowChannelOptions ? (
          <ShowChannelOptionsModalContent
            user={user}
            closeAllModals={closeAllModals}
            selectedChannel={selectedChannel}
          />
        ) : null}
        {modalsVisible.SendInviteToChannel ? (
          <SendInviteToChannelModalContent
            user={user}
            closeAllModals={closeAllModals}
          />
        ) : null}
      </CustomModal>
    </View>
  );
}

export default ActiveChannelList;
