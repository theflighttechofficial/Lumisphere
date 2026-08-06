import { motion, AnimatePresence, useSpring } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import {
    Sparkles,
    Wrench,
    Brain,
    Layers,
    Search,
    Volume2,
    CheckCircle2,
    X,
    MessageSquare,
    Zap,
    Cpu,
    HelpCircle,
    Gamepad2,
    Trophy,
    Lock,
    Key,
    Bot
} from "lucide-react";
import { useLight } from "../../context/LightContext";
import useMousePosition from "../../hooks/useMousePosition";
import { AudioEngine } from "../../utils/AudioEngine";
import useMobile from "../../hooks/useMobile";
import DroneSparks from "./DroneSparks";
import DroneHologram from "./DroneHologram";
import { SecretsManager } from "../../utils/SecretsManager";

import RetroArcadeModal from "../InteractiveDesk/RetroArcadeModal";
import HiddenDevRoomModal from "../InteractiveDesk/HiddenDevRoomModal";
import AchievementsModal from "../InteractiveDesk/AchievementsModal";

export default function Drone() {
    const { isLightOn } = useLight();
    const mouse = useMousePosition();
    const droneRef = useRef(null);
    const isMobile = useMobile(768);

    // Drone states
    const [tilt, setTilt] = useState(0);
    const [isScanning, setIsScanning] = useState(false);
    const [isRepairing, setIsRepairing] = useState(false);
    const [isIdle, setIsIdle] = useState(false);
    const [speechText, setSpeechText] = useState("AI Companion Online • Pull chain or click me!");
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [hologramMode, setHologramMode] = useState("none"); // 'none' | 'recommendations' | 'skills' | 'diagnostics'
    const [followCursor, setFollowCursor] = useState(true);

    // Secret Modals State
    const [arcadeOpen, setArcadeOpen] = useState(false);
    const [devRoomOpen, setDevRoomOpen] = useState(false);
    const [achievementsOpen, setAchievementsOpen] = useState(false);

    // Mouse spring motion for cursor tracking
    const springX = useSpring(0, { stiffness: 45, damping: 15 });
    const springY = useSpring(0, { stiffness: 45, damping: 15 });

    // Idle Detection Timer
    const idleTimerRef = useRef(null);

    const resetIdleTimer = () => {
        setIsIdle(false);
        if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
        idleTimerRef.current = setTimeout(() => {
            setIsIdle(true);
            const randomHint = SecretsManager.getRandomHint();
            speakMessage(randomHint);
        }, 5000);
    };

    // Listen for custom secret events
    useEffect(() => {
        const handleSecretEvent = (e) => {
            const { type, payload } = e.detail;
            if (type === "KONAMI_ACTIVATED") {
                speakMessage("🕹️ KONAMI CODE ACTIVATED! Opening Secret Retro Arcade...");
                setArcadeOpen(true);
            } else if (type === "MORSE_ACTIVATED") {
                speakMessage("⚡ MORSE CODE DECODED! Unlocking Hidden Developer Room...");
                setDevRoomOpen(true);
            } else if (type === "ACHIEVEMENT_UNLOCKED") {
                speakMessage(`🏆 Achievement Unlocked: ${payload.name}!`);
            }
        };

        const handleOpenModal = (e) => {
            const { modal } = e.detail;
            if (modal === "arcade") setArcadeOpen(true);
            if (modal === "devroom") setDevRoomOpen(true);
            if (modal === "achievements") setAchievementsOpen(true);
        };

        window.addEventListener("lumisphere_secret_event", handleSecretEvent);
        window.addEventListener("lumisphere_open_modal", handleOpenModal);

        return () => {
            window.removeEventListener("lumisphere_secret_event", handleSecretEvent);
            window.removeEventListener("lumisphere_open_modal", handleOpenModal);
        };
    }, []);

    // Cursor tracking & idle detection
    useEffect(() => {
        window.addEventListener("mousemove", resetIdleTimer);
        window.addEventListener("keydown", resetIdleTimer);

        resetIdleTimer();

        return () => {
            window.removeEventListener("mousemove", resetIdleTimer);
            window.removeEventListener("keydown", resetIdleTimer);
            if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
        };
    }, []);

    // Smooth cursor follow calculations
    useEffect(() => {
        if (!followCursor) {
            springX.set(0);
            springY.set(0);
            return;
        }

        const windowW = window.innerWidth;
        const windowH = window.innerHeight;

        if (mouse.x > 0 && mouse.y > 0) {
            // Target offset relative to center of screen
            const targetX = (mouse.x - windowW / 2) * (isMobile ? 0.25 : 0.45);
            const targetY = (mouse.y - windowH / 3) * (isMobile ? 0.15 : 0.35);

            springX.set(targetX);
            springY.set(targetY);

            // Compute tilt angle based on horizontal mouse movement
            const angle = Math.max(-25, Math.min(25, (targetX / (windowW / 2)) * 35));
            setTilt(angle);
        }
    }, [mouse, followCursor, isMobile, springX, springY]);

    // Speech trigger helper with synthesized bleeps & Web Speech API
    const speakMessage = (text) => {
        setSpeechText(text);
        AudioEngine.playDroneBleep();

        // Optional Web Speech API synthesis
        if (typeof window !== "undefined" && "speechSynthesis" in window && !AudioEngine.isMuted()) {
            try {
                window.speechSynthesis.cancel();
                const utterance = new SpeechSynthesisUtterance(text);
                utterance.rate = 1.1;
                utterance.pitch = 1.3;
                utterance.volume = 0.5;
                window.speechSynthesis.speak(utterance);
            } catch (e) {}
        }
    };

    // Action handlers
    const handleTriggerScan = () => {
        setIsScanning(true);
        speakMessage("Scanning workspace target... All systems operational!");
        AudioEngine.playDroneScan();
        setTimeout(() => setIsScanning(false), 3000);
    };

    const handleTriggerRepair = () => {
        setIsRepairing(true);
        speakMessage("Initiating automated drone spark repair sequence!");
        
        let sparkCount = 0;
        const sparkInterval = setInterval(() => {
            AudioEngine.playDroneRepair();
            sparkCount++;
            if (sparkCount > 10) clearInterval(sparkInterval);
        }, 150);

        setTimeout(() => {
            setIsRepairing(false);
            speakMessage("Repair complete! System integrity restored to 100%.");
            AudioEngine.playUISelect();
        }, 2200);
    };

    const handleRecommendProjects = () => {
        setHologramMode("recommendations");
        AudioEngine.playHoloProject();
        speakMessage("Project Recommendations projected! Check out top engineering builds.");
    };

    const handleExplainSkills = () => {
        setHologramMode("skills");
        AudioEngine.playHoloProject();
        speakMessage("Skill Matrix projected! Explaining AI, WebGL, and Fullstack stack.");
    };

    const handleSystemDiagnostics = () => {
        setHologramMode("diagnostics");
        AudioEngine.playHoloProject();
        speakMessage("Running system diagnostics. All cores green!");
    };

    const handleSeekSecrets = () => {
        const hint = SecretsManager.getRandomHint();
        speakMessage(hint);
        AudioEngine.playHoloProject();
    };

    return (
        <>
            {/* Drone Hologram Overlay Viewer */}
            <DroneHologram
                mode={hologramMode}
                onClose={() => setHologramMode("none")}
            />

            {/* Secret Modals */}
            <RetroArcadeModal
                isOpen={arcadeOpen}
                onClose={() => setArcadeOpen(false)}
            />
            <HiddenDevRoomModal
                isOpen={devRoomOpen}
                onClose={() => setDevRoomOpen(false)}
            />
            <AchievementsModal
                isOpen={achievementsOpen}
                onClose={() => setAchievementsOpen(false)}
            />

            {/* Main Floating Drone Entity */}
            <motion.div
                ref={droneRef}
                style={{
                    x: springX,
                    y: springY,
                }}
                animate={{
                    opacity: 1,
                    scale: isMobile ? 0.85 : 1,
                    pointerEvents: "auto",
                }}
                className="
                    fixed
                    top-20 sm:top-28
                    left-1/2
                    -translate-x-1/2
                    z-[100]
                    flex
                    flex-col
                    items-center
                    select-none
                "
            >
                {/* Dynamic Holographic Dialogue Speech Bubble */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{
                        opacity: 1,
                        y: [0, -4, 0],
                    }}
                    transition={{
                        y: { duration: 2.5, repeat: Infinity, ease: "easeInOut" }
                    }}
                    className="
                        relative
                        mb-3
                        px-3.5
                        py-1.5
                        rounded-xl
                        border
                        border-cyan-400/50
                        bg-neutral-950/90
                        backdrop-blur-md
                        text-[11px]
                        font-mono
                        font-semibold
                        text-cyan-300
                        whitespace-nowrap
                        shadow-[0_0_20px_rgba(34,211,238,0.3)]
                        flex
                        items-center
                        gap-2
                        cursor-pointer
                        hover:scale-105
                        transition-transform
                    "
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"></span>
                    </span>

                    <span>{speechText}</span>

                    {isIdle && (
                        <span className="px-1.5 py-0.2 rounded text-[9px] bg-amber-500/20 text-amber-300 border border-amber-500/40">
                            IDLE PATROL
                        </span>
                    )}
                </motion.div>

                {/* Drone Core Physics Body */}
                <motion.div
                    animate={{ rotate: tilt }}
                    transition={{ type: "spring", stiffness: 120, damping: 15 }}
                    className="relative flex flex-col items-center cursor-pointer group"
                    onClick={() => {
                        AudioEngine.playUISelect();
                        setIsMenuOpen(!isMenuOpen);
                    }}
                >
                    {/* Welding Spark Particles during Repair */}
                    <DroneSparks active={isRepairing} />

                    {/* Hologram Emitter Beams */}
                    {hologramMode !== "none" && (
                        <div className="absolute bottom-full mb-1 w-24 h-28 bg-gradient-to-t from-cyan-400/40 to-transparent clip-triangle pointer-events-none animate-pulse" />
                    )}

                    {/* Drone Metal Pod */}
                    <div className={`relative w-10 h-10 rounded-full bg-gradient-to-br from-zinc-700 via-zinc-800 to-zinc-950 border-2 transition-all flex items-center justify-center shadow-2xl ${
                        isRepairing
                            ? "border-amber-400 shadow-[0_0_25px_rgba(251,191,36,0.8)]"
                            : isScanning
                            ? "border-cyan-400 shadow-[0_0_25px_rgba(34,211,238,0.8)]"
                            : "border-cyan-500/60 hover:border-cyan-400 hover:shadow-[0_0_20px_rgba(34,211,238,0.5)]"
                    }`}>

                        {/* Scanner Eye */}
                        <motion.div
                            animate={isScanning ? {
                                scale: [0.95, 1.4, 0.95],
                                backgroundColor: ["#22d3ee", "#ffffff", "#22d3ee"],
                            } : isRepairing ? {
                                scale: [1, 1.5, 1],
                                backgroundColor: ["#f59e0b", "#fef08a", "#f59e0b"],
                            } : {
                                scale: [0.9, 1.25, 0.9],
                            }}
                            transition={{
                                duration: isScanning || isRepairing ? 0.4 : 1.5,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                            className="w-3.5 h-3.5 rounded-full bg-cyan-400 shadow-[0_0_10px_#22d3ee]"
                        />

                        {/* Left Wing Thruster */}
                        <div className="absolute -left-5 top-1/2 -translate-y-1/2 w-5 h-3.5 rounded-l-md bg-zinc-800 border-l-2 border-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.5)] flex items-center justify-end">
                            <span className="w-1 h-1 rounded-full bg-cyan-400 opacity-80 mr-0.5 animate-pulse" />
                        </div>

                        {/* Right Wing Thruster */}
                        <div className="absolute -right-5 top-1/2 -translate-y-1/2 w-5 h-3.5 rounded-r-md bg-zinc-800 border-r-2 border-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.5)] flex items-center justify-start">
                            <span className="w-1 h-1 rounded-full bg-cyan-400 opacity-80 ml-0.5 animate-pulse" />
                        </div>

                        {/* Top Antenna Signal */}
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-0.5 h-4 bg-zinc-500">
                            <span className="absolute -top-1 -left-[1.5px] w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                        </div>
                    </div>

                    {/* Bottom Thruster Jet Flame */}
                    <motion.div
                        animate={{
                            opacity: [0.6, 1, 0.6],
                            scaleY: [0.8, 1.4, 0.8],
                        }}
                        transition={{
                            duration: 0.12,
                            repeat: Infinity,
                            ease: "linear",
                        }}
                        className="w-2.5 h-4 bg-gradient-to-b from-cyan-400 to-transparent blur-[0.5px] origin-top mt-0.5"
                    />

                    {/* Laser Target Reticle Scan Grid */}
                    <AnimatePresence>
                        {isScanning && (
                            <motion.div
                                initial={{ opacity: 0, scaleY: 0 }}
                                animate={{ opacity: 0.8, scaleY: 1 }}
                                exit={{ opacity: 0, scaleY: 0 }}
                                style={{
                                    originY: 0,
                                    clipPath: "polygon(50% 0%, 10% 100%, 90% 100%)",
                                    background: "linear-gradient(to bottom, rgba(34,211,238,0.7) 0%, rgba(34,211,238,0.05) 100%)",
                                }}
                                className="absolute top-9 w-64 h-64 pointer-events-none z-10 blur-[0.5px]"
                            />
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* Interactive AI Companion Control Wheel Menu */}
                <AnimatePresence>
                    {isMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.8, y: 10 }}
                            className="mt-3 p-3 rounded-2xl bg-neutral-950/95 border border-cyan-500/50 shadow-[0_0_40px_rgba(34,211,238,0.3)] backdrop-blur-xl flex flex-wrap items-center justify-center gap-2 max-w-md z-[110]"
                        >
                            <button
                                onClick={() => {
                                    AudioEngine.playHoloProject();
                                    window.dispatchEvent(new CustomEvent("lumisphere_open_lumi_ai"));
                                }}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-400/50 text-xs font-mono font-bold transition shadow-[0_0_15px_rgba(34,211,238,0.4)]"
                            >
                                <Bot className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                                <span>🤖 Ask Lumi AI Assistant</span>
                            </button>

                            <button
                                onClick={handleTriggerScan}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-mono transition"
                            >
                                <Search className="w-3.5 h-3.5" />
                                <span>Scan Target</span>
                            </button>

                            <button
                                onClick={handleRecommendProjects}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-mono transition"
                            >
                                <Sparkles className="w-3.5 h-3.5" />
                                <span>Recommend Projects</span>
                            </button>

                            <button
                                onClick={handleExplainSkills}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-mono transition"
                            >
                                <Brain className="w-3.5 h-3.5" />
                                <span>Explain Skills</span>
                            </button>

                            <button
                                onClick={handleSeekSecrets}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-mono transition"
                            >
                                <Key className="w-3.5 h-3.5" />
                                <span>Seek Secrets & Hints</span>
                            </button>

                            <button
                                onClick={() => setAchievementsOpen(true)}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-mono transition"
                            >
                                <Trophy className="w-3.5 h-3.5" />
                                <span>Achievements</span>
                            </button>

                            <button
                                onClick={handleTriggerRepair}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-mono transition"
                            >
                                <Wrench className="w-3.5 h-3.5" />
                                <span>Repair Drone</span>
                            </button>

                            <button
                                onClick={() => setFollowCursor(!followCursor)}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono border transition ${
                                    followCursor
                                        ? "bg-cyan-500 text-neutral-950 font-bold border-cyan-400"
                                        : "bg-neutral-800 text-neutral-400 border-neutral-700"
                                }`}
                            >
                                <Zap className="w-3.5 h-3.5" />
                                <span>Follow Cursor: {followCursor ? "ON" : "OFF"}</span>
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </>
    );
}
