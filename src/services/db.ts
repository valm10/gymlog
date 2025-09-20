import { supabase } from "../lib/supabase";

export async function ensureProfile() {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("not authenticated");
  await supabase
    .from("profiles")
    .upsert({ id: user.id })
    .select()
    .maybeSingle();
  return user;
}

export async function listExercises() {
  const { data, error } = await supabase
    .from("exercises")
    .select("*")
    .order("name");
  if (error) throw error;
  return data;
}

export async function startWorkout(notes?: string) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("not authenticated");
  const { data, error } = await supabase
    .from("workouts")
    .insert({ user_id: user.id, notes })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function getTodayWorkout() {
  const start = new Date(new Date().setHours(0, 0, 0, 0)).toISOString();
  const end = new Date(new Date().setHours(23, 59, 59, 999)).toISOString();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("not authenticated");
  const { data, error } = await supabase
    .from("workouts")
    .select("*")
    .gte("started_at", start)
    .lte("started_at", end)
    .eq("user_id", user.id)
    .order("started_at", { ascending: false })
    .limit(1);
  if (error) throw error;
  return data?.[0] ?? null;
}

export async function addSet(
  workout_id: string,
  exercise_id: string,
  set_number: number,
  reps: number,
  weight_kg?: number
) {
  const { data, error } = await supabase
    .from("sets")
    .insert({ workout_id, exercise_id, set_number, reps, weight_kg })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function listSets(workout_id: string) {
  const { data, error } = await supabase
    .from("sets")
    .select("*, exercises:exercise_id(name)")
    .eq("workout_id", workout_id)
    .order("set_number");
  if (error) throw error;
  return data;
}
