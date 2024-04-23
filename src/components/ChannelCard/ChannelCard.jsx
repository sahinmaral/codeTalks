import React, { useMemo } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import Icon from "react-native-remix-icon";
import ChannelUserStatus from "../../enums/ChannelUserStatus";
import Badge from "../Badge/Badge";
import styles from "../../screens/ChannelList/ChannelList.styles";

function ChannelCard({
  navigation,
  channel,
  toggleModal,
  handleSelectChannel,
}) {
  const isUserAcceptedToThisChannel = useMemo(() => {
    return channel.status === ChannelUserStatus.Accepted;
  }, [channel]);

  const userStatusAtChannelBadgeText = useMemo(() => {
    switch (channel.status) {
      case 0:
        return "İstek gönderildi";
      case 1:
        return "İstek reddedildi";
      case 3:
        return "Kanaldan bloklandınız";
    }
  }, [channel]);

  const userStatusAtChannelBadgeColor = useMemo(() => {
    switch (channel.status) {
      case 0:
        return "success";
      case 1:
        return "danger";
      case 3:
        return "warning";
    }
  }, [channel]);

  return (
    <TouchableOpacity
      disabled={!isUserAcceptedToThisChannel}
      style={styles.channelCardContainer}
      onPress={() => {
        if (isUserAcceptedToThisChannel) {
          navigation.navigate("ChannelMessagesList", {
            channelId: channel.id,
            channelName: channel.name,
          });
        }
      }}
    >
      <View style={styles.channelCardContentLeftPartContainer}>
        <Image
          style={styles.channelCardPhoto}
          source={{
            uri: "https://reactnative.dev/img/tiny_logo.png",
          }}
        />
        <View style={styles.channelCardHeaderContainer}>
          <Text style={styles.channelCardHeaderText}>{channel.name}</Text>
          {channel.status !== ChannelUserStatus.Accepted ? (
            <Badge
              text={userStatusAtChannelBadgeText}
              color={userStatusAtChannelBadgeColor}
            />
          ) : null}
        </View>
      </View>
      {isUserAcceptedToThisChannel ? (
        <TouchableOpacity
          style={styles.channelCardContentRightPartContainer}
          onPress={() => {
            toggleModal();
            handleSelectChannel(channel);
          }}
        >
          <Icon name="menu-line" size="24" color="black"></Icon>
        </TouchableOpacity>
      ) : null}
    </TouchableOpacity>
  );
}

export default ChannelCard;
