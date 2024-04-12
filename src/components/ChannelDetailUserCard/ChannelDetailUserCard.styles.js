import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  text: { color: colors.black, fontSize: 15 },
  container: {
    borderRadius: 10,
    marginVertical: 10,
    backgroundColor: colors.white,
    padding: 10,
    gap: 15,
    flexDirection: "row",
  },
  left: {
    container: {
      flex: 1.5 / 10,
    },
  },
  photo: {
    container: {
      width: 50,
      height: 50,
      borderRadius: 25,
    },
  },
  badge: {
    container: {
      backgroundColor: "gray",
      padding: 5,
      borderRadius: 5,
    },
    text: { color: colors.white, fontSize: 10 },
  },
  right: {
    container: {
      flex: 8.5 / 10,
    },
    bottom: {
      container: {
        flex: 1,
        justifyContent:"flex-end"
      },
      text: { color: colors.black, fontSize: 12 },
    },
    top: {
      container: {
        flex: 1,
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "space-between",
      },
    },
  },
});

export default styles;
