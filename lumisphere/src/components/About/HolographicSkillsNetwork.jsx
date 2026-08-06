import React, { useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    Brain,
    Code,
    Layers,
    Database,
    Cpu,
    Sparkles,
    ExternalLink,
    Award,
    Calendar,
    Briefcase,
    GitBranch,
    X,
    ChevronRight,
    Zap,
    CheckCircle2
} from "lucide-react";
import { AudioEngine } from "../../utils/AudioEngine";

// Neural Skills Nodes Dataset with real relationships & details
const SKILLS_NODES = [
    {
        id: "python",
        name: "Python (Core Engine)",
        category: "Languages",
        level: "Intermediate+",
        icon: Code,
        color: "text-amber-400 border-amber-500/50 bg-amber-500/10 glow-amber",
        coords: { x: 20, y: 30 },
        connections: ["rag", "ml", "data_tools", "ocr"],
        projects: [
            { name: "L&T Hybrid RAG Spec Extractor", desc: "FAISS + BM25 search script for 1,200+ page blueprints." },
            { name: "AutoCAD SLD Diagram OCR Parser", desc: "Tesseract OCR & PyMuPDF extractor script." },
            { name: "Road-AI Damage Detection", desc: "YOLOv8 + MiDaS depth estimation pipeline." }
        ],
        experience: [
            { role: "Data Analyst Intern", company: "L&T Construction", date: "May - Jul 2026", details: "Engineered Python automation tools saving 3-4 days per project." }
        ],
        timeline: [
            { year: "2024", text: "Learned Core Python, OOP, & Data Structures." },
            { year: "2025", text: "Mastered pandas, NumPy, scikit-learn & API integrations." },
            { year: "2026", text: "Deployed Production Hybrid RAG & Computer Vision Pipelines." }
        ],
        certs: ["HackerRank Python Gold Badge (5 Stars)", "IBM Python 101 for Data Science"]
    },
    {
        id: "rag",
        name: "Hybrid RAG & GenAI",
        category: "AI / GenAI Systems",
        level: "Specialist",
        icon: Brain,
        color: "text-cyan-400 border-cyan-500/50 bg-cyan-500/10 glow-cyan",
        coords: { x: 50, y: 20 },
        connections: ["python", "faiss_bm25", "prompting", "ml"],
        projects: [
            { name: "L&T Spec Extractor", desc: "Ranks blueprint context chunks, reducing token costs from $22 to $2." }
        ],
        experience: [
            { role: "Industrial RAG Architect", company: "L&T Construction", date: "May - Jul 2026", details: "Received Letter of Recommendation from Sr. Data Scientist Naveen Raj." }
        ],
        timeline: [
            { year: "May 2026", text: "Explored Dense FAISS Vector Embeddings & HNSW index." },
            { year: "Jun 2026", text: "Integrated Sparse BM25 Keyword Search & Reciprocal Rank Fusion." },
            { year: "Jul 2026", text: "Optimized LLM Prompt Reranking for 88.3% token savings." }
        ],
        certs: ["Google Prompting Essentials Specialization (4 Courses)"]
    },
    {
        id: "faiss_bm25",
        name: "FAISS & BM25 Search",
        category: "Vector & Search Systems",
        level: "Advanced",
        icon: Database,
        color: "text-emerald-400 border-emerald-500/50 bg-emerald-500/10 glow-emerald",
        coords: { x: 80, y: 35 },
        connections: ["rag", "python"],
        projects: [
            { name: "Reciprocal Rank Fusion Reranker", desc: "Blends dense semantic vector scores with sparse BM25 keyword rankings." }
        ],
        experience: [
            { role: "Search Architect", company: "L&T Construction", date: "Jun 2026", details: "Handled zero-text AutoCAD PDF OCR layers." }
        ],
        timeline: [
            { year: "2026", text: "Benchmarked FAISS vector search latency vs BM25 keyword precision." }
        ],
        certs: ["Stanford Machine Learning Specialization"]
    },
    {
        id: "webgl",
        name: "WebGL & GLSL Shaders",
        category: "3D Graphics & Audio",
        level: "Advanced",
        icon: Layers,
        color: "text-purple-400 border-purple-500/50 bg-purple-500/10 glow-purple",
        coords: { x: 25, y: 70 },
        connections: ["react_fullstack", "audio_api"],
        projects: [
            { name: "Lumisphere Atmospheric Scene", desc: "Real-time volumetric atmosphere, weather physics, and 3D desk." }
        ],
        experience: [
            { role: "Interactive Systems Creator", company: "Lumisphere Labs", date: "2026", details: "Built zero-dependency WebGL GLSL shaders." }
        ],
        timeline: [
            { year: "2025", text: "Canvas 2D particle systems & HTML5 animation." },
            { year: "2026", text: "Three.js, React Three Fiber & WebGL GLSL Shaders." }
        ],
        certs: ["Interactive Graphics & Audio Synthesis Specialist"]
    },
    {
        id: "audio_api",
        name: "Web Audio API Synthesis",
        category: "Audio Engineering",
        level: "Advanced",
        icon: Zap,
        color: "text-pink-400 border-pink-500/50 bg-pink-500/10 glow-pink",
        coords: { x: 50, y: 80 },
        connections: ["webgl", "react_fullstack"],
        projects: [
            { name: "AudioEngine.js", desc: "Zero-asset procedural FM/additive synthesis for mech keyboards, steam hiss, & rain." }
        ],
        experience: [
            { role: "Audio Synthesizer Engineer", company: "Lumisphere Labs", date: "2026", details: "Replaced 5MB MP3 audio samples with real-time math synthesis." }
        ],
        timeline: [
            { year: "2026", text: "Engineered FM synthesis oscillators & biquad filters." }
        ],
        certs: ["Web Audio API Real-time Synthesis Spec"]
    },
    {
        id: "ml",
        name: "Machine Learning (scikit-learn)",
        category: "Artificial Intelligence",
        level: "Advanced",
        icon: Cpu,
        color: "text-sky-400 border-sky-500/50 bg-sky-500/10 glow-sky",
        coords: { x: 75, y: 70 },
        connections: ["python", "rag", "sql"],
        projects: [
            { name: "AgriYield AI", desc: "Crop yield prediction using XGBoost & climate parameters." },
            { name: "Titanic ML Survival Model", desc: "Classifier with SHAP explainable AI." }
        ],
        experience: [
            { role: "Research & ML Contributor", company: "SRIHER Research Day 2026", date: "2026", details: "Presented ML model evaluation benchmarks." }
        ],
        timeline: [
            { year: "2025", text: "Supervised Learning, Regressions, & Decision Trees." },
            { year: "2026", text: "Ensemble Models (XGBoost, Random Forest) & Model Evaluation." }
        ],
        certs: ["Stanford Machine Learning Specialization (Andrew Ng Signed)", "Microsoft ML Models (Build 2026)"]
    },
    {
        id: "sql",
        name: "SQL & Data Analytics",
        category: "Data Systems",
        level: "Intermediate",
        icon: Database,
        color: "text-yellow-400 border-yellow-500/50 bg-yellow-500/10 glow-yellow",
        coords: { x: 85, y: 15 },
        connections: ["python", "ml"],
        projects: [
            { name: "L&T Construction Data Analysis", desc: "Complex SQL aggregations and metrics queries." },
            { name: "StrataScratch SQL Practice", desc: "Solved 120+ SQL interview challenges." }
        ],
        experience: [
            { role: "Data Analyst Intern", company: "L&T Construction", date: "May - Jul 2026", details: "Extracted metrics from relational databases." }
        ],
        timeline: [
            { year: "2025", text: "SQL Basics, JOINS, & Grouping." },
            { year: "2026", text: "Window Functions, Subqueries, & Performance Indexing." }
        ],
        certs: ["HackerRank SQL Gold Badge (5 Stars)", "HackerRank SQL Intermediate Certificate"]
    },
    {
        id: "react_fullstack",
        name: "React 19 & Fullstack Web",
        category: "Fullstack Architecture",
        level: "Expert",
        icon: GitBranch,
        color: "text-emerald-400 border-emerald-500/50 bg-emerald-500/10 glow-emerald",
        coords: { x: 15, y: 50 },
        connections: ["webgl", "audio_api", "python"],
        projects: [
            { name: "Lumisphere Interactive Workspace", desc: "React 19, Vite, Framer Motion, and WebGL." },
            { name: "Neoshaan Client Sites", desc: "3 client websites with Node.js/Nodemailer backend." }
        ],
        experience: [
            { role: "Web Developer Intern", company: "Neoshaan Technologies", date: "May - Jul 2025", details: "Built 3 production client web applications." }
        ],
        timeline: [
            { year: "2024", text: "HTML5, CSS3, & Vanilla JavaScript." },
            { year: "2025", text: "React, Vite, TailwindCSS, & Node.js." },
            { year: "2026", text: "React 19 Concurrent Features, Custom Hooks, & WebGL Integration." }
        ],
        certs: ["Full-Stack Web Engineering Certification"]
    }
];

