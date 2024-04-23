import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import colors from "../../styles/colors";
import Icon from "react-native-remix-icon";
import CustomModal from "../../components/CustomModal";
import AddMessageModalContent from "../../components/ModalContent/AddMessageModalContent";
import styles from "./ChannelMessagesList.styles";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import Loading from "../Loading";
import { useSelector } from "react-redux";
import MessageCard from "../../components/MessageCard";
import ChannelCreatedMessageCard from "../../components/ChannelCreatedMessageCard";
import * as SignalR from "@microsoft/signalr";

function ChannelMessagesList({ navigation, route }) {
  const { channelId, channelName } = route.params;

  const scrollViewRef = useRef();

  const { user } = useSelector((state) => state.app);

  const [fetchResult, setFetchResult] = useState({
    connection: null,
    error: null,
    messages: null,
  });
  const [modalVisible, setModalVisible] = useState(false);

  const loading = useMemo(() => {
    return (
      fetchResult.connection && fetchResult.connection.state !== "Connected"
    );
  }, [fetchResult, fetchResult.connection]);

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: !loading,
    });
  }, [loading]);

  useEffect(() => {
    const newConnection = new SignalR.HubConnectionBuilder()
      .withUrl(process.env.EXPO_PUBLIC_SIGNALR_API_URL)
      .build();

    setFetchResult({ ...fetchResult, connection: newConnection });

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

    if (fetchResult.connection) {
      fetchResult.connection
        .start()
        .then(() => {
          // Start fetching messages immediately
          fetchResult.connection.invoke("SendMessagesOfChannel", channelId);

          // Set up interval to fetch messages periodically
          intervalId = setInterval(() => {
            fetchResult.connection.invoke("SendMessagesOfChannel", channelId);
          }, 1000);
        })
        .catch((error) => {
          setFetchResult({ ...fetchResult, error });
        });

      fetchResult.connection.on("ReceiveMessagesOfChannel", (messages) => {
        setFetchResult({ ...fetchResult, messages });
      });
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [fetchResult.connection, channelId]);

  if (loading) {
    return (
      <Loading
        text={`Mesajlar yüklenirken lütfen bekleyiniz ...`}
        styles={{
          container: { backgroundColor: colors.orange[500] },
          text: { color: colors.white },
        }}
      />
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.messagesContainer}
        ref={scrollViewRef}
        onContentSizeChange={() =>
          scrollViewRef.current.scrollToEnd({ animated: true })
        }
      >
        {fetchResult.messages && fetchResult.messages.count === 0 && (
          <ChannelCreatedMessageCard
            styles={styles}
            channelName={channelName}
          />
        )}
        {fetchResult.messages &&
          fetchResult.messages.items.map((messageDetail) => {
            return (
              <MessageCard
                key={messageDetail.id}
                messageDetail={messageDetail}
                styles={styles}
              />
            );
          })}
      </ScrollView>

      <TouchableOpacity onPress={toggleModal} style={styles.addMessageButton}>
        <Icon name="add-line" size={24} color={colors.white} />
      </TouchableOpacity>

      <CustomModal toggleModal={toggleModal} modalVisible={modalVisible}>
        <AddMessageModalContent
          channelId={channelId}
          userId={user.id}
          toggleModal={toggleModal}
        />
      </CustomModal>
    </View>
  );
}

ChannelMessagesList.navigationOptions = () => {
  return {
    headerShown: loading,
  };
};

export default ChannelMessagesList;
