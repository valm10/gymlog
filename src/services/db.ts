import { supabase } from "../lib/supabase";

/** Local day window (00:00–23:59.999) in ISO. */
function dayRange(dateStr: string) {
  const d = new Date(`${dateStr}T00:00:00`);
  const start = new Date(d.setHours(0, 0, 0, 0)).toISOString();
  const end = new Date(d.setHours(23, 59, 59, 999)).toISOString();
  return { start, end };
}

export type Exercise = {
  id: string;
  name: string;
  muscle_group?: string | null;
};
export type Workout = {
  id: string;
  user_id: string;
  started_at: string;
  notes: string | null;
};
export type SetRow = {
  id: string;
  workout_id: string;
  exercise_id: string;
  set_number: number | null;
  reps: number | null;
  weight_kg: number | null;
  created_at: string | null;
  exercises?: { name: string } | null;
};
export type ExerciseSummaryForDate = {
  exercise_id: string;
  name: string;
  sets: number;
  lastReps: number | null;
  lastWeight: number | null;
};

async function requireUser() {
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  const user = data.user;
  if (!user) throw new Error("not authenticated");
  return user;
}

/* Catalog */
export async function listExercises(): Promise<Exercise[]> {
  await requireUser();
  const { data, error } = await supabase
    .from("exercises")
    .select("id, name, muscle_group")
    .order("name", { ascending: true });
  if (error) throw error;
  return data as Exercise[];
}

/* Workouts */
export async function getTodayWorkout(): Promise<Workout | null> {
  const user = await requireUser();
  const today = new Date().toISOString().slice(0, 10);
  const { start, end } = dayRange(today);
  const { data, error } = await supabase
    .from("workouts")
    .select("id, user_id, started_at, notes")
    .gte("started_at", start)
    .lte("started_at", end)
    .eq("user_id", user.id)
    .order("started_at", { ascending: true })
    .limit(1)
    .maybeSingle();
  if (error && (error as any).code !== "PGRST116") throw error;
  return (data as Workout) ?? null;
}

export async function startWorkout(): Promise<Workout> {
  const user = await requireUser();
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from("workouts")
    .insert([{ user_id: user.id, started_at: now, notes: null }])
    .select("id, user_id, started_at, notes")
    .single();
  if (error) throw error;
  return data as Workout;
}

export async function listWorkoutsByDate(
  dateStr: string
): Promise<Array<Pick<Workout, "id" | "started_at" | "notes">>> {
  const user = await requireUser();
  const { start, end } = dayRange(dateStr);
  const { data, error } = await supabase
    .from("workouts")
    .select("id, started_at, notes")
    .gte("started_at", start)
    .lte("started_at", end)
    .eq("user_id", user.id)
    .order("started_at", { ascending: true });
  if (error) throw error;
  return data as Array<Pick<Workout, "id" | "started_at" | "notes">>;
}

export async function listWorkoutDatesInRange(fromISO: string, toISO: string) {
  const user = await requireUser();
  const { data, error } = await supabase
    .from("workouts")
    .select("started_at")
    .gte("started_at", fromISO)
    .lte("started_at", toISO)
    .eq("user_id", user.id);
  if (error) throw error;
  const set = new Set<string>();
  for (const w of data as Array<{ started_at: string }>) {
    const ds = new Date(w.started_at).toISOString().slice(0, 10);
    set.add(ds);
  }
  return Array.from(set);
}

/* Sets (+ normalize joined shape) */
type RawSetRow = Omit<SetRow, "exercises"> & {
  exercises?: { name: string } | { name: string }[] | null;
};
function normalizeSetRow(r: RawSetRow): SetRow {
  const ex = Array.isArray(r.exercises)
    ? (r.exercises[0] ?? null)
    : (r.exercises ?? null);
  return { ...r, exercises: ex };
}

export async function listSets(workoutId: string): Promise<SetRow[]> {
  await requireUser();
  const { data, error } = await supabase
    .from("sets")
    .select(
      "id, workout_id, exercise_id, set_number, reps, weight_kg, created_at, exercises(name)"
    )
    .eq("workout_id", workoutId)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data as RawSetRow[]).map(normalizeSetRow);
}

export async function addSet(
  workoutId: string,
  exerciseId: string,
  setNumber: number | null,
  reps: number,
  weightKg: number
): Promise<SetRow> {
  await requireUser();
  if (!Number.isFinite(reps) || reps <= 0) throw new Error("Invalid reps");
  if (!Number.isFinite(weightKg) || weightKg < 0)
    throw new Error("Invalid weight");

  const { data, error } = await supabase
    .from("sets")
    .insert([
      {
        workout_id: workoutId,
        exercise_id: exerciseId,
        set_number: setNumber,
        reps,
        weight_kg: weightKg,
      },
    ])
    .select(
      "id, workout_id, exercise_id, set_number, reps, weight_kg, created_at, exercises(name)"
    )
    .single();
  if (error) throw error;
  return normalizeSetRow(data as RawSetRow);
}

export async function deleteSet(setId: string): Promise<void> {
  await requireUser();
  const { error } = await supabase.from("sets").delete().eq("id", setId);
  if (error) throw error;
}

/* Day aggregation */
export async function listExercisesDoneOnDate(
  dateStr: string
): Promise<ExerciseSummaryForDate[]> {
  const user = await requireUser();
  const { start, end } = dayRange(dateStr);

  const { data, error } = await supabase
    .from("sets")
    .select(
      `
      exercise_id,
      reps,
      weight_kg,
      created_at,
      exercises(name),
      workouts!inner(started_at, user_id)
    `
    )
    .gte("workouts.started_at", start)
    .lte("workouts.started_at", end)
    .eq("workouts.user_id", user.id)
    .order("created_at", { ascending: true });

  if (error) throw error;

  const map = new Map<string, ExerciseSummaryForDate>();
  for (const row of data as Array<any>) {
    const id = row.exercise_id as string;
    const name = (row.exercises?.name as string) ?? "Exercise";
    const reps = (row.reps as number | null) ?? null;
    const weight = (row.weight_kg as number | null) ?? null;

    const prev = map.get(id);
    if (!prev) {
      map.set(id, {
        exercise_id: id,
        name,
        sets: 1,
        lastReps: reps,
        lastWeight: weight,
      });
    } else {
      prev.sets += 1;
      prev.lastReps = reps ?? prev.lastReps;
      prev.lastWeight = weight ?? prev.lastWeight;
    }
  }

  return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
}
