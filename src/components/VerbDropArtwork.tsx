import { useState } from "react";
import type { VerbDropCard } from "@/data/verbDrops";
import VerbIllustration from "@/components/VerbIllustration";

interface VerbDropArtworkProps {
  verb: VerbDropCard;
  className?: string;
}

export default function VerbDropArtwork({ verb, className = "" }: VerbDropArtworkProps) {
  const [imageFailed, setImageFailed] = useState(false);

  if (verb.imageSrc && !imageFailed) {
    return (
      <div className={`relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-white via-primary/5 to-success/10 ${className}`}>
        <img
          src={verb.imageSrc}
          alt={`${verb.infinitive_hebrew} — ${verb.translation_ru}`}
          className="h-full w-full object-contain"
          loading="eager"
          decoding="async"
          onError={() => setImageFailed(true)}
        />
      </div>
    );
  }

  return <VerbIllustration type={verb.visualType} className={className} />;
}
