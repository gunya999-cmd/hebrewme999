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
