import type { VerbDropCard } from "@/data/verbDrops";
import VerbIllustration from "@/components/VerbIllustration";

interface VerbDropArtworkProps {
  verb: VerbDropCard;
  className?: string;
}

type MovementScene =
  | "walk"
  | "come"
  | "goOut"
  | "goIn"
  | "returnHome"
  | "cross"
  | "goUp"
  | "goDown"
  | "run"
  | "moveForward";

function getMovementScene(infinitive: string): MovementScene | null {
  switch (infinitive) {
    case "ללכת":
      return "walk";
    case "לבוא":
      return "come";
    case "לצאת":
      return "goOut";
    case "להיכנס":
      return "goIn";
    case "לחזור":
      return "returnHome";
    case "לעבור":
      return "cross";
    case "לעלות":
      return "goUp";
    case "לרדת":
      return "goDown";
    case "לרוץ":
      return "run";
    case "להתקדם":
      return "moveForward";
    default:
      return null;
  }
}

function Person({
  x = 72,
  y = 70,
  shirt = "fill-primary",
  pants = "fill-slate-700",
  fast = false,
  still = false,
}: {
  x?: number;
  y?: number;
  shirt?: string;
  pants?: string;
  fast?: boolean;
  still?: boolean;
}) {
  const legPath = still ? "M23 89v38M51 89v38" : fast ? "M23 88L4 124M52 88l34 18" : "M24 88L10 124M51 88l20 36";
  const armPath = still ? "M20 57l-17 18M55 57l17 18" : fast ? "M20 57L0 43M56 57l29-20" : "M20 57L1 69M56 57l25 12";

  return (
    <g transform={`translate(${x} ${y})`}>
      <ellipse cx="38" cy="133" rx="45" ry="9" className="fill-foreground/10" />
      <circle cx="38" cy="24" r="21" className="fill-amber-200 stroke-foreground/20" strokeWidth="3" />
      <path d="M21 22c7-19 33-19 40 0-8-9-29-9-40 0z" className="fill-slate-800" />
      <path d="M30 28h2M45 28h2M32 39c5 4 10 4 15 0" className="stroke-foreground/70" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M20 50c12-10 25-10 37 0v40H20z" className={shirt} />
      <path d={armPath} className="stroke-amber-200" strokeWidth="9" strokeLinecap="round" fill="none" />
      <path d={legPath} className={pants} strokeWidth="12" strokeLinecap="round" fill="none" stroke="currentColor" />
      <path d="M1 125h25M63 125h28" className="stroke-background" strokeWidth="7" strokeLinecap="round" fill="none" />
    </g>
  );
}

