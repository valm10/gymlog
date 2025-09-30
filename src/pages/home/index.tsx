import React, { useEffect, useMemo, useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Calendar, DateData } from "react-native-calendars";
import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import type { RootStackParamList } from "../../routes/types";
import BottomTimer from "../../components/BottomTimer";
import { listWorkoutDatesInRange } from "../../services/db";
import theme from "../../global/themes";

function monthRange(year: number, month: number) {
  const first = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0));
  const last = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));
  return { from: first.toISOString(), to: last.toISOString() };
}

export default function Home() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const today = new Date().toISOString().split("T")[0];

  const [visible, setVisible] = useState<{ y: number; m: number }>(() => {
    const d = new Date();
    return { y: d.getFullYear(), m: d.getMonth() + 1 };
  });
  const [workoutDays, setWorkoutDays] = useState<string[]>([]);

  async function loadMonth(y: number, m: number) {
    try {
      const { from, to } = monthRange(y, m);
      const days = await listWorkoutDatesInRange(from, to);
      setWorkoutDays(days);
    } catch (e: any) {
      Alert.alert("Error", e.message || String(e));
    }
  }

  useEffect(() => {
    loadMonth(visible.y, visible.m);
  }, [visible.y, visible.m]);

  const marked = useMemo(() => {
    const m: Record<string, any> = {};
    for (const d of workoutDays) {
      m[d] = { selected: true, selectedColor: theme.colors.orangeLight };
    }
    if (!m[today]) {
      m[today] = { selected: true, selectedColor: "#FFE6D1" };
    }
    return m;
  }, [workoutDays, today]);

  const onDayPress = (d: DateData) => {
    navigation.navigate("DayWorkouts", { date: d.dateString });
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <View style={styles.container}>
        <View style={styles.calendarCard}>
          <Calendar
            markedDates={marked}
            onDayPress={onDayPress}
            onMonthChange={(m: DateData) =>
              setVisible({ y: m.year, m: m.month })
            }
            enableSwipeMonths
            theme={{
              calendarBackground: "#fff",
              textSectionTitleColor: "rgba(0,0,0,0.5)",
              dayTextColor: "#111",
              monthTextColor: "#111",
              todayTextColor: theme.colors.primary,
              arrowColor: "#111",
            }}
            style={{ borderRadius: 16 }}
          />
        </View>
      </View>

      <BottomTimer />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 100,
    backgroundColor: "#fff",
  },
  calendarCard: {
    borderRadius: 16,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
});
