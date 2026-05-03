import { Gauge } from "lucide-react";
import { useSpeechRate, SPEECH_RATE_LABELS, SpeechRateKey } from "@/hooks/useSpeechRate";
import { cn } from "@/lib/utils";

interface Props {
  className?: string;
  variant?: "pills" | "compact";
}

const ORDER: SpeechRateKey[] = ["slow", "normal", "fast"];

export function SpeechRateSelector({ className, variant = "pills" }: Props) {
  const { rateKey, setRate } = useSpeechRate();

  if (variant === "compact") {
    return (
      <div className={cn("inline-flex items-center gap-1 rounded-full bg-muted/50 p-1", className)}>
        <Gauge className="w-3.5 h-3.5 ml-1.5 text-muted-foreground" />
        {ORDER.map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => setRate(k)}
            className={cn(
              "text-xs px-2 py-0.5 rounded-full transition-colors",
              rateKey === k
                ? "bg-primary text-primary-foreground font-semibold"
                : "text-muted-foreground hover:text-foreground"
            )}
            aria-pressed={rateKey === k}
            title={`Скорость: ${SPEECH_RATE_LABELS[k]}`}
          >
            {SPEECH_RATE_LABELS[k]}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className="text-xs text-muted-foreground flex items-center gap-1">
        <Gauge className="w-3.5 h-3.5" /> Скорость:
      </span>
      <div className="inline-flex rounded-full bg-muted p-1">
        {ORDER.map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => setRate(k)}
            className={cn(
              "text-xs px-3 py-1 rounded-full transition-colors",
              rateKey === k
                ? "bg-primary text-primary-foreground font-semibold"
                : "text-muted-foreground hover:text-foreground"
            )}
            aria-pressed={rateKey === k}
          >
            {SPEECH_RATE_LABELS[k]}
          </button>
        ))}
      </div>
    </div>
  );
}
