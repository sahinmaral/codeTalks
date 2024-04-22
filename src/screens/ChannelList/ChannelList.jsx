import { useEffect, useMemo, useState } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";
import colors from "../../styles/colors";
import Icon from "react-native-remix-icon";
import CustomModal from "../../components/CustomModal";
import ChannelCreateModalContent from "../../components/ModalContent/ChannelCreateModalContent";
import styles from "./ChannelList.styles";
import ChannelCard from "../../components/ChannelCard";
import * as SignalR from "@microsoft/signalr";
import Loading from "../../screens/Loading";
import ModalType from "../../enums/ModalType";
import ShowChannelOptionsModalContent from "../../components/ModalContent/ShowChannelOptionsModalContent";
import NoChannelRegisteredCard from "../../components/NoChannelRegisteredCard";

function ChannelList({ navigation }) {
  const { user } = useSelector((state) => state.app);

  const [connection, setConnection] = useState(null);
  const [channels, setChannels] = useState(null);
  const [modalsVisible, setModalsVisible] = useState({
    ChannelCreate: false,
    ShowChannelOptions: false,
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
              .invoke("SendAllChannels", user.id, null, null)
              .catch((err) => console.log(err));
          }, 1000);
        })
        .catch((err) => {
          console.log(err);
        });

      connection.on("ReceiveAllChannels", (channels) => {
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
        <NoChannelRegisteredCard />
      ) : (
        <ScrollView style={styles.channelListContainer}>
          <View style={styles.channelCardContainer}>
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
          </View>
        </ScrollView>
      )}

      <TouchableOpacity
        onPress={() => toggleModal(ModalType.ChannelCreate)}
        style={styles.addChannelButton}
      >
        <Icon name="add-line" size={24} color={colors.white} />
      </TouchableOpacity>

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
      </CustomModal>
    </View>
  );
}

export default ChannelList;
