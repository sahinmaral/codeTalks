import { Dimensions, StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  channelListContainer: { flex: 1, padding: 10, backgroundColor: colors.white },
  channelCardContainer: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    height: Dimensions.get("window").height,
  },
  modal: {
    overlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "flex-end",
    },
  },
  channelCard: {
    main: {
      width: "100%",
      padding:10,
      borderRadius: 5,
      borderWidth: 1,
      borderColor: colors.stone[300],
    },
    photo: {
      main: {flex:1.5/10},
      container:{
        width: 50,
        height: 50,
        borderRadius:25
      }
    },  
    content: {
      container:{
        flexDirection: "row",
      },
      left:{
        container: {
          flex:9/10,
          gap:15,
          flexDirection: "row",
          alignItems: "center",
        },
      },
      right:{
        container:{
          flex:1/10,
          paddingLeft:10,
          flexDirection: "row",
          justifyContent:'center',
          alignItems: "center",
        }
      }
    },
    text: {
      main:{ flex: 8.5 / 10 },
      content:{
        color: colors.orange[400],
        fontWeight: "bold",
        fontSize: 20,
      }
    },
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
