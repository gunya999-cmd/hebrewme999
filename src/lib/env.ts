const rawSupabaseUrl = (import.meta.env.VITE_SUPABASE_URL || "").trim();
const rawSupabaseKey = (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || "").trim();
const rawSupabaseProjectId = (import.meta.env.VITE_SUPABASE_PROJECT_ID || "").trim();

function isValidUrl(value: string): boolean {
  if (!value) return false;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

export const SUPABASE_URL = rawSupabaseUrl;
export const SUPABASE_PUBLISHABLE_KEY = rawSupabaseKey;
export const SUPABASE_PROJECT_ID = rawSupabaseProjectId;

export const isSupabaseConfigured = isValidUrl(SUPABASE_URL) && SUPABASE_PUBLISHABLE_KEY.length > 0;

export const SUPABASE_CONFIG_ERROR =
  "Supabase не настроен. Добавьте VITE_SUPABASE_URL и VITE_SUPABASE_PUBLISHABLE_KEY в Cloudflare Pages → Settings → Environment variables, затем сделайте Redeploy.";

export function getSupabaseFunctionUrl(functionName: string): string {
  if (!isSupabaseConfigured) {
    throw new Error(SUPABASE_CONFIG_ERROR);
  }
  return `${SUPABASE_URL.replace(/\/$/, "")}/functions/v1/${functionName}`;
}

export function getSupabaseAuthHeaders(): Record<string, string> {
  if (!isSupabaseConfigured) {
    throw new Error(SUPABASE_CONFIG_ERROR);
  }
  return {
    Authorization: `Bearer ${SUPABASE_PUBLISHABLE_KEY}`,
  };
}

// createClient validates arguments during module import. These placeholders keep
// static pages available even before production environment variables are added.
export const SAFE_SUPABASE_URL = isSupabaseConfigured ? SUPABASE_URL : "https://example.supabase.co";
export const SAFE_SUPABASE_PUBLISHABLE_KEY = isSupabaseConfigured ? SUPABASE_PUBLISHABLE_KEY : "missing-supabase-key";
