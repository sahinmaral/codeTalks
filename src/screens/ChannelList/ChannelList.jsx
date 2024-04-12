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

function ChannelList({ navigation }) {
  const { user } = useSelector((state) => state.app);

  const [connection, setConnection] = useState(null);
  const [channels, setChannels] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  useEffect(() => {
    const newConnection = new SignalR.HubConnectionBuilder()
      .withUrl(process.env.EXPO_PUBLIC_SIGNALR_API_URL)
      .build();
  
    setConnection(newConnection);
  
    return () => {
      if (newConnection) {
        newConnection.stop().then(() => console.log("Connection stopped")).catch(console.error);
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
            connection.invoke("SendAllChannels", user.id);
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
  }, [connection]);


  if (!connection || connection.state !== "Connected") {
    return <Loading text={"Kanallar yüklenirken lütfen bekleyiniz ..."} />;
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.channelListContainer}>
        <View style={styles.channelCardContainer}>
          {channels.items.map((channel) => {
            return (
              <ChannelCard
                key={channel.id}
                navigation={navigation}
                channel={channel}
                styles={styles}
              />
            );
          })}
        </View>
      </ScrollView>

      <TouchableOpacity onPress={toggleModal} style={styles.addChannelButton}>
        <Icon name="add-line" size={24} color={colors.white} />
      </TouchableOpacity>

      <CustomModal toggleModal={toggleModal} modalVisible={modalVisible}>
        <ChannelCreateModalContent
          channels={channels}
          toggleModal={toggleModal}
        />
      </CustomModal>
    </View>
  );
}

export default ChannelList;
