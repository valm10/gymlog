import React from "react";
import { Text, View, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import { supabase } from "../../lib/supabase";
import { styles } from "./style";

export default function Settings() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>

      <Pressable
        style={styles.card}
        accessibilityRole="button"
        onPress={() => navigation.navigate("Help" as never)}
      >
        <Feather name="info" size={22} color="#fff" />
        <Text style={styles.cardText}>Help & Tips</Text>
      </Pressable>

      <Pressable
        style={[styles.card, styles.signOut]}
        accessibilityRole="button"
        onPress={() => supabase.auth.signOut()}
      >
        <Feather name="log-out" size={22} color="#fff" />
        <Text style={styles.cardText}>Sign out</Text>
      </Pressable>
    </View>
  );
}
