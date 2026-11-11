import { useEffect, useState } from "react";
import { FastForward } from "lucide-react";

export default function IntroVideo({ onDone }) {
  const [showSkip, setShowSkip] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      if (e.origin === window.location.origin && e.data === "intro-done") onDone();
    };
    const onKey = (e) => (e.key === "Escape" || e.key === "Enter") && onDone();
    window.addEventListener("message", handler);
    window.addEventListener("keydown", onKey);
    const t = setTimeout(() => setShowSkip(true), 600);
    return () => {
      window.removeEventListener("message", handler);
      window.removeEventListener("keydown", onKey);
      clearTimeout(t);
    };
  }, [onDone]);

  return (
    <div className="fixed inset-0 z-[99999] bg-black">
      <iframe src="/intro.html" title="Intro showreel" className="w-full h-full border-0 bg-black" />
      <button
        onClick={onDone}
        aria-label="Skip the intro reel"
        className={`group isolate absolute right-4 sm:right-8 bottom-[max(1.25rem,env(safe-area-inset-bottom))] sm:bottom-8 flex items-center gap-3 pl-6 pr-5 py-3.5 sm:py-4 rounded-full bg-amber-400 text-zinc-950 text-base sm:text-lg font-bold tracking-wide shadow-[0_0_0_6px_rgba(251,191,36,0.18),0_12px_40px_rgba(251,191,36,0.45)] hover:bg-amber-300 hover:scale-105 active:scale-95 transition-all duration-500 ${showSkip ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}`}
      >
        <span className="absolute inset-0 rounded-full bg-amber-300/50 animate-ping [animation-duration:2.4s] -z-10" aria-hidden />
        Skip reel
        <FastForward size={20} className="fill-current group-hover:translate-x-0.5 transition-transform" />
        <kbd className="hidden sm:inline-block ml-1 px-1.5 py-0.5 rounded-md bg-black/15 text-[11px] font-semibold">Esc</kbd>
      </button>
    </div>
  );
}
