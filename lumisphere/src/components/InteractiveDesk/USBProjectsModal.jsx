
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { featuredProjects, projectCategories, projectStatus } from "../../data/profile";
import { ExternalLink, HardDrive, Sparkles, X, CheckCircle2 } from "lucide-react";

const usbProjects = featuredProjects.slice(0, 6).map((p) => ({
    id: p.id,
    title: p.title,
    category: projectCategories.find((c) => c.id === p.category)?.label ?? "Project",
    desc: p.tagline,
    tech: p.stack.slice(0, 4),
    status: projectStatus[p.status].label,
    link: p.links.live || p.links.repo || "https://github.com/theflighttechofficial",
}));

export default function USBProjectsModal({ isOpen, onClose }) {
    if (!isOpen || typeof document === "undefined") return null;

    return createPortal(
        <AnimatePresence>
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    transition={{ duration: 0.28, ease: "easeOut" }}
                    className="relative w-full max-w-4xl rounded-2xl bg-neutral-950 border border-sky-500/40 shadow-[0_0_50px_rgba(56,189,248,0.25)] overflow-hidden flex flex-col"
                >
                    {/* Top USB Hardware Header */}
                    <div className="bg-neutral-900 px-6 py-4 border-b border-sky-500/30 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-sky-500/20 text-sky-400 border border-sky-500/40 animate-pulse">
                                <HardDrive className="w-5 h-5" />
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h3 className="font-mono text-sm font-bold text-sky-300">
                                        USB PORTABLE DRIVE • MOUNTED
                                    </h3>
                                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                                        <CheckCircle2 className="w-3 h-3" /> READ/WRITE
                                    </span>
                                </div>
                                <p className="text-[11px] font-mono text-neutral-400">
                                    Capacity: 128 GB • High-Speed USB 3.2 Gen 2
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

                    {/* Projects Grid */}
                    <div className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-h-[70vh] overflow-y-auto">
                        {usbProjects.map((proj) => (
                            <motion.div
                                key={proj.id}
                                whileHover={{ y: -4, scale: 1.02 }}
                                className="group relative rounded-xl bg-neutral-900/80 border border-neutral-800 hover:border-sky-500/50 p-4 transition-all duration-300 flex flex-col justify-between"
                            >
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-[10px] font-mono uppercase tracking-wider text-sky-400 font-semibold px-2 py-0.5 rounded bg-sky-500/10 border border-sky-500/20">
                                            {proj.category}
                                        </span>
                                        <Sparkles className="w-3.5 h-3.5 text-sky-400 group-hover:rotate-12 transition-transform" />
                                    </div>
                                    <h4 className="font-mono text-sm font-bold text-neutral-100 group-hover:text-sky-300 transition-colors mb-2">
                                        {proj.title}
                                    </h4>
                                    <p className="text-xs text-neutral-400 leading-relaxed font-sans mb-4">
                                        {proj.desc}
                                    </p>
                                </div>

                                <div>
                                    <div className="flex flex-wrap gap-1.5 mb-4">
                                        {proj.tech.map((t, i) => (
                                            <span
                                                key={i}
                                                className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-950 text-neutral-300 border border-neutral-800"
                                            >
                                                {t}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="pt-3 border-t border-neutral-800 flex items-center justify-between text-xs font-mono">
                                        <span className="text-emerald-400 font-semibold text-[11px]">
                                            {proj.status}
                                        </span>
                                        <a
                                            href={proj.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-1 text-sky-400 hover:text-sky-300 transition"
                                        >
                                            <span>Explore</span>
                                            <ExternalLink className="w-3.5 h-3.5" />
                                        </a>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Footer */}
                    <div className="bg-neutral-900 px-6 py-3 border-t border-neutral-800 flex items-center justify-between text-[11px] font-mono text-neutral-400">
                        <span>USB File System: ext4 / encrypted</span>
                        <span>Click eject or close to unmount</span>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>,
        document.body
    );
}
