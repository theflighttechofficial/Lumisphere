import { lazy, Suspense, useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
    Award, Bot, Briefcase, CheckCircle2, Compass, Cpu, FileText, LayoutGrid, LogOut, Mail, MapPin, Palette,
    Send, Sparkles, Sun, Volume2, VolumeX,
} from "lucide-react";
import { useLight } from "../../context/LightContext";
import { AudioEngine } from "../../utils/AudioEngine";
import useMobile from "../../hooks/useMobile";
import { profile, socials, education, experience, projects, certifications } from "../../data/profile";
import NoiseLayer from "../UI/NoiseLayer";
import { SocialIcon } from "./BrandIcons";
import { themePalettes } from "./themes";
import { ProjectModal, CodeModal } from "./ProjectModal";
import ResumeModal from "./ResumeModal";
import OverviewSection from "./sections/OverviewSection";
import ExperienceSection from "./sections/ExperienceSection";
import ProjectsSection from "./sections/ProjectsSection";
import SkillsSection from "./sections/SkillsSection";
import AchievementsSection from "./sections/AchievementsSection";
import JourneySection from "./sections/JourneySection";
import ContactSection from "./sections/ContactSection";

// WebGL hologram is desktop-only and loaded on demand, so phones never download three.js for it.
const Hologram = lazy(() => import("./Hologram"));

const SECTIONS = [
    { id: "overview", label: "Overview", icon: Sparkles },
    { id: "experience", label: "Experience", icon: Briefcase },
    { id: "projects", label: "Projects", icon: LayoutGrid },
    { id: "skills", label: "Skills", icon: Cpu },
    { id: "achievements", label: "Awards & Research", icon: Award },
    { id: "journey", label: "Journey", icon: Compass },
    { id: "contact", label: "Contact", icon: Send },
];

const SHAPES = [
    { id: null, label: "Auto" },
    { id: "reactor", label: "Core" },
    { id: "neural", label: "Neural" },
    { id: "matrix", label: "Grid" },
    { id: "helix", label: "Helix" },
];

const quickStats = [
    { value: education.cgpa, label: "CGPA" },
    { value: projects.length, label: "Projects" },
    { value: experience.length, label: "Internships" },
    { value: certifications.length, label: "Certs" },
];

