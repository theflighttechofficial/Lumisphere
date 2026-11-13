import { motion } from "framer-motion";
import { ArrowRight, Database, Layers, Sparkles, Workflow } from "lucide-react";
import { profile, impactStats, featuredProjects, nowBuilding } from "../../../data/profile";
import { Card, MotionItem, MotionList, SectionHeading } from "../ui";
import { sectionMotion } from "../motion";
import ProjectCard from "../ProjectCard";
import Terminal from "../Terminal";

const layers = [
    { icon: Workflow, title: "Data & ML", body: "Python, pandas, scikit-learn, XGBoost, SHAP, YOLOv8, OpenCV and RAG pipelines." },
    { icon: Layers, title: "Product engineering", body: "TypeScript, React, Vite, Tailwind, Node.js, Express and FastAPI." },
    { icon: Database, title: "Data stores", body: "SQL, PostgreSQL, MongoDB, Supabase and FAISS vector indexes." },
];

export default function OverviewSection({ viewerName, college, onNavigate, onOpenProject, terminalProps }) {
    return (
        <motion.div {...sectionMotion} className="space-y-10">
            {/* Hero */}
            <div>
                <p className="font-mono text-xs text-amber-400/90 mb-3">
                    {viewerName ? `Hi ${viewerName}${college ? ` from ${college}` : ""} — thanks for stopping by.` : "Hi, thanks for stopping by."}
                </p>
                <h1 className="text-[28px] leading-[1.15] sm:text-4xl xl:text-[44px] font-bold tracking-tight text-white text-balance max-w-3xl">
                    {profile.headline.split("systems")[0]}
                    <span className="bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 bg-clip-text text-transparent">systems</span>
                    {profile.headline.split("systems")[1]}
                </h1>
                <p className="mt-4 text-[15px] text-zinc-300 leading-relaxed max-w-2xl">{profile.summary}</p>
                <div className="mt-6 flex flex-wrap gap-2.5">
                    <button
                        onClick={() => onNavigate("projects")}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-300 text-zinc-950 text-sm font-semibold shadow-lg shadow-amber-400/20 hover:brightness-110"
                    >
                        See my work <ArrowRight size={15} />
                    </button>
                    <button
                        onClick={() => onNavigate("contact")}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/15 bg-white/5 text-white text-sm font-semibold hover:bg-white/10"
                    >
                        Get in touch
                    </button>
                </div>
            </div>

            {/* Impact */}
            <MotionList className="grid grid-cols-2 xl:grid-cols-4 gap-3">
                {impactStats.map((s) => (
                    <MotionItem key={s.label}>
                        <Card className="h-full p-4 sm:p-5 bg-gradient-to-b from-amber-400/[0.06] to-transparent border-amber-400/15">
                            <div className="text-lg sm:text-2xl font-bold text-white tracking-tight">{s.value}</div>
                            <div className="mt-1 text-xs sm:text-[13px] text-zinc-400 leading-snug">{s.label}</div>
                        </Card>
                    </MotionItem>
                ))}
            </MotionList>

            {/* How I work */}
            <div>
                <SectionHeading eyebrow="What I do" title="Three layers, one pipeline" description="I work end to end: from raw data and models to the product people actually use." />
                <div className="grid sm:grid-cols-3 gap-3">
                    {layers.map(({ icon: Icon, title, body }) => (
                        <Card key={title} className="p-5">
                            <div className="w-9 h-9 rounded-xl bg-amber-400/10 border border-amber-400/25 flex items-center justify-center mb-3">
                                <Icon size={17} className="text-amber-300" />
                            </div>
                            <h3 className="text-[15px] font-semibold text-white">{title}</h3>
                            <p className="mt-1 text-sm text-zinc-400 leading-relaxed">{body}</p>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Featured work */}
            <div>
                <SectionHeading
                    eyebrow="Selected work"
                    title="Featured projects"
                    action={
                        <button onClick={() => onNavigate("projects")} className="inline-flex items-center gap-1.5 text-sm font-semibold text-amber-300 hover:text-amber-200 shrink-0">
                            All projects <ArrowRight size={14} />
                        </button>
                    }
                />
                <MotionList className="grid md:grid-cols-2 2xl:grid-cols-3 gap-3">
                    {featuredProjects.slice(0, 6).map((p) => (
                        <MotionItem key={p.id}>
                            <ProjectCard project={p} onOpen={onOpenProject} />
                        </MotionItem>
                    ))}
                </MotionList>
            </div>

            {/* Now + terminal */}
            <div className="grid lg:grid-cols-5 gap-4">
                <Card className="min-w-0 lg:col-span-2 p-5">
                    <h3 className="flex items-center gap-2 text-[15px] font-semibold text-white">
                        <span className="relative flex w-2 h-2">
                            <span className="absolute inline-flex w-full h-full rounded-full bg-emerald-400 opacity-60 animate-ping" />
                            <span className="relative inline-flex w-2 h-2 rounded-full bg-emerald-400" />
                        </span>
                        Right now
                    </h3>
                    <ul className="mt-4 space-y-3.5">
                        {nowBuilding.map((n) => (
                            <li key={n.title} className="flex gap-3">
                                <Sparkles size={15} className="text-amber-400 mt-0.5 shrink-0" />
                                <div>
                                    <div className="text-sm font-semibold text-zinc-100">{n.title}</div>
                                    <div className="text-[13px] text-zinc-400 leading-snug">{n.detail}</div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </Card>
                <div className="min-w-0 lg:col-span-3">
                    <Terminal viewerName={viewerName} college={college} {...terminalProps} />
                </div>
            </div>
        </motion.div>
    );
}
