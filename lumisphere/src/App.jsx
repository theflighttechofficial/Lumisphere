import { useCallback, useState } from "react";
import { Analytics } from '@vercel/analytics/react';
import LoginPage from "./pages/LoginPage";
import MagneticCustomCursor from "./components/UI/MagneticCustomCursor";
import LumiAIModal from "./components/UI/LumiAIModal";
import IntroVideo from "./components/UI/IntroVideo";

const INTRO_KEY = "lumisphere_intro_seen";

// The showreel plays once per browser session; reloads and returning tabs go straight to the lamp.
const introAlreadySeen = () => {
  try {
    return sessionStorage.getItem(INTRO_KEY) === "1" || new URLSearchParams(window.location.search).has("skipintro");
  } catch {
    return false;
  }
};

export default function App() {
  const [introDone, setIntroDone] = useState(introAlreadySeen);

  const finishIntro = useCallback(() => {
    try {
      sessionStorage.setItem(INTRO_KEY, "1");
    } catch {
      /* storage blocked — intro will just replay next time */
    }
    setIntroDone(true);
  }, []);

  if (!introDone) return <IntroVideo onDone={finishIntro} />;

  return (
    <>
      <MagneticCustomCursor />
      <LumiAIModal />
      <LoginPage />
      <Analytics />
    </>
  );
}
