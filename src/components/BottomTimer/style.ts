import { StyleSheet } from "react-native";
import theme from "../../global/themes";
export const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 94,
    padding: 14,
    borderRadius: 14,
    backgroundColor: theme.colors.primary,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  time: { fontSize: 18, fontWeight: "700", color: "#fff" },
  row: { flexDirection: "row", gap: 16, marginTop: 8, alignItems: "center" },
  inputWrap: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  input: {
    flex: 1,
    height: 40,
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: "rgba(255,255,255,0.12)",
    color: "#fff",
  },
  pillRow: { flexDirection: "row", gap: 8, marginTop: 8 },
  pill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.15)",
  },
  pillText: { color: "#fff" },
  btnText: { color: "#fff" },
});
