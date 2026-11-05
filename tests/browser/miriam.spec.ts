import { test, expect } from "@playwright/test";

test("Miriam tutor page loads and offers voice entry", async ({ page }) => {
  await page.goto("/ai-tutor");
  await expect(page.getByText("AI Репетитор").first()).toBeVisible();
  await expect(page.getByText("Позвонить Ракель").first()).toBeVisible();
});

test("voice dialogue displays a safe setup screen without credentials", async ({ page }) => {
  await page.goto("/voice-dialogue");
  await expect(page.locator("body")).toContainText(/Ракель|микрофон|разговор|Начинающий/i);
  await expect(page.locator("body")).not.toContainText(/undefined|Cannot read properties/i);
});

for (const status of [401, 503]) {
  test(`voice configuration ${status} stops safely without requesting a Gemini key`, async ({ page }) => {
    const calls: string[] = [];
    page.on("request", req => calls.push(req.url()));
    await page.addInitScript(() => {
      // AudioContext is unlocked synchronously, before the configuration await.
      class TestAudioContext {
        resume() { return Promise.resolve(); }
        close() { return Promise.resolve(); }
      }
      Object.defineProperty(window, "AudioContext", { value: TestAudioContext, configurable: true });
      Object.defineProperty(navigator, "mediaDevices", {
        configurable: true,
        value: { getUserMedia: () => { throw new Error("Microphone must not open before config succeeds"); } },
      });
    });
    await page.route("**/api/voice-config", route => route.fulfill({ status, contentType: "application/json", body: JSON.stringify({ error: "disabled" }) }));
    await page.goto("/voice-dialogue");
    await page.getByRole("button", { name: /Начинающий/ }).click();
    await expect(page.getByText(status === 401 ? /Войдите в защищённую/ : /Голосовой сервис пока не настроен/)).toBeVisible();
    expect(calls.filter(url => url.includes("/api/voice-config"))).toHaveLength(1);
    expect(calls.some(url => /gemini-voice-config|generativelanguage\.googleapis\.com|\/functions\/v1\/ai-dialogue/.test(url))).toBe(false);
  });
}

test("voice setup, PCM exchange and translations use only same-origin routes", async ({ page }) => {
  const messages: Array<{
    setup?: { model: string; generationConfig: { responseModalities: string[] }; realtimeInputConfig: { activityHandling: string } };
    clientContent?: unknown;
    realtimeInput?: { audio?: { mimeType: string; data: string } };
  }> = [];
  const requests: string[] = [];
  page.on("request", req => requests.push(req.url()));
  await page.addInitScript(() => {
    const node = () => ({ connect() {}, disconnect() {} });
    class TestAudioContext {
      sampleRate = 48000;
      state = "running";
      destination = {};
      audioWorklet = { addModule: async () => {} };
      resume() { return Promise.resolve(); }
      close() { return Promise.resolve(); }
      createMediaStreamSource() { return node(); }
      createAnalyser() { return { ...node(), fftSize: 2048, getFloatTimeDomainData: (data: Float32Array) => data.fill(0) }; }
      createGain() { return { ...node(), gain: { value: 0 } }; }
      createBuffer(_channels: number, length: number) { return { getChannelData: () => new Float32Array(length) }; }
      createBufferSource() {
        const source = { ...node(), buffer: null, playbackRate: { value: 1 }, onended: null as (() => void) | null, stop() {}, start() { setTimeout(() => source.onended?.(), 500); } };
        return source;
      }
    }
    class TestAudioWorkletNode {
      port = {
        set onmessage(handler: (event: { data: { pcm: Float32Array } }) => void) {
          setTimeout(() => handler({ data: { pcm: new Float32Array(2048).fill(0.1) } }), 100);
        },
      };
      connect() {}
      disconnect() {}
    }
    Object.defineProperty(window, "AudioContext", { value: TestAudioContext, configurable: true });
    Object.defineProperty(window, "AudioWorkletNode", { value: TestAudioWorkletNode, configurable: true });
    Object.defineProperty(window, "SpeechRecognition", { value: undefined, configurable: true });
    Object.defineProperty(window, "webkitSpeechRecognition", { value: undefined, configurable: true });
    const track = { enabled: true, stop() {} };
    Object.defineProperty(navigator, "mediaDevices", {
      configurable: true,
      value: { getUserMedia: async () => ({ getTracks: () => [track], getAudioTracks: () => [track] }) },
    });
  });
  await page.route("**/api/voice-config", route => route.fulfill({ json: { model: "test-live-model" } }));
  await page.route("**/api/translate", route => {
    const { text } = route.request().postDataJSON();
    return route.fulfill({ json: { translation: text === "שלום" ? "Привет" : "Меня зовут Георгий" } });
  });
  await page.routeWebSocket("**/api/gemini-live", ws => {
    ws.onMessage(raw => {
      const message = JSON.parse(String(raw));
      messages.push(message);
      if (message.setup) ws.send(JSON.stringify({ setupComplete: {} }));
      if (message.clientContent) ws.send(JSON.stringify({ serverContent: {
        outputTranscription: { text: "שלום" },
        modelTurn: { parts: [{ inlineData: { mimeType: "audio/pcm;rate=24000", data: "AAAAAA==" } }] },
        turnComplete: true,
      } }));
      if (message.realtimeInput?.audio) ws.send(JSON.stringify({ serverContent: {
        inputTranscription: { text: "קוראים לי גאורגי" }, turnComplete: true,
      } }));
    });
  });
  await page.goto("/voice-dialogue");
  await page.getByRole("button", { name: /Начинающий/ }).click();
  await expect(page.getByText("Привет", { exact: true })).toBeVisible();
  await expect(page.getByText("Меня зовут Георгий", { exact: true })).toBeVisible();
  expect(messages[0].setup.model).toBe("models/test-live-model");
  expect(messages[0].setup.generationConfig.responseModalities).toEqual(["AUDIO"]);
  expect(messages[0].setup.realtimeInputConfig.activityHandling).toBe("START_OF_ACTIVITY_INTERRUPTS");
  // The mock output is still playing when the input worklet fires (100ms
  // against a 500ms buffer). PCM must reach the socket during AI playback.
  expect(messages.some(message => message.realtimeInput?.audio?.mimeType === "audio/pcm;rate=16000")).toBe(true);
  expect(requests.filter(url => url.includes("/api/translate"))).toHaveLength(2);
  expect(requests.some(url => /gemini-voice-config|generativelanguage\.googleapis\.com|\/functions\/v1\/ai-dialogue/.test(url))).toBe(false);
});
