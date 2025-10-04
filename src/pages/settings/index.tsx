import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import { supabase } from "../../lib/supabase";
import theme from "../../global/themes";

export default function Settings() {
  const navigation = useNavigation();

  const onHelp = () => navigation.navigate("Help" as never);
  const onSignOut = () => supabase.auth.signOut();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>

      <Pressable
        style={styles.card}
        onPress={onHelp}
        accessibilityRole="button"
      >
        <Feather name="info" size={22} color="#fff" />
        <Text style={styles.cardText}>Help & Tips</Text>
      </Pressable>

      <Pressable
        style={[styles.card, { backgroundColor: "#111" }]}
        onPress={onSignOut}
        accessibilityRole="button"
      >
        <Feather name="log-out" size={22} color="#fff" />
        <Text style={styles.cardText}>Sign out</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
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
  cardText: { color: "#fff", fontWeight: "700", fontSize: 16 },
});
