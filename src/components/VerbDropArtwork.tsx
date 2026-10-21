import { useState } from "react";
import type { VerbDropCard } from "@/data/verbDrops";
import VerbIllustration from "@/components/VerbIllustration";
import VerbCardScene from "@/components/VerbCardScene";

interface VerbDropArtworkProps {
  verb: VerbDropCard;
  className?: string;
}

export default function VerbDropArtwork({ verb, className = "" }: VerbDropArtworkProps) {
  const [imageFailed, setImageFailed] = useState(false);

  if (verb.id === "hero-walk") {
    return (
      <div className={`relative overflow-hidden rounded-[2rem] bg-[radial-gradient(circle_at_18%_20%,_rgba(34,211,238,0.28),_transparent_28%),radial-gradient(circle_at_82%_16%,_rgba(124,58,237,0.32),_transparent_30%),linear-gradient(135deg,_#0b1028,_#161b46_58%,_#0f766e)] ${className}`}>
        <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.12)_1px,transparent_1px)] [background-size:28px_28px]" />
        <div className="absolute -right-8 -top-10 h-36 w-36 rounded-full border border-white/15 bg-white/5" />
        <div className="absolute -bottom-12 -left-8 h-40 w-40 rounded-full border border-cyan-200/15 bg-cyan-300/5" />
        <div className="relative flex h-full min-h-[11rem] items-center justify-between gap-6 px-7 py-6 text-white">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.28em] text-cyan-200/75">Hebrew action mode</p>
            <p className="mt-2 text-2xl font-black">Учись через действие</p>
            <p className="mt-2 max-w-sm text-sm font-semibold leading-relaxed text-white/65">Картинка, звук, форма и быстрый ответ в одном коротком цикле.</p>
          </div>
          <div className="shrink-0 text-right">
            <p dir="rtl" className="font-hebrew text-6xl font-black leading-none text-cyan-200 hebrew-glow">ללכת</p>
            <p className="mt-2 text-lg font-black text-white">идти</p>
            <div className="mt-3 flex justify-end gap-2">
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-black">פעל</span>
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-black">הלך</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (verb.imageSrc && !imageFailed) {
    return (
      <VerbCardScene
        verbId={verb.id}
        src={verb.imageSrc}
        alt={`${verb.infinitive_hebrew} — ${verb.translation_ru}`}
        className={`rounded-[2rem] bg-gradient-to-br from-white via-primary/5 to-success/10 ${className}`}
        loading="eager"
        onError={() => setImageFailed(true)}
      />
    );
  }

  return <VerbIllustration type={verb.visualType} className={className} />;
}
