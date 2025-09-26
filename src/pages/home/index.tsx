import React, { useEffect, useMemo, useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { Calendar, DateObject } from "react-native-calendars";
import { useNavigation } from "@react-navigation/native";
import BottomTimer from "../../components/BottomTimer";
import { listWorkoutDatesInRange } from "../../services/db";
import theme from "../../global/themes";

function monthRange(year: number, month: number) {
  const first = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0));
  const last = new Date(Date.UTC(year, month, 0, 23, 59, 59));
  return { from: first.toISOString(), to: last.toISOString() };
}

export default function Home() {
  const navigation = useNavigation();
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
    // keep today visually selected if desired
    if (!m[today]) {
      m[today] = { selected: true, selectedColor: "#FFE6D1" };
    }
    return m;
  }, [workoutDays]);

  const onDayPress = (d: DateObject) => {
    navigation.navigate(
      "DayWorkouts" as never,
      { date: d.dateString } as never
    );
  };

  return (
    <View style={styles.container}>
      <Calendar
        markedDates={marked}
        onDayPress={onDayPress}
        onMonthChange={(m) => setVisible({ y: m.year, m: m.month })}
        enableSwipeMonths
      />
      <BottomTimer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingBottom: 100 },
});