function Scene({ scene }: { scene: MovementScene }) {
  switch (scene) {
    case "walk":
      return (
        <>
          <path d="M28 201c38-24 83-24 121 0s68 24 98 0" className="stroke-primary/30" strokeWidth="14" strokeLinecap="round" fill="none" />
          <path d="M169 90h47l-19-19M216 90l-19 19" className="stroke-success" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <Person x={63} y={56} shirt="fill-purple-500" />
        </>
      );
    case "come":
      return (
        <>
          <path d="M172 77h54v111h-54z" className="fill-orange-200 stroke-orange-500" strokeWidth="7" />
          <path d="M178 89h35v88h-35z" className="fill-violet-600" />
          <path d="M104 185c24-25 48-39 72-43" className="stroke-success" strokeWidth="9" strokeLinecap="round" fill="none" />
          <path d="M147 131l31 12-24 22" className="stroke-success" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <Person x={55} y={72} shirt="fill-teal-500" />
        </>
      );
    case "goOut":
      return (
        <>
          <path d="M43 69h84v124H43z" className="fill-violet-700 stroke-violet-900" strokeWidth="7" />
          <path d="M67 82h42v99H67z" className="fill-background/80" />
          <path d="M126 134h62l-24-24M188 134l-24 24" className="stroke-success" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <Person x={112} y={76} shirt="fill-emerald-500" />
        </>
      );
    case "goIn":
      return (
        <>
          <path d="M149 64h71v131h-71z" className="fill-violet-700 stroke-violet-900" strokeWidth="7" />
          <path d="M156 79h46v103h-46z" className="fill-amber-200" />
          <path d="M72 134h71l-24-24M143 134l-24 24" className="stroke-primary" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <Person x={55} y={76} shirt="fill-teal-500" />
        </>
      );
    case "returnHome":
      return (
        <>
          <path d="M164 111l38-35 39 35v77h-77z" className="fill-orange-200 stroke-orange-500" strokeWidth="7" strokeLinejoin="round" />
          <path d="M191 145h23v43h-23z" className="fill-violet-700" />
          <path d="M74 185c52-42 100-54 144-34" className="stroke-primary/35" strokeWidth="14" strokeLinecap="round" fill="none" />
          <path d="M125 122c-24 11-39 28-45 51" className="stroke-success" strokeWidth="9" strokeLinecap="round" fill="none" />
          <Person x={51} y={77} shirt="fill-purple-500" />
        </>
      );
    case "cross":
      return (
        <>
          <path d="M21 154h214v62H21z" className="fill-slate-700" />
          <path d="M39 164h25M86 164h25M133 164h25M180 164h25M63 191h25M110 191h25M157 191h25" className="stroke-background" strokeWidth="10" strokeLinecap="round" />
          <path d="M40 96h176" className="stroke-success" strokeWidth="9" strokeLinecap="round" fill="none" />
          <Person x={86} y={63} shirt="fill-teal-500" />
        </>
      );
    case "goUp":
      return (
        <>
          <path d="M137 190h88v28h-88zM109 161h88v29h-88zM81 132h88v29H81zM53 103h88v29H53z" className="fill-violet-300 stroke-violet-500" strokeWidth="5" />
          <path d="M57 80l39-39 39 39M96 43v72" className="stroke-success" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <Person x={92} y={68} shirt="fill-purple-500" />
        </>
      );
    case "goDown":
      return (
        <>
          <path d="M42 190h88v28H42zM70 161h88v29H70zM98 132h88v29H98zM126 103h88v29h-88z" className="fill-violet-300 stroke-violet-500" strokeWidth="5" />
          <path d="M201 55v72M162 90l39 39 39-39" className="stroke-primary" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <Person x={85} y={72} shirt="fill-teal-500" />
        </>
      );
    case "run":
      return (
        <>
          <path d="M33 190h170" className="stroke-primary/25" strokeWidth="14" strokeLinecap="round" fill="none" />
          <path d="M55 94h38M42 123h54M33 152h38" className="stroke-success/70" strokeWidth="7" strokeLinecap="round" fill="none" />
          <Person x={90} y={60} shirt="fill-teal-500" fast />
        </>
      );
    case "moveForward":
      return (
        <>
          <path d="M67 188h124" className="stroke-primary/25" strokeWidth="14" strokeLinecap="round" fill="none" />
          <path d="M173 91h46l-18-18M219 91l-18 18" className="stroke-success" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <circle cx="55" cy="188" r="13" className="fill-muted stroke-primary/50" strokeWidth="5" />
          <circle cx="126" cy="188" r="13" className="fill-muted stroke-primary/50" strokeWidth="5" />
          <Person x={88} y={69} shirt="fill-purple-500" still />
        </>
      );
  }
}

export default function VerbDropArtwork({ verb, className = "" }: VerbDropArtworkProps) {
  const scene = getMovementScene(verb.infinitive_hebrew);

  if (!scene) {
    return <VerbIllustration type={verb.visualType} className={className} />;
  }

  return (
    <div className={`relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-white via-primary/5 to-success/10 ${className}`}>
      <svg viewBox="0 0 256 256" role="img" aria-label={verb.translation_ru} className="h-full w-full">
        <circle cx="210" cy="47" r="28" className="fill-primary/10" />
        <circle cx="44" cy="62" r="18" className="fill-success/15" />
        <path d="M25 218c44-28 83-28 119 0s64 28 88 0v30H25z" className="fill-card/75" />
        <Scene scene={scene} />
      </svg>
    </div>
  );
}
