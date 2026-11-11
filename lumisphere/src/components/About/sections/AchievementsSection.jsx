import { motion } from "framer-motion";
import { Award, BookOpenText, ExternalLink, FlaskConical, Medal, PenLine, Trophy } from "lucide-react";
import { achievements, certifications, research, writing } from "../../../data/profile";
import { Card, MotionItem, MotionList, SectionHeading } from "../ui";
import { sectionMotion } from "../motion";

const kindIcon = { hackathon: Trophy, research: FlaskConical, data: Medal };

export default function AchievementsSection() {
    return (
        <motion.div {...sectionMotion} className="space-y-10">
            <div>
                <SectionHeading eyebrow="Recognition" title="Hackathons, research & competitions" />
                <MotionList className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3">
                    {achievements.map((a) => {
                        const Icon = kindIcon[a.kind] || Trophy;
                        return (
                            <MotionItem key={a.title}>
                                <Card className="h-full p-5">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="w-9 h-9 rounded-xl bg-amber-400/10 border border-amber-400/25 flex items-center justify-center shrink-0">
                                            <Icon size={17} className="text-amber-300" />
                                        </div>
                                        <span className="font-mono text-[12px] text-zinc-500">{a.date}</span>
                                    </div>
                                    <h3 className="mt-3 text-[15px] font-semibold text-white">{a.title}</h3>
                                    <p className="text-[13px] text-amber-300/90">{a.org}</p>
                                    <p className="mt-2 text-sm text-zinc-400 leading-relaxed">{a.detail}</p>
                                </Card>
                            </MotionItem>
                        );
                    })}
                </MotionList>
            </div>

            <div className="grid lg:grid-cols-2 gap-4">
                <Card className="p-5 sm:p-6">
                    <h3 className="flex items-center gap-2 text-[15px] font-semibold text-white"><BookOpenText size={17} className="text-violet-300" /> Research</h3>
                    {research.map((r) => (
                        <a key={r.title} href={r.link} target="_blank" rel="noopener noreferrer" className="group block mt-3">
                            <div className="text-[15px] font-medium text-zinc-100 group-hover:text-amber-200 flex items-start gap-1.5">
                                {r.title} <ExternalLink size={13} className="mt-1 shrink-0 opacity-60" />
                            </div>
                            <p className="text-[13px] text-violet-300">{r.venue}</p>
                            <p className="mt-1.5 text-sm text-zinc-400 leading-relaxed">{r.detail}</p>
                        </a>
                    ))}
                </Card>
                <Card className="p-5 sm:p-6">
                    <h3 className="flex items-center gap-2 text-[15px] font-semibold text-white"><PenLine size={17} className="text-sky-300" /> Writing</h3>
                    {writing.map((w) => (
                        <a key={w.title} href={w.url} target="_blank" rel="noopener noreferrer" className="group block mt-3">
                            <div className="text-[15px] font-medium text-zinc-100 group-hover:text-amber-200 flex items-start gap-1.5">
                                {w.title} <ExternalLink size={13} className="mt-1 shrink-0 opacity-60" />
                            </div>
                            <p className="text-[13px] text-sky-300">{w.venue} · {w.note}</p>
                        </a>
                    ))}
                </Card>
            </div>

            <div>
                <SectionHeading eyebrow="Credentials" title={`${certifications.length} certifications`} />
                <MotionList className="grid sm:grid-cols-2 gap-2.5">
                    {certifications.map((c) => (
                        <MotionItem key={c.title}>
                            <Card className="h-full p-4 flex gap-3.5">
                                <Award size={18} className="text-emerald-400 shrink-0 mt-0.5" />
                                <div className="min-w-0">
                                    <div className="text-sm font-semibold text-zinc-100 leading-snug">{c.title}</div>
                                    <div className="mt-0.5 text-[13px] text-zinc-400">{c.issuer} · <span className="font-mono">{c.date}</span></div>
                                </div>
                            </Card>
                        </MotionItem>
                    ))}
                </MotionList>
            </div>
        </motion.div>
    );
}
