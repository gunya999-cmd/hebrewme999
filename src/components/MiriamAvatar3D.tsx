import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import avatarVideo from "@/assets/miriam-avatar.mp4";
import avatarPoster from "@/assets/miriam-avatar-poster.jpg";
import { cn } from "@/lib/utils";

interface MiriamAvatar3DProps {
  /** When true, the avatar plays (lip-sync with AI speech). When false, it pauses on first frame. */
  speaking?: boolean;
  size?: number;
  className?: string;
  /** Decorative glowing ring while speaking */
  showRing?: boolean;
  rounded?: boolean;
}

/**
 * 3D animated Miriam avatar synced with AI audio playback.
 * Plays the looping video while `speaking` is true, otherwise pauses
 * on the first frame so the face stays still while she "listens".
 */
export function MiriamAvatar3D({
  speaking = false,
  size = 168,
  className,
  showRing = true,
  rounded = true,
}: MiriamAvatar3DProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (speaking) {
      v.play().catch(() => {
        /* autoplay can fail before first user gesture — safe to ignore */
      });
    } else {
      v.pause();
      // Reset to first frame so idle face is consistent
      try {
        v.currentTime = 0;
      } catch {
        /* ignore */
      }
    }
  }, [speaking]);

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
      <video
        ref={videoRef}
        src={avatarVideo}
        poster={avatarPoster}
        muted
        playsInline
        loop
        preload="auto"
        width={size}
        height={size}
        className={cn(
          "block w-full h-full object-cover shadow-xl border-4 border-white/70 dark:border-white/10",
          rounded ? "rounded-full" : "rounded-2xl",
        )}
      />
    </div>
  );
}

export default MiriamAvatar3D;
