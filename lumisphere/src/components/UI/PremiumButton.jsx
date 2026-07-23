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
        const targetText = "CONNECTING GATEWAY...";
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
                bg-black
                text-red-400
                font-black
                tracking-widest
                uppercase
                border
                border-zinc-800
                hover:border-red-500/40
                shadow-xl
                ${isLoading ? "cursor-not-allowed opacity-90" : "cursor-pointer"}
            `}
        >
            {/* Content */}
            <div
                className="
                    relative
                    z-10
                    flex
                    items-center
                    justify-center
                    gap-2
                    text-red-400
                    font-black
                "
            >
                {isLoading ? (
                    <div className="flex items-center gap-3">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                            className="w-4.5 h-4.5 rounded-full border-[2px] border-red-500/20 border-t-red-500"
                        />
                        <span className="text-red-400 text-[11px] font-extrabold tracking-[0.15em] uppercase font-mono">
                            <DecryptingText text="Verifying..." isLoading={isLoading} />
                        </span>
                    </div>
                ) : (
                    <>
                        <span className="text-red-400 font-black">
                            {text}
                        </span>

                        <motion.div
                            className="group-hover:translate-x-1 transition-transform text-red-400"
                            animate={{
                                x: [0, 2, 0],
                            }}
                            transition={{
                                repeat: Infinity,
                                duration: 2,
                            }}
                        >
                            <ArrowRight size={18} className="text-red-400" />
                        </motion.div>
                    </>
                )}
            </div>
        </motion.button>
    );
}