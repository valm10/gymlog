import { supabase } from "../lib/supabase";

function dayRange(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00");
  const start = new Date(d.setHours(0, 0, 0, 0)).toISOString();
  const end = new Date(d.setHours(23, 59, 59, 999)).toISOString();
  return { start, end };
}

export async function listWorkoutsByDate(dateStr: string) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("not authenticated");
  const { start, end } = dayRange(dateStr);
  const { data, error } = await supabase
    .from("workouts")
    .select("id, started_at, notes")
    .gte("started_at", start)
    .lte("started_at", end)
    .eq("user_id", user.id)
    .order("started_at", { ascending: true });
  if (error) throw error;
  return data;
}

export async function listWorkoutDatesInRange(fromISO: string, toISO: string) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("not authenticated");
  const { data, error } = await supabase
    .from("workouts")
    .select("started_at")
    .gte("started_at", fromISO)
    .lte("started_at", toISO)
    .eq("user_id", user.id);
  if (error) throw error;
  const set = new Set<string>();
  for (const w of data) {
    const ds = new Date(w.started_at).toISOString().slice(0, 10);
    set.add(ds);
  }
  return Array.from(set);
}
