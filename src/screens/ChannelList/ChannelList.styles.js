import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  channelListContainer: {
    flex: 1,
    padding:10,
    backgroundColor: colors.white,
  },
  channelCardContainer: {
    borderRadius: 5,
    borderWidth: 1,
    borderColor: colors.stone[300],
    flexDirection: "row",
    padding:10
  },
  channelCardPhoto:{
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  channelCardContentLeftPartContainer:{
    flex: 9 / 10,
    gap: 15,
    flexDirection: "row",
  },
  channelCardContentRightPartContainer: {
    flex: 1 / 10,
    flexDirection: "row",
    alignItems:'center',
    justifyContent:'center'
  },
  channelCardHeaderContainer:{ flex: 8.5 / 10 },
  channelCardHeaderText:{
    color: colors.orange[400],
    fontWeight: "bold",
    fontSize: 20,
  },
  showBubbleContentMenuButton: {
    position: "absolute",
    bottom: 10,
    right: 10,
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.orange[400],
  },
});

export default styles;
