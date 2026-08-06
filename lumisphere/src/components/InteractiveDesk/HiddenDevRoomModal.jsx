import React, { useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, X, Sparkles, BookOpen, Volume2, Cpu, CheckCircle2, Shield, Code2 } from "lucide-react";
import { AudioEngine } from "../../utils/AudioEngine";
import { SecretsManager } from "../../utils/SecretsManager";

const DEV_DIARY_ENTRIES = [
    {
        date: "Night 1: The Vision",
        title: "Creating Lumisphere's WebGL Atmosphere",
        content: "I wanted a workspace that feels alive—where the lamp isn't just a static SVG, but a physical pendulum swinging to sine waves with GLSL volumetric light cone shaders."
    },
    {
        date: "Night 3: Audio Synthesis",
        title: "Zero-Asset Web Audio Engine",
        content: "Instead of downloading 5MB of MP3 audio samples, every single mechanical click, ceramic cup clink, and rain hiss is generated mathematically in real time via Web Audio API oscillators and noise buffers."
    },
    {
        date: "Night 5: GenAI & RAG Pipeline",
        title: "Industrial Specification Extractors",
        content: "Engineered a hybrid FAISS vector + BM25 keyword RAG pipeline for L&T construction blueprints. Reranking document chunks cut LLM token costs from $22 down to $2 per document run."
    }
];

export default function HiddenDevRoomModal({ isOpen, onClose }) {
    const [activeTab, setActiveTab] = useState("diary");
    const [synthFreq, setSynthFreq] = useState(440);

    if (!isOpen || typeof document === "undefined") return null;

    SecretsManager.unlockAchievement("devroom");
    SecretsManager.findCollectible("relic");

    const playTestSynth = () => {
        AudioEngine.playHoloProject();
    };

    return createPortal(
        <AnimatePresence>
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 30 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 30 }}
                    className="relative w-full max-w-4xl rounded-2xl bg-neutral-950 border-4 border-amber-500/40 shadow-[0_0_60px_rgba(251,191,36,0.3)] overflow-hidden flex flex-col min-h-[500px]"
                >
                    {/* Header */}
                    <div className="bg-neutral-900 px-6 py-4 border-b border-amber-500/30 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/40 animate-pulse">
                                <Lock className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-mono text-sm font-bold text-amber-300">
                                    CONFIDENTIAL DEVELOPER VAULT
                                </h3>
                                <p className="text-[11px] font-mono text-neutral-400">
                                    Hidden Room • Raw Engineering Prototypes & Diary
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

                    {/* Navigation Tabs */}
                    <div className="bg-neutral-900/60 px-6 py-3 border-b border-neutral-800 flex items-center gap-3">
                        <button
                            onClick={() => setActiveTab("diary")}
                            className={`px-4 py-2 rounded-xl text-xs font-mono border transition ${
                                activeTab === "diary"
                                    ? "bg-amber-500 text-neutral-950 font-bold border-amber-400 shadow-md"
                                    : "text-neutral-400 border-neutral-800 hover:bg-neutral-800"
                            }`}
                        >
                            Developer Diary
                        </button>

                        <button
                            onClick={() => setActiveTab("blueprints")}
                            className={`px-4 py-2 rounded-xl text-xs font-mono border transition ${
                                activeTab === "blueprints"
                                    ? "bg-amber-500 text-neutral-950 font-bold border-amber-400 shadow-md"
                                    : "text-neutral-400 border-neutral-800 hover:bg-neutral-800"
                            }`}
                        >
                            Unreleased Prototypes
                        </button>

                        <button
                            onClick={() => setActiveTab("synth")}
                            className={`px-4 py-2 rounded-xl text-xs font-mono border transition ${
                                activeTab === "synth"
                                    ? "bg-amber-500 text-neutral-950 font-bold border-amber-400 shadow-md"
                                    : "text-neutral-400 border-neutral-800 hover:bg-neutral-800"
                            }`}
                        >
                            Web Audio Lab
                        </button>
                    </div>

                    {/* Content View */}
                    <div className="p-6 flex-1 bg-gradient-to-b from-neutral-950 to-black overflow-y-auto">
                        {activeTab === "diary" && (
                            <div className="space-y-4">
                                {DEV_DIARY_ENTRIES.map((entry, idx) => (
                                    <div
                                        key={idx}
                                        className="p-4 rounded-xl bg-neutral-900/80 border border-neutral-800 hover:border-amber-500/40 transition"
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-[10px] font-mono text-amber-400 font-bold">
                                                {entry.date}
                                            </span>
                                            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                                        </div>
                                        <h4 className="font-mono text-sm font-bold text-neutral-100 mb-2">
                                            {entry.title}
                                        </h4>
                                        <p className="font-mono text-xs text-neutral-300 leading-relaxed">
                                            "{entry.content}"
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}

                        {activeTab === "blueprints" && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
                                <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800">
                                    <div className="text-amber-400 font-bold mb-2 flex items-center gap-1.5">
                                        <Code2 className="w-4 h-4" />
                                        <span>3D WebGPU Instanced Mesh Particle System</span>
                                    </div>
                                    <p className="text-neutral-400 leading-relaxed text-[11px]">
                                        Prototype rendering 100,000 instanced dust motes reacting to volumetric lamp ray fields with GPU compute shaders.
                                    </p>
                                </div>

                                <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800">
                                    <div className="text-amber-400 font-bold mb-2 flex items-center gap-1.5">
                                        <Cpu className="w-4 h-4" />
                                        <span>Autonomous Agent LLM Reranking Core</span>
                                    </div>
                                    <p className="text-neutral-400 leading-relaxed text-[11px]">
                                        Reciprocal Rank Fusion (RRF) algorithm combining BM25 keyword search scores with FAISS HNSW vector distances.
                                    </p>
                                </div>
                            </div>
                        )}

                        {activeTab === "synth" && (
                            <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 flex flex-col items-center gap-4 text-center font-mono">
                                <Volume2 className="w-8 h-8 text-amber-400 animate-pulse" />
                                <h4 className="text-sm font-bold text-amber-300">
                                    Web Audio API Procedural Synthesizer Lab
                                </h4>
                                <button
                                    onClick={playTestSynth}
                                    className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs rounded-xl shadow-lg transition"
                                >
                                    Play Frequency Test
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="bg-neutral-900 px-6 py-3 border-t border-neutral-800 flex items-center justify-between text-[11px] font-mono text-neutral-400">
                        <span>Access Level: AUTHORIZED</span>
                        <span>Relic Unlocked: Quantum Core Relic 🔮</span>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>,
        document.body
    );
}
