import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Keyboard, Volume2, Sparkles, X, Activity, RefreshCw } from "lucide-react";
import { AudioEngine } from "../../utils/AudioEngine";

const SWITCH_TYPES = [
    { id: "blue", name: "Clicky Blue", color: "text-sky-400 border-sky-400/40 bg-sky-500/10" },
    { id: "brown", name: "Tactile Brown", color: "text-amber-400 border-amber-400/40 bg-amber-500/10" },
    { id: "red", name: "Linear Red", color: "text-red-400 border-red-400/40 bg-red-500/10" },
];

const SAMPLE_TEXT = "Lumisphere reactive 3D shaders and real-time audio synthesis elevate web user experiences.";

export default function MechKeyboardModal({ isOpen, onClose }) {
    const [switchType, setSwitchType] = useState("blue");
    const [typedText, setTypedText] = useState("");
    const [activeKey, setActiveKey] = useState(null);
    const [wpm, setWpm] = useState(0);
    const [startTime, setStartTime] = useState(null);

    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e) => {
            if (e.key === "Escape") return;
            AudioEngine.playMechKeyClick(switchType);
            setActiveKey(e.key.toUpperCase());

            setTimeout(() => setActiveKey(null), 120);

            if (e.key === "Backspace") {
                setTypedText((prev) => prev.slice(0, -1));
                return;
            }

            if (e.key.length === 1) {
                if (!startTime) setStartTime(Date.now());
                setTypedText((prev) => {
                    const next = prev + e.key;
                    if (startTime) {
                        const elapsedMins = (Date.now() - startTime) / 60000;
                        if (elapsedMins > 0) {
                            const words = next.length / 5;
                            setWpm(Math.round(words / elapsedMins));
                        }
                    }
                    return next;
                });
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, switchType, startTime]);

    if (!isOpen || typeof document === "undefined") return null;

    const resetTyping = () => {
        setTypedText("");
        setStartTime(null);
        setWpm(0);
    };

    return createPortal(
        <AnimatePresence>
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 30 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 30 }}
                    className="relative w-full max-w-3xl rounded-2xl bg-neutral-950 border border-purple-500/40 shadow-[0_0_50px_rgba(192,132,252,0.25)] overflow-hidden flex flex-col"
                >
                    {/* Header */}
                    <div className="bg-neutral-900 px-6 py-4 border-b border-purple-500/30 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400 border border-purple-500/40">
                                <Keyboard className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-mono text-sm font-bold text-purple-300">
                                    CUSTOM MECHANICAL KEYBOARD
                                </h3>
                                <p className="text-[11px] font-mono text-neutral-400">
                                    Interactive Audio Soundboard & Typing Test
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={onClose}
                            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Controls & Switch Selector */}
                    <div className="p-6 bg-neutral-900/60 border-b border-neutral-800 flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-mono text-neutral-400">Switch Type:</span>
                            {SWITCH_TYPES.map((s) => (
                                <button
                                    key={s.id}
                                    onClick={() => {
                                        setSwitchType(s.id);
                                        AudioEngine.playMechKeyClick(s.id);
                                    }}
                                    className={`px-3 py-1.5 rounded-lg font-mono text-xs border transition-all ${
                                        switchType === s.id
                                            ? `${s.color} font-bold shadow-md`
                                            : "text-neutral-400 border-neutral-800 hover:bg-neutral-800"
                                    }`}
                                >
                                    {s.name}
                                </button>
                            ))}
                        </div>

                        <div className="flex items-center gap-4 text-xs font-mono">
                            <div className="flex items-center gap-1.5 text-purple-400 font-bold bg-purple-500/10 px-3 py-1.5 rounded-lg border border-purple-500/30">
                                <Activity className="w-4 h-4" />
                                <span>WPM: {wpm}</span>
                            </div>
                            <button
                                onClick={resetTyping}
                                className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 transition"
                                title="Reset Test"
                            >
                                <RefreshCw className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Typing Test Interactive Box */}
                    <div className="p-6">
                        <div className="mb-4 text-xs font-mono text-neutral-400">
                            Type on your keyboard to hear the mechanical switch audio synthesis:
                        </div>
                        <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 font-mono text-sm leading-relaxed tracking-wide min-h-[90px]">
                            <span className="text-purple-300 font-semibold">{typedText}</span>
                            <span className="inline-block w-2 h-4 bg-purple-400 ml-0.5 animate-pulse" />
                        </div>

                        {/* Visual Key Matrix */}
                        <div className="mt-6 flex flex-col items-center gap-1.5 p-4 rounded-xl bg-neutral-900/80 border border-neutral-800/80">
                            <div className="flex gap-1.5">
                                {["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"].map((k) => (
                                    <div
                                        key={k}
                                        className={`w-9 h-9 rounded-lg font-mono text-xs flex items-center justify-center border transition-all ${
                                            activeKey === k
                                                ? "bg-purple-500 text-neutral-950 font-bold scale-110 shadow-[0_0_15px_rgba(192,132,252,0.8)] border-purple-300"
                                                : "bg-neutral-950 text-neutral-400 border-neutral-800"
                                        }`}
                                    >
                                        {k}
                                    </div>
                                ))}
                            </div>
                            <div className="flex gap-1.5">
                                {["A", "S", "D", "F", "G", "H", "J", "K", "L"].map((k) => (
                                    <div
                                        key={k}
                                        className={`w-9 h-9 rounded-lg font-mono text-xs flex items-center justify-center border transition-all ${
                                            activeKey === k
                                                ? "bg-purple-500 text-neutral-950 font-bold scale-110 shadow-[0_0_15px_rgba(192,132,252,0.8)] border-purple-300"
                                                : "bg-neutral-950 text-neutral-400 border-neutral-800"
                                        }`}
                                    >
                                        {k}
                                    </div>
                                ))}
                            </div>
                            <div className="flex gap-1.5">
                                {["Z", "X", "C", "V", "B", "N", "M"].map((k) => (
                                    <div
                                        key={k}
                                        className={`w-9 h-9 rounded-lg font-mono text-xs flex items-center justify-center border transition-all ${
                                            activeKey === k
                                                ? "bg-purple-500 text-neutral-950 font-bold scale-110 shadow-[0_0_15px_rgba(192,132,252,0.8)] border-purple-300"
                                                : "bg-neutral-950 text-neutral-400 border-neutral-800"
                                        }`}
                                    >
                                        {k}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>,
        document.body
    );
}
