import { StyleSheet } from "react-native";
import colors from "../../../styles/colors";

const styles = StyleSheet.create({
  modalContainer: {
    justifyContent: "space-between",
    backgroundColor: colors.stone[100],
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  headerContainer:{
    gap:10,
    paddingBottom:10
  },
  headerText: { fontSize: 20, textAlign: "center", color: "black", fontWeight:"bold" },
  description: { fontSize: 16, textAlign: "center", fontWeight:"semibold" },
  tooltipContainer: {
    padding: 10,
  },
  menuItemContainer: {
    paddingTop: 5,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "lightgray",
  },
  menuItemText: {
    textAlign: "center",
    color: "black",
    fontSize: 16,
  },
});

export default styles;