export default function AboutPage() {
    const { isLightOn, setIsLightOn, setIsLoggedIn, lampIntensity, setLampIntensity, viewerName, college, isMuted, toggleMute } = useLight();
    const isDesktop = !useMobile(1024);

    const [section, setSection] = useState("overview");
    const [theme, setTheme] = useState("amber");
    const [shapeOverride, setShapeOverride] = useState(null);
    const [selectedProject, setSelectedProject] = useState(null);
    const [snippet, setSnippet] = useState(null);
    const [resumeOpen, setResumeOpen] = useState(false);
    const [toast, setToast] = useState(null);
    const [leaving, setLeaving] = useState(false);

    const scrollRef = useRef(null);
    const mainRef = useRef(null);
    const navRef = useRef(null);
    const toastTimer = useRef(null);

    const showToast = useCallback((msg) => {
        setToast(msg);
        clearTimeout(toastTimer.current);
        toastTimer.current = setTimeout(() => setToast(null), 2600);
    }, []);

    useEffect(() => () => clearTimeout(toastTimer.current), []);

    const navigate = useCallback(
        (id) => {
            AudioEngine.playUIHover();
            setSection(id);
            // Desktop scrolls the main column; phones scroll the whole sheet back to the nav bar.
            if (isDesktop) mainRef.current?.scrollTo({ top: 0, behavior: "smooth" });
            else if (mainRef.current && scrollRef.current) {
                const sheet = scrollRef.current;
                const top = mainRef.current.parentElement.getBoundingClientRect().top - sheet.getBoundingClientRect().top + sheet.scrollTop;
                if (sheet.scrollTop > top) sheet.scrollTo({ top });
            }
        },
        [isDesktop]
    );

    // Keep the active tab visible in the horizontally scrolling nav on small screens.
    // Scroll only the nav strip; scrollIntoView would also shift every scrollable ancestor sideways.
    useEffect(() => {
        const nav = navRef.current;
        const btn = nav?.querySelector(`[data-section="${section}"]`);
        if (!nav || !btn || nav.scrollWidth <= nav.clientWidth) return;
        nav.scrollTo({ left: btn.offsetLeft - nav.clientWidth / 2 + btn.offsetWidth / 2, behavior: "smooth" });
    }, [section]);

    const openProject = useCallback((p) => {
        AudioEngine.playUISelect();
        setSelectedProject(p);
    }, []);

    const signOut = () => {
        setLeaving(true);
        AudioEngine.playChainRelease();
        setTimeout(() => {
            setIsLoggedIn(false);
            setIsLightOn(false);
        }, 700);
    };

    const terminalProps = {
        onNavigate: navigate,
        onOpenProject: openProject,
        onOpenResume: () => setResumeOpen(true),
        onTheme: setTheme,
        onDim: setLampIntensity,
    };

    const sectionProps = { viewerName, college, onNavigate: navigate, onOpenProject: openProject, onToast: showToast, terminalProps };

    return (
        <motion.div
            ref={scrollRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: leaving ? 0 : 1, filter: leaving ? "blur(6px)" : "blur(0px)" }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="fixed inset-0 z-50 overflow-y-auto overflow-x-clip lg:overflow-y-hidden bg-black/75 lg:bg-black/45 backdrop-blur-md"
        >
            <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
                <div className="absolute -top-40 -left-40 w-[520px] h-[520px] rounded-full bg-amber-500/10 blur-[160px]" />
                <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full bg-violet-500/10 blur-[180px]" />
            </div>

            <div
                className="relative min-h-full lg:h-full flex flex-col lg:flex-row gap-3 lg:gap-5 p-3 sm:p-5 lg:p-6 pb-[max(0.75rem,env(safe-area-inset-bottom))] transition-opacity duration-700"
                style={{ opacity: isLightOn ? 1 : 0.12 }}
            >
                {/* ───────────── Sidebar / mobile hero ───────────── */}
                <motion.aside
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    className="relative lg:w-[340px] xl:w-[380px] shrink-0 lg:h-full lg:overflow-y-auto scrollbar-none rounded-3xl border border-white/10 bg-gradient-to-b from-zinc-950/90 via-zinc-900/70 to-zinc-950/90 backdrop-blur-2xl shadow-2xl"
                >
                    <NoiseLayer />
                    <div className="relative flex flex-col gap-5 p-5 sm:p-6 lg:min-h-full">
                        <div className="flex items-center justify-between">
                            {/* On desktop the parked lamp hangs over this corner, so the wordmark steps aside for it */}
                            <span className="flex items-center gap-2 font-mono text-[11px] font-bold tracking-[0.35em] text-amber-400 lg:invisible">
                                LUMISPHERE <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_10px_#facc15] animate-pulse" />
                            </span>
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={toggleMute}
                                    aria-label={isMuted ? "Unmute sound" : "Mute sound"}
                                    className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10"
                                >
                                    {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                                </button>
                                <button
                                    onClick={signOut}
                                    aria-label="Leave portfolio"
                                    title="Turn off the lamp"
                                    className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10"
                                >
                                    <LogOut size={16} />
                                </button>
                            </div>
                        </div>

                        <div aria-hidden className="hidden lg:block h-16 xl:h-20 -mt-2" />

                        {/* Identity */}
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setResumeOpen(true)}
                                aria-label="Open résumé"
                                className="relative shrink-0 w-16 h-16 sm:w-[72px] sm:h-[72px] rounded-2xl bg-gradient-to-br from-amber-300 via-amber-500 to-orange-600 p-[1.5px] shadow-[0_0_30px_rgba(251,191,36,0.35)]"
                            >
                                <span className="flex w-full h-full items-center justify-center rounded-[14px] bg-zinc-950 text-xl sm:text-2xl font-bold tracking-tight text-amber-200">{profile.initials}</span>
                                <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-400 border-[3px] border-zinc-950" title="Available" />
                            </button>
                            <div className="min-w-0">
                                <h2 className="text-xl sm:text-[22px] font-bold tracking-tight text-white">{profile.name}</h2>
                                <p className="text-sm font-medium text-amber-300">{profile.role}</p>
                                <p className="mt-0.5 flex items-center gap-1 text-[13px] text-zinc-400"><MapPin size={12} /> Chennai, India</p>
                            </div>
                        </div>

                        <div className="flex gap-2 items-start rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.06] px-3.5 py-2.5">
                            <CheckCircle2 size={15} className="text-emerald-400 mt-0.5 shrink-0" />
                            <p className="text-[13px] text-emerald-100/90 leading-snug">{profile.availability}</p>
                        </div>

                        <div className="grid grid-cols-4 gap-2">
                            {quickStats.map((s) => (
                                <div key={s.label} className="rounded-xl border border-white/10 bg-white/[0.03] py-2.5 text-center">
                                    <div className="text-lg font-bold text-white leading-none">{s.value}</div>
                                    <div className="mt-1 text-[11px] text-zinc-500">{s.label}</div>
                                </div>
                            ))}
                        </div>

                        {/* Hologram (desktop) */}
                        {isDesktop && (
                            <div className="relative h-[210px] rounded-2xl border border-amber-400/15 bg-gradient-to-b from-zinc-950/60 to-black/80 overflow-hidden cursor-grab active:cursor-grabbing">
                                <Suspense fallback={<div className="absolute inset-0 animate-pulse bg-white/[0.02]" />}>
                                    <Hologram section={section} theme={theme} shapeOverride={shapeOverride} />
                                </Suspense>
                                <div className="absolute top-2 inset-x-2 flex items-center justify-between gap-2 pointer-events-none">
                                    <div className="flex gap-0.5 p-0.5 rounded-lg bg-black/60 border border-white/10 backdrop-blur pointer-events-auto">
                                        {SHAPES.map((s) => (
                                            <button
                                                key={s.label}
                                                onClick={() => setShapeOverride(s.id)}
                                                className={`px-1.5 py-0.5 rounded-md text-[10px] font-mono font-semibold ${shapeOverride === s.id ? "bg-amber-400 text-zinc-950" : "text-zinc-400 hover:text-white"}`}
                                            >
                                                {s.label}
                                            </button>
                                        ))}
                                    </div>
                                    <div className="flex items-center gap-1 p-1 rounded-lg bg-black/60 border border-white/10 backdrop-blur pointer-events-auto">
                                        <Palette size={11} className="text-zinc-500 mx-0.5" />
                                        {Object.keys(themePalettes).map((t) => (
                                            <button
                                                key={t}
                                                onClick={() => setTheme(t)}
                                                aria-label={`${t} hologram theme`}
                                                className={`w-3 h-3 rounded-full ${theme === t ? "ring-2 ring-white scale-110" : "opacity-60 hover:opacity-100"}`}
                                                style={{ backgroundColor: themePalettes[t].points }}
                                            />
                                        ))}
                                    </div>
                                </div>
                                <p className="absolute bottom-2 left-3 font-mono text-[10px] text-amber-400/80 pointer-events-none">drag to rotate · morphs per section</p>
                            </div>
                        )}

                        {/* Lamp dimmer */}
                        <label className="block rounded-2xl border border-white/10 bg-black/30 px-4 py-3">
                            <span className="flex items-center justify-between text-[13px] text-zinc-300">
                                <span className="flex items-center gap-1.5"><Sun size={14} className="text-amber-400" /> Lamp brightness</span>
                                <span className="font-mono text-amber-300">{lampIntensity}%</span>
                            </span>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={lampIntensity}
                                onChange={(e) => setLampIntensity(Number(e.target.value))}
                                aria-label="Lamp brightness"
                                className="mt-2 w-full accent-amber-400 cursor-pointer"
                            />
                        </label>

                        {/* Primary actions */}
                        <div className="grid grid-cols-3 gap-2">
                            <button onClick={() => setResumeOpen(true)} className="flex flex-col items-center gap-1 rounded-xl bg-gradient-to-b from-amber-400 to-amber-500 text-zinc-950 py-2.5 text-[12px] font-semibold hover:brightness-110">
                                <FileText size={17} /> Résumé
                            </button>
                            <a href={`mailto:${profile.email}`} className="flex flex-col items-center gap-1 rounded-xl border border-white/15 bg-white/5 text-white py-2.5 text-[12px] font-semibold hover:bg-white/10">
                                <Mail size={17} /> Email
                            </a>
                            <button
                                onClick={() => window.dispatchEvent(new CustomEvent("lumisphere_open_lumi_ai"))}
                                className="flex flex-col items-center gap-1 rounded-xl border border-cyan-400/30 bg-cyan-400/10 text-cyan-200 py-2.5 text-[12px] font-semibold hover:bg-cyan-400/20"
                            >
                                <Bot size={17} /> Ask Lumi
                            </button>
                        </div>

                        <div className="flex flex-wrap gap-1.5 lg:mt-auto">
                            {socials.map((s) => (
                                <a
                                    key={s.id}
                                    href={s.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={s.label}
                                    title={s.label}
                                    className="w-10 h-10 rounded-xl border border-white/10 bg-white/[0.03] flex items-center justify-center text-zinc-400 hover:text-amber-300 hover:border-amber-400/40"
                                >
                                    <SocialIcon id={s.id} size={16} />
                                </a>
                            ))}
                        </div>
                    </div>
                </motion.aside>

                {/* ───────────── Main panel ───────────── */}
                <motion.main
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
                    className="relative flex-1 min-w-0 lg:h-full flex flex-col rounded-3xl border border-white/10 bg-gradient-to-b from-zinc-950/90 via-zinc-900/75 to-zinc-950/90 backdrop-blur-3xl shadow-2xl lg:overflow-hidden"
                >
                    <NoiseLayer />
                    <nav
                        ref={navRef}
                        aria-label="Portfolio sections"
                        className="sticky top-0 lg:static z-20 flex gap-1 overflow-x-auto scrollbar-none p-2 sm:p-3 border-b border-white/10 bg-zinc-950/90 lg:bg-transparent backdrop-blur-xl rounded-t-3xl"
                    >
                        {SECTIONS.map(({ id, label, icon: Icon }) => (
                            <button
                                key={id}
                                data-section={id}
                                onClick={() => navigate(id)}
                                aria-current={section === id ? "page" : undefined}
                                className={`relative shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[13px] font-semibold transition-colors ${section === id ? "text-zinc-950" : "text-zinc-400 hover:text-white"}`}
                            >
                                {section === id && (
                                    <motion.span layoutId="section-pill" className="absolute inset-0 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-300 shadow-lg shadow-amber-400/20" transition={{ type: "spring", stiffness: 380, damping: 30 }} />
                                )}
                                <Icon size={14} className="relative" />
                                <span className="relative">{label}</span>
                            </button>
                        ))}
                    </nav>

                    <div ref={mainRef} className="relative flex-1 lg:overflow-y-auto overscroll-contain p-5 sm:p-7 xl:p-10">
                        <AnimatePresence mode="wait">
                            {section === "overview" && <OverviewSection key="overview" {...sectionProps} />}
                            {section === "experience" && <ExperienceSection key="experience" />}
                            {section === "projects" && <ProjectsSection key="projects" onOpenProject={openProject} />}
                            {section === "skills" && <SkillsSection key="skills" />}
                            {section === "achievements" && <AchievementsSection key="achievements" />}
                            {section === "journey" && <JourneySection key="journey" />}
                            {section === "contact" && <ContactSection key="contact" {...sectionProps} />}
                        </AnimatePresence>

                        <footer className="mt-14 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2 text-[12px] text-zinc-500">
                            <span>© {new Date().getFullYear()} {profile.name} · Built with React, Three.js & a lot of light.</span>
                            <button onClick={signOut} className="hover:text-amber-300">Turn the lamp off ↩</button>
                        </footer>
                    </div>
                </motion.main>
            </div>

            <AnimatePresence>
                {selectedProject && (
                    <ProjectModal
                        key="project"
                        project={selectedProject}
                        onClose={() => setSelectedProject(null)}
                        onShowCode={(s) => {
                            setSelectedProject(null);
                            setSnippet(s);
                        }}
                    />
                )}
                {snippet && <CodeModal key="code" snippet={snippet} onClose={() => setSnippet(null)} onToast={showToast} />}
                {resumeOpen && <ResumeModal key="resume" onClose={() => setResumeOpen(false)} onToast={showToast} />}
            </AnimatePresence>

            <AnimatePresence>
                {toast && (
                    <div className="fixed inset-x-0 bottom-6 z-[400] flex justify-center px-4 pointer-events-none">
                        <motion.div
                            role="status"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900/95 border border-amber-400/40 text-sm text-amber-100 shadow-xl backdrop-blur"
                        >
                            <CheckCircle2 size={15} className="text-amber-400" /> {toast}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
