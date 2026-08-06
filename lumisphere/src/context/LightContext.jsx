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

    // --- Dynamic Day/Night & Weather Environment State ---
    const getAutoTimeOfDay = () => {
        const hour = new Date().getHours();
        if (hour >= 6 && hour < 12) return "morning";
        if (hour >= 12 && hour < 19) return "evening";
        return "night";
    };

    const [isAutoTime, setIsAutoTime] = useState(true);
    const [timeOfDay, setTimeOfDayState] = useState(() => getAutoTimeOfDay());
    const [weather, setWeather] = useState("clear"); // "clear" | "rain" | "snow"
    const [lightningFlash, setLightningFlash] = useState(0); // 0 to 1 intensity
    const [weatherVolume, setWeatherVolume] = useState(0.5);

    const setTimeOfDay = (mode) => {
        setIsAutoTime(false);
        setTimeOfDayState(mode);
    };

    const enableAutoTime = () => {
        setIsAutoTime(true);
        setTimeOfDayState(getAutoTimeOfDay());
    };

    // Auto-update timeOfDay if isAutoTime is true
    useEffect(() => {
        if (!isAutoTime) return;

        const checkTime = () => {
            const currentAuto = getAutoTimeOfDay();
            setTimeOfDayState(currentAuto);
        };

        checkTime();
        const interval = setInterval(checkTime, 60000); // Check every minute
        return () => clearInterval(interval);
    }, [isAutoTime]);

    // Handle weather audio synthesis trigger & lightning strikes
    useEffect(() => {
        if (isMuted) {
            AudioEngine.stopRainAudio();
            AudioEngine.stopSnowAudio();
            return;
        }

        AudioEngine.setWeatherVolume(weatherVolume);

        if (weather === "rain") {
            AudioEngine.startRainAudio();
            AudioEngine.stopSnowAudio();
        } else if (weather === "snow") {
            AudioEngine.startSnowAudio();
            AudioEngine.stopRainAudio();
        } else {
            AudioEngine.stopRainAudio();
            AudioEngine.stopSnowAudio();
        }
    }, [weather, isMuted, weatherVolume]);

    // Lightning Flash loop during rain
    useEffect(() => {
        if (weather !== "rain") {
            setLightningFlash(0);
            return;
        }

        let flashTimeout;

        const scheduleLightning = () => {
            // Next strike in 7 to 18 seconds
            const nextDelay = 7000 + Math.random() * 11000;
            flashTimeout = setTimeout(() => {
                // Trigger lightning flash sequence
                setLightningFlash(1.0);
                AudioEngine.triggerThunder();

                // Double flash effect
                setTimeout(() => setLightningFlash(0.2), 80);
                setTimeout(() => setLightningFlash(0.85), 160);
                setTimeout(() => setLightningFlash(0), 380);

                scheduleLightning();
            }, nextDelay);
        };

        scheduleLightning();

        return () => {
            clearTimeout(flashTimeout);
            setLightningFlash(0);
        };
    }, [weather]);

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

                // Environment & Weather
                timeOfDay,
                setTimeOfDay,
                isAutoTime,
                enableAutoTime,
                weather,
                setWeather,
                lightningFlash,
                weatherVolume,
                setWeatherVolume,
            }}
        >
            {children}
        </LightContext.Provider>
    );
}

export function useLight() {
    return useContext(LightContext);
}