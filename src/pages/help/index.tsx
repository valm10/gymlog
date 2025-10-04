import React from "react";
import { ScrollView, View, Text, StyleSheet } from "react-native";
import theme from "../../global/themes";

export default function Help() {
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#fff" }}
      contentContainerStyle={styles.content}
    >
      <Text style={styles.h1}>Help & Tips</Text>

      <View style={styles.block}>
        <Text style={styles.h2}>What is this app?</Text>
        <Text style={styles.p}>
          Gym Log is a simple workout journal. You pick an exercise, add sets
          with reps and weight, and the app remembers what you did.
        </Text>
      </View>

      <View style={styles.block}>
        <Text style={styles.h2}>Quick start</Text>
        <Text style={styles.li}>
          • Tap the orange + button to start a workout for today.
        </Text>
        <Text style={styles.li}>
          • Choose an exercise, fill reps, sets, and weight.
        </Text>
        <Text style={styles.li}>
          • Press <Text style={styles.bold}>Add Exercise</Text> to log it.
        </Text>
      </View>

      <View style={styles.block}>
        <Text style={styles.h2}>Looking back</Text>
        <Text style={styles.li}>
          • The calendar shows days you trained (orange dots).
        </Text>
        <Text style={styles.li}>
          • Tap a day to see workouts from that date.
        </Text>
      </View>

      <View style={styles.block}>
        <Text style={styles.h2}>Editing</Text>
        <Text style={styles.li}>
          • To delete a set: <Text style={styles.bold}>press and hold</Text> a
          set in the list, then confirm delete.
        </Text>
        <Text style={styles.li}>
          • Want the same as last time? Use “Duplicate last set”.
        </Text>
      </View>

      <View style={styles.block}>
        <Text style={styles.h2}>Timers & rest</Text>
        <Text style={styles.p}>
          Use the orange rest timer at the bottom to time your breaks. Pick a
          preset or type the seconds you want.
        </Text>
      </View>

      <View style={styles.block}>
        <Text style={styles.h2}>Accounts & safety</Text>
        <Text style={styles.li}>• Your data is linked to your account.</Text>
        <Text style={styles.li}>• You can log out anytime from Settings.</Text>
      </View>

      <Text style={styles.footer}>Have fun and lift safely 💪</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 16, gap: 14 },
  h1: {
    fontSize: 20,
    fontWeight: "800",
    color: "#111",
    textAlign: "center",
    marginBottom: 6,
  },
  h2: { fontSize: 16, fontWeight: "700", color: "#111", marginBottom: 6 },
  p: { color: "rgba(0,0,0,0.8)" },
  li: { color: "rgba(0,0,0,0.8)", marginBottom: 4 },
  bold: { fontWeight: "700", color: "#111" },
  block: {
    borderRadius: 12,
    backgroundColor: "#fff",
    padding: 12,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.08)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
  footer: {
    textAlign: "center",
    color: theme.colors.primary,
    fontWeight: "700",
    marginTop: 8,
    marginBottom: 20,
  },
});
