import React from "react";
import { Dimensions, Text, View } from "react-native";
import Icon from "react-native-remix-icon";

function NoChannelRegisteredCard() {
  return (
    <View
      style={{
        backgroundColor: "lightblue",
        justifyContent:"center",
        alignItems:'center',
        gap:10,
        padding:10,
        height: Dimensions.get("window").height / 5,
      }}
    >
      <Icon name="information-fill" size="60" color="white"></Icon>
      <Text style={{textAlign:'center', color:'black'}}>
        Herhangi bir kanala katılmadınız veya herhangi bir kanal oluşturmadınız.
      </Text>
    </View>
  );
}

export default NoChannelRegisteredCard;
