import { useEffect } from "react";

export default function IntroVideo({ onDone }) {
  useEffect(() => {
    const handler = (e) => {
      if (e.data === "intro-done") onDone();
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, [onDone]);

  return (
    <iframe
      src="/intro.html"
      title="Intro"
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        border: "none",
        background: "#000",
        zIndex: 99999,
      }}
    />
  );
}
