import { afterEach, describe, expect, it, vi } from "vitest";
import { getMiriamVoiceModel, miriamWebSocketUrl, translateToRussian } from "./miriamApi";

afterEach(() => vi.unstubAllGlobals());

describe("Miriam same-origin client", () => {
  it("uses a same-origin WebSocket URL with no query or credentials", () => {
    const url = new URL(miriamWebSocketUrl());
    expect(url.host).toBe(window.location.host);
    expect(url.pathname).toBe("/api/gemini-live");
    expect(url.search).toBe("");
    expect(url.username).toBe("");
  });
  it("loads only the model from Cloudflare, without requesting a legacy key", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ model: "test-live-model" }) });
    vi.stubGlobal("fetch", fetchMock);
    expect(await getMiriamVoiceModel()).toBe("test-live-model");
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0][0]).toBe("/api/voice-config");
  });
  it.each([401, 403, 503])("fails closed on config status %s without a fallback", async status => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: false, status });
    vi.stubGlobal("fetch", fetchMock);
    await expect(getMiriamVoiceModel()).rejects.toThrow();
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
  it("rejects invalid model metadata", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: async () => ({ model: "https://attacker.example" }) }));
    await expect(getMiriamVoiceModel()).rejects.toThrow();
  });
  it("translates through Cloudflare only", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ translation: "Привет" }) });
    vi.stubGlobal("fetch", fetchMock);
    expect(await translateToRussian("שלום")).toBe("Привет");
    expect(fetchMock.mock.calls[0][0]).toBe("/api/translate");
    expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toEqual({ text: "שלום" });
  });
  it.each([401, 429, 502, 503])("does not silently switch providers when translation returns %s", async status => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: false, status });
    vi.stubGlobal("fetch", fetchMock);
    expect(await translateToRussian("שלום")).toBe("");
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
  it("handles a network failure without a second provider request", async () => {
    const fetchMock = vi.fn().mockRejectedValue(new Error("offline"));
    vi.stubGlobal("fetch", fetchMock);
    expect(await translateToRussian("שלום")).toBe("");
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
