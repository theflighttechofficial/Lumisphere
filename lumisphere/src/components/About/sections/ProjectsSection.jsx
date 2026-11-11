import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search, X } from "lucide-react";
import { projects, projectCategories } from "../../../data/profile";
import { AudioEngine } from "../../../utils/AudioEngine";
import { MotionItem, MotionList, SectionHeading } from "../ui";
import { sectionMotion } from "../motion";
import ProjectCard from "../ProjectCard";

export default function ProjectsSection({ onOpenProject }) {
    const [category, setCategory] = useState("all");
    const [query, setQuery] = useState("");

    const counts = useMemo(() => {
        const c = { all: projects.length };
        projects.forEach((p) => (c[p.category] = (c[p.category] || 0) + 1));
        return c;
    }, []);

    const visible = useMemo(() => {
        const q = query.toLowerCase().trim();
        return projects
            .filter((p) => category === "all" || p.category === category)
            .filter((p) => !q || [p.title, p.tagline, ...p.stack].some((s) => s.toLowerCase().includes(q)))
            .sort((a, b) => Number(!!b.featured) - Number(!!a.featured));
    }, [category, query]);

    return (
        <motion.div {...sectionMotion}>
            <SectionHeading
                eyebrow="Projects"
                title={`${projects.length} things I've built`}
                description="Production tools, research, hackathon builds and products. Tap any card for the full story, metrics and links."
            />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-5">
                <div className="flex gap-1.5 overflow-x-auto scrollbar-none -mx-1 px-1 pb-1" role="tablist" aria-label="Project categories">
                    {projectCategories.map((c) => (
                        <button
                            key={c.id}
                            role="tab"
                            aria-selected={category === c.id}
                            onClick={() => {
                                AudioEngine.playUISelect();
                                setCategory(c.id);
                            }}
                            className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[13px] font-medium transition-colors ${
                                category === c.id ? "bg-amber-400 border-amber-400 text-zinc-950" : "border-white/10 bg-white/[0.03] text-zinc-300 hover:text-white hover:border-white/25"
                            }`}
                        >
                            {c.label}
                            <span className={`text-[11px] font-mono ${category === c.id ? "text-zinc-800" : "text-zinc-500"}`}>{counts[c.id] || 0}</span>
                        </button>
                    ))}
                </div>
                <label className="relative flex items-center md:w-64 shrink-0">
                    <Search size={15} className="absolute left-3 text-zinc-500 pointer-events-none" />
                    <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search by name or tech…"
                        aria-label="Search projects"
                        className="w-full pl-9 pr-8 py-2 rounded-xl bg-black/40 border border-white/10 text-base md:text-sm text-white placeholder-zinc-500 outline-none focus:border-amber-400/60"
                    />
                    {query && (
                        <button onClick={() => setQuery("")} aria-label="Clear search" className="absolute right-2 p-1 text-zinc-500 hover:text-white">
                            <X size={14} />
                        </button>
                    )}
                </label>
            </div>

            {visible.length ? (
                <MotionList key={category + query} className="grid md:grid-cols-2 2xl:grid-cols-3 gap-3">
                    {visible.map((p) => (
                        <MotionItem key={p.id}>
                            <ProjectCard project={p} onOpen={onOpenProject} />
                        </MotionItem>
                    ))}
                </MotionList>
            ) : (
                <p className="py-16 text-center text-sm text-zinc-500">Nothing matches “{query}”. Try a technology like “React” or “FAISS”.</p>
            )}
        </motion.div>
    );
}
