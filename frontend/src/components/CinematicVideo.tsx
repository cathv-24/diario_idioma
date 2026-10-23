import { useEffect, useRef, useState } from "react";
import { Play, Pause } from "lucide-react";
const VIDEO =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_083109_283f3553-e28f-428b-a723-d639c617eb2b.mp4";
export default function CinematicVideo() {
  const ref = useRef<HTMLVideoElement>(null);
  const [paused, setPaused] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    let frame = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let disposed = false;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onMotion = () => setPaused(motion.matches);
    motion.addEventListener("change", onMotion);
    const handlePlayFailure = () => {
      if (!disposed) setPaused(true);
    };
    const monitor = () => {
      if (disposed) return;
      const { currentTime: t, duration: d } = video;
      if (Number.isFinite(d) && d > 0)
        video.style.opacity = String(
          Math.max(0, Math.min(1, t / 0.5, (d - t) / 0.5)),
        );
      frame = requestAnimationFrame(monitor);
    };
    const onEnd = () => {
      video.style.opacity = "0";
      timer = setTimeout(() => {
        if (disposed || paused) return;
        video.currentTime = 0;
        void video.play().catch(handlePlayFailure);
      }, 100);
    };
    video.addEventListener("ended", onEnd);
    if (paused) {
      video.pause();
      video.style.opacity = ".65";
    } else {
      void video.play().catch(handlePlayFailure);
      frame = requestAnimationFrame(monitor);
    }
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      clearTimeout(timer);
      video.pause();
      video.removeEventListener("ended", onEnd);
      motion.removeEventListener("change", onMotion);
    };
  }, [paused]);
  return (
    <>
      <div
        className={`cinematic-layer ${failed ? "video-unavailable" : ""}`}
        aria-hidden="true"
      >
        <video
          ref={ref}
          src={VIDEO}
          muted
          playsInline
          preload="metadata"
          onError={() => setFailed(true)}
        />
        <div className="video-wash" />
      </div>
      {!failed && (
        <button
          className="video-control"
          onClick={() => setPaused(!paused)}
          aria-label={
            paused ? "Reproducir vídeo de fondo" : "Pausar vídeo de fondo"
          }
        >
          {paused ? "Reproducir paisaje" : "Pausar paisaje"}
          {paused ? (
            <Play size={12} aria-hidden="true" />
          ) : (
            <Pause size={12} aria-hidden="true" />
          )}
        </button>
      )}
    </>
  );
}
