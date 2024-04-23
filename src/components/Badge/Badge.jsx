import React from "react";
import { View, Text } from "react-native";
import styles from "./Badge.styles";
import colors from "../../styles/colors";

const Badge = ({ text, color }) => {
  return (
    <View style={[styles.container, { backgroundColor: colors[color] }]}>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

export default Badge;
