import { supabase } from "@/integrations/supabase/client";
import { readProgress, writeProgress, mergeProgress, type Progress } from "./miriamProgress";

type CloudRow = { user_id: string; progress: Progress; updated_at: string };
type ProgressClient = {
  from: (table: string) => {
    select: (columns: string) => { eq: (column: string, value: string) => { maybeSingle: () => Promise<{ data: CloudRow | null; error: { message: string } | null }> } };
    upsert: (value: { user_id: string; progress: Progress }, options: { onConflict: string }) => Promise<{ error: { message: string } | null }>;
  };
};

// This table is created by the SQL migration; generated database types can be
// refreshed once that migration has been applied to the connected project.
const client = supabase as unknown as ProgressClient;

export async function loadCloudProgress(): Promise<Progress | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data, error } = await client.from("miriam_learning_progress").select("user_id,progress,updated_at").eq("user_id", user.id).maybeSingle();
  if (error) throw new Error(error.message);
  return data?.progress ?? null;
}

export async function pushCloudProgress(): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;
  const { error } = await client.from("miriam_learning_progress").upsert(
    { user_id: user.id, progress: readProgress() },
    { onConflict: "user_id" },
  );
  if (error) throw new Error(error.message);
  return true;
}

export async function syncCloudProgress(): Promise<Progress | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const remote = await loadCloudProgress();
  const merged = remote ? mergeProgress(readProgress(), remote) : readProgress();
  const { error } = await client.from("miriam_learning_progress").upsert(
    { user_id: user.id, progress: merged },
    { onConflict: "user_id" },
  );
  if (error) throw new Error(error.message);
  writeProgress(merged);
  return merged;
}
