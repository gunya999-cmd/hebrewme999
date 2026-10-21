import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import speakingVideo from "@/assets/miriam-avatar.mp4";
import idleVideo from "@/assets/miriam-avatar-idle.mp4";
import avatarPoster from "@/assets/miriam-avatar-poster.jpg";
import { cn } from "@/lib/utils";

interface MiriamAvatar3DProps {
  /** When true — plays the active "speaking" loop. When false — plays the idle living-presence loop. */
  speaking?: boolean;
  size?: number;
  className?: string;
  /** Decorative glowing ring while speaking */
  showRing?: boolean;
  rounded?: boolean;
}

/**
 * 3D animated Miriam avatar. Always alive — switches between an idle
 * "breathing/looking around" loop and an active "speaking" loop, with a
 * smooth crossfade so the presence never feels frozen.
 */
export function MiriamAvatar3D({
  speaking = false,
  size = 168,
  className,
  showRing = true,
  rounded = true,
}: MiriamAvatar3DProps) {
  const speakingRef = useRef<HTMLVideoElement>(null);
  const idleRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const s = speakingRef.current;
    const i = idleRef.current;
    if (!s || !i) return;
    const safePlay = (v: HTMLVideoElement) => {
      v.play().catch(() => {
        /* autoplay restrictions before first gesture — ignore */
      });
    };
    // Both loops keep running so we can crossfade instantly without a freeze.
    safePlay(s);
    safePlay(i);
  }, []);

  return (
    <div
      className={cn("relative inline-block", className)}
      style={{ width: size, height: size }}
    >
      {showRing && speaking && (
        <motion.span
          aria-hidden
          className={cn(
            "absolute inset-0 -m-2 border-2 border-primary/60",
            rounded ? "rounded-full" : "rounded-2xl",
          )}
          animate={{ scale: [1, 1.08, 1], opacity: [0.9, 0.4, 0.9] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
        />
      )}

      {/* Idle layer — always playing underneath */}
      <video
        ref={idleRef}
        src={idleVideo}
        poster={avatarPoster}
        muted
        playsInline
        loop
        autoPlay
        preload="auto"
        width={size}
        height={size}
        className={cn(
          "absolute inset-0 block w-full h-full object-cover shadow-xl border-4 border-white/70 dark:border-white/10 transition-opacity duration-300",
          rounded ? "rounded-full" : "rounded-2xl",
          speaking ? "opacity-0" : "opacity-100",
        )}
      />

      {/* Speaking layer — fades in while AI is talking */}
      <video
        ref={speakingRef}
        src={speakingVideo}
        poster={avatarPoster}
        muted
        playsInline
        loop
        autoPlay
        preload="auto"
        width={size}
        height={size}
        className={cn(
          "relative block w-full h-full object-cover shadow-xl border-4 border-white/70 dark:border-white/10 transition-opacity duration-300",
          rounded ? "rounded-full" : "rounded-2xl",
          speaking ? "opacity-100" : "opacity-0",
        )}
      />
    </div>
  );
}

export default MiriamAvatar3D;
