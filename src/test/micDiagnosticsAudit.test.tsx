import { act, cleanup, render, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { MicDiagnostics } from "@/components/MicDiagnostics";

const previousSecure = Object.getOwnPropertyDescriptor(window, "isSecureContext");
const previousMediaDevices = Object.getOwnPropertyDescriptor(navigator, "mediaDevices");

afterEach(() => {
  cleanup();
  if (previousSecure) Object.defineProperty(window, "isSecureContext", previousSecure);
  else Reflect.deleteProperty(window, "isSecureContext");
  if (previousMediaDevices) Object.defineProperty(navigator, "mediaDevices", previousMediaDevices);
  else Reflect.deleteProperty(navigator, "mediaDevices");
});

describe("microphone diagnostic lifecycle", () => {
  it("releases a microphone granted after the diagnostics dialog has closed", async () => {
    let grant!: (stream: MediaStream) => void;
    const getUserMedia = vi.fn(() => new Promise<MediaStream>(resolve => { grant = resolve; }));
    Object.defineProperty(window, "isSecureContext", { configurable: true, value: true });
    Object.defineProperty(navigator, "mediaDevices", {
      configurable: true,
      value: { getUserMedia, enumerateDevices: vi.fn().mockResolvedValue([]) },
    });
    const stop = vi.fn();
    const stream = { getTracks: () => [{ stop }], getAudioTracks: () => [] } as unknown as MediaStream;

    const { rerender } = render(
      <MicDiagnostics open={true} onOpenChange={vi.fn()} />,
    );
    await waitFor(() => expect(getUserMedia).toHaveBeenCalledTimes(1));

    rerender(<MicDiagnostics open={false} onOpenChange={vi.fn()} />);
    await act(async () => { grant(stream); });
    await waitFor(() => expect(stop).toHaveBeenCalledTimes(1));
  });

  it("releases microphone if audio initialization fails after permission is granted", async () => {
    Object.defineProperty(window, "isSecureContext", { configurable: true, value: true });
    const stop = vi.fn();
    const stream = {
      getTracks: () => [{ stop }],
      getAudioTracks: () => [{ stop, getSettings: () => ({}) }],
    } as unknown as MediaStream;
    Object.defineProperty(navigator, "mediaDevices", {
      configurable: true,
      value: {
        getUserMedia: vi.fn().mockResolvedValue(stream),
        enumerateDevices: vi.fn().mockResolvedValue([]),
      },
    });

    const prev = Object.getOwnPropertyDescriptor(window, "AudioContext");
    Object.defineProperty(window, "AudioContext", { configurable: true, value: undefined });
    try {
      render(<MicDiagnostics open={true} onOpenChange={vi.fn()} />);
      await waitFor(() => expect(stop).toHaveBeenCalledTimes(1));
    } finally {
      if (prev) Object.defineProperty(window, "AudioContext", prev);
      else Reflect.deleteProperty(window, "AudioContext");
    }
  });
});
