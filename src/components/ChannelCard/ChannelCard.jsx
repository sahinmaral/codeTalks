import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import Icon from "react-native-remix-icon";

function ChannelCard({ navigation, channel, styles }) {
  return (
    <TouchableOpacity
      style={styles.channelCard.main}
      onPress={() =>
        navigation.navigate("ChannelMessagesList", {
          channelId: channel.id,
          channelName: channel.name,
        })
      }
    >
      <View style={styles.channelCard.content.container}>
        <View style={styles.channelCard.content.left.container}>
          <View style={styles.channelCard.photo.main}>
            <Image
              style={styles.channelCard.photo.container}
              source={{
                uri: "https://reactnative.dev/img/tiny_logo.png",
              }}
            />
          </View>
          <View style={styles.channelCard.text.main}>
            <Text style={styles.channelCard.text.content}>{channel.name}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.channelCard.content.right.container}>
          <Icon name="menu-line" size="24" color="black"></Icon>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

export default ChannelCard;
