import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useLight } from "../../context/LightContext";
import { AudioEngine } from "../../utils/AudioEngine";

function DecryptingText({ text, isLoading }) {
    const [displayText, setDisplayText] = useState(text);
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*";

    useEffect(() => {
        if (!isLoading) {
            setDisplayText(text);
            return;
        }

        let iteration = 0;
        const targetText = "DECRYPTING PORTAL...";
        const interval = setInterval(() => {
            setDisplayText(() => {
                return targetText
                    .split("")
                    .map((char, index) => {
                        if (index < iteration) {
                            return targetText[index];
                        }
                        if (char === " ") return " ";
                        return chars[Math.floor(Math.random() * chars.length)];
                    })
                    .join("");
            });

            if (iteration >= targetText.length) {
                clearInterval(interval);
            }
            iteration += 1 / 3;
        }, 25);

        return () => clearInterval(interval);
    }, [isLoading, text]);

    return <span>{displayText}</span>;
}

export default function PremiumButton({
    isLoading,
    onClick,
    text = "Sign In"
}) {
    const { isLightOn } = useLight();

    return (
        <motion.button
            onClick={onClick}
            disabled={isLoading}
            onMouseEnter={() => !isLoading && AudioEngine.playUIHover()}
            whileHover={isLoading ? {} : {
                scale: 1.02,
                y: -2,
            }}
            whileTap={isLoading ? {} : {
                scale: 0.98,
                y: 2,
            }}
            className={`
                group
                relative
                w-full
                overflow-hidden
                rounded-2xl
                py-4
                text-white
                font-semibold
                tracking-wide
                ${isLoading ? "cursor-not-allowed opacity-90" : "cursor-pointer"}
            `}
        >
            {/* Amber Bloom */}
            <motion.div
                animate={{
                    opacity: isLightOn ? 0.45 : 0.12,
                    scale: isLightOn ? 1 : 0.9,
                }}
                transition={{
                    duration: 1,
                }}
                className="
                    absolute
                    -inset-3
                    rounded-[28px]
                    bg-amber-500/30
                    blur-2xl
                    pointer-events-none
                "
            />

            {/* Main Body */}
            <motion.div
                animate={{
                    backgroundPosition: [
                        "0% 50%",
                        "100% 50%",
                        "0% 50%",
                    ],
                }}
                transition={{
                    repeat: Infinity,
                    duration: 10,
                    ease: "linear",
                }}
                className="
                    absolute
                    inset-0
                    rounded-2xl
                    bg-[linear-gradient(120deg,#b45309,#d97706,#f59e0b,#d97706,#b45309)]
                    bg-[length:250%_250%]
                "
            />

            {/* Glass Overlay */}
            <div
                className="
                    absolute
                    inset-0
                    rounded-2xl
                    bg-gradient-to-b
                    from-white/20
                    via-white/5
                    to-black/10
                    pointer-events-none
                "
            />

            {/* Top Highlight */}
            <div
                className="
                    absolute
                    top-[1px]
                    left-4
                    right-4
                    h-px
                    rounded-full
                    bg-white/70
                    pointer-events-none
                "
            />

            {/* Inner Shadow */}
            <div
                className="
                    absolute
                    inset-0
                    rounded-2xl
                    pointer-events-none
                "
                style={{
                    boxShadow: `
                        inset 0 1px rgba(255,255,255,.22),
                        inset 0 -8px 12px rgba(0,0,0,.18)
                    `,
                }}
            />

            {/* Outer Border */}
            <div
                className="
                    absolute
                    inset-0
                    rounded-2xl
                    border
                    border-white/15
                    pointer-events-none
                "
            />

            {/* First Shine */}
            <motion.div
                animate={{
                    x: ["-180%", "220%"],
                }}
                transition={{
                    repeat: Infinity,
                    duration: 3.5,
                    ease: "linear",
                }}
                className="
                    absolute
                    inset-y-0
                    w-24
                    -skew-x-12
                    bg-white/25
                    blur-lg
                "
            />

            {/* Second Shine */}
            <motion.div
                animate={{
                    x: ["220%", "-180%"],
                    opacity: [0, 0.15, 0],
                }}
                transition={{
                    repeat: Infinity,
                    duration: 8,
                    ease: "linear",
                }}
                className="
                    absolute
                    inset-y-0
                    w-36
                    -skew-x-12
                    bg-amber-100/15
                    blur-xl
                "
            />

            {/* Laser scanning bar during loading */}
            {isLoading && (
                <motion.div
                    animate={{
                        y: ["-100%", "200%"],
                        opacity: [0, 1, 0]
                    }}
                    transition={{
                        repeat: Infinity,
                        duration: 1.5,
                        ease: "easeInOut"
                    }}
                    className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_8px_#22d3ee] z-20 pointer-events-none"
                />
            )}

            {/* Content */}
            <div
                className="
                    relative
                    z-10
                    flex
                    items-center
                    justify-center
                    gap-2
                "
            >
                {isLoading ? (
                    <div className="flex items-center gap-3">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                            className="w-4.5 h-4.5 rounded-full border-[2px] border-cyan-400/20 border-t-cyan-400"
                        />
                        <span className="text-cyan-300 text-[11px] font-bold tracking-[0.15em] uppercase font-mono">
                            <DecryptingText text="Verifying..." isLoading={isLoading} />
                        </span>
                    </div>
                ) : (
                    <>
                        <span className="drop-shadow-lg">
                            {text}
                        </span>

                        <motion.div
                            className="group-hover:translate-x-1 transition-transform"
                            animate={{
                                x: [0, 2, 0],
                            }}
                            transition={{
                                repeat: Infinity,
                                duration: 2,
                            }}
                        >
                            <ArrowRight size={18} />
                        </motion.div>
                    </>
                )}
            </div>
        </motion.button>
    );
}