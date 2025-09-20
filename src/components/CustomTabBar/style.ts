import { StyleSheet } from "react-native";
import theme from "../../global/themes";

export const styles = StyleSheet.create({
  wrap: {
    backgroundColor: "#fff",
  },
  tabArea: {
    flexDirection: "row",
    height: 64,
    alignItems: "center",
    justifyContent: "space-around",
    borderTopWidth: 0.5,
    borderColor: "rgba(0,0,0,0.08)",
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  tabLabel: {
    fontSize: 11,
    color: "rgba(0,0,0,0.45)",
  },
  tabLabelFocus: {
    color: theme.colors.primary,
    fontWeight: "600",
  },
  fab: {
    position: "absolute",
    alignSelf: "center",
    bottom: 32,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
});