export default function HolographicSkillsNetwork() {
    const [selectedNode, setSelectedNode] = useState(null);
    const [hoveredNode, setHoveredNode] = useState(null);
    const [drawerTab, setDrawerTab] = useState("projects"); // 'projects' | 'experience' | 'timeline' | 'certs' | 'relations'

    const handleNodeClick = (node) => {
        AudioEngine.playUISelect();
        setSelectedNode(node);
        setDrawerTab("projects");
    };

    const handleNodeHover = (nodeId) => {
        if (hoveredNode !== nodeId) {
            AudioEngine.playUIHover();
            setHoveredNode(nodeId);
        }
    };

    const activeNodeData = SKILLS_NODES.find((n) => n.id === selectedNode?.id) || selectedNode;

    return (
        <div className="relative w-full rounded-2xl bg-neutral-950/90 border border-cyan-500/30 p-4 sm:p-6 shadow-[0_0_50px_rgba(34,211,238,0.15)] backdrop-blur-md overflow-hidden my-4 select-none">
            {/* Header Banner */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-4 border-b border-cyan-500/20">
                <div className="flex items-center gap-2">
                    <Brain className="w-5 h-5 text-cyan-400 animate-pulse" />
                    <h3 className="font-mono text-sm font-bold text-cyan-300 uppercase tracking-widest">
                        HOLOGRAPHIC NEURAL SKILLS MATRIX
                    </h3>
                </div>
                <div className="text-[11px] font-mono text-neutral-400 flex items-center gap-2">
                    <span>Hover & click neural nodes to expand deep specs</span>
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                </div>
            </div>

            {/* Neural Network Interactive Canvas / Map Container */}
            <div className="relative w-full h-[440px] sm:h-[480px] bg-neutral-900/60 rounded-xl border border-neutral-800 overflow-hidden flex items-center justify-center">
                {/* Background Grid Pattern */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-500/10 via-transparent to-transparent pointer-events-none" />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

                {/* SVG Laser Synapses Connections */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
                    {SKILLS_NODES.map((source) =>
                        source.connections.map((targetId) => {
                            const target = SKILLS_NODES.find((n) => n.id === targetId);
                            if (!target) return null;

                            const isHighlighted =
                                hoveredNode === source.id ||
                                hoveredNode === target.id ||
                                selectedNode?.id === source.id ||
                                selectedNode?.id === target.id;

                            return (
                                <g key={`${source.id}-${target.id}`}>
                                    <line
                                        x1={`${source.coords.x}%`}
                                        y1={`${source.coords.y}%`}
                                        x2={`${target.coords.x}%`}
                                        y2={`${target.coords.y}%`}
                                        stroke={isHighlighted ? "#22d3ee" : "rgba(255, 255, 255, 0.12)"}
                                        strokeWidth={isHighlighted ? "2.5" : "1"}
                                        strokeDasharray={isHighlighted ? "6 3" : "none"}
                                        className={isHighlighted ? "animate-pulse" : ""}
                                    />
                                </g>
                            );
                        })
                    )}
                </svg>

                {/* Interactive Floating Neural Nodes */}
                {SKILLS_NODES.map((node) => {
                    const Icon = node.icon;
                    const isHovered = hoveredNode === node.id;
                    const isSelected = selectedNode?.id === node.id;
                    const isConnectedToHovered =
                        hoveredNode &&
                        (node.connections.includes(hoveredNode) ||
                            SKILLS_NODES.find((n) => n.id === hoveredNode)?.connections.includes(node.id));

                    return (
                        <motion.div
                            key={node.id}
                            style={{
                                left: `${node.coords.x}%`,
                                top: `${node.coords.y}%`,
                            }}
                            animate={{
                                y: [0, -6, 0],
                                scale: isSelected ? 1.2 : isHovered ? 1.15 : isConnectedToHovered ? 1.08 : 1,
                            }}
                            transition={{
                                y: { duration: 3 + Math.random() * 2, repeat: Infinity, ease: "easeInOut" },
                                scale: { duration: 0.2 }
                            }}
                            onMouseEnter={() => handleNodeHover(node.id)}
                            onMouseLeave={() => setHoveredNode(null)}
                            onClick={() => handleNodeClick(node)}
                            className={`
                                absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20 group
                                p-3 rounded-2xl border backdrop-blur-md transition-all duration-300
                                ${node.color}
                                ${isSelected ? "ring-4 ring-cyan-400 shadow-[0_0_30px_rgba(34,211,238,0.8)]" : ""}
                                ${isHovered ? "shadow-[0_0_25px_rgba(34,211,238,0.6)]" : ""}
                                ${hoveredNode && !isHovered && !isConnectedToHovered ? "opacity-35" : "opacity-100"}
                            `}
                        >
                            <div className="flex items-center gap-2">
                                <div className="p-2 rounded-xl bg-black/60 border border-white/20">
                                    <Icon className="w-5 h-5 text-cyan-300 group-hover:scale-110 transition-transform" />
                                </div>
                                <div className="hidden sm:block text-left">
                                    <div className="font-mono text-xs font-bold text-white tracking-wide">
                                        {node.name}
                                    </div>
                                    <div className="text-[9px] font-mono text-cyan-300/80">
                                        {node.category} • {node.level}
                                    </div>
                                </div>
                            </div>

                            {/* Node Floating Beacon */}
                            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
                        </motion.div>
                    );
                })}
            </div>

            {/* Expandable Holographic Node Specification Drawer Modal */}
            {selectedNode &&
                typeof document !== "undefined" &&
                createPortal(
                    <AnimatePresence>
                        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.88, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.88 }}
                                className="relative w-full max-w-3xl rounded-2xl bg-neutral-950 border border-cyan-500/50 shadow-[0_0_60px_rgba(34,211,238,0.3)] overflow-hidden flex flex-col max-h-[85vh] font-mono select-none"
                            >
                                {/* Drawer Header */}
                                <div className="bg-neutral-900 px-6 py-4 border-b border-cyan-500/30 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
                                            {React.createElement(activeNodeData.icon, { className: "w-6 h-6" })}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h3 className="text-base font-bold text-cyan-300">
                                                    {activeNodeData.name}
                                                </h3>
                                                <span className="px-2 py-0.5 rounded text-[10px] bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 font-bold">
                                                    {activeNodeData.level}
                                                </span>
                                            </div>
                                            <p className="text-xs text-neutral-400">
                                                Category: {activeNodeData.category}
                                            </p>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => setSelectedNode(null)}
                                        className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                {/* 5 Interactive Spec Tabs */}
                                <div className="bg-neutral-900/70 px-6 py-3 border-b border-neutral-800 flex flex-wrap items-center gap-2">
                                    {[
                                        { id: "projects", label: "Projects", icon: Sparkles },
                                        { id: "experience", label: "Experience", icon: Briefcase },
                                        { id: "timeline", label: "Learning Timeline", icon: Calendar },
                                        { id: "certs", label: "Certifications", icon: Award },
                                        { id: "relations", label: "Relationships", icon: GitBranch },
                                    ].map((tab) => {
                                        const TabIcon = tab.icon;
                                        const isTabActive = drawerTab === tab.id;
                                        return (
                                            <button
                                                key={tab.id}
                                                onClick={() => {
                                                    AudioEngine.playUISelect();
                                                    setDrawerTab(tab.id);
                                                }}
                                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs border transition ${
                                                    isTabActive
                                                        ? "bg-cyan-500 text-neutral-950 font-bold border-cyan-400 shadow-md"
                                                        : "text-neutral-400 border-neutral-800 hover:bg-neutral-800"
                                                }`}
                                            >
                                                <TabIcon className="w-3.5 h-3.5" />
                                                <span>{tab.label}</span>
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* Spec Content Details View */}
                                <div className="p-6 overflow-y-auto max-h-[50vh] bg-gradient-to-b from-neutral-950 to-black space-y-4">
                                    {/* Tab 1: Projects */}
                                    {drawerTab === "projects" && (
                                        <div className="space-y-3">
                                            {activeNodeData.projects.map((p, idx) => (
                                                <div
                                                    key={idx}
                                                    className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-cyan-500/40 transition flex items-start justify-between"
                                                >
                                                    <div>
                                                        <h4 className="text-xs font-bold text-cyan-300 flex items-center gap-2 mb-1">
                                                            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                                                            <span>{p.name}</span>
                                                        </h4>
                                                        <p className="text-xs text-neutral-300 leading-relaxed font-sans">
                                                            {p.desc}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Tab 2: Experience */}
                                    {drawerTab === "experience" && (
                                        <div className="space-y-3">
                                            {activeNodeData.experience.map((e, idx) => (
                                                <div
                                                    key={idx}
                                                    className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 flex items-start gap-3"
                                                >
                                                    <Briefcase className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                                                    <div>
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className="text-xs font-bold text-white">{e.role}</span>
                                                            <span className="text-[10px] text-cyan-400">@ {e.company}</span>
                                                            <span className="text-[10px] text-neutral-500">({e.date})</span>
                                                        </div>
                                                        <p className="text-xs text-neutral-300 font-sans">
                                                            {e.details}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Tab 3: Learning Timeline */}
                                    {drawerTab === "timeline" && (
                                        <div className="space-y-3 relative pl-4 border-l-2 border-cyan-500/40 ml-2">
                                            {activeNodeData.timeline.map((t, idx) => (
                                                <div key={idx} className="relative">
                                                    <div className="absolute -left-[23px] top-1.5 w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
                                                    <span className="text-xs font-bold text-cyan-400">{t.year}</span>
                                                    <p className="text-xs text-neutral-300 font-sans mt-0.5">{t.text}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Tab 4: Certifications */}
                                    {drawerTab === "certs" && (
                                        <div className="space-y-2">
                                            {activeNodeData.certs.map((c, idx) => (
                                                <div
                                                    key={idx}
                                                    className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-amber-300 font-bold flex items-center gap-2"
                                                >
                                                    <Award className="w-4 h-4 text-amber-400 shrink-0" />
                                                    <span>{c}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Tab 5: Relationships */}
                                    {drawerTab === "relations" && (
                                        <div className="space-y-3">
                                            <p className="text-xs text-neutral-400">Connected Skill Nodes in Neural Network:</p>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                {activeNodeData.connections.map((targetId) => {
                                                    const relNode = SKILLS_NODES.find((n) => n.id === targetId);
                                                    if (!relNode) return null;
                                                    const RelIcon = relNode.icon;
                                                    return (
                                                        <button
                                                            key={targetId}
                                                            onClick={() => {
                                                                AudioEngine.playUISelect();
                                                                setSelectedNode(relNode);
                                                            }}
                                                            className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-cyan-400 transition text-left flex items-center gap-3 group"
                                                        >
                                                            <RelIcon className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
                                                            <div>
                                                                <div className="text-xs font-bold text-white group-hover:text-cyan-300">
                                                                    {relNode.name}
                                                                </div>
                                                                <div className="text-[10px] text-neutral-400">
                                                                    {relNode.category}
                                                                </div>
                                                            </div>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Drawer Footer */}
                                <div className="bg-neutral-900 px-6 py-3 border-t border-neutral-800 flex items-center justify-between text-[11px] text-neutral-400">
                                    <span>Neural Node ID: {activeNodeData.id}</span>
                                    <span>Click X to close node inspector</span>
                                </div>
                            </motion.div>
                        </div>
                    </AnimatePresence>,
                    document.body
                )}
        </div>
    );
}
