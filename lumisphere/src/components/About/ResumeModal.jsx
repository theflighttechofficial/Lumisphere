import { useState } from "react";
import { createPortal } from "react-dom";
import { Copy, LayoutGrid, FileText, Printer } from "lucide-react";
import {
    profile, socials, education, experience, featuredProjects, skillGroups, certifications, achievements, plainTextResume,
} from "../../data/profile";
import { AudioEngine } from "../../utils/AudioEngine";
import Modal from "./Modal";
import ResumeRoom from "./ResumeRoom";

const btn = "inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition";

function H({ children }) {
    return <h3 className="mt-6 mb-2.5 pb-1.5 border-b border-white/10 print:border-black/30 text-[12px] font-mono font-bold uppercase tracking-[0.18em] text-amber-300 print:text-black">{children}</h3>;
}

function ClassicResume() {
    const links = socials.filter((s) => ["github", "linkedin", "kaggle", "hashnode"].includes(s.id));
    return (
        <article className="text-zinc-300 print:text-black text-[14px] leading-relaxed">
            <header>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white print:text-black">{profile.name}</h2>
                <p className="mt-0.5 text-[15px] font-medium text-amber-200 print:text-black">{profile.role}</p>
                <p className="mt-2 text-[13px] text-zinc-400 print:text-black flex flex-wrap gap-x-3 gap-y-1">
                    <a href={`mailto:${profile.email}`} className="hover:text-white">{profile.email}</a>
                    <span>{profile.location}</span>
                    {links.map((l) => (
                        <a key={l.id} href={l.url} target="_blank" rel="noopener noreferrer" className="hover:text-white">{l.url.replace(/^https?:\/\/(www\.)?/, "")}</a>
                    ))}
                </p>
            </header>

            <H>Summary</H>
            <p>{profile.summary}</p>

            <H>Experience</H>
            <div className="space-y-4">
                {experience.map((e) => (
                    <div key={e.id}>
                        <div className="flex flex-col sm:flex-row sm:justify-between gap-0.5">
                            <p className="font-semibold text-white print:text-black">{e.role} · {e.company}</p>
                            <p className="font-mono text-[12px] text-zinc-400 print:text-black shrink-0">{e.period} · {e.location}</p>
                        </div>
                        <ul className="mt-1.5 space-y-1 list-disc pl-5 marker:text-amber-400">
                            {e.points.map((p) => <li key={p}>{p}</li>)}
                        </ul>
                    </div>
                ))}
            </div>

            <H>Education</H>
            <div className="flex flex-col sm:flex-row sm:justify-between gap-0.5">
                <p><span className="font-semibold text-white print:text-black">{education.degree}</span> — {education.school}</p>
                <p className="font-mono text-[12px] text-zinc-400 print:text-black shrink-0">{education.period}</p>
            </div>
            <p className="text-[13px]">CGPA {education.cgpa}/10 · {education.honoursLabel}: {education.honours.join(", ")}</p>

            <H>Selected projects</H>
            <ul className="space-y-1.5">
                {featuredProjects.map((p) => (
                    <li key={p.id}>
                        <span className="font-semibold text-white print:text-black">{p.title}</span> — {p.tagline}{" "}
                        <span className="text-zinc-500 print:text-black text-[13px]">({p.metrics.join(" · ")})</span>
                    </li>
                ))}
            </ul>

            <H>Skills</H>
            <dl className="grid sm:grid-cols-[170px_1fr] gap-x-4 gap-y-1">
                {skillGroups.map((g) => (
                    <div key={g.id} className="contents">
                        <dt className="font-semibold text-white print:text-black">{g.label}</dt>
                        <dd className="mb-1.5 sm:mb-0">{g.items.join(", ")}</dd>
                    </div>
                ))}
            </dl>

            <H>Certifications</H>
            <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-1">
                {certifications.map((c) => <li key={c.title}>{c.title} — <span className="text-zinc-500 print:text-black">{c.issuer}, {c.date}</span></li>)}
            </ul>

            <H>Achievements</H>
            <ul className="space-y-1 list-disc pl-5 marker:text-amber-400">
                {achievements.map((a) => <li key={a.title}><span className="font-semibold text-white print:text-black">{a.title}:</span> {a.detail}</li>)}
            </ul>
        </article>
    );
}

export default function ResumeModal({ onClose, onToast }) {
    const [gallery, setGallery] = useState(false);

    const copy = async () => {
        AudioEngine.playUISelect();
        try {
            await navigator.clipboard.writeText(plainTextResume());
            onToast("Plain-text résumé copied");
        } catch {
            onToast("Clipboard is blocked in this browser");
        }
    };

    return (
        <Modal
            onClose={onClose}
            title="Résumé"
            maxWidth="max-w-4xl"
            footer={
                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={() => {
                            AudioEngine.playUISelect();
                            setGallery((g) => !g);
                        }}
                        className={`${btn} mr-auto border border-white/15 bg-white/5 text-white hover:bg-white/10`}
                    >
                        {gallery ? <FileText size={15} /> : <LayoutGrid size={15} />} {gallery ? "Document view" : "Gallery view"}
                    </button>
                    <button onClick={copy} className={`${btn} border border-white/15 bg-white/5 text-white hover:bg-white/10`}>
                        <Copy size={15} /> Copy text
                    </button>
                    <button
                        onClick={() => {
                            setGallery(false);
                            setTimeout(() => window.print(), 50);
                        }}
                        className={`${btn} bg-amber-400 text-zinc-950 hover:bg-amber-300`}
                    >
                        <Printer size={15} /> Save as PDF
                    </button>
                </div>
            }
        >
            <div className="pr-8 sm:pr-10">{gallery ? <ResumeRoom /> : <ClassicResume />}</div>
            {/* Print copy lives directly under <body>, outside the modal's transforms and scroll clipping */}
            {createPortal(
                <div id="print-root">
                    <ClassicResume />
                </div>,
                document.body
            )}
        </Modal>
    );
}
