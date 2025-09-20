import { StyleSheet } from "react-native";
import theme from "../../global/themes";
export const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 94,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 14,
    backgroundColor: theme.colors.primary,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  time: { fontSize: 18, fontWeight: "700", color: "#fff" },
  row: {
    flexDirection: "row",
    gap: 16,
    marginTop: 8,
  },
});
