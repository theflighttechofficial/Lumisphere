import { createContext, useContext, useState, useEffect } from "react";
import { AudioEngine } from "../utils/AudioEngine";

const LightContext = createContext();

export function LightProvider({ children }) {
    const [isLightOn, setIsLightOn] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isMuted, setIsMuted] = useState(() => {
        const stored = localStorage.getItem("lumisphere_muted");
        const initialMute = stored ? stored === "true" : false;
        AudioEngine.setMuted(initialMute);
        return initialMute;
    });

    const toggleLight = () => {
        setIsLightOn(prev => !prev);
    };

    const toggleMute = () => {
        setIsMuted(prev => {
            const next = !prev;
            localStorage.setItem("lumisphere_muted", String(next));
            AudioEngine.setMuted(next);
            if (!next && isLightOn) {
                AudioEngine.startBulbHum();
            } else {
                AudioEngine.stopBulbHum();
            }
            return next;
        });
    };

    // Keep AudioEngine muted state in sync with local storage load
    useEffect(() => {
        AudioEngine.setMuted(isMuted);
        if (!isMuted && isLightOn) {
            AudioEngine.startBulbHum();
        } else {
            AudioEngine.stopBulbHum();
        }
    }, [isLightOn, isMuted]);

    const [isInputFocused, setIsInputFocused] = useState(false);
    const [loginTriggerTime, setLoginTriggerTime] = useState(0);
    const [lampIntensity, setLampIntensity] = useState(100); // 0 to 100 range for dimmer
    const [viewerName, setViewerName] = useState("");
    const [college, setCollege] = useState("");

    return (
        <LightContext.Provider
            value={{
                isLightOn,
                setIsLightOn,
                toggleLight,
                isMuted,
                toggleMute,
                isLoggedIn,
                setIsLoggedIn,
                isInputFocused,
                setIsInputFocused,
                loginTriggerTime,
                setLoginTriggerTime,
                lampIntensity,
                setLampIntensity,
                viewerName,
                setViewerName,
                college,
                setCollege,
            }}
        >
            {children}
        </LightContext.Provider>
    );
}

export function useLight() {
    return useContext(LightContext);
}