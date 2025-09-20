import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Alert,
  TextInput,
  Button,
  FlatList,
  Modal,
  Pressable,
} from "react-native";
import {
  addSet,
  getTodayWorkout,
  listExercises,
  listSets,
  startWorkout,
} from "../../services/db";

export default function LogToday() {
  const [workoutId, setWorkoutId] = useState<string | null>(null);
  const [exerciseId, setExerciseId] = useState<string>("");
  const [reps, setReps] = useState("10");
  const [weight, setWeight] = useState("40");
  const [sets, setSets] = useState<any[]>([]);
  const [exercises, setExercises] = useState<any[]>([]);
  const [pickerOpen, setPickerOpen] = useState(false);

  useEffect(() => {
    (async () => {
      const w = await getTodayWorkout();
      if (!w) {
        const nw = await startWorkout();
        setWorkoutId(nw.id);
      } else {
        setWorkoutId(w.id);
        const s = await listSets(w.id);
        setSets(s);
      }
      const ex = await listExercises();
      setExercises(ex);
      if (ex[0]) setExerciseId(ex[0].id);
    })().catch((e) => Alert.alert("Error", e.message));
  }, []);

  const onAdd = async () => {
    if (!workoutId || !exerciseId) return;
    const s = await addSet(
      workoutId,
      exercise_id,
      sets.length + 1,
      Number(reps),
      Number(weight)
    );
  };

  return (
    <View style={{ flex: 1, padding: 16, gap: 10 }}>
      <Text style={{ fontSize: 20, fontWeight: "700" }}>Today’s workout</Text>

      {!workoutId ? (
        <Button
          title="Start workout"
          onPress={async () => {
            const w = await startWorkout();
            setWorkoutId(w.id);
          }}
        />
      ) : (
        <>
          <Text>Exercise</Text>
          <Pressable
            onPress={() => setPickerOpen(true)}
            style={{ borderWidth: 1, padding: 12, borderRadius: 8 }}
          >
            <Text>
              {exercises.find((e) => e.id === exerciseId)?.name ||
                "Select exercise"}
            </Text>
          </Pressable>

          <Modal visible={pickerOpen} transparent animationType="fade">
            <Pressable
              onPress={() => setPickerOpen(false)}
              style={{
                flex: 1,
                backgroundColor: "rgba(0,0,0,0.3)",
                justifyContent: "center",
              }}
            >
              <View
                style={{
                  margin: 24,
                  backgroundColor: "#fff",
                  borderRadius: 12,
                  maxHeight: "60%",
                }}
              >
                <FlatList
                  data={exercises}
                  keyExtractor={(i) => i.id}
                  renderItem={({ item }) => (
                    <Pressable
                      onPress={() => {
                        setExerciseId(item.id);
                        setPickerOpen(false);
                      }}
                      style={{
                        padding: 14,
                        borderBottomWidth: 1,
                        borderColor: "#eee",
                      }}
                    >
                      <Text>{item.name}</Text>
                    </Pressable>
                  )}
                  ListEmptyComponent={
                    <Text style={{ padding: 14 }}>No exercises</Text>
                  }
                />
              </View>
            </Pressable>
          </Modal>

          <Text>Reps</Text>
          <TextInput
            style={{ borderWidth: 1, padding: 8 }}
            value={reps}
            onChangeText={setReps}
            keyboardType="numeric"
          />
          <Text>Weight (kg)</Text>
          <TextInput
            style={{ borderWidth: 1, padding: 8 }}
            value={weight}
            onChangeText={setWeight}
            keyboardType="numeric"
          />
          <Button
            title="Add set"
            onPress={async () => {
              if (!workoutId || !exerciseId) return;
              const s = await addSet(
                workoutId,
                exerciseId,
                sets.length + 1,
                Number(reps),
                Number(weight)
              );
              setSets((prev) => [...prev, s]);
            }}
          />

          <Text style={{ marginTop: 16, fontWeight: "600" }}>Today’s sets</Text>
          <FlatList
            data={sets}
            keyExtractor={(i) => i.id}
            renderItem={({ item }) => (
              <Text>
                {item.exercises?.name ?? item.exercise_id} — {item.reps} reps @{" "}
                {item.weight_kg ?? 0}kg
              </Text>
            )}
          />
        </>
      )}
    </View>
  );
}
