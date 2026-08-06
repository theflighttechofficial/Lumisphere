import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, X, Sparkles, CheckCircle2, Lock, Gift } from "lucide-react";
import { SecretsManager } from "../../utils/SecretsManager";

export default function AchievementsModal({ isOpen, onClose }) {
    const [achievements, setAchievements] = useState(SecretsManager.achievements);
    const [collectibles, setCollectibles] = useState(SecretsManager.collectibles);

    useEffect(() => {
        const update = () => {
            setAchievements([...SecretsManager.achievements]);
            setCollectibles([...SecretsManager.collectibles]);
        };
        const unsubscribe = SecretsManager.subscribe(update);
        return () => unsubscribe();
    }, []);

    if (!isOpen || typeof document === "undefined") return null;

    const unlockedCount = achievements.filter((a) => a.unlocked).length;
    const collectiblesCount = collectibles.filter((c) => c.found).length;

    return createPortal(
        <AnimatePresence>
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="relative w-full max-w-4xl rounded-2xl bg-neutral-950 border border-amber-500/30 shadow-[0_0_50px_rgba(251,191,36,0.2)] overflow-hidden flex flex-col max-h-[85vh]"
                >
                    {/* Header */}
                    <div className="bg-neutral-900 px-6 py-4 border-b border-amber-500/20 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/40">
                                <Trophy className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-mono text-sm font-bold text-amber-300">
                                    ACHIEVEMENTS & SECRET RELICS
                                </h3>
                                <p className="text-[11px] font-mono text-neutral-400">
                                    Progress: {unlockedCount} / {achievements.length} Badges • {collectiblesCount} / {collectibles.length} Relics
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

                    {/* Content Section */}
                    <div className="p-6 overflow-y-auto space-y-6">
                        {/* Achievements Grid */}
                        <div>
                            <h4 className="font-mono text-xs font-bold uppercase text-amber-400 mb-3 flex items-center gap-1.5">
                                <Sparkles className="w-4 h-4" />
                                <span>Unlocked Badges</span>
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                                {achievements.map((item) => (
                                    <div
                                        key={item.id}
                                        className={`p-3.5 rounded-xl border flex flex-col justify-between transition-all ${
                                            item.unlocked
                                                ? "bg-amber-500/10 border-amber-500/40 text-amber-300 shadow-md"
                                                : "bg-neutral-900/60 border-neutral-800 text-neutral-500 opacity-60"
                                        }`}
                                    >
                                        <div>
                                            <div className="text-2xl mb-2">{item.icon}</div>
                                            <div className="font-mono text-xs font-bold mb-1">
                                                {item.name}
                                            </div>
                                            <div className="text-[10px] font-mono text-neutral-400 leading-tight">
                                                {item.desc}
                                            </div>
                                        </div>
                                        <div className="mt-3 pt-2 border-t border-black/20 text-[10px] font-mono font-bold flex items-center justify-between">
                                            <span>{item.unlocked ? "UNLOCKED" : "LOCKED"}</span>
                                            {item.unlocked ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Lock className="w-3.5 h-3.5 text-neutral-600" />}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Collectibles Shelf */}
                        <div>
                            <h4 className="font-mono text-xs font-bold uppercase text-amber-400 mb-3 flex items-center gap-1.5">
                                <Gift className="w-4 h-4" />
                                <span>Hidden Collectibles Shelf</span>
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                                {collectibles.map((item) => (
                                    <div
                                        key={item.id}
                                        className={`p-3.5 rounded-xl border flex items-center gap-3 ${
                                            item.found
                                                ? "bg-sky-500/10 border-sky-500/40 text-sky-300 shadow-md"
                                                : "bg-neutral-900/60 border-neutral-800 text-neutral-500 opacity-60"
                                        }`}
                                    >
                                        <div className="text-2xl">{item.icon}</div>
                                        <div>
                                            <div className="font-mono text-xs font-bold">{item.name}</div>
                                            <div className="text-[10px] font-mono text-neutral-400">
                                                {item.found ? `Found at ${item.location}` : "Hidden on desk"}
                                            </div>
                                        </div>
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
