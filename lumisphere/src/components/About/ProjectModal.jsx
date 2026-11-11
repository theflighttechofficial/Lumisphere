import { Check, Code2, Copy, ExternalLink, Info, PlayCircle, PenLine } from "lucide-react";
import { useState } from "react";
import { codeSnippets, projectStatus } from "../../data/profile";
import { AudioEngine } from "../../utils/AudioEngine";
import { GithubIcon } from "./BrandIcons";
import Modal from "./Modal";
import { Badge, Chip } from "./ui";

const linkBtn = "flex-1 sm:flex-none whitespace-nowrap inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition";

export function ProjectModal({ project, onClose, onShowCode }) {
    const status = projectStatus[project.status];
    const { live, repo, video, article, extra } = project.links || {};

    return (
        <Modal
            onClose={onClose}
            title={project.title}
            footer={
                <div className="flex flex-wrap gap-2 justify-end">
                    {project.snippet && codeSnippets[project.snippet] && (
                        <button onClick={() => onShowCode(codeSnippets[project.snippet])} className={`${linkBtn} sm:mr-auto border border-white/15 bg-white/5 text-white hover:bg-white/10`}>
                            <Code2 size={15} className="text-amber-300" /> How it works
                        </button>
                    )}
                    {extra && (
                        <a href={extra.url} target="_blank" rel="noopener noreferrer" className={`${linkBtn} border border-white/15 bg-white/5 text-white hover:bg-white/10`}>
                            {extra.label} <ExternalLink size={13} />
                        </a>
                    )}
                    {article && (
                        <a href={article} target="_blank" rel="noopener noreferrer" className={`${linkBtn} border border-white/15 bg-white/5 text-white hover:bg-white/10`}>
                            <PenLine size={15} /> Write-up
                        </a>
                    )}
                    {video && (
                        <a href={video} target="_blank" rel="noopener noreferrer" className={`${linkBtn} border border-white/15 bg-white/5 text-white hover:bg-white/10`}>
                            <PlayCircle size={15} /> Demo video
                        </a>
                    )}
                    {repo && (
                        <a href={repo} target="_blank" rel="noopener noreferrer" onClick={() => AudioEngine.playUISelect()} className={`${linkBtn} border border-white/15 bg-white/5 text-white hover:bg-white/10`}>
                            <GithubIcon size={15} /> Code
                        </a>
                    )}
                    {live && (
                        <a href={live} target="_blank" rel="noopener noreferrer" onClick={() => AudioEngine.playUISelect()} className={`${linkBtn} bg-gradient-to-r from-amber-400 to-yellow-300 text-zinc-950 hover:brightness-110`}>
                            Visit live <ExternalLink size={14} />
                        </a>
                    )}
                </div>
            }
        >
            <div className="pr-10">
                <div className="flex flex-wrap items-center gap-2">
                    <Badge tone={status.tone} dot>{status.label}</Badge>
                    <span className="font-mono text-[12px] text-zinc-500">{project.year}</span>
                </div>
                <h2 className="mt-3 text-2xl sm:text-[28px] font-bold tracking-tight text-white">{project.title}</h2>
                <p className="mt-1 text-[15px] text-amber-200/90">{project.tagline}</p>
            </div>

            {project.metrics?.length > 0 && (
                <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {project.metrics.map((m) => (
                        <div key={m} className="px-3 py-2.5 rounded-xl bg-amber-400/[0.07] border border-amber-400/20 text-[13px] font-semibold text-amber-100">{m}</div>
                    ))}
                </div>
            )}

            <p className="mt-5 text-[15px] text-zinc-300 leading-relaxed">{project.description}</p>

            {project.highlights?.length > 0 && (
                <ul className="mt-5 space-y-2.5">
                    {project.highlights.map((h) => (
                        <li key={h} className="flex gap-2.5 text-sm text-zinc-300 leading-relaxed">
                            <Check size={16} className="text-emerald-400 shrink-0 mt-0.5" /> {h}
                        </li>
                    ))}
                </ul>
            )}

            <div className="mt-6">
                <p className="text-[12px] font-mono uppercase tracking-wider text-zinc-500 mb-2">Built with</p>
                <div className="flex flex-wrap gap-1.5">{project.stack.map((s) => <Chip key={s}>{s}</Chip>)}</div>
            </div>

            {project.note && (
                <p className="mt-5 flex gap-2 text-[13px] text-zinc-400 rounded-xl border border-white/10 bg-white/[0.03] p-3">
                    <Info size={15} className="shrink-0 mt-0.5 text-zinc-500" /> {project.note}
                </p>
            )}
        </Modal>
    );
}

export function CodeModal({ snippet, onClose, onToast }) {
    const [copied, setCopied] = useState(false);
    const copy = async () => {
        try {
            await navigator.clipboard.writeText(snippet.code);
            setCopied(true);
            onToast("Snippet copied");
            setTimeout(() => setCopied(false), 1800);
        } catch {
            /* clipboard blocked — nothing to do */
        }
    };

    return (
        <Modal
            onClose={onClose}
            title={snippet.title}
            maxWidth="max-w-3xl"
            z="z-[310]"
            footer={
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <p className="text-[12px] text-zinc-500">Simplified sketch of the approach — not the production source.</p>
                    <button onClick={copy} className={`${linkBtn} bg-amber-400 text-zinc-950 hover:bg-amber-300`}>
                        {copied ? <Check size={15} /> : <Copy size={15} />} {copied ? "Copied" : "Copy"}
                    </button>
                </div>
            }
        >
            <div className="pr-10">
                <p className="font-mono text-[12px] text-amber-300">{snippet.lang}</p>
                <h2 className="mt-1 text-xl font-bold text-white">{snippet.title}</h2>
            </div>
            <pre className="mt-4 p-4 rounded-2xl bg-black/70 border border-white/10 overflow-x-auto text-[12.5px] leading-relaxed text-zinc-200 font-mono select-text">
                <code>{snippet.code}</code>
            </pre>
        </Modal>
    );
}
