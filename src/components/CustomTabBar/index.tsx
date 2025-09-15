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
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";

export default function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  const { onOpen } = useContext(AuthContextList) as { onOpen: () => void };

  const go = (screenName: string) => navigation.navigate(screenName as never);

  return (
    <View style={styles.tabArea}>
      <TouchableOpacity style={styles.tabItem} onPress={() => go("Home")}>
        <Fontisto
          name="player-settings"
          style={{
            opacity: state.index === 0 ? 1 : 0.3,
            color: themas.colors.primary,
            fontSize: 32,
          }}
        />
      </TouchableOpacity>

      <TouchableOpacity style={styles.tabItemButtom} onPress={onOpen}>
        <View style={{ width: "100%", left: 10, top: 4 }}>
          <Ionicons name="add" size={35} color="#FFF" />
        </View>
        <View
          style={{
            flexDirection: "row-reverse",
            width: "100%",
            right: 10,
            bottom: 10,
          }}
        >
          <MaterialIcons name="edit-note" size={30} color="#FFF" />
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.tabItem} onPress={() => go("Settings")}>
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
}
