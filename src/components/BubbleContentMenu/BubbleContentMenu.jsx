import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import styles from "./BubbleContentMenu.styles";

function BubbleContentMenu({children}) {
  return (
    <View>
      <View style={styles.container}>
        {children}
      </View>
      <View
        style={styles.bubbleNeedle}
      ></View>
    </View>
  );
}

export default BubbleContentMenu;
