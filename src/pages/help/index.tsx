import React from "react";
import { ScrollView, Text, View, Linking } from "react-native";
import theme from "../../global/themes";

export default function Help() {
  const Bullet = ({ children }: React.PropsWithChildren) => (
    <View style={{ flexDirection: "row", marginBottom: 8 }}>
      <Text style={{ marginRight: 8 }}>•</Text>
      <Text style={{ flex: 1 }}>{children}</Text>
    </View>
  );
  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={{ padding: 16, gap: 12 }}>
        <Text style={{ fontSize: 20, fontWeight: "800" }}>Help & Tips</Text>
        <Text style={{ color: "rgba(0,0,0,0.7)" }}>
          Quick guide to using the app
        </Text>

        <Text style={{ fontWeight: "700", marginTop: 8 }}>Shortcuts</Text>
        <Bullet>
          Tap “Duplicate last set” to add the same previous set you were doing.
        </Bullet>
        <Bullet>Use the recent exercises list to switch quickly.</Bullet>

        <Text style={{ fontWeight: "700", marginTop: 8 }}>Common issues</Text>
        <Bullet>
          “Add” stays disabled → fill all fields with valid numbers.
        </Bullet>
        <Bullet>
          Deleted a set by mistake? Tap{" "}
          <Text style={{ color: theme.colors.primary, fontWeight: "700" }}>
            Undo
          </Text>{" "}
          on the notifications.
        </Bullet>

        <Text style={{ fontWeight: "700", marginTop: 8 }}>Contact</Text>
        <Bullet>
          Found a bug?{" "}
          <Text
            style={{ color: theme.colors.primary, fontWeight: "700" }}
            onPress={() => Linking.openURL("mailto:vitorlopesmeD@gmail.com")}
          >
            Email support
          </Text>
        </Bullet>
      </View>
    </ScrollView>
  );
}
