import React, { useEffect, useState } from "react";
import { View, Text, Alert, TextInput, Button, FlatList } from "react-native";
import {
  addSet,
  getTodayWorkout,
  listExercises,
  listSets,
  startWorkout,
} from "../../service/db";

export default function LogToday() {
  const [workoutId, setWorkoutId] = useState<string | null>(null);
  const [exercises, setExercises] = useState<any[]>([]);
  const [exerciseId, setExerciseId] = useState<string | null>(null);
  const [reps, setReps] = useState("10");
  const [weight, setWeight] = useState("40");
  const [sets, setSets] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const w = await getTodayWorkout();
      if (w) setWorkoutId(w.id);
      const ex = await listExercises();
      setExercises(ex);
      if (ex[0]) setExerciseId(ex[0].id);
      if (w) {
        const s = await listSets(w.id);
        setSets(s);
      }
    })().catch((e) => Alert.alert("Erro", e.message));
  }, []);

  const onStart = async () => {
    const w = await startWorkout();
    setWorkoutId(w.id);
  };

  const onAdd = async () => {
    if (!workoutId || !exerciseId) return;
    const s = await addSet(
      workoutId,
      exerciseId,
      sets.length + 1,
      Number(reps),
      Number(weight)
    );
    setSets((prev) => [...prev, s]);
  };

  return (
    <View style={{ flex: 1, padding: 16, gap: 10 }}>
      <Text style={{ fontSize: 20, fontWeight: "700" }}>
        Log do treino de hoje
      </Text>

      {!workoutId ? (
        <Button title="Iniciar treino" onPress={onStart} />
      ) : (
        <>
          <Text>Exercício:</Text>
          {/* Para simplificar, um input exibindo o id do exercício (troque por picker depois) */}
          <TextInput
            style={{ borderWidth: 1, padding: 8 }}
            value={exerciseId ?? ""}
            onChangeText={setExerciseId}
          />

          <Text>Reps</Text>
          <TextInput
            style={{ borderWidth: 1, padding: 8 }}
            value={reps}
            onChangeText={setReps}
            keyboardType="numeric"
          />
          <Text>Peso (kg)</Text>
          <TextInput
            style={{ borderWidth: 1, padding: 8 }}
            value={weight}
            onChangeText={setWeight}
            keyboardType="numeric"
          />

          <Button title="Adicionar set" onPress={onAdd} />

          <Text style={{ marginTop: 16, fontWeight: "600" }}>Sets de hoje</Text>
          <FlatList
            data={sets}
            keyExtractor={(item) => item.id}
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
