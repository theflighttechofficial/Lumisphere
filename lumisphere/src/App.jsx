import LoginPage from "./pages/LoginPage";
import MagneticCustomCursor from "./components/UI/MagneticCustomCursor";
import LumiAIModal from "./components/UI/LumiAIModal";

export default function App() {
  return (
    <>
      <MagneticCustomCursor />
      <LumiAIModal />
      <LoginPage />
    </>
  );
}