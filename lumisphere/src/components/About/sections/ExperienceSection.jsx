import { motion } from "framer-motion";
import { BadgeCheck, Building2, ExternalLink, GraduationCap, MapPin, Users } from "lucide-react";
import { experience, education, leadership } from "../../../data/profile";
import { Card, Chip, MotionItem, MotionList, SectionHeading } from "../ui";
import { sectionMotion } from "../motion";

export default function ExperienceSection() {
    return (
        <motion.div {...sectionMotion} className="space-y-10">
            <div>
                <SectionHeading eyebrow="Experience" title="Where I've shipped" description="Two internships, both ending with something in production." />
                <MotionList className="relative space-y-4 sm:pl-6">
                    <div className="hidden sm:block absolute left-[7px] top-3 bottom-3 w-px bg-gradient-to-b from-amber-400/60 via-white/10 to-transparent" />
                    {experience.map((job) => (
                        <MotionItem key={job.id} className="relative">
                            <span className="hidden sm:block absolute -left-6 top-6 w-[15px] h-[15px] rounded-full border-2 border-amber-400 bg-zinc-950 shadow-[0_0_12px_rgba(251,191,36,0.5)]" />
                            <Card className="p-5 sm:p-6">
                                <div className="flex flex-col md:flex-row md:items-start justify-between gap-2 md:gap-4">
                                    <div className="min-w-0">
                                        <h3 className="text-lg font-semibold text-white">{job.role}</h3>
                                        <p className="mt-0.5 flex items-center gap-1.5 text-sm font-medium text-amber-300">
                                            <Building2 size={14} className="shrink-0" /> {job.company}
                                        </p>
                                    </div>
                                    <div className="flex flex-wrap md:flex-col md:items-end gap-x-3 gap-y-1 text-[13px] text-zinc-400 shrink-0">
                                        <span className="font-mono text-zinc-200">{job.period}</span>
                                        <span className="flex items-center gap-1"><MapPin size={12} /> {job.location}</span>
                                    </div>
                                </div>

                                <p className="mt-3 text-[15px] text-zinc-300 leading-relaxed">{job.summary}</p>

                                <div className="mt-4 grid grid-cols-2 lg:grid-cols-4 gap-2">
                                    {job.metrics.map((m) => (
                                        <div key={m} className="px-3 py-2 rounded-xl bg-amber-400/[0.06] border border-amber-400/15 text-[13px] font-semibold text-amber-100">{m}</div>
                                    ))}
                                </div>

                                <ul className="mt-4 space-y-2.5">
                                    {job.points.map((pt) => (
                                        <li key={pt} className="flex gap-2.5 text-sm text-zinc-300 leading-relaxed">
                                            <span className="mt-2 w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                                            <span>{pt}</span>
                                        </li>
                                    ))}
                                </ul>

                                <div className="mt-4 flex flex-wrap gap-1.5">
                                    {job.stack.map((s) => <Chip key={s}>{s}</Chip>)}
                                </div>

                                {(job.credential || job.link) && (
                                    <div className="mt-4 pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[13px]">
                                        {job.credential && (
                                            <p className="flex gap-2 text-zinc-400"><BadgeCheck size={15} className="text-emerald-400 shrink-0 mt-0.5" /> {job.credential}</p>
                                        )}
                                        {job.link && (
                                            <a href={job.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-amber-300 hover:text-amber-200 font-semibold shrink-0">
                                                View the site code <ExternalLink size={13} />
                                            </a>
                                        )}
                                    </div>
                                )}
                            </Card>
                        </MotionItem>
                    ))}
                </MotionList>
            </div>

            <div className="grid lg:grid-cols-2 gap-4">
                <Card className="p-5 sm:p-6">
                    <h3 className="flex items-center gap-2 text-[15px] font-semibold text-white"><GraduationCap size={17} className="text-amber-300" /> Education</h3>
                    <p className="mt-3 text-[15px] font-medium text-zinc-100">{education.degree}</p>
                    <p className="text-sm text-zinc-400">{education.school} · {education.period}</p>
                    <div className="mt-4 flex items-center gap-4">
                        <div>
                            <div className="text-3xl font-bold text-white">{education.cgpa}<span className="text-base text-zinc-500 font-medium"> / 10</span></div>
                            <div className="text-[13px] text-emerald-400">{education.cgpaNote}</div>
                        </div>
                    </div>
                    <p className="mt-4 text-[12px] font-mono uppercase tracking-wider text-zinc-500">{education.honoursLabel}</p>
                    <div className="mt-2 flex flex-wrap gap-1.5">{education.honours.map((h) => <Chip key={h} highlight>{h}</Chip>)}</div>
                </Card>
                <Card className="p-5 sm:p-6">
                    <h3 className="flex items-center gap-2 text-[15px] font-semibold text-white"><Users size={17} className="text-amber-300" /> Leadership</h3>
                    <ul className="mt-3 space-y-4">
                        {leadership.map((l) => (
                            <li key={l.title}>
                                <div className="text-[15px] font-medium text-zinc-100">{l.title}</div>
                                <p className="text-sm text-zinc-400 leading-relaxed">{l.detail}</p>
                            </li>
                        ))}
                    </ul>
                </Card>
            </div>
        </motion.div>
    );
}
