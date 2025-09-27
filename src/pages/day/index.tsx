import React, { useEffect, useState } from "react";
import { View, Text, FlatList, ActivityIndicator, Alert } from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";
import type { RootStackParamList } from "../../routes/types";
import {
  listExercisesDoneOnDate,
  type ExerciseSummaryForDate,
} from "../../services/db";

type R = RouteProp<RootStackParamList, "DayWorkouts">;

export default function DayWorkouts() {
  const { params } = useRoute<R>();
  const { date } = params;

  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<ExerciseSummaryForDate[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const data = await listExercisesDoneOnDate(date);
        setItems(data);
      } catch (e: any) {
        Alert.alert("Error", e.message || String(e));
      } finally {
        setLoading(false);
      }
    })();
  }, [date]);

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: "#fff" }}>
      <Text style={{ fontSize: 18, fontWeight: "700", marginBottom: 8 }}>
        Exercises on {date}
      </Text>

      <FlatList
        data={items}
        keyExtractor={(i) => i.exercise_id}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        renderItem={({ item }) => (
          <View
            style={{
              borderWidth: 1,
              borderColor: "rgba(0,0,0,0.08)",
              borderRadius: 12,
              padding: 12,
              backgroundColor: "#fafafa",
            }}
          >
            <Text style={{ fontWeight: "700", color: "#111" }}>
              {item.name}
            </Text>
            <Text style={{ marginTop: 4, color: "rgba(0,0,0,0.7)" }}>
              {item.sets} {item.sets === 1 ? "set" : "sets"}
              {item.lastReps != null || item.lastWeight != null
                ? ` • last: ${item.lastReps ?? "—"} reps @ ${item.lastWeight ?? "—"} kg`
                : ""}
            </Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={{ color: "rgba(0,0,0,0.6)" }}>
            No exercises logged on this day.
          </Text>
        }
        contentContainerStyle={{ paddingBottom: 24 }}
      />
    </View>
  );
}
