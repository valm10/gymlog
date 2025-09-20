import { StyleSheet } from "react-native";
import theme from "../../global/themes";
export const styles = StyleSheet.create({
  boxInput: {
    width: "100%",
    height: 44,
    borderWidth: 1,
    borderRadius: 40,
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    backgroundColor: theme.colors.lightGray,
    borderColor: theme.colors.lightGray,
  },
  input: { height: "100%", borderRadius: 40 },
  titleInput: { marginLeft: 5, color: theme.colors.gray, marginTop: 20 },
  Icon: { width: "100%" },
  Button: { width: "10%" },
});
