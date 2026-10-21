interface VerbIllustrationProps {
  type: string;
  className?: string;
}

type SceneKind =
  | "movement"
  | "food"
  | "drink"
  | "writing"
  | "reading"
  | "talking"
  | "home"
  | "shopping"
  | "sleep"
  | "sport"
  | "thinking"
  | "work";

function sceneKind(type: string): SceneKind {
  if (["walk", "come", "exit", "enter", "move", "return"].includes(type)) return "movement";
  if (["eat", "cook"].includes(type)) return "food";
  if (["drink"].includes(type)) return "drink";
  if (["write", "message"].includes(type)) return "writing";
  if (["read", "study", "prepare", "know", "understand", "interest"].includes(type)) return "reading";
  if (["speak", "ask", "answer", "call", "meet"].includes(type)) return "talking";
  if (["open", "close", "clean", "fix", "organize", "put", "sit"].includes(type)) return "home";
  if (["buy", "pay"].includes(type)) return "shopping";
  if (["sleep"].includes(type)) return "sleep";
  if (["train"].includes(type)) return "sport";
  if (["work"].includes(type)) return "work";
  return "thinking";
}

function ActionObject({ kind }: { kind: SceneKind }) {
  switch (kind) {
    case "movement":
      return (
        <g>
          <path d="M42 180c34-24 69-24 103 0s68 24 103 0" className="stroke-primary/45" fill="none" strokeWidth="10" strokeLinecap="round" />
          <path d="M174 125h42l-18-18" className="stroke-success" fill="none" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M216 125l-18 18" className="stroke-success" fill="none" strokeWidth="10" strokeLinecap="round" />
        </g>
      );
    case "food":
      return (
        <g>
          <ellipse cx="183" cy="150" rx="38" ry="16" className="fill-background stroke-primary" strokeWidth="7" />
          <circle cx="174" cy="146" r="8" className="fill-success" />
          <circle cx="192" cy="148" r="8" className="fill-primary/70" />
          <path d="M211 103v63M224 104v62M211 132h13" className="stroke-foreground/60" fill="none" strokeWidth="6" strokeLinecap="round" />
        </g>
      );
    case "drink":
      return (
        <g>
          <path d="M172 103h49l-8 67h-33z" className="fill-background stroke-primary" strokeWidth="7" strokeLinejoin="round" />
          <path d="M181 127h31" className="stroke-success" strokeWidth="8" strokeLinecap="round" />
          <path d="M198 103l22-30" className="stroke-foreground/55" strokeWidth="6" strokeLinecap="round" />
        </g>
      );
    case "writing":
      return (
        <g>
          <path d="M157 121h64v48h-64z" className="fill-background stroke-primary" strokeWidth="7" strokeLinejoin="round" />
          <path d="M172 137h33M172 151h24" className="stroke-foreground/45" strokeWidth="5" strokeLinecap="round" />
          <path d="M146 157l44-44 15 15-44 44-22 7z" className="fill-success/25 stroke-success" strokeWidth="6" strokeLinejoin="round" />
        </g>
      );
    case "reading":
      return (
        <g>
          <path d="M153 116c20-9 40-9 60 0v54c-20-9-40-9-60 0z" className="fill-background stroke-primary" strokeWidth="7" strokeLinejoin="round" />
          <path d="M153 116c-20-9-40-9-60 0v54c20-9 40-9 60 0z" className="fill-background stroke-primary" strokeWidth="7" strokeLinejoin="round" />
          <path d="M111 132h25M111 146h18M171 132h25M171 146h18" className="stroke-foreground/45" strokeWidth="5" strokeLinecap="round" />
        </g>
      );
    case "talking":
      return (
        <g>
          <path d="M158 84h56a20 20 0 0120 20v29a20 20 0 01-20 20h-19l-27 22 5-22h-15a20 20 0 01-20-20v-29a20 20 0 0120-20z" className="fill-background stroke-primary" strokeWidth="7" strokeLinejoin="round" />
          <path d="M166 111h44M166 128h31" className="stroke-success" strokeWidth="6" strokeLinecap="round" />
        </g>
      );
    case "home":
      return (
        <g>
          <path d="M166 92h48v83h-48z" className="fill-background stroke-primary" strokeWidth="7" strokeLinejoin="round" />
          <circle cx="202" cy="135" r="5" className="fill-success" />
          <path d="M149 105l41-35 41 35" className="stroke-success" fill="none" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      );
    case "shopping":
      return (
        <g>
          <path d="M150 104h72l-10 43h-50z" className="fill-background stroke-primary" strokeWidth="7" strokeLinejoin="round" />
          <path d="M144 88h14l8 59" className="stroke-foreground/55" strokeWidth="7" strokeLinecap="round" />
          <circle cx="169" cy="166" r="8" className="fill-success" />
          <circle cx="207" cy="166" r="8" className="fill-success" />
        </g>
      );
    case "sleep":
      return (
        <g>
          <path d="M66 142h145v34H66z" className="fill-background stroke-primary" strokeWidth="7" strokeLinejoin="round" />
          <path d="M82 121h58v21H82z" className="fill-success/20 stroke-success" strokeWidth="6" strokeLinejoin="round" />
          <path d="M172 82h31l-31 31h33" className="stroke-primary" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </g>
      );
    case "sport":
      return (
        <g>
          <path d="M160 136h70" className="stroke-foreground/60" strokeWidth="8" strokeLinecap="round" />
          <path d="M160 120v32M230 120v32" className="stroke-primary" strokeWidth="10" strokeLinecap="round" />
          <path d="M174 94l26 26 21-25" className="stroke-success" fill="none" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      );
    case "work":
      return (
        <g>
          <path d="M150 116h73v47h-73z" className="fill-background stroke-primary" strokeWidth="7" strokeLinejoin="round" />
          <path d="M133 166h107" className="stroke-success" strokeWidth="8" strokeLinecap="round" />
          <path d="M177 137h20" className="stroke-foreground/45" strokeWidth="5" strokeLinecap="round" />
        </g>
      );
    default:
      return (
        <g>
          <path d="M178 94c26 0 44 17 44 40s-18 40-44 40-44-17-44-40 18-40 44-40z" className="fill-background stroke-primary" strokeWidth="7" />
          <path d="M158 132h40M178 112v40" className="stroke-success" strokeWidth="8" strokeLinecap="round" />
        </g>
      );
  }
}

