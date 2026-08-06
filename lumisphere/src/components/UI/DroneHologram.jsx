import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cpu, Sparkles, ExternalLink, Brain, Layers, Code, CheckCircle2, Zap, X } from "lucide-react";
import { AudioEngine } from "../../utils/AudioEngine";
import HolographicSkillsNetwork from "../About/HolographicSkillsNetwork";

const RECOMMENDED_PROJECTS = [
    {
        id: "rag",
        title: "Industrial Hybrid RAG Spec Extractor",
        desc: "FAISS vector retrieval + BM25 sparse keyword ranking with Reciprocal Rank Fusion. -88% token cost reduction.",
        badge: "AI & GenAI",
        link: "https://github.com"
    },
    {
        id: "webgl",
        title: "Lumisphere Atmospheric 3D Engine",
        desc: "Real-time raymarched GLSL volumetric atmosphere, procedural Web Audio synthesis, and interactive desk physics.",
        badge: "3D Graphics",
        link: "https://github.com"
    },
    {
        id: "ocr",
        title: "AutoCAD SLD Diagram OCR Parser",
        desc: "Deep learning OCR pipeline parsing zero-text layer electrical single-line diagrams from AutoCAD PDFs.",
        badge: "Computer Vision",
        link: "https://github.com"
    }
];

const SKILL_NODES = [
    { name: "Fullstack Engineering", level: "Expert", desc: "React 19, Vite, Framer Motion, TailwindCSS, Node.js", icon: Code },
    { name: "GenAI & RAG Architecture", level: "Senior Spec", desc: "LangChain, FAISS, Open-Source LLM Reranking, Python", icon: Brain },
    { name: "Computer Graphics & WebGL", level: "Advanced", desc: "Three.js, React Three Fiber, Custom GLSL Shaders, Web Audio", icon: Layers }
];

export default function DroneHologram({ mode = "none", onClose }) {
    if (mode === "none") return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, scale: 0.8, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: -20 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="absolute top-24 left-1/2 -translate-x-1/2 z-[110] w-[340px] sm:w-[420px] pointer-events-auto"
            >
                {/* Holographic Projection Cone Beam */}
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-12 bg-gradient-to-b from-cyan-400/40 to-transparent clip-triangle pointer-events-none" />

                {/* Hologram Card Frame */}
                <div className="relative rounded-2xl bg-neutral-950/90 border border-cyan-400/50 p-5 shadow-[0_0_50px_rgba(34,211,238,0.3)] backdrop-blur-xl font-mono overflow-hidden">
                    {/* Glowing Scanlines */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(34,211,238,0.05)_50%,transparent_50%)] bg-[length:100%_4px] pointer-events-none" />

                    {/* Hologram Header */}
                    <div className="relative z-10 flex items-center justify-between pb-3 mb-3 border-b border-cyan-500/30">
                        <div className="flex items-center gap-2">
                            <Cpu className="w-5 h-5 text-cyan-400 animate-spin" />
                            <span className="text-xs font-bold text-cyan-300 uppercase tracking-widest">
                                HOLOGRAM PROJECTION • {mode.toUpperCase()}
                            </span>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-1 rounded text-cyan-400 hover:text-white hover:bg-cyan-500/20 transition"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Mode Content: Projects Recommendation */}
                    {mode === "recommendations" && (
                        <div className="space-y-3 relative z-10">
                            <p className="text-[11px] text-cyan-200/80 mb-2">
                                🤖 Drone Recommendation Engine selected top engineering builds:
                            </p>
                            {RECOMMENDED_PROJECTS.map((proj) => (
                                <div
                                    key={proj.id}
                                    className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/30 hover:border-cyan-400 transition flex flex-col gap-1"
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-bold text-cyan-300">{proj.title}</span>
                                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                                            {proj.badge}
                                        </span>
                                    </div>
                                    <p className="text-[10px] text-neutral-300 leading-relaxed font-sans">
                                        {proj.desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Mode Content: Skill Breakdown */}
                    {mode === "skills" && (
                        <div className="relative z-10">
                            <HolographicSkillsNetwork />
                        </div>
                    )}

                    {/* Mode Content: System Diagnostics & AI Core */}
                    {mode === "diagnostics" && (
                        <div className="space-y-3 relative z-10">
                            <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/30 flex items-center justify-between">
                                <span className="text-xs text-neutral-300">System Integrity:</span>
                                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                                    <CheckCircle2 className="w-3.5 h-3.5" /> 100% OPERATIONAL
                                </span>
                            </div>
                            <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/30 flex items-center justify-between">
                                <span className="text-xs text-neutral-300">Companion AI Core:</span>
                                <span className="text-xs font-bold text-cyan-400">ACTIVE & MONITORING</span>
                            </div>
                            <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/30 flex items-center justify-between">
                                <span className="text-xs text-neutral-300">Sensors & Radar:</span>
                                <span className="text-xs font-bold text-amber-400">CURSOR TRACKING ONLINE</span>
                            </div>
                        </div>
                    )}

                    {/* Footer */}
                    <div className="mt-4 pt-2 border-t border-cyan-500/30 flex items-center justify-between text-[9px] text-cyan-400/80">
                        <span>Hologram Frequency: 5.8 GHz</span>
                        <span>Click X to close projection</span>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
