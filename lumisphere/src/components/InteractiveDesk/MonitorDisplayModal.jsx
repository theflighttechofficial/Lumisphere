import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Monitor, Terminal, Power, Clock, Cpu, Palette, X, Sparkles, Send } from "lucide-react";
import { AudioEngine } from "../../utils/AudioEngine";
import { SecretsManager } from "../../utils/SecretsManager";

const WALLPAPERS = [
    { id: "amber", name: "Cyber Amber", bg: "from-amber-950/80 via-black to-neutral-950", accent: "text-amber-400 border-amber-500/40" },
    { id: "neon", name: "Midnight Neon", bg: "from-sky-950/80 via-black to-purple-950", accent: "text-sky-400 border-sky-500/40" },
    { id: "matrix", name: "Matrix Emerald", bg: "from-emerald-950/80 via-black to-neutral-950", accent: "text-emerald-400 border-emerald-500/40" },
];

export default function MonitorDisplayModal({ isOpen, onClose }) {
    const [screenOn, setScreenOn] = useState(true);
    const [wallpaper, setWallpaper] = useState("amber");
    const [terminalInput, setTerminalInput] = useState("");
    const [terminalOutput, setTerminalOutput] = useState([
        "Lumisphere Workstation Operating System v2.4",
        "Type 'help' to view available system commands.",
        "------------------------------------------------"
    ]);
    const [timeString, setTimeString] = useState("");

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            setTimeString(now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
        };
        updateTime();
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }, []);

    if (!isOpen || typeof document === "undefined") return null;

    const currentWP = WALLPAPERS.find((w) => w.id === wallpaper) || WALLPAPERS[0];

    const togglePower = () => {
        AudioEngine.playMonitorPower();
        setScreenOn(!screenOn);
    };

    const handleCommandSubmit = (e) => {
        e.preventDefault();
        if (!terminalInput.trim()) return;

        const cmd = terminalInput.trim().toLowerCase();
        AudioEngine.playUISelect();
        let reply = [];

        switch (cmd) {
            case "help":
                reply = [
                    "Available Commands:",
                    "  help     - Show list of system commands",
                    "  status   - Check system CPU & GPU memory load",
                    "  projects - View mounted projects",
                    "  whoami   - Display user context",
                    "  date     - Show current date & system time",
                    "  clear    - Clear terminal logs"
                ];
                break;
            case "status":
                reply = [
                    "[SYSTEM HEALTH CHECK]",
                    "• WebGL Renderer: 60.0 FPS stable",
                    "• GPU Memory: 1.4 GB / 8.0 GB",
                    "• Audio Engine: Web Audio Synthesizer Active",
                    "• Status: ALL SYSTEMS OPERATIONAL"
                ];
                break;
            case "whoami":
                reply = ["User: Lead Architect / Lumisphere Developer", "Access Level: ADMIN"];
                break;
            case "projects":
                reply = ["Mounted Projects:", "1. L&T Hybrid RAG Spec Extractor", "2. AutoCAD SLD OCR Diagram Parser", "3. Lumisphere 3D Scene Engine"];
                break;
            case "date":
                reply = [`Current Time: ${new Date().toLocaleString()}`];
                break;
            case "arcade":
                SecretsManager.unlockAchievement("hacker");
                SecretsManager.unlockAchievement("arcade");
                window.dispatchEvent(new CustomEvent("lumisphere_open_modal", { detail: { modal: "arcade" } }));
                reply = ["👾 ACCESS GRANTED: Launching Cyberpunk Retro Arcade..."];
                break;
            case "devroom":
            case "vault":
                SecretsManager.unlockAchievement("hacker");
                SecretsManager.unlockAchievement("devroom");
                window.dispatchEvent(new CustomEvent("lumisphere_open_modal", { detail: { modal: "devroom" } }));
                reply = ["🚪 ACCESS GRANTED: Opening Confidential Developer Vault..."];
                break;
            case "matrix":
                setWallpaper("matrix");
                SecretsManager.unlockAchievement("hacker");
                reply = ["⚡ MATRIX RAIN ACTIVATED. Color palette set to Matrix Emerald."];
                break;
            case "godmode":
                SecretsManager.unlockAchievement("hacker");
                SecretsManager.unlockAchievement("konami");
                SecretsManager.unlockAchievement("morse");
                SecretsManager.unlockAchievement("arcade");
                SecretsManager.unlockAchievement("devroom");
                SecretsManager.unlockAchievement("collector");
                reply = ["👑 GOD MODE ACTIVATED: All secret achievements unlocked!"];
                break;
            case "secrets":
                SecretsManager.unlockAchievement("hacker");
                reply = [
                    "🔐 UNCOVERED SECRETS:",
                    "1. Konami Code: ↑ ↑ ↓ ↓ ← → ← → B A",
                    "2. Morse Code: Rhythmic lamp chain pulls (3 fast, 3 slow, 3 fast)",
                    "3. Secret Terminal Commands: 'arcade', 'devroom', 'matrix', 'godmode', 'diary'"
                ];
                break;
            case "lumi":
            case "ask":
            case "recruiter":
            case "pitch":
            case "summarize":
                window.dispatchEvent(new CustomEvent("lumisphere_open_lumi_ai"));
                reply = [
                    "🤖 LUMI AI ENGINE RESPONDING:",
                    "• Varun Vaibhav — Data Analyst Intern (L&T Construction) & B.Tech AI Student.",
                    "• Production RAG Spec Extractor: FAISS + BM25, 1,200+ pgs, $22->$2 cost opt.",
                    "• Academic Standing: CGPA 7.7/10 (Upward Trajectory: 6.86 -> 7.68).",
                    "• Future Plans: MS in Data Science @ Arizona State University (ASU) 2029.",
                    "💡 Opening Lumi AI Voice Assistant..."
                ];
                break;
            case "diary":
                SecretsManager.unlockAchievement("hacker");
                SecretsManager.unlockAchievement("historian");
                window.dispatchEvent(new CustomEvent("lumisphere_open_modal", { detail: { modal: "devroom" } }));
                reply = ["📜 Opening Developer Diary..."];
                break;
            case "clear":
                setTerminalOutput([]);
                setTerminalInput("");
                return;
            default:
                reply = [`Command not recognized: '${cmd}'. Type 'help' or 'secrets' for guidance.`];
        }

        setTerminalOutput((prev) => [...prev, `> ${terminalInput}`, ...reply]);
        setTerminalInput("");
    };

    return createPortal(
        <AnimatePresence>
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
                <motion.div
                    initial={{ opacity: 0, scale: 0.88, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.88 }}
                    className="relative w-full max-w-4xl rounded-2xl bg-neutral-950 border-4 border-neutral-800 shadow-[0_0_60px_rgba(56,189,248,0.2)] overflow-hidden flex flex-col min-h-[500px]"
                >
                    {/* Monitor Outer Bezels / Title */}
                    <div className="bg-neutral-900 px-6 py-3 border-b border-neutral-800 flex items-center justify-between z-20">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={togglePower}
                                className={`p-1.5 rounded-lg border transition ${
                                    screenOn
                                        ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40"
                                        : "bg-red-500/20 text-red-400 border-red-500/40"
                                }`}
                                title="Power Display"
                            >
                                <Power className="w-4 h-4" />
                            </button>
                            <span className="font-mono text-xs font-bold text-neutral-200">
                                LUMISPHERE ULTRA-WIDE MONITOR • {screenOn ? "DISPLAY ON" : "DISPLAY STANDBY"}
                            </span>
                        </div>

                        <div className="flex items-center gap-2">
                            {screenOn && (
                                <div className="flex items-center gap-1 bg-neutral-950 px-3 py-1 rounded-lg border border-neutral-800 font-mono text-xs text-amber-400">
                                    <Clock className="w-3.5 h-3.5" />
                                    <span>{timeString}</span>
                                </div>
                            )}
                            <button
                                onClick={onClose}
                                className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Display Screen */}
                    {screenOn ? (
                        <div className={`flex-1 p-6 bg-gradient-to-br ${currentWP.bg} relative flex flex-col justify-between overflow-hidden select-none`}>
                            {/* CRT Scanline Shader Overlay */}
                            <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] z-10" />

                            {/* Top Screen App Header */}
                            <div className="flex flex-wrap items-center justify-between gap-3 z-20 pb-4 border-b border-white/10">
                                <div className="flex items-center gap-2 font-mono text-xs text-sky-400">
                                    <Terminal className="w-4 h-4" />
                                    <span className="font-bold">SYSTEM TERMINAL & WORKSTATION</span>
                                </div>

                                {/* Wallpaper Selector */}
                                <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur p-1 rounded-lg border border-white/10">
                                    <Palette className="w-3.5 h-3.5 text-neutral-400 ml-1" />
                                    {WALLPAPERS.map((wp) => (
                                        <button
                                            key={wp.id}
                                            onClick={() => {
                                                setWallpaper(wp.id);
                                                AudioEngine.playUISelect();
                                            }}
                                            className={`px-2 py-0.5 rounded text-[10px] font-mono transition ${
                                                wallpaper === wp.id
                                                    ? "bg-white/20 text-white font-bold"
                                                    : "text-neutral-400 hover:text-white"
                                            }`}
                                        >
                                            {wp.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Interactive Terminal Window */}
                            <div className="my-4 flex-1 bg-black/80 backdrop-blur-md rounded-xl border border-white/10 p-4 font-mono text-xs overflow-y-auto max-h-[300px] z-20 shadow-inner">
                                {terminalOutput.map((line, idx) => (
                                    <div
                                        key={idx}
                                        className={
                                            line.startsWith(">")
                                                ? "text-sky-300 font-bold"
                                                : line.startsWith("•")
                                                ? "text-emerald-400"
                                                : "text-amber-200/90"
                                        }
                                    >
                                        {line}
                                    </div>
                                ))}
                            </div>

                            {/* Command Input Form */}
                            <form onSubmit={handleCommandSubmit} className="relative z-20 flex items-center gap-2">
                                <div className="relative flex-1">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-xs text-sky-400 font-bold">
                                        &gt;
                                    </span>
                                    <input
                                        type="text"
                                        value={terminalInput}
                                        onChange={(e) => setTerminalInput(e.target.value)}
                                        placeholder="Type command (e.g. help, status, projects)..."
                                        className="w-full bg-black/90 text-white font-mono text-xs pl-7 pr-4 py-2.5 rounded-xl border border-sky-500/40 focus:border-sky-400 focus:outline-none shadow-lg"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="px-4 py-2.5 bg-sky-500 hover:bg-sky-400 text-neutral-950 font-mono font-bold text-xs rounded-xl flex items-center gap-1.5 transition"
                                >
                                    <span>Exec</span>
                                    <Send className="w-3.5 h-3.5" />
                                </button>
                            </form>
                        </div>
                    ) : (
                        <div className="flex-1 bg-black flex flex-col items-center justify-center text-neutral-600 font-mono text-xs">
                            <Power className="w-10 h-10 mb-2 opacity-40 animate-pulse" />
                            <span>MONITOR IN POWER SAVING MODE</span>
                            <span className="text-[10px] text-neutral-700 mt-1">Press Power button on top to wake</span>
                        </div>
                    )}
                </motion.div>
            </div>
        </AnimatePresence>,
        document.body
    );
}
