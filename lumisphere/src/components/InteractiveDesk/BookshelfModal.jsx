import React, { useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Bookmark, ChevronRight, Sparkles, X, Layers, Code, Brain } from "lucide-react";
import { AudioEngine } from "../../utils/AudioEngine";

const BOOKS = [
    {
        id: "ai_rag",
        title: "Industrial GenAI & Hybrid RAG Architecture",
        author: "Lumisphere Labs",
        category: "Artificial Intelligence",
        color: "from-amber-500/20 to-amber-900/40 border-amber-500/40 text-amber-300",
        icon: Brain,
        chapters: [
            "Chapter 1: Dense FAISS Vector Indexing & Hybrid RRF Search",
            "Chapter 2: Context Chunk Reranking for 88% Token Cost Reduction",
            "Chapter 3: Zero-Text Layer AutoCAD PDF Blueprint OCR Pipelines"
        ]
    },
    {
        id: "webgl",
        title: "WebGL Shaders & Procedural Audio Synthesis",
        author: "WebGL Masters",
        category: "Computer Graphics",
        color: "from-sky-500/20 to-sky-900/40 border-sky-500/40 text-sky-300",
        icon: Layers,
        chapters: [
            "Chapter 1: Real-Time Raymarched Volumetric Atmosphere GLSL Shaders",
            "Chapter 2: Web Audio API FM & Additive Sound Generators",
            "Chapter 3: GPU Particle Wind & Weather Physics Simulations"
        ]
    },
    {
        id: "fullstack",
        title: "Modern React 19 & High-Performance Systems",
        author: "Systems Guild",
        category: "Fullstack Engineering",
        color: "from-emerald-500/20 to-emerald-900/40 border-emerald-500/40 text-emerald-300",
        icon: Code,
        chapters: [
            "Chapter 1: React 19 Concurrent Rendering & State Optimization",
            "Chapter 2: Micro-Animation Engineering with Framer Motion & GSAP",
            "Chapter 3: Zero-Dependency Pure Web Standards Integration"
        ]
    }
];

export default function BookshelfModal({ isOpen, onClose }) {
    const [selectedBook, setSelectedBook] = useState(BOOKS[0].id);

    if (!isOpen || typeof document === "undefined") return null;

    const currentBook = BOOKS.find((b) => b.id === selectedBook);

    const handleSelectBook = (id) => {
        AudioEngine.playPageFlip();
        setSelectedBook(id);
    };

    return createPortal(
        <AnimatePresence>
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="relative w-full max-w-4xl rounded-2xl bg-neutral-950 border border-amber-500/30 shadow-[0_0_50px_rgba(251,191,36,0.2)] overflow-hidden flex flex-col md:flex-row min-h-[460px]"
                >
                    {/* Left Sidebar Bookshelf List */}
                    <div className="w-full md:w-80 bg-neutral-900 p-5 border-b md:border-b-0 md:border-r border-neutral-800 flex flex-col justify-between">
                        <div>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/40">
                                    <BookOpen className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-mono text-sm font-bold text-amber-300">
                                        TECH LIBRARY
                                    </h3>
                                    <p className="text-[11px] font-mono text-neutral-400">
                                        Desk Book Collection
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                {BOOKS.map((book) => {
                                    const Icon = book.icon;
                                    const isSelected = selectedBook === book.id;
                                    return (
                                        <button
                                            key={book.id}
                                            onClick={() => handleSelectBook(book.id)}
                                            className={`w-full p-3.5 rounded-xl border text-left transition-all flex items-center gap-3 bg-gradient-to-r ${
                                                isSelected
                                                    ? `${book.color} shadow-lg ring-1 ring-amber-400/50`
                                                    : "bg-neutral-950/60 border-neutral-800 text-neutral-400 hover:border-neutral-700"
                                            }`}
                                        >
                                            <Icon className="w-5 h-5 shrink-0" />
                                            <div className="overflow-hidden">
                                                <div className="text-xs font-mono font-bold line-clamp-1">
                                                    {book.title}
                                                </div>
                                                <div className="text-[10px] font-mono text-neutral-400">
                                                    {book.category}
                                                </div>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="mt-6 text-[11px] font-mono text-neutral-500 flex items-center justify-between">
                            <span>Library Status: ONLINE</span>
                            <Bookmark className="w-4 h-4 text-amber-400" />
                        </div>
                    </div>

                    {/* Book Detail Viewer */}
                    <div className="flex-1 p-6 bg-neutral-950 flex flex-col justify-between">
                        <div>
                            <div className="flex items-center justify-between pb-4 mb-4 border-b border-neutral-800">
                                <div>
                                    <span className="text-[10px] font-mono uppercase text-amber-400 font-semibold px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                                        {currentBook?.category}
                                    </span>
                                    <h2 className="font-mono text-base font-bold text-neutral-100 mt-2">
                                        {currentBook?.title}
                                    </h2>
                                    <p className="text-xs font-mono text-neutral-400">
                                        Author: {currentBook?.author}
                                    </p>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="space-y-3">
                                <h4 className="text-xs font-mono uppercase text-neutral-300 font-semibold flex items-center gap-1">
                                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                                    <span>Table of Contents</span>
                                </h4>
                                {currentBook?.chapters.map((ch, idx) => (
                                    <div
                                        key={idx}
                                        className="p-3 rounded-lg bg-neutral-900 border border-neutral-800 text-xs font-mono text-neutral-300 flex items-center gap-2 hover:border-amber-500/30 transition"
                                    >
                                        <ChevronRight className="w-4 h-4 text-amber-400 shrink-0" />
                                        <span>{ch}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="pt-4 border-t border-neutral-800 text-[11px] font-mono text-neutral-500 flex items-center justify-between">
                            <span>Lumisphere Engineering Docs</span>
                            <span>Click any book to switch view</span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>,
        document.body
    );
}
