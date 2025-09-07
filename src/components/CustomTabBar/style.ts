import { StyleSheet } from "react-native";
import { themas } from "../../global/themes";

export const styles = StyleSheet.create({
  tabArea: {
    flexDirection: "row",
    height: 80,
    justifyContent: "space-around",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,
  },

  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  tabItemButtom: {
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: "center",
    zIndex: 9999,
    top: -30,
    backgroundColor: themas.colors.primary,
  },
});
