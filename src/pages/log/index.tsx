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
  deleteSet,
  getTodayWorkout,
  listExercises,
  listSets,
  startWorkout,
} from "../../services/db";
import { useToast } from "../../components/Toast";
import InlineError from "../../components/InlineError";

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
  const toast = useToast();

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

  // recognition: top-5 recent exercises used today
  const recentExerciseIds = useMemo(() => {
    const freq: Record<string, number> = {};
    for (const s of setsData)
      freq[s.exercise_id] = (freq[s.exercise_id] ?? 0) + 1;
    return Object.keys(freq)
      .sort((a, b) => (freq[b] ?? 0) - (freq[a] ?? 0))
      .slice(0, 5);
  }, [setsData]);

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

  // Prefill fields from last set of the selected exercise (no state churn)
  useEffect(() => {
    if (!exerciseId) return;
    const last = [...setsData]
      .reverse()
      .find((s) => s.exercise_id === exerciseId);
    if (last?.reps != null) setReps(String(last.reps));
    if (last?.weight_kg != null) setWeight(String(last.weight_kg));
  }, [exerciseId, setsData]);

  // PURE validation (no setState here) -> prevents re-render loops
  const errors = useMemo(() => {
    const r = Number(reps);
    const c = Number(setsCount);
    const w = Number(weight);
    const e = {
      reps: null as string | null,
      sets: null as string | null,
      weight: null as string | null,
    };

    if (!Number.isFinite(r) || r <= 0) e.reps = "Reps must be > 0";
    if (!Number.isFinite(c) || c < 1) e.sets = "Sets must be ≥ 1";
    if (!Number.isFinite(w) || w < 0) e.weight = "Weight must be ≥ 0";
    return e;
  }, [reps, setsCount, weight]);

  const hasErrors = Boolean(errors.reps || errors.sets || errors.weight);
  const addDisabled = !exerciseId || hasErrors || busy;

  async function onAddExercise() {
    if (!workoutId) return Alert.alert("Error", "Start a workout first.");
    if (!exerciseId) return Alert.alert("Error", "Select an exercise.");
    if (hasErrors) {
      toast.show("Fix the fields above");
      return;
    }

    setBusy(true);
    try {
      // per-exercise numbering baseline
      const existingForExercise = setsData.filter(
        (s) => s.exercise_id === exerciseId
      );
      const startNum = existingForExercise.length + 1;

      const created: SetRow[] = [];
      const c = Math.max(1, Number(setsCount));
      const r = Number(reps);
      const w = Number(weight);
      for (let i = 0; i < c; i += 1) {
        const sr = (await addSet(
          workoutId,
          exerciseId,
          startNum + i,
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
      toast.show("Exercise added");
    } catch (e: any) {
      Alert.alert("Error", e.message || String(e));
    } finally {
      setBusy(false);
    }
  }

  function confirmDeleteSet(row: SetRow) {
    Alert.alert(
      "Delete set?",
      `${row.exercises?.name ?? "Set"} • Set ${row.set_number ?? "—"} • ${
        row.reps ?? 0
      } reps @ ${row.weight_kg ?? 0} kg`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteSet(row.id);
              setSetsData((prev) => prev.filter((s) => s.id !== row.id));
              toast.show("Set deleted", {
                actionText: "Undo",
                onAction: async () => {
                  if (!workoutId) return;
                  try {
                    const restored = await addSet(
                      workoutId,
                      row.exercise_id,
                      row.set_number ?? null,
                      row.reps ?? 0,
                      row.weight_kg ?? 0
                    );
                    setSetsData((prev) => [...prev, restored]);
                  } catch (e: any) {
                    Alert.alert("Undo failed", e.message || String(e));
                  }
                },
              });
            } catch (e: any) {
              Alert.alert("Error", e.message || String(e));
            }
          },
        },
      ]
    );
  }

  async function duplicateLastSet() {
    if (!workoutId || !exerciseId) return;
    const last = [...setsData]
      .reverse()
      .find((s) => s.exercise_id === exerciseId);
    if (!last) return Alert.alert("Info", "No previous set to duplicate.");
    setReps(String(last.reps ?? reps));
    setWeight(String(last.weight_kg ?? weight));
    setSetsCount("1");
    await onAddExercise();
  }

  const sections: Section[] = useMemo(() => {
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

  const recentExercises = recentExerciseIds
    .map((id) => ({ id, name: exerciseById[id] }))
    .filter((x): x is { id: string; name: string } => Boolean(x.name));

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
            accessibilityRole="button"
            accessibilityLabel="Choose exercise"
          >
            <Text style={styles.pickerText}>{selectedExerciseName}</Text>
          </Pressable>

          {recentExercises.length ? (
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                gap: 8,
                marginBottom: 8,
              }}
            >
              {recentExercises.map((e) => (
                <Pressable
                  key={e.id}
                  onPress={() => setExerciseId(e.id)}
                  style={{
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderRadius: 999,
                    backgroundColor: "#f0f0f0",
                  }}
                >
                  <Text>{e.name}</Text>
                </Pressable>
              ))}
            </View>
          ) : null}

          <View style={styles.row}>
            <View style={styles.field}>
              <Text style={styles.label}>Reps</Text>
              <TextInput
                value={reps}
                onChangeText={setReps}
                keyboardType="number-pad"
                style={styles.input}
                placeholder="10"
                accessibilityLabel="Repetitions"
              />
              <InlineError msg={errors.reps} />
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>Sets</Text>
              <TextInput
                value={setsCount}
                onChangeText={setSetsCount}
                keyboardType="number-pad"
                style={styles.input}
                placeholder="1"
                accessibilityLabel="Number of sets"
              />
              <InlineError msg={errors.sets} />
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>Weight (kg)</Text>
              <TextInput
                value={weight}
                onChangeText={setWeight}
                keyboardType="decimal-pad"
                style={styles.input}
                placeholder="40"
                accessibilityLabel="Weight in kilograms"
              />
              <InlineError msg={errors.weight} />
            </View>
          </View>

          <View style={{ flexDirection: "row", gap: 10 }}>
            <Pressable
              onPress={onAddExercise}
              style={[styles.cta, addDisabled && { opacity: 0.6 }, { flex: 1 }]}
              disabled={addDisabled}
              accessibilityRole="button"
              accessibilityLabel="Add exercise"
            >
              {busy ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.ctaText}>Add Exercise</Text>
              )}
            </Pressable>

            <Pressable
              onPress={duplicateLastSet}
              style={[styles.cta, { backgroundColor: "#111", flex: 1 }]}
              accessibilityRole="button"
              accessibilityLabel="Duplicate last set"
            >
              <Text style={styles.ctaText}>Duplicate last set</Text>
            </Pressable>
          </View>
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
              <Pressable
                onLongPress={() => confirmDeleteSet(item)}
                android_ripple={{ color: "#eee" }}
                style={styles.setRow}
                accessibilityRole="button"
                accessibilityLabel={`Set ${item.set_number ?? "—"} ${item.reps ?? 0} reps at ${item.weight_kg ?? 0} kilograms. Long press to delete.`}
              >
                <Text style={styles.setMeta}>
                  Set {item.set_number ?? "—"} • {item.reps ?? 0} reps @{" "}
                  {item.weight_kg ?? 0} kg
                </Text>
              </Pressable>
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
                  accessibilityRole="button"
                  accessibilityLabel={`Choose ${item.name}`}
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
