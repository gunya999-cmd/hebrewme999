import { useCallback, useEffect, useRef, useState } from "react";
import { Mic, MicOff, RefreshCw, X, CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";

type PermissionState = "unknown" | "checking" | "granted" | "denied" | "prompt" | "unsupported";

interface MicDiagnosticsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDeviceId?: string;
  onDeviceChange?: (deviceId: string) => void;
}

type AudioWindow = Window & typeof globalThis & { webkitAudioContext?: typeof AudioContext };

function explainError(err: unknown): { title: string; hint: string } {
  const e = err as { name?: string; message?: string };
  switch (e?.name) {
    case "NotAllowedError":
    case "PermissionDeniedError":
      return {
        title: "Доступ к микрофону запрещён",
        hint: "Откройте настройки сайта в браузере (значок замка слева в адресной строке) и разрешите микрофон, затем перезагрузите страницу.",
      };
    case "NotFoundError":
    case "DevicesNotFoundError":
      return {
        title: "Микрофон не найден",
        hint: "Подключите микрофон или гарнитуру и нажмите «Проверить ещё раз».",
      };
    case "NotReadableError":
    case "TrackStartError":
      return {
        title: "Микрофон занят",
        hint: "Закройте другие приложения, использующие микрофон (Zoom, Telegram, Discord и т.п.) и попробуйте снова.",
      };
    case "OverconstrainedError":
    case "ConstraintNotSatisfiedError":
      return {
        title: "Устройство не поддерживает нужные параметры",
        hint: "Попробуйте выбрать другое устройство в списке ниже.",
      };
    default:
      return {
        title: "Не удалось получить доступ",
        hint: e?.message || "Попробуйте перезагрузить страницу.",
      };
  }
}

