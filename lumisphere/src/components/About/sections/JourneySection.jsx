import { motion } from "framer-motion";
import { journey, goals } from "../../../data/profile";
import { Card, MotionItem, MotionList, SectionHeading } from "../ui";
import { sectionMotion } from "../motion";

const dot = {
    done: "bg-amber-400 border-amber-400",
    now: "bg-emerald-400 border-emerald-400 shadow-[0_0_14px_rgba(52,211,153,0.8)]",
    next: "bg-zinc-950 border-zinc-500 border-dashed",
};

export default function JourneySection() {
    return (
        <motion.div {...sectionMotion}>
            <SectionHeading eyebrow="Journey" title="How I got here, and where I'm going" description={`${goals.shortTerm} Long term: ${goals.longTerm}`} />
            <MotionList className="relative pl-7">
                <div className="absolute left-[7px] top-2 bottom-2 w-px bg-gradient-to-b from-amber-400/70 via-emerald-400/40 to-white/5" />
                {journey.map((step) => (
                    <MotionItem key={step.title} className="relative pb-5 last:pb-0">
                        <span className={`absolute -left-7 top-4 w-[15px] h-[15px] rounded-full border-2 ${dot[step.status]}`} />
                        <Card className={`p-4 sm:p-5 ${step.status === "now" ? "border-emerald-400/30 bg-emerald-400/[0.04]" : step.status === "next" ? "border-dashed bg-transparent" : ""}`}>
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                                <span className={`font-mono text-[12px] ${step.status === "now" ? "text-emerald-300" : step.status === "next" ? "text-zinc-500" : "text-amber-300"}`}>{step.date}</span>
                                {step.status === "now" && <span className="text-[11px] font-semibold text-emerald-300 uppercase tracking-wider">● In progress</span>}
                                {step.status === "next" && <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">Planned</span>}
                            </div>
                            <h3 className={`mt-1 text-[15px] font-semibold ${step.status === "next" ? "text-zinc-300" : "text-white"}`}>{step.title}</h3>
                            <p className="mt-0.5 text-sm text-zinc-400 leading-relaxed">{step.detail}</p>
                        </Card>
                    </MotionItem>
                ))}
            </MotionList>
        </motion.div>
    );
}
