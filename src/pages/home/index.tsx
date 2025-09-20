import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, StyleSheet } from "react-native";
import { Calendar } from "react-native-calendars";
import BottomTimer from "../../components/BottomTimer";

export default function Home() {
  const today = new Date().toISOString().split("T")[0];
  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <View style={styles.container}>
        <View style={styles.card}>
          <Calendar
            markedDates={{
              [today]: { selected: true, selectedColor: "#FF6A00" },
            }}
            theme={{
              todayTextColor: "#FF6A00",
              selectedDayBackgroundColor: "#FF6A00",
              arrowColor: "#111",
              monthTextColor: "#111",
              textSectionTitleColor: "rgba(0,0,0,0.6)",
            }}
          />
        </View>
        <View style={{ height: 120 }} />
      </View>
      <BottomTimer />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f7f7f8" },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  card: {
    borderRadius: 16,
    backgroundColor: "#fff",
    padding: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
    overflow: "hidden",
  },
});
