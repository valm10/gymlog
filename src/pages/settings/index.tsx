import React from "react";
import { Text, View, Button } from "react-native";
import { supabase } from "../../lib/supabase";

export default function Settings() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 12,
      }}
    >
      <Text>Settings</Text>
      <Button title="Sign out" onPress={() => supabase.auth.signOut()} />
    </View>
  );
}
