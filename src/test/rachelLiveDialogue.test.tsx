import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import VoiceDialogue from "@/pages/VoiceDialogue";

vi.mock("@/lib/i18n", () => ({ useLanguage: () => ({ t: (text: string) => text }) }));
vi.mock("@/lib/env", () => ({
  isSupabaseConfigured: true,
  SUPABASE_CONFIG_ERROR: "",
  getSupabaseFunctionUrl: (name: string) => "https://stub.supabase.test/functions/v1/" + name,
  getSupabaseAuthHeaders: () => ({ Authorization: "Bearer test-public-key" }),
}));
vi.mock("@/components/MiriamAvatar3D", () => ({ MiriamAvatar3D: () => <div data-testid="avatar" /> }));
vi.mock("@/components/MicDiagnostics", () => ({ MicDiagnostics: () => null }));
vi.mock("@/components/SpeechRateSelector", () => ({ SpeechRateSelector: () => null }));
vi.mock("@/hooks/useSpeechRate", () => ({ getSpeechRate: () => 1 }));
vi.mock("@/lib/miriamProgress", () => ({ saveAttempt: vi.fn() }));

type SocketListener = ((event: any) => void) | null;
class FakeSocket {
  static OPEN = 1;
  static sockets: FakeSocket[] = [];
  readyState = 0;
  onopen: SocketListener = null;
  onclose: SocketListener = null;
  onmessage: SocketListener = null;
  onerror: SocketListener = null;
  sent: any[] = [];
  constructor(public url: string) { FakeSocket.sockets.push(this); }
  send(message: string) { this.sent.push(JSON.parse(message)); }
  open() { this.readyState = FakeSocket.OPEN; this.onopen?.({}); }
  emit(message: any) { this.onmessage?.({ data: JSON.stringify(message) }); }
  close(code = 1000) {
    this.readyState = 3;
    this.onclose?.({ code, reason: "" });
  }
}

class FakeWorklet {
  static latest: FakeWorklet;
  port = { onmessage: null as ((event: any) => void) | null };
  constructor() { FakeWorklet.latest = this; }
  connect() {}
  disconnect() {}
}

const soundNode = () => ({ connect() {}, disconnect() {} });
class FakeAudioContext {
  sampleRate = 48000;
  state = "running";
  destination = {};
  audioWorklet = { addModule: async () => {} };
  resume = async () => {};
  close = async () => {};
  createMediaStreamSource() { return soundNode(); }
  createGain() { return { ...soundNode(), gain: { value: 0 } }; }
  createAnalyser() {
    return {
      ...soundNode(),
      fftSize: 2048,
      smoothingTimeConstant: 0,
      getFloatTimeDomainData: (samples: Float32Array) => samples.fill(0),
    };
  }
  createBuffer(_channels: number, size: number) {
    const data = new Float32Array(size);
    return { getChannelData: () => data };
  }
  createBufferSource() {
    return {
      ...soundNode(),
      playbackRate: { value: 1 },
      buffer: null,
      onended: null as (() => void) | null,
      start() {}, // Leave Rachel speaking until an explicit server event.
      stop() {},
    };
  }
}

async function startMockCall() {
  render(
    <MemoryRouter initialEntries={[{ pathname: "/voice-dialogue", state: { level: "beginner" } }]}>
      <VoiceDialogue />
    </MemoryRouter>,
  );
  fireEvent.click(screen.getByRole("button", { name: "Позвонить Ракель" }));
  await waitFor(() => expect(FakeSocket.sockets).toHaveLength(1));
  const socket = FakeSocket.sockets[0];
  await act(async () => {
    socket.open();
    socket.emit({ setupComplete: {} });
  });
  return socket;
}

