import { StyleSheet } from "react-native";
import theme from "../../global/themes";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    gap: 16,
  },
  title: {
    position: "absolute",
    top: 24,
    alignSelf: "center",
    fontSize: 18,
    fontWeight: "700",
    color: "#111",
  },
  card: {
    width: "86%",
    minHeight: 56,
    borderRadius: 14,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  signOut: {
    backgroundColor: "#111",
  },
  cardText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});
