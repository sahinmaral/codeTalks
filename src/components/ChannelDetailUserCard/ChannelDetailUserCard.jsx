import React, { useMemo } from "react";
import { Image, Text, View } from "react-native";
import styles from "./ChannelDetailUserCard.styles";
import { useSelector } from "react-redux";

function ChannelDetailUserCard({ user }) {
  const { user: currentUser } = useSelector((state) => state.app);

  const fullName = useMemo(() => {
    return `${user.firstName} ${user.middleName ? user.middleName + " " : ""}${user.lastName}`;
  }, [user]);

  return (
    <View style={styles.container}>
      <View style={styles.left.container}>
        <Image
          style={styles.photo.container}
          source={{
            uri: "https://reactnative.dev/img/tiny_logo.png",
          }}
        />
      </View>
      <View style={styles.right.container}>
        <View style={styles.right.top.container}>
          <Text style={styles.text}>
            {currentUser.id === user.id ? "Siz" : fullName}
          </Text>
          <View style={styles.badge.container}>
            <Text style={styles.badge.text}>{user.role.name}</Text>
          </View>
        </View>
        <View style={styles.right.bottom.container}>
            <Text style={styles.right.bottom.text}>{user.userName}</Text>
        </View>
      </View>
    </View>
  );
}

export default ChannelDetailUserCard;
