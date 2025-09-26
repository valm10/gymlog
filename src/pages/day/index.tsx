import React, { useEffect, useState } from "react";
import { View, Text, FlatList, ActivityIndicator, Alert } from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";
import type { RootStackParamList } from "../../routes/types";
import { listWorkoutsByDate } from "../../services/db";

type R = RouteProp<RootStackParamList, "DayWorkouts">;

export default function DayWorkouts() {
  const { params } = useRoute<R>();
  const { date } = params;
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<
    Array<{ id: string; started_at: string; notes: string | null }>
  >([]);

  useEffect(() => {
    (async () => {
      try {
        const data = await listWorkoutsByDate(date);
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
        Workouts on {date}
      </Text>
      <FlatList
        data={items}
        keyExtractor={(i) => i.id}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        renderItem={({ item }) => {
          const t = new Date(item.started_at);
          const hh = String(t.getHours()).padStart(2, "0");
          const mm = String(t.getMinutes()).padStart(2, "0");
          return (
            <View
              style={{
                borderWidth: 1,
                borderColor: "rgba(0,0,0,0.08)",
                borderRadius: 12,
                padding: 12,
                backgroundColor: "#fafafa",
              }}
            >
              <Text style={{ fontWeight: "600" }}>
                Workout at {hh}:{mm}
              </Text>
              {item.notes ? (
                <Text style={{ marginTop: 4, color: "rgba(0,0,0,0.7)" }}>
                  {item.notes}
                </Text>
              ) : null}
            </View>
          );
        }}
        ListEmptyComponent={
          <Text style={{ color: "rgba(0,0,0,0.6)" }}>
            No workouts on this day.
          </Text>
        }
      />
    </View>
  );
}
