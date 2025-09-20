import { Dimensions, StyleSheet } from "react-native";
import theme from "../../global/themes";
export const style = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
  boxTop: {
    width: "100%",
    height: Dimensions.get("window").height / 3,
    alignItems: "center",
    justifyContent: "center",
  },
  boxMid: {
    width: "100%",
    height: Dimensions.get("window").height / 4,
    paddingHorizontal: 24,
    gap: 4,
  },
  boxBottom: {
    width: "100%",
    paddingHorizontal: 24,
    marginTop: 24,
  },
  logo: { width: 80, height: 80, borderRadius: 5 },
  text: { fontWeight: "bold", marginTop: 40, fontSize: 18 },
  textBottom: { fontSize: 16, color: theme.colors.gray },
  textBottomCreate: { fontSize: 16, color: theme.colors.primary },
});
