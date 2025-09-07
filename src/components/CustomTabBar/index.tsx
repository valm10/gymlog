import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { styles } from "./style";
import {
  Fontisto,
  FontAwesome,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";

export default ({ state, navigation }) => {
  return (
    <View style={styles.tabArea}>
      <TouchableOpacity style={styles.tabItem}>
        <Fontisto name="player-settings" style={{ fontSize: 32 }} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.tabItemButtom}>
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
      <TouchableOpacity style={styles.tabItem}>
        <FontAwesome name="user" style={{ fontSize: 32 }} />
      </TouchableOpacity>
    </View>
  );
};
