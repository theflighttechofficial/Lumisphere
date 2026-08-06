import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { StickyNote, Plus, Trash2, Check, X, Palette, Lock } from "lucide-react";
import { AudioEngine } from "../../utils/AudioEngine";

const COLOR_OPTIONS = [
    { id: "yellow", bg: "bg-yellow-400/90 text-neutral-950", border: "border-yellow-300", accent: "#facc15" },
    { id: "cyan", bg: "bg-sky-400/90 text-neutral-950", border: "border-sky-300", accent: "#38bdf8" },
    { id: "green", bg: "bg-emerald-400/90 text-neutral-950", border: "border-emerald-300", accent: "#34d399" },
    { id: "pink", bg: "bg-pink-400/90 text-neutral-950", border: "border-pink-300", accent: "#f472b6" },
    { id: "purple", bg: "bg-purple-400/90 text-neutral-950", border: "border-purple-300", accent: "#c084fc" },
];

const INITIAL_NOTES = [
    {
        id: "1",
        text: "⚡ Sprint Priorities:\n- Optimize WebGL Shader uniforms\n- Add Mechanical Keyboard soundboard",
        color: "yellow",
        completed: false,
    },
    {
        id: "2",
        text: "☕ Coffee break & inspect hybrid RAG vector embeddings benchmark.",
        color: "cyan",
        completed: true,
    },
];

export default function StickyNotesApp({ isOpen, onClose }) {
    const [notes, setNotes] = useState(() => {
        try {
            const saved = localStorage.getItem("lumisphere_sticky_notes");
            return saved ? JSON.parse(saved) : INITIAL_NOTES;
        } catch (e) {
            return INITIAL_NOTES;
        }
    });

    const [newText, setNewText] = useState("");
    const [selectedColor, setSelectedColor] = useState("yellow");

    useEffect(() => {
        try {
            localStorage.setItem("lumisphere_sticky_notes", JSON.stringify(notes));
        } catch (e) {}
    }, [notes]);

    if (!isOpen || typeof document === "undefined") return null;

    const handleAddNote = () => {
        if (!newText.trim()) return;
        AudioEngine.playStickyPeel();
        const newNote = {
            id: Date.now().toString(),
            text: newText.trim(),
            color: selectedColor,
            completed: false,
        };
        setNotes([newNote, ...notes]);
        setNewText("");
    };

    const handleDeleteNote = (id) => {
        AudioEngine.playStickyPeel();
        setNotes(notes.filter((n) => n.id !== id));
    };

    const handleToggleComplete = (id) => {
        AudioEngine.playUISelect();
        setNotes(
            notes.map((n) => (n.id === id ? { ...n, completed: !n.completed } : n))
        );
    };

    return createPortal(
        <AnimatePresence>
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="relative w-full max-w-3xl rounded-2xl bg-neutral-900 border border-yellow-500/30 shadow-[0_0_50px_rgba(234,179,8,0.2)] overflow-hidden flex flex-col max-h-[85vh]"
                >
                    {/* Header */}
                    <div className="bg-neutral-950 px-6 py-4 border-b border-yellow-500/20 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-yellow-500/20 text-yellow-400 border border-yellow-500/40">
                                <StickyNote className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-mono text-sm font-bold text-yellow-300">
                                    DESK STICKY NOTES
                                </h3>
                                <p className="text-[11px] font-mono text-neutral-400">
                                    Personal Post-it Board • Synced to Local Storage
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

                    {/* New Note Creator input */}
                    <div className="p-4 bg-neutral-900 border-b border-neutral-800 flex flex-col md:flex-row gap-3 items-stretch">
                        <textarea
                            value={newText}
                            onChange={(e) => setNewText(e.target.value)}
                            placeholder="Write a new sticky note or reminder..."
                            className="flex-1 bg-neutral-950 text-neutral-100 placeholder-neutral-500 font-mono text-xs p-3 rounded-xl border border-neutral-800 focus:border-yellow-500/50 focus:outline-none resize-none h-16"
                        />

                        <div className="flex md:flex-col justify-between items-center gap-2">
                            {/* Color Selector */}
                            <div className="flex items-center gap-1.5 bg-neutral-950 p-1.5 rounded-lg border border-neutral-800">
                                {COLOR_OPTIONS.map((c) => (
                                    <button
                                        key={c.id}
                                        onClick={() => setSelectedColor(c.id)}
                                        className={`w-5 h-5 rounded-full border transition-transform ${
                                            selectedColor === c.id ? "scale-125 ring-2 ring-white" : "scale-100 opacity-80"
                                        }`}
                                        style={{ backgroundColor: c.accent }}
                                    />
                                ))}
                            </div>

                            <button
                                onClick={handleAddNote}
                                className="px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-neutral-950 font-mono font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-lg transition"
                            >
                                <Plus className="w-4 h-4" />
                                <span>Add Note</span>
                            </button>
                        </div>
                    </div>

                    {/* Notes Grid */}
                    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 overflow-y-auto max-h-[50vh]">
                        {notes.map((note) => {
                            const colorStyle =
                                COLOR_OPTIONS.find((c) => c.id === note.color) || COLOR_OPTIONS[0];

                            return (
                                <motion.div
                                    key={note.id}
                                    layout
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0.8, opacity: 0 }}
                                    className={`relative p-4 rounded-xl shadow-lg border ${colorStyle.bg} ${colorStyle.border} flex flex-col justify-between min-h-[140px] transform hover:-translate-y-1 transition-all duration-200`}
                                >
                                    <div className="font-mono text-xs font-medium leading-relaxed whitespace-pre-wrap">
                                        <span className={note.completed ? "line-through opacity-60" : ""}>
                                            {note.text}
                                        </span>
                                    </div>

                                    <div className="mt-4 pt-2 border-t border-black/10 flex items-center justify-between">
                                        <button
                                            onClick={() => handleToggleComplete(note.id)}
                                            className={`p-1 rounded-md transition ${
                                                note.completed
                                                    ? "bg-neutral-950/20 text-neutral-950"
                                                    : "bg-black/10 hover:bg-black/20"
                                            }`}
                                        >
                                            <Check className={`w-4 h-4 ${note.completed ? "opacity-100" : "opacity-40"}`} />
                                        </button>

                                        <button
                                            onClick={() => handleDeleteNote(note.id)}
                                            className="p-1 rounded-md text-neutral-900/60 hover:text-red-700 hover:bg-black/10 transition"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>,
        document.body
    );
}
