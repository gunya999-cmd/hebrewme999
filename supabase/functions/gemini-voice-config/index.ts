import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Retire the endpoint that used to return the permanent Gemini key. Deploy this
// tombstone and rotate that key during the coordinated Cloudflare cutover.
serve(() => new Response(JSON.stringify({ error: "Legacy voice configuration retired" }), {
  status: 410,
  headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
}));
