import { useEffect, useState } from "react";

export default function IntroVideo({ onDone }) {
  const [showSkip, setShowSkip] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      if (e.origin === window.location.origin && e.data === "intro-done") onDone();
    };
    const onKey = (e) => (e.key === "Escape" || e.key === "Enter") && onDone();
    window.addEventListener("message", handler);
    window.addEventListener("keydown", onKey);
    const t = setTimeout(() => setShowSkip(true), 1200);
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
        className={`absolute bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-5 px-4 py-2 rounded-full border border-white/20 bg-black/60 backdrop-blur text-[13px] font-semibold text-white/80 hover:text-white hover:border-white/40 transition-opacity duration-500 ${showSkip ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      >
        Skip intro →
      </button>
    </div>
  );
}