export function MicDiagnostics({ open, onOpenChange, selectedDeviceId, onDeviceChange }: MicDiagnosticsProps) {
  const [permission, setPermission] = useState<PermissionState>("unknown");
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [activeDeviceId, setActiveDeviceId] = useState<string | undefined>(selectedDeviceId);
  const [level, setLevel] = useState(0);
  const [peak, setPeak] = useState(0);
  const [hasSignal, setHasSignal] = useState(false);
  const [error, setError] = useState<{ title: string; hint: string } | null>(null);
  const [isSecure, setIsSecure] = useState(true);

  const streamRef = useRef<MediaStream | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const rafRef = useRef<number | null>(null);
  const peakRef = useRef(0);
  const signalSeenRef = useRef(false);

  const stop = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (ctxRef.current && ctxRef.current.state !== "closed") {
      ctxRef.current.close().catch(() => {});
    }
    ctxRef.current = null;
    analyserRef.current = null;
    setLevel(0);
    setPeak(0);
    peakRef.current = 0;
    signalSeenRef.current = false;
    setHasSignal(false);
  }, []);

  const start = useCallback(async (deviceId?: string) => {
    stop();
    setError(null);

    if (typeof window !== "undefined" && !window.isSecureContext) {
      setIsSecure(false);
      setPermission("unsupported");
      setError({
        title: "Небезопасное соединение",
        hint: "Микрофон работает только по HTTPS. Откройте опубликованную версию приложения.",
      });
      return;
    }
    setIsSecure(true);

    if (!navigator.mediaDevices?.getUserMedia) {
      setPermission("unsupported");
      setError({
        title: "Браузер не поддерживает микрофон",
        hint: "Используйте свежий Chrome, Edge, Firefox или Safari.",
      });
      return;
    }

    setPermission("checking");

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: deviceId
          ? { deviceId: { exact: deviceId }, echoCancellation: true, noiseSuppression: true, autoGainControl: true }
          : { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
      });
      streamRef.current = stream;
      setPermission("granted");

      // Refresh device list now that labels are available
      try {
        const list = await navigator.mediaDevices.enumerateDevices();
        const inputs = list.filter((d) => d.kind === "audioinput");
        setDevices(inputs);
        const track = stream.getAudioTracks()[0];
        const settings = track?.getSettings();
        if (settings?.deviceId) setActiveDeviceId(settings.deviceId);
      } catch {
        // ignore
      }

      const Ctor = window.AudioContext || (window as AudioWindow).webkitAudioContext;
      if (!Ctor) throw new Error("AudioContext недоступен");
      const ctx = new Ctor();
      ctxRef.current = ctx;
      await ctx.resume();

      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 1024;
      analyser.smoothingTimeConstant = 0.4;
      analyserRef.current = analyser;
      source.connect(analyser);

      const buf = new Float32Array(analyser.fftSize);
      const tick = () => {
        analyser.getFloatTimeDomainData(buf);
        let energy = 0;
        for (let i = 0; i < buf.length; i++) energy += buf[i] * buf[i];
        const rms = Math.sqrt(energy / buf.length);
        // Map RMS (~0..0.3) to 0..100
        const norm = Math.min(100, Math.round(rms * 400));
        setLevel(norm);
        if (norm > peakRef.current) {
          peakRef.current = norm;
          setPeak(norm);
        }
        if (norm > 8 && !signalSeenRef.current) {
          signalSeenRef.current = true;
          setHasSignal(true);
        }
        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    } catch (err) {
      const info = explainError(err);
      setError(info);
      const e = err as { name?: string };
      setPermission(e?.name === "NotAllowedError" || e?.name === "PermissionDeniedError" ? "denied" : "granted");
      // Try to enumerate devices anyway (without labels)
      try {
        const list = await navigator.mediaDevices.enumerateDevices();
        setDevices(list.filter((d) => d.kind === "audioinput"));
      } catch {
        // ignore
      }
    }
  }, [stop]);

  // Start when dialog opens, stop when closes
  useEffect(() => {
    if (open) {
      start(selectedDeviceId);
    } else {
      stop();
    }
    return () => stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const handleDeviceSelect = (id: string) => {
    setActiveDeviceId(id);
    onDeviceChange?.(id);
    start(id);
  };

  const statusBadge = () => {
    if (permission === "checking") {
      return (
        <div className="flex items-center gap-2 text-muted-foreground">
          <RefreshCw className="w-4 h-4 animate-spin" />
          <span className="text-sm">Проверяем разрешение...</span>
        </div>
      );
    }
    if (permission === "granted") {
      return (
        <div className="flex items-center gap-2 text-green-600 dark:text-green-500">
          <CheckCircle2 className="w-4 h-4" />
          <span className="text-sm font-medium">Доступ разрешён</span>
        </div>
      );
    }
    if (permission === "denied") {
      return (
        <div className="flex items-center gap-2 text-destructive">
          <XCircle className="w-4 h-4" />
          <span className="text-sm font-medium">Доступ запрещён</span>
        </div>
      );
    }
    if (permission === "unsupported") {
      return (
        <div className="flex items-center gap-2 text-destructive">
          <AlertTriangle className="w-4 h-4" />
          <span className="text-sm font-medium">Не поддерживается</span>
        </div>
      );
    }
    return null;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mic className="w-5 h-5" />
            Диагностика микрофона
          </DialogTitle>
          <DialogDescription>
            Проверим разрешение, устройство и уровень звука. Скажите что-нибудь — индикатор должен реагировать.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Permission status */}
          <div className="rounded-xl border border-border p-3 bg-muted/30">
            <p className="text-xs text-muted-foreground mb-1">Разрешение браузера</p>
            {statusBadge()}
          </div>

          {/* Error / hint */}
          {error && (
            <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-3">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-destructive mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-destructive">{error.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">{error.hint}</p>
                </div>
              </div>
            </div>
          )}

          {/* Device selector */}
          {devices.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Устройство ввода</p>
              <select
                value={activeDeviceId || ""}
                onChange={(e) => handleDeviceSelect(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                disabled={permission !== "granted"}
              >
                {devices.map((d, idx) => (
                  <option key={d.deviceId || idx} value={d.deviceId}>
                    {d.label || `Микрофон ${idx + 1} (нет доступа к названию)`}
                  </option>
                ))}
              </select>
              {!devices.some((d) => d.label) && permission !== "granted" && (
                <p className="text-xs text-muted-foreground">
                  Названия устройств появятся после разрешения доступа.
                </p>
              )}
            </div>
          )}

          {/* Signal level */}
          {permission === "granted" && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">Уровень сигнала</p>
                <p className="text-xs font-mono text-muted-foreground">
                  {level}% (пик {peak}%)
                </p>
              </div>
              <Progress value={level} className="h-3" />
              <div className="flex items-center gap-2 mt-2">
                {hasSignal ? (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex items-center gap-2 text-green-600 dark:text-green-500"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="text-sm font-medium">Микрофон вас слышит ✓</span>
                  </motion.div>
                ) : (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mic className="w-4 h-4 animate-pulse" />
                    <span className="text-sm">Скажите «привет, проверка»...</span>
                  </div>
                )}
              </div>

              {/* Hints when no signal after some time */}
              {permission === "granted" && peak < 5 && (
                <div className="mt-3 rounded-lg bg-muted/50 p-3 space-y-1">
                  <p className="text-xs font-semibold text-foreground">Не слышит вас? Проверьте:</p>
                  <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                    <li>Не выключен ли микрофон физической кнопкой на ноутбуке (часто F4/F8)</li>
                    <li>Громкость микрофона в системных настройках звука</li>
                    <li>Выбрано правильное устройство в списке выше</li>
                    <li>Микрофон не используется другим приложением</li>
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 gap-2"
              onClick={() => start(activeDeviceId)}
              disabled={permission === "checking"}
            >
              <RefreshCw className={`w-4 h-4 ${permission === "checking" ? "animate-spin" : ""}`} />
              Проверить ещё раз
            </Button>
            <Button size="sm" className="flex-1 gap-2" onClick={() => onOpenChange(false)}>
              <X className="w-4 h-4" />
              Закрыть
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
