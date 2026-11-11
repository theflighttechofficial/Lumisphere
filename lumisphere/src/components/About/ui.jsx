import { motion } from "framer-motion";
import { listMotion } from "./motion";

const tones = {
    emerald: "text-emerald-300 bg-emerald-400/10 border-emerald-400/30",
    amber: "text-amber-300 bg-amber-400/10 border-amber-400/30",
    sky: "text-sky-300 bg-sky-400/10 border-sky-400/30",
    violet: "text-violet-300 bg-violet-400/10 border-violet-400/30",
    zinc: "text-zinc-300 bg-white/5 border-white/15",
};

export function Badge({ tone = "zinc", children, dot = false, className = "" }) {
    return (
        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[11px] font-semibold whitespace-nowrap ${tones[tone]} ${className}`}>
            {dot && <span className="w-1.5 h-1.5 rounded-full bg-current" />}
            {children}
        </span>
    );
}

export function Chip({ children, highlight = false }) {
    return (
        <span
            className={`inline-flex items-center px-2 py-1 rounded-md border font-mono text-[11px] leading-none ${
                highlight ? "border-amber-400/40 bg-amber-400/10 text-amber-200" : "border-white/10 bg-white/[0.04] text-zinc-300"
            }`}
        >
            {children}
        </span>
    );
}

export function SectionHeading({ eyebrow, title, description, action }) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-5">
            <div className="min-w-0">
                {eyebrow && <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-amber-400/90 mb-1.5">{eyebrow}</p>}
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white text-balance">{title}</h2>
                {description && <p className="mt-1.5 text-sm text-zinc-400 max-w-2xl leading-relaxed">{description}</p>}
            </div>
            {action}
        </div>
    );
}

export function Card({ children, className = "", as: As = "div", ...rest }) {
    return (
        <As className={`rounded-2xl border border-white/10 bg-white/[0.025] ${className}`} {...rest}>
            {children}
        </As>
    );
}

export function MotionList({ className = "", children }) {
    return (
        <motion.div variants={listMotion.container} initial="hidden" animate="visible" className={className}>
            {children}
        </motion.div>
    );
}

export function MotionItem({ className = "", children, ...rest }) {
    return (
        <motion.div variants={listMotion.item} className={className} {...rest}>
            {children}
        </motion.div>
    );
}
