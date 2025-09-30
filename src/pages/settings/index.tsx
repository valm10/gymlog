import React from "react";
import { Text, View, Button } from "react-native";
import { supabase } from "../../lib/supabase";
import { useNavigation } from "@react-navigation/native";

export default function Settings() {
  const nav = useNavigation();
  return (
    <View style={{ flex: 1, padding: 16, gap: 12, backgroundColor: "#fff" }}>
      <Text style={{ fontSize: 18, fontWeight: "700" }}>Settings</Text>
      <Button
        title="Help & Tips"
        onPress={() => nav.navigate("Help" as never)}
      />
      <Button title="Sign out" onPress={() => supabase.auth.signOut()} />
    </View>
  );
}
