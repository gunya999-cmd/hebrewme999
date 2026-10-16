// All Miriam traffic stays on the application's origin. No permanent Gemini
// credential, legacy key endpoint, or paid fallback is used by this client.
async function withDeadline<T>(milliseconds: number, action: (signal: AbortSignal) => Promise<T>): Promise<T> {
  // Older Safari versions do not implement AbortSignal.timeout.
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), milliseconds);
  try { return await action(controller.signal); }
  finally { clearTimeout(timer); }
}

export async function getMiriamVoiceModel(): Promise<string> {
  return withDeadline(10000, async signal => {
    const response = await fetch("/api/voice-config", {
      credentials: "same-origin", redirect: "error", signal,
    });
    if (!response.ok) {
      throw new Error(response.status === 401 || response.status === 403
        ? "Войдите в защищённую тестовую версию через Cloudflare Access."
        : "Голосовой сервис пока не настроен. Попробуйте позже.");
    }
    const data = await response.json();
    if (typeof data?.model !== "string" || !/^[a-z0-9][a-z0-9.-]{0,127}$/.test(data.model)) {
      throw new Error("Не удалось получить настройки голосового сервиса.");
    }
    return data.model;
  });
}

export function miriamWebSocketUrl(): string {
  const url = new URL("/api/gemini-live", window.location.origin);
  url.protocol = url.protocol === "https:" ? "wss:" : "ws:";
  return url.href;
}

export async function translateToRussian(text: string): Promise<string> {
  try {
    return await withDeadline(20000, async signal => {
      const response = await fetch("/api/translate", {
        method: "POST", credentials: "same-origin", redirect: "error",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }), signal,
      });
      if (!response.ok) return "";
      const data = await response.json();
      return typeof data?.translation === "string" ? data.translation : "";
    });
  } catch { return ""; }
}