export default function VerbIllustration({ type, className = "" }: VerbIllustrationProps) {
  const kind = sceneKind(type);

  return (
    <div className={`relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-primary/10 via-accent/20 to-success/10 ${className}`}>
      <svg viewBox="0 0 256 256" role="img" aria-label="Иллюстрация действия" className="h-full w-full">
        <circle cx="210" cy="46" r="26" className="fill-primary/10" />
        <circle cx="45" cy="67" r="18" className="fill-success/10" />
        <path d="M31 205c36-25 72-25 108 0s69 25 103 0v31H31z" className="fill-card/75" />

        <g transform={kind === "movement" ? "translate(18 0)" : "translate(0 0)"}>
          <circle cx="91" cy="78" r="26" className="fill-primary/25 stroke-primary" strokeWidth="6" />
          <path d="M76 77c10 10 23 10 33 0" className="stroke-foreground/55" fill="none" strokeWidth="6" strokeLinecap="round" />
          <path d="M88 106c-20 9-31 28-31 53" className="stroke-primary" fill="none" strokeWidth="13" strokeLinecap="round" />
          <path d="M97 108c24 11 36 28 38 52" className="stroke-primary" fill="none" strokeWidth="13" strokeLinecap="round" />
          <path d={kind === "movement" || kind === "sport" ? "M68 160l-28 31M118 161l29 27" : "M72 159l-10 34M120 160l13 33"} className="stroke-foreground/55" fill="none" strokeWidth="12" strokeLinecap="round" />
          <path d={kind === "writing" || kind === "reading" || kind === "work" ? "M70 122l-30 26M111 122l37 18" : kind === "food" || kind === "drink" ? "M72 123l44 18M111 122l37-18" : "M71 122l-33 10M111 122l34 10"} className="stroke-foreground/55" fill="none" strokeWidth="11" strokeLinecap="round" />
        </g>

        <ActionObject kind={kind} />
      </svg>
    </div>
  );
}
