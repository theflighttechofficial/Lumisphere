import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Sun,
    Sunset,
    Moon,
    Clock,
    CloudRain,
    Snowflake,
    SunDim,
    Volume2,
    VolumeX,
    Sparkles,
    SlidersHorizontal,
    X,
    GripVertical,
    Activity,
    Compass,
} from "lucide-react";
import { useLight } from "../../context/LightContext";
import { AudioEngine } from "../../utils/AudioEngine";

export default function EnvironmentControlPanel() {
    const {
        timeOfDay,
        setTimeOfDay,
        isAutoTime,
        enableAutoTime,
        weather,
        setWeather,
        weatherVolume,
        setWeatherVolume,
        isMuted,
    } = useLight();

    const [isExpanded, setIsExpanded] = useState(false);
    const [currentTimeStr, setCurrentTimeStr] = useState("");

    // Live clock string
    useEffect(() => {
        const updateClock = () => {
            const now = new Date();
            setCurrentTimeStr(
                now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
            );
        };
        updateClock();
        const interval = setInterval(updateClock, 1000);
        return () => clearInterval(interval);
    }, []);

    const getTimeStatus = () => {
        if (isAutoTime) return { label: "AUTO", icon: <Clock className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />, color: "text-cyan-400" };
        if (timeOfDay === "morning") return { label: "MORNING", icon: <Sun className="w-3.5 h-3.5 text-amber-400" />, color: "text-amber-400" };
        if (timeOfDay === "evening") return { label: "EVENING", icon: <Sunset className="w-3.5 h-3.5 text-orange-400" />, color: "text-orange-400" };
        return { label: "NIGHT", icon: <Moon className="w-3.5 h-3.5 text-indigo-400" />, color: "text-indigo-400" };
    };

    const getWeatherStatus = () => {
        if (weather === "rain") return { label: "RAIN", icon: <CloudRain className="w-3.5 h-3.5 text-blue-400 animate-bounce" /> };
        if (weather === "snow") return { label: "SNOW", icon: <Snowflake className="w-3.5 h-3.5 text-sky-300 animate-spin" style={{ animationDuration: "6s" }} /> };
        return { label: "CLEAR", icon: <SunDim className="w-3.5 h-3.5 text-emerald-400" /> };
    };

    const timeStatus = getTimeStatus();
    const weatherStatus = getWeatherStatus();

    return (
        <motion.div
            drag
            dragMomentum={false}
            className="fixed bottom-6 left-6 z-[220] pointer-events-auto select-none"
        >
            {/* Draggable Floating Widget Pill */}
            <motion.div
                whileHover={{ scale: 1.02 }}
                className="
                    flex items-center gap-2.5 p-2 px-3.5
                    rounded-2xl
                    bg-zinc-950/85
                    border border-white/20
                    backdrop-blur-xl
                    shadow-[0_12px_32px_rgba(0,0,0,0.6),inset_0_1px_rgba(255,255,255,0.15)]
                    text-white font-sans text-xs
                "
            >
                {/* Drag Handle */}
                <div className="cursor-grab active:cursor-grabbing opacity-50 hover:opacity-100 transition-opacity">
                    <GripVertical className="w-4 h-4 text-zinc-400" />
                </div>

                {/* Status Indicator */}
                <div className="flex items-center gap-1.5 font-mono text-[11px] font-semibold tracking-wide border-r border-white/15 pr-2.5">
                    {timeStatus.icon}
                    <span className={timeStatus.color}>{timeStatus.label}</span>
                    <span className="text-zinc-500">•</span>
                    <span className="text-zinc-300 uppercase">{weatherStatus.label}</span>
                    <span className="text-zinc-500">•</span>
                    <span className="px-1.5 py-0.5 rounded text-[9px] bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center gap-1 font-bold">
                        <Sparkles className="w-2.5 h-2.5 animate-spin" />
                        <span>LIVING SKY</span>
                    </span>
                </div>

                {/* Quick Switcher Buttons */}
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => {
                            AudioEngine.playUISelect();
                            setTimeOfDay("morning");
                        }}
                        onMouseEnter={() => AudioEngine.playUIHover()}
                        title="Morning Sunlight"
                        className={`p-1.5 rounded-lg transition-all cursor-pointer ${!isAutoTime && timeOfDay === "morning" ? "bg-amber-500/30 border border-amber-500/60 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.4)]" : "text-zinc-400 hover:text-white hover:bg-white/10"}`}
                    >
                        <Sun className="w-3.5 h-3.5" />
                    </button>

                    <button
                        onClick={() => {
                            AudioEngine.playUISelect();
                            setTimeOfDay("evening");
                        }}
                        onMouseEnter={() => AudioEngine.playUIHover()}
                        title="Evening Twilight"
                        className={`p-1.5 rounded-lg transition-all cursor-pointer ${!isAutoTime && timeOfDay === "evening" ? "bg-orange-500/30 border border-orange-500/60 text-orange-300 shadow-[0_0_10px_rgba(249,115,22,0.4)]" : "text-zinc-400 hover:text-white hover:bg-white/10"}`}
                    >
                        <Sunset className="w-3.5 h-3.5" />
                    </button>

                    <button
                        onClick={() => {
                            AudioEngine.playUISelect();
                            setTimeOfDay("night");
                        }}
                        onMouseEnter={() => AudioEngine.playUIHover()}
                        title="Midnight Starfield"
                        className={`p-1.5 rounded-lg transition-all cursor-pointer ${!isAutoTime && timeOfDay === "night" ? "bg-indigo-500/30 border border-indigo-500/60 text-indigo-300 shadow-[0_0_10px_rgba(99,102,241,0.4)]" : "text-zinc-400 hover:text-white hover:bg-white/10"}`}
                    >
                        <Moon className="w-3.5 h-3.5" />
                    </button>

                    <button
                        onClick={() => {
                            AudioEngine.playUISelect();
                            setWeather(weather === "rain" ? "clear" : "rain");
                        }}
                        onMouseEnter={() => AudioEngine.playUIHover()}
                        title="Rain & Lightning Storm"
                        className={`p-1.5 rounded-lg transition-all cursor-pointer ${weather === "rain" ? "bg-blue-500/30 border border-blue-500/60 text-blue-300 shadow-[0_0_10px_rgba(59,130,246,0.4)]" : "text-zinc-400 hover:text-white hover:bg-white/10"}`}
                    >
                        <CloudRain className="w-3.5 h-3.5" />
                    </button>

                    <button
                        onClick={() => {
                            AudioEngine.playUISelect();
                            setWeather(weather === "snow" ? "clear" : "snow");
                        }}
                        onMouseEnter={() => AudioEngine.playUIHover()}
                        title="Snow & Ice Frost"
                        className={`p-1.5 rounded-lg transition-all cursor-pointer ${weather === "snow" ? "bg-sky-400/30 border border-sky-400/60 text-sky-200 shadow-[0_0_10px_rgba(56,189,248,0.4)]" : "text-zinc-400 hover:text-white hover:bg-white/10"}`}
                    >
                        <Snowflake className="w-3.5 h-3.5" />
                    </button>

                    <button
                        onClick={() => {
                            AudioEngine.playUISelect();
                            enableAutoTime();
                        }}
                        onMouseEnter={() => AudioEngine.playUIHover()}
                        title="Auto Clock Sync"
                        className={`p-1.5 rounded-lg transition-all cursor-pointer ${isAutoTime ? "bg-cyan-500/30 border border-cyan-500/60 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.4)]" : "text-zinc-400 hover:text-white hover:bg-white/10"}`}
                    >
                        <Clock className="w-3.5 h-3.5" />
                    </button>
                </div>

                {/* Expand Master Controls Drawer */}
                <button
                    onClick={() => {
                        AudioEngine.playUISelect();
                        setIsExpanded(!isExpanded);
                    }}
                    onMouseEnter={() => AudioEngine.playUIHover()}
                    className={`p-1.5 rounded-xl border transition-all cursor-pointer ml-1 ${isExpanded ? "bg-violet-600/40 border-violet-500/60 text-violet-300 shadow-[0_0_12px_rgba(139,92,246,0.4)]" : "bg-white/5 border-white/10 text-zinc-400 hover:text-white"}`}
                >
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                </button>
            </motion.div>

            {/* Expandable Master Suite Panel */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ opacity: 0, y: 12, scale: 0.95 }}
                        animate={{ opacity: 1, y: -10, scale: 1 }}
                        exit={{ opacity: 0, y: 12, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="
                            absolute bottom-full left-0 mb-2
                            w-72 sm:w-80
                            p-4
                            rounded-3xl
                            bg-zinc-950/90
                            border border-white/20
                            backdrop-blur-2xl
                            shadow-[0_25px_60px_rgba(0,0,0,0.8),inset_0_1px_rgba(255,255,255,0.15)]
                            text-white font-sans
                        "
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
                            <div className="flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-violet-400 animate-pulse" />
                                <div>
                                    <h3 className="text-xs font-semibold tracking-wider uppercase font-mono text-white">
                                        ENV CONTROL SUITE
                                    </h3>
                                    <span className="text-[10px] font-mono text-zinc-400">
                                        {currentTimeStr} • DRAGGABLE WIDGET
                                    </span>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsExpanded(false)}
                                className="p-1 rounded-lg hover:bg-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Presets Grid */}
                        <div className="mb-3.5">
                            <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block mb-1.5">
                                Atmospheric Lighting
                            </label>
                            <div className="grid grid-cols-3 gap-1.5">
                                <button
                                    onClick={() => {
                                        AudioEngine.playUISelect();
                                        setTimeOfDay("morning");
                                    }}
                                    className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all cursor-pointer gap-1 ${!isAutoTime && timeOfDay === "morning" ? "bg-amber-500/25 border-amber-500/60 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.3)]" : "bg-white/[0.03] border-white/5 text-zinc-400 hover:text-white hover:bg-white/10"}`}
                                >
                                    <Sun className="w-4 h-4 text-amber-400" />
                                    <span className="text-[11px] font-medium">Morning</span>
                                </button>

                                <button
                                    onClick={() => {
                                        AudioEngine.playUISelect();
                                        setTimeOfDay("evening");
                                    }}
                                    className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all cursor-pointer gap-1 ${!isAutoTime && timeOfDay === "evening" ? "bg-orange-500/25 border-orange-500/60 text-orange-300 shadow-[0_0_12px_rgba(249,115,22,0.3)]" : "bg-white/[0.03] border-white/5 text-zinc-400 hover:text-white hover:bg-white/10"}`}
                                >
                                    <Sunset className="w-4 h-4 text-orange-400" />
                                    <span className="text-[11px] font-medium">Evening</span>
                                </button>

                                <button
                                    onClick={() => {
                                        AudioEngine.playUISelect();
                                        setTimeOfDay("night");
                                    }}
                                    className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all cursor-pointer gap-1 ${!isAutoTime && timeOfDay === "night" ? "bg-indigo-500/25 border-indigo-500/60 text-indigo-300 shadow-[0_0_12px_rgba(99,102,241,0.3)]" : "bg-white/[0.03] border-white/5 text-zinc-400 hover:text-white hover:bg-white/10"}`}
                                >
                                    <Moon className="w-4 h-4 text-indigo-400" />
                                    <span className="text-[11px] font-medium">Night</span>
                                </button>
                            </div>
                        </div>

                        {/* Weather Grid */}
                        <div className="mb-3.5">
                            <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block mb-1.5">
                                Weather Dynamics
                            </label>
                            <div className="grid grid-cols-3 gap-1.5">
                                <button
                                    onClick={() => {
                                        AudioEngine.playUISelect();
                                        setWeather("clear");
                                    }}
                                    className={`flex flex-col items-center justify-center p-2 rounded-xl border text-center transition-all cursor-pointer gap-1 ${weather === "clear" ? "bg-emerald-500/25 border-emerald-500/60 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.3)]" : "bg-white/[0.03] border-white/5 text-zinc-400 hover:text-white hover:bg-white/10"}`}
                                >
                                    <SunDim className="w-4 h-4 text-emerald-400" />
                                    <span className="text-[10px] font-medium">Clear</span>
                                </button>

                                <button
                                    onClick={() => {
                                        AudioEngine.playUISelect();
                                        setWeather("rain");
                                    }}
                                    className={`flex flex-col items-center justify-center p-2 rounded-xl border text-center transition-all cursor-pointer gap-1 ${weather === "rain" ? "bg-blue-500/25 border-blue-500/60 text-blue-300 shadow-[0_0_12px_rgba(59,130,246,0.3)]" : "bg-white/[0.03] border-white/5 text-zinc-400 hover:text-white hover:bg-white/10"}`}
                                >
                                    <CloudRain className="w-4 h-4 text-blue-400" />
                                    <span className="text-[10px] font-medium">Rain</span>
                                </button>

                                <button
                                    onClick={() => {
                                        AudioEngine.playUISelect();
                                        setWeather("snow");
                                    }}
                                    className={`flex flex-col items-center justify-center p-2 rounded-xl border text-center transition-all cursor-pointer gap-1 ${weather === "snow" ? "bg-sky-400/25 border-sky-400/60 text-sky-200 shadow-[0_0_12px_rgba(56,189,248,0.3)]" : "bg-white/[0.03] border-white/5 text-zinc-400 hover:text-white hover:bg-white/10"}`}
                                >
                                    <Snowflake className="w-4 h-4 text-sky-200" />
                                    <span className="text-[10px] font-medium">Snow</span>
                                </button>
                            </div>
                        </div>

                        {/* Weather Audio Volume Slider */}
                        {weather !== "clear" && (
                            <div className="pt-2.5 border-t border-white/10 flex items-center justify-between gap-2">
                                <div className="flex items-center gap-1.5 text-[11px] text-zinc-300 font-mono">
                                    {isMuted ? <VolumeX className="w-3.5 h-3.5 text-zinc-500" /> : <Volume2 className="w-3.5 h-3.5 text-violet-400" />}
                                    <span>Weather FX Volume</span>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.05"
                                    value={weatherVolume}
                                    onChange={(e) => setWeatherVolume(parseFloat(e.target.value))}
                                    className="w-24 accent-violet-500 h-1 bg-white/10 rounded-lg cursor-pointer"
                                />
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
