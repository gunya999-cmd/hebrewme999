interface VerbIllustrationProps {
  type: string;
  className?: string;
}

function getScene(type: string) {
  if (["walk", "come", "exit", "enter", "move", "return"].includes(type)) {
    return { emoji: "🚶", item: "M4 164c30-18 82-18 112 0s82 18 112 0", accent: "M141 74l22 21 24-33" };
  }
  if (["eat", "cook"].includes(type)) {
    return { emoji: "🍽️", item: "M62 144h124l-12 28H74z", accent: "M82 125c17-17 51-17 68 0" };
  }
  if (["drink"].includes(type)) {
    return { emoji: "🥤", item: "M88 87h70l-10 88H98z", accent: "M104 73h58" };
  }
  if (["write", "read", "study", "understand", "know", "prepare"].includes(type)) {
    return { emoji: "📚", item: "M62 132h132v39H62z", accent: "M84 114h88M84 100h64" };
  }
  if (["speak", "ask", "answer", "call", "message", "meet"].includes(type)) {
    return { emoji: "💬", item: "M55 80h138a18 18 0 0118 18v45a18 18 0 01-18 18h-72l-35 24 8-24H55a18 18 0 01-18-18V98a18 18 0 0118-18z", accent: "M76 111h94M76 132h67" };
  }
  if (["open", "close", "clean", "fix", "organize", "put", "sit"].includes(type)) {
    return { emoji: "🏠", item: "M69 86h82v91H69z", accent: "M151 86l38 22v69h-38" };
  }
  if (["sleep"].includes(type)) {
    return { emoji: "😴", item: "M54 136h143v38H54z", accent: "M122 78h34l-34 34h38" };
  }
  if (["buy", "pay"].includes(type)) {
    return { emoji: "🛒", item: "M54 92h121l-12 53H75z", accent: "M69 166a10 10 0 100-20 10 10 0 000 20zM156 166a10 10 0 100-20 10 10 0 000 20z" };
  }
  if (["feel", "love", "want", "think", "be", "do", "start", "continue", "stop", "stay", "manage", "interest"].includes(type)) {
    return { emoji: "✨", item: "M128 73c29-29 84-10 82 36-2 42-82 86-82 86s-80-44-82-86c-2-46 53-65 82-36z", accent: "M100 124h56M128 96v56" };
  }
  if (["train"].includes(type)) {
    return { emoji: "🏃", item: "M69 145h118M84 126l18 19 25-46 30 32 22-21", accent: "M171 82a17 17 0 11-34 0 17 17 0 0134 0z" };
  }
  return { emoji: "⚡", item: "M128 54l-58 84h42l-16 64 88-104h-47z", accent: "M66 181h124" };
}

export default function VerbIllustration({ type, className = "" }: VerbIllustrationProps) {
  const scene = getScene(type);

  return (
    <div className={`relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-primary/10 via-accent/20 to-success/10 ${className}`}>
      <svg viewBox="0 0 256 256" role="img" aria-label="Иллюстрация действия" className="h-full w-full">
        <circle cx="204" cy="48" r="28" className="fill-primary/10" />
        <circle cx="46" cy="66" r="18" className="fill-success/10" />
        <path d="M33 204c31-33 72-31 95-12 28 23 63 21 95-12v52H33z" className="fill-card/80" />
        <circle cx="122" cy="78" r="28" className="fill-primary/20" />
        <path d="M105 109h46a22 22 0 0122 22v55H83v-55a22 22 0 0122-22z" className="fill-primary/30" />
        <path d="M104 78c13 12 35 12 48 0" className="stroke-foreground/50" fill="none" strokeWidth="7" strokeLinecap="round" />
        <path d={scene.item} className="stroke-primary" fill="none" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
        <path d={scene.accent} className="stroke-success" fill="none" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <div className="absolute bottom-4 right-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-background/80 text-2xl shadow-sm backdrop-blur-sm">
        {scene.emoji}
      </div>
    </div>
  );
}
