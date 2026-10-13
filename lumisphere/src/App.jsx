import { useState } from "react";
import LoginPage from "./pages/LoginPage";
import MagneticCustomCursor from "./components/UI/MagneticCustomCursor";
import LumiAIModal from "./components/UI/LumiAIModal";
import IntroVideo from "./components/UI/IntroVideo";

export default function App() {
  const [introDone, setIntroDone] = useState(false);

  if (!introDone) return <IntroVideo onDone={() => setIntroDone(true)} />;

  return (
    <>
      <MagneticCustomCursor />
      <LumiAIModal />
      <LoginPage />
    </>
  );
}