describe("Rachel Live voice regression", () => {
  beforeEach(() => {
    FakeSocket.sockets = [];
    // JSDOM does not implement scrolling; production browsers do.
    Object.defineProperty(HTMLElement.prototype, "scrollTo", { configurable: true, value: vi.fn() });
    vi.stubGlobal("WebSocket", FakeSocket);
    vi.stubGlobal("AudioContext", FakeAudioContext);
    vi.stubGlobal("AudioWorkletNode", FakeWorklet);
    vi.stubGlobal("requestAnimationFrame", () => 1);
    vi.stubGlobal("cancelAnimationFrame", () => {});
    Object.defineProperty(navigator, "mediaDevices", {
      configurable: true,
      value: {
        getUserMedia: vi.fn().mockResolvedValue({
          getTracks: () => [{ stop: vi.fn() }],
          getAudioTracks: () => [{ enabled: true }],
        }),
      },
    });
    // Intentionally never return from translation. Hebrew must not wait for it.
    vi.stubGlobal("fetch", vi.fn(async (url: string) => {
      if (url.includes("gemini-voice-config")) {
        return { ok: true, json: async () => ({ apiKey: "mock-only" }) };
      }
      return new Promise(() => {});
    }));
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it("continues sending student PCM while Rachel is speaking", async () => {
    const socket = await startMockCall();
    await act(async () => {
      socket.emit({
        serverContent: { modelTurn: { parts: [{ inlineData: { data: btoa(String.fromCharCode(0, 0, 0, 0)) } }] } },
      });
    });
    const before = socket.sent.filter(entry => entry.realtimeInput?.audio).length;
    act(() => {
      FakeWorklet.latest.port.onmessage?.({ data: { pcm: new Float32Array(2048) } });
    });
    expect(socket.sent.filter(entry => entry.realtimeInput?.audio)).toHaveLength(before + 1);
    const setup = socket.sent.find(entry => entry.setup);
    expect(setup.setup.realtimeInputConfig.activityHandling).toBe("START_OF_ACTIVITY_INTERRUPTS");
  });

  it("shows student Hebrew promptly without waiting for Rachel or translation", async () => {
    const socket = await startMockCall();
    await act(async () => {
      socket.emit({ serverContent: { inputTranscription: { text: "אני לומד עברית" } } });
    });
    expect(screen.getByText("אני לומד עברית")).toBeInTheDocument();
    await waitFor(() => expect(screen.getByText("אני לומד עברית")).toBeInTheDocument(), { timeout: 1800 });
    // Do not wait for a model turnComplete: Gemini input text is independently committed.
    await new Promise(resolve => setTimeout(resolve, 1000));
    expect(screen.getByText("אני לומד עברית")).toBeInTheDocument();
    expect(screen.getByLabelText("История диалога").textContent).toContain("אני לומד עברית");
  });

  it("preserves ten spoken turns without losing identical practice answers", async () => {
    const socket = await startMockCall();
    for (let i = 0; i < 10; i++) {
      await act(async () => {
        socket.emit({ serverContent: { inputTranscription: { text: "שלום" } } });
        socket.emit({ serverContent: { outputTranscription: { text: "טוב מאוד " + i }, turnComplete: true } });
      });
    }
    expect(screen.getAllByText("שלום")).toHaveLength(10);
    expect(screen.getByLabelText("История диалога").textContent).toContain("טוב מאוד 9");
  });

  it("keeps already heard words after an unexpected socket close", async () => {
    const socket = await startMockCall();
    await act(async () => {
      socket.emit({ serverContent: { inputTranscription: { text: "מה שלומך" } } });
      socket.close(1008);
    });
    expect(screen.getByText("מה שלומך")).toBeInTheDocument();
    expect(screen.getByRole("alert").textContent).toContain("1008");
  });
  it("does not reopen microphone or socket after navigation during reconnect backoff", async () => {
    const socket = await startMockCall();
    await act(async () => { socket.close(1006); });
    // The connection schedules an 800ms automatic retry, but the page is gone.
    cleanup();
    await new Promise(resolve => setTimeout(resolve, 1000));
    expect(FakeSocket.sockets).toHaveLength(1);
  });

});
