import React, { useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, X, Code, CheckSquare, Sparkles, FileText, Copy, Check } from "lucide-react";
import { AudioEngine } from "../../utils/AudioEngine";

const notebookSections = [
    {
        id: "architecture",
        title: "Architectural Blueprints",
        icon: Code,
        content: `// Lumisphere Hybrid RAG Architecture
const RAGPipeline = {
    embeddingModel: "text-embedding-3-large",
    vectorDB: "FAISS HNSW Index (384-dim)",
    hybridSearch: {
        denseWeight: 0.65,
        sparseBM25Weight: 0.35,
        reciprocalRankFusionK: 60
    },
    latencyTarget: "< 140ms",
    llmCostOptimization: "-88.3% token savings via document chunk reranking"
};`
    },
    {
        id: "sprint",
        title: "Active Sprint Goals",
        icon: CheckSquare,
        content: `[✓] Lumisphere WebGL Shaders & Lighting
[✓] Interactive Desk Physics & Audio Engine
[✓] Real-time Weather & Atmospheric Controls
[ ] Neural RAG Streaming Pipeline Benchmarks
[ ] 3D WebGPU Mesh Instancing Refactor`
    },
    {
        id: "research",
        title: "Ideas & Research Log",
        icon: Sparkles,
        content: `* Researching Web Audio API FM Synthesis for custom mechanical keyboard sounds.
* Exploring signed distance field (SDF) font rendering for high-DPI terminal text inside WebGL scene.
* Implementing zero-lag mouse coordinate transforms for 3D perspective lamp sway.`
    },
    {
        id: "philosophy",
        title: "Engineering Journal",
        icon: FileText,
        content: `"Software is an artistic craft. Every pixel, every millisecond of transition, and every auditory feedback cue must combine to create a unforgettable sensory experience."`
    }
];

export default function NotebookModal({ isOpen, onClose }) {
    const [activeTab, setActiveTab] = useState("architecture");
    const [copied, setCopied] = useState(false);

    if (!isOpen || typeof document === "undefined") return null;

    const currentSection = notebookSections.find((s) => s.id === activeTab);

    const handleTabChange = (id) => {
        AudioEngine.playPageFlip();
        setActiveTab(id);
    };

    const handleCopy = () => {
        if (currentSection) {
            navigator.clipboard.writeText(currentSection.content);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return createPortal(
        <AnimatePresence>
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                <motion.div
                    initial={{ opacity: 0, scale: 0.88, rotateX: 15 }}
                    animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                    exit={{ opacity: 0, scale: 0.88, rotateX: -15 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="relative w-full max-w-3xl rounded-2xl bg-neutral-900/95 border border-amber-500/30 shadow-[0_0_50px_rgba(251,191,36,0.2)] overflow-hidden flex flex-col md:flex-row min-h-[480px]"
                >
                    {/* Binder Spine / Sidebar Tabs */}
                    <div className="w-full md:w-64 bg-neutral-950 p-5 border-b md:border-b-0 md:border-r border-amber-500/20 flex flex-col justify-between">
                        <div>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/40">
                                    <BookOpen className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-mono text-sm font-bold text-amber-300">
                                        Developer Notebook
                                    </h3>
                                    <p className="text-[11px] font-mono text-neutral-400">
                                        Project Notes & Specs
                                    </p>
                                </div>
                            </div>

                            <nav className="space-y-2">
                                {notebookSections.map((section) => {
                                    const Icon = section.icon;
                                    const isSelected = activeTab === section.id;
                                    return (
                                        <button
                                            key={section.id}
                                            onClick={() => handleTabChange(section.id)}
                                            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-mono transition-all text-left ${
                                                isSelected
                                                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold shadow-md"
                                                    : "text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900"
                                            }`}
                                        >
                                            <Icon className={`w-4 h-4 ${isSelected ? "text-amber-400" : "text-neutral-500"}`} />
                                            <span>{section.title}</span>
                                        </button>
                                    );
                                })}
                            </nav>
                        </div>

                        <div className="mt-6 pt-4 border-t border-neutral-800 text-[11px] font-mono text-neutral-500 flex items-center justify-between">
                            <span>Status: ENCRYPTED</span>
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        </div>
                    </div>

                    {/* Page Content View */}
                    <div className="flex-1 p-6 flex flex-col justify-between bg-gradient-to-b from-neutral-900 to-neutral-950">
                        <div>
                            {/* Header bar */}
                            <div className="flex items-center justify-between pb-4 mb-4 border-b border-neutral-800">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-mono uppercase text-amber-400 font-semibold tracking-wider">
                                        {currentSection?.title}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={handleCopy}
                                        className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-mono border border-neutral-700 transition"
                                    >
                                        {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                                        <span>{copied ? "Copied" : "Copy"}</span>
                                    </button>
                                    <button
                                        onClick={onClose}
                                        className="p-1 rounded-md text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            {/* Code / Text Block */}
                            <div className="rounded-xl bg-neutral-950 p-4 border border-neutral-800/80 font-mono text-xs text-amber-200/90 leading-relaxed overflow-x-auto max-h-[300px] whitespace-pre-wrap selection:bg-amber-500/30">
                                {currentSection?.content}
                            </div>
                        </div>

                        {/* Footer details */}
                        <div className="mt-4 pt-3 border-t border-neutral-800/80 flex items-center justify-between text-[11px] font-mono text-neutral-500">
                            <span>Lumisphere Workspace v2.4 • Confidential</span>
                            <span>Click tabs to flip pages</span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>,
        document.body
    );
}
