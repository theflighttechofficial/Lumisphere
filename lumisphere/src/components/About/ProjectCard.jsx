import { ArrowUpRight, ExternalLink, Lock } from "lucide-react";
import { projectStatus } from "../../data/profile";
import { AudioEngine } from "../../utils/AudioEngine";
import { GithubIcon } from "./BrandIcons";
import { Badge } from "./ui";

export default function ProjectCard({ project, onOpen }) {
    const status = projectStatus[project.status];
    const extraStack = project.stack.length - 4;

    return (
        <article
            role="button"
            tabIndex={0}
            onClick={() => {
                AudioEngine.playUISelect();
                onOpen(project);
            }}
            onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onOpen(project);
                }
            }}
            aria-label={`Open ${project.title} details`}
            className="group relative h-full flex flex-col p-5 rounded-2xl border border-white/10 bg-white/[0.025] hover:border-amber-400/40 hover:bg-white/[0.04] cursor-pointer transition-colors outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
        >
            <div className="flex items-center justify-between gap-2 mb-3">
                <Badge tone={status.tone} dot>{status.label}</Badge>
                <ArrowUpRight size={17} className="text-zinc-500 group-hover:text-amber-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
            </div>

            <h3 className="text-[16px] font-semibold text-white group-hover:text-amber-200 transition-colors">{project.title}</h3>
            <p className="mt-1.5 text-sm text-zinc-400 leading-relaxed line-clamp-2">{project.tagline}</p>

            {project.metrics?.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1">
                    {project.metrics.slice(0, 3).map((m) => (
                        <span key={m} className="text-[12px] font-mono text-amber-200/90">{m}</span>
                    ))}
                </div>
            )}

            <div className="mt-auto pt-4 flex items-end justify-between gap-3">
                <div className="flex flex-wrap gap-1.5 min-w-0">
                    {project.stack.slice(0, 4).map((t) => (
                        <span key={t} className="px-1.5 py-0.5 rounded border border-white/10 bg-white/[0.04] font-mono text-[11px] text-zinc-400">{t}</span>
                    ))}
                    {extraStack > 0 && <span className="px-1.5 py-0.5 font-mono text-[11px] text-zinc-500">+{extraStack}</span>}
                </div>
                <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                    {project.links?.live && (
                        <a href={project.links.live} target="_blank" rel="noopener noreferrer" aria-label={`${project.title} live site`} className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10">
                            <ExternalLink size={15} />
                        </a>
                    )}
                    {project.links?.repo ? (
                        <a href={project.links.repo} target="_blank" rel="noopener noreferrer" aria-label={`${project.title} on GitHub`} className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10">
                            <GithubIcon size={15} />
                        </a>
                    ) : (
                        <span className="p-1.5 text-zinc-600" title="Private repository"><Lock size={14} /></span>
                    )}
                </div>
            </div>
        </article>
    );
}
