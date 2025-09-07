import React, { useContext } from "react";
import { TouchableOpacity, View } from "react-native";
import { styles } from "./style";
import {
  Fontisto,
  FontAwesome,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
import { themas } from "../../global/themes";
import { AuthContextList } from "../../context/authContext_list";

export default ({ state, navigation }) => {
  const { onOpen } = useContext(AuthContextList) as { onOpen: () => void };
  const go = (screenName: string) => {
    navigation.navigate(screenName);
  };

  return (
    <View style={styles.tabArea}>
      <TouchableOpacity style={styles.tabItem} onPress={() => go("Settings")}>
        <Fontisto
          name="player-settings"
          style={{
            opacity: state.index === 0 ? 1 : 0.3,
            color: themas.colors.primary,
            fontSize: 32,
          }}
        />
      </TouchableOpacity>
      //It looks like a mess but trust it works
      <TouchableOpacity style={styles.tabItemButtom} onPress={onOpen}>
        <View style={{ width: "100%", left: 10, top: 4 }}>
          <Ionicons name="add" size={35} color={"#FFF"} />
        </View>
        <View
          style={{
            flexDirection: "row-reverse",
            width: "100%",
            right: 10,
            bottom: 10,
          }}
        >
          <MaterialIcons name="edit-note" size={30} style={{ color: "#FFF" }} />
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.tabItem} onPress={() => go("User")}>
        <FontAwesome
          name="user"
          style={{
            opacity: state.index === 1 ? 1 : 0.3,
            color: themas.colors.primary,
            fontSize: 32,
          }}
        />
      </TouchableOpacity>
    </View>
  );
};
