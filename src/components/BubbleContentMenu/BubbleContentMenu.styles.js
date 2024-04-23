import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 90,
    right: 10,
    borderRadius: 10,
    backgroundColor: "lightblue",
    paddingTop: 10,
    paddingBottom: 20,
  },
  menuItemContainer: {
    padding: 10,
    borderBottomColor: "white",
    borderBottomWidth: 1,
  },
  menuItemText: { color: "black" },
  bubbleNeedle: {
    position: "absolute",
    bottom: 70,
    right: 20,
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderBottomWidth: 20,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "lightblue",
    transform: [{ rotate: "180deg" }],
  },
});

export default styles;
