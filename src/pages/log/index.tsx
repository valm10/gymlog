import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  Alert,
  TextInput,
  SectionList,
  Modal,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "./style";
import {
  addSet,
  getTodayWorkout,
  listExercises,
  listSets,
  startWorkout,
} from "../../services/db";

type Exercise = { id: string; name: string; muscle_group?: string | null };
type SetRow = {
  id: string;
  workout_id: string;
  exercise_id: string;
  set_number: number | null;
  reps: number | null;
  weight_kg: number | null;
  created_at?: string | null;
  exercises?: { name: string } | null;
};

type Section = { title: string; exerciseId: string; data: SetRow[] };

export default function LogToday() {
  const [workoutId, setWorkoutId] = useState<string | null>(null);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [setsData, setSetsData] = useState<SetRow[]>([]);
  const [pickerOpen, setPickerOpen] = useState(false);

  // form
  const [exerciseId, setExerciseId] = useState<string>("");
  const [reps, setReps] = useState<string>("10");
  const [setsCount, setSetsCount] = useState<string>("1");
  const [weight, setWeight] = useState<string>("40");
  const [busy, setBusy] = useState(false);

  const exerciseById = useMemo(() => {
    const m: Record<string, string> = {};
    for (const e of exercises) m[e.id] = e.name;
    return m;
  }, [exercises]);

  const selectedExerciseName =
    exercises.find((e) => e.id === exerciseId)?.name || "Choose exercise";

  useEffect(() => {
    (async () => {
      const w = await getTodayWorkout();
      if (!w) {
        const nw = await startWorkout();
        setWorkoutId(nw.id);
      } else {
        setWorkoutId(w.id);
        const s = (await listSets(w.id)) as SetRow[];
        setSetsData(s);
      }
      const ex = (await listExercises()) as Exercise[];
      setExercises(ex);
      if (ex[0]) setExerciseId(ex[0].id);
    })().catch((e: any) => Alert.alert("Error", e.message || String(e)));
  }, []);

  async function onAddExercise() {
    if (!workoutId) return Alert.alert("Error", "Start a workout first.");
    if (!exerciseId) return Alert.alert("Error", "Select an exercise.");

    const r = Number(reps);
    const w = Number(weight);
    const c = Math.max(1, Number(setsCount));
    if (!Number.isFinite(r) || r <= 0)
      return Alert.alert("Error", "Reps must be > 0.");
    if (!Number.isFinite(w) || w < 0)
      return Alert.alert("Error", "Weight must be ≥ 0.");

    setBusy(true);
    try {
      // per-exercise numbering baseline
      const existingForExercise = setsData.filter(
        (s) => s.exercise_id === exerciseId
      );
      const startNum = existingForExercise.length + 1;

      const created: SetRow[] = [];
      for (let i = 0; i < c; i += 1) {
        const sr = (await addSet(
          workoutId,
          exerciseId,
          startNum + i, // per-exercise set numbering
          r,
          w
        )) as SetRow;
        created.push({
          ...sr,
          exercises: {
            name: exerciseById[sr.exercise_id] || selectedExerciseName,
          },
        });
      }
      setSetsData((prev) => [...prev, ...created]);
      setSetsCount("1");
    } catch (e: any) {
      Alert.alert("Error", e.message || String(e));
    } finally {
      setBusy(false);
    }
  }

  const sections: Section[] = useMemo(() => {
    // group by exercise id; order groups by first appearance
    const order: string[] = [];
    const map: Record<string, SetRow[]> = {};
    for (const s of setsData) {
      const k = s.exercise_id;
      if (!map[k]) {
        map[k] = [];
        order.push(k);
      }
      map[k].push(s);
    }
    return order.map((exerciseId) => ({
      title: exerciseById[exerciseId] || "Exercise",
      exerciseId,
      data: map[exerciseId]
        .slice()
        .sort((a, b) => (a.set_number ?? 0) - (b.set_number ?? 0)),
    }));
  }, [setsData, exerciseById]);

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>Workout Log</Text>

          <Text style={styles.label}>Exercise</Text>
          <Pressable
            onPress={() => setPickerOpen(true)}
            style={styles.picker}
            android_ripple={{ color: "#eee" }}
          >
            <Text style={styles.pickerText}>{selectedExerciseName}</Text>
          </Pressable>

          <View style={styles.row}>
            <View style={styles.field}>
              <Text style={styles.label}>Reps</Text>
              <TextInput
                value={reps}
                onChangeText={setReps}
                keyboardType="number-pad"
                style={styles.input}
                placeholder="10"
              />
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>Sets</Text>
              <TextInput
                value={setsCount}
                onChangeText={setSetsCount}
                keyboardType="number-pad"
                style={styles.input}
                placeholder="1"
              />
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>Weight (kg)</Text>
              <TextInput
                value={weight}
                onChangeText={setWeight}
                keyboardType="decimal-pad"
                style={styles.input}
                placeholder="40"
              />
            </View>
          </View>

          <Pressable
            onPress={onAddExercise}
            style={[styles.cta, busy && { opacity: 0.6 }]}
            disabled={busy}
          >
            {busy ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.ctaText}>Add Exercise</Text>
            )}
          </Pressable>
        </View>

        <View style={styles.card}>
          <Text style={styles.title}>Today’s workout</Text>
          <SectionList
            sections={sections}
            keyExtractor={(item) => item.id}
            ItemSeparatorComponent={() => <View style={styles.sep} />}
            SectionSeparatorComponent={() => <View style={{ height: 12 }} />}
            renderSectionHeader={({ section }) => (
              <Text style={styles.sectionTitle}>{section.title}</Text>
            )}
            renderItem={({ item }) => (
              <View style={styles.setRow}>
                <Text style={styles.setMeta}>
                  Set {item.set_number ?? "—"} • {item.reps ?? 0} reps @{" "}
                  {item.weight_kg ?? 0} kg
                </Text>
              </View>
            )}
            ListEmptyComponent={
              <Text style={styles.empty}>
                No sets yet. Add your first exercise.
              </Text>
            }
          />
        </View>
      </View>

      <Modal visible={pickerOpen} transparent animationType="fade">
        <Pressable
          onPress={() => setPickerOpen(false)}
          style={styles.modalBackdrop}
        >
          <View style={styles.modalCard}>
            <SectionList
              sections={[{ title: "Exercises", data: exercises }]}
              keyExtractor={(i) => i.id}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => {
                    setExerciseId(item.id);
                    setPickerOpen(false);
                  }}
                  style={styles.modalItem}
                >
                  <Text style={styles.modalItemText}>{item.name}</Text>
                </Pressable>
              )}
              renderSectionHeader={({ section }) => (
                <Text style={[styles.sectionTitle, { padding: 12 }]}>
                  {section.title}
                </Text>
              )}
              ListEmptyComponent={
                <Text style={styles.modalEmpty}>No exercises</Text>
              }
            />
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}
