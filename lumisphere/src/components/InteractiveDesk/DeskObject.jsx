import React from "react";
import { motion } from "framer-motion";
import { AudioEngine } from "../../utils/AudioEngine";

export default function DeskObject({
    id,
    label,
    subtitle,
    shortcut,
    icon: Icon,
    isActive = false,
    badgeText,
    onClick,
    onHover,
    children,
    className = "",
    glowColor = "rgba(56, 189, 248, 0.4)",
}) {
    const handleMouseEnter = () => {
        AudioEngine.playUIHover();
        if (onHover) onHover(id);
    };

    return (
        <motion.div
            layoutId={`desk-item-${id}`}
            whileHover={{
                scale: 1.07,
                y: -6,
                rotateX: 4,
                rotateY: -4,
                transition: { duration: 0.22, ease: "easeOut" }
            }}
            whileTap={{ scale: 0.94, y: 1 }}
            onMouseEnter={handleMouseEnter}
            onClick={(e) => {
                e.stopPropagation();
                AudioEngine.playUISelect();
                if (onClick) onClick(id);
            }}
            className={`
                group relative cursor-pointer select-none rounded-xl p-3
                transition-all duration-300 backdrop-blur-sm
                bg-neutral-900/60 border border-neutral-800/80
                hover:border-amber-400/50 hover:bg-neutral-800/80
                hover:shadow-[0_0_25px_${glowColor}]
                flex flex-col items-center justify-center
                ${isActive ? "ring-2 ring-amber-400 border-amber-400/80 shadow-[0_0_30px_rgba(251,191,36,0.35)]" : ""}
                ${className}
            `}
        >
            {/* Active / Badge tag */}
            {badgeText && (
                <div className="absolute -top-2.5 right-2 px-1.5 py-0.5 rounded-md text-[10px] font-mono font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm animate-pulse z-30">
                    {badgeText}
                </div>
            )}

            {/* Rendered Custom Children Graphic or Default Icon */}
            <div className="relative z-10 flex items-center justify-center">
                {children ? (
                    children
                ) : (
                    <Icon className="w-7 h-7 text-amber-400 group-hover:text-amber-300 group-hover:scale-110 transition-transform duration-300" />
                )}
            </div>

            {/* Desk Object Label */}
            <div className="mt-2 text-center z-10">
                <div className="text-xs font-semibold font-mono tracking-wide text-neutral-200 group-hover:text-amber-300 transition-colors flex items-center justify-center gap-1">
                    {label}
                </div>
                {subtitle && (
                    <div className="text-[10px] font-mono text-neutral-400 group-hover:text-neutral-300 line-clamp-1">
                        {subtitle}
                    </div>
                )}
            </div>

            {/* Hover Tooltip Overlay popping out to the right */}
            <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-50 flex items-center">
                <div className="w-2 h-2 bg-neutral-950 rotate-45 -mr-1 border-l border-b border-amber-500/30 z-10" />
                <div className="bg-neutral-950/95 text-amber-300 font-mono text-[11px] font-medium px-2.5 py-1.5 rounded-lg border border-amber-500/30 shadow-2xl whitespace-nowrap flex items-center gap-1.5">
                    <span>{label}</span>
                    {shortcut && (
                        <span className="text-[9px] px-1 py-0.2 bg-amber-500/20 text-amber-400 rounded border border-amber-500/30">
                            {shortcut}
                        </span>
                    )}
                </div>
            </div>

            {/* Subtle Hover Floor Glow Halo */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        </motion.div>
    );
}
