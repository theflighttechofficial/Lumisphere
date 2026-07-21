import { useState } from "react";
import { motion, useMotionValue, useSpring, useTransform, animate } from "framer-motion";
import { AudioEngine } from "../../utils/AudioEngine";

export default function PullChain({
    isLightOn,
    toggleLight,
}) {
    const [isPulling, setIsPulling] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    // Draggable y value
    const dragY = useMotionValue(0);
    // Spring physics to make the motion extremely organic and bouncy
    const springY = useSpring(dragY, {
        stiffness: 450,
        damping: 15,
    });

    // Map the vertical stretch of the bead chain
    const chainHeight = useTransform(springY, [0, 80], [42, 110]);

    return (
        <motion.div
            animate={{
                rotate: isPulling ? 0 : [-1.5, 1.5, -1.5],
            }}
            transition={{
                rotate: {
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut",
                }
            }}
            style={{
                left: "calc(50% + 28px)",
                transformOrigin: "top center",
            }}
            className="
                absolute
                top-[68px]
                -translate-x-1/2
                z-50
                flex
                flex-col
                items-center
                select-none
                pointer-events-auto
            "
        >
            {/* ================= Brass Socket Grommet ================= */}
            <div className="w-3 h-2 bg-gradient-to-r from-amber-600 via-amber-300 to-amber-700 rounded-sm border border-amber-800 shadow-[0_1px_2px_rgba(0,0,0,0.3)] z-25" />

            {/* ================= Ball Bead Chain ================= */}
            <motion.div
                style={{
                    height: chainHeight,
                }}
                className="relative w-2 flex flex-col items-center z-20"
            >
                {/* Repeating Bead Pattern */}
                <div
                    className="w-[8px] h-full"
                    style={{
                        backgroundImage: "radial-gradient(circle, #ffffff 1.5px, #a1a1aa 2.5px, #3f3f46 4px, transparent 4.5px)",
                        backgroundSize: "8px 8px",
                        backgroundRepeat: "repeat-y",
                        backgroundPosition: "center",
                    }}
                />
            </motion.div>

            {/* ================= Pull Ball (Interactive Draggable Handle) ================= */}
            <motion.div
                drag="y"
                dragConstraints={{ top: 0, bottom: 80 }}
                dragElastic={{ top: 0.05, bottom: 0.15 }}
                dragMomentum={false}
                style={{
                    y: dragY,
                    background: "radial-gradient(circle at 35% 35%, #ffffff 0%, #e4e4e7 15%, #a1a1aa 45%, #3f3f46 75%, #18181b 100%)",
                    border: "1px solid rgba(255, 255, 255, 0.4)",
                }}
                onDragStart={() => {
                    setIsPulling(true);
                    AudioEngine.playChainPull();
                }}
                onDragEnd={(e, info) => {
                    setIsPulling(false);
                    AudioEngine.playChainRelease();
                    
                    // If pulled down past the threshold, toggle light
                    if (info.offset.y > 45) {
                        toggleLight();
                    }
                    
                    // Spring back to 0
                    animate(dragY, 0, {
                        type: "spring",
                        stiffness: 700,
                        damping: 17,
                    });
                }}
                onMouseEnter={() => {
                    setIsHovered(true);
                    AudioEngine.playUIHover();
                }}
                onMouseLeave={() => {
                    setIsHovered(false);
                }}
                whileHover={{
                    scale: 1.15,
                }}
                animate={{
                    boxShadow: isLightOn
                        ? "0 0 25px rgba(253,224,71,0.6), inset -2px -2px 6px rgba(0,0,0,0.7), inset 2px 2px 6px rgba(255,255,255,0.9), 0 6px 12px rgba(0,0,0,0.5)"
                        : "inset -2px -2px 6px rgba(0,0,0,0.7), inset 2px 2px 6px rgba(255,255,255,0.9), 0 6px 12px rgba(0,0,0,0.4)",
                }}
                className="
                    relative
                    -mt-[3px]
                    w-6
                    h-6
                    rounded-full
                    z-50
                    cursor-grab
                    active:cursor-grabbing
                "
            >
                {/* Hitbox Extension for larger touch/drag target */}
                <div className="absolute -inset-4 rounded-full bg-transparent" />

                {/* Polish Reflection Shine */}
                <div
                    className="
                        absolute
                        top-1
                        left-1
                        w-2
                        h-2
                        rounded-full
                        bg-gradient-to-br
                        from-white
                        to-transparent
                        opacity-80
                        blur-[0.5px]
                    "
                />

                {/* Hover Glow Ring indicator */}
                {isHovered && (
                    <motion.div
                        layoutId="pull-chain-glow"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1.3 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="absolute inset-0 border border-violet-400/40 rounded-full blur-[2px] pointer-events-none"
                    />
                )}
            </motion.div>
        </motion.div>
    );
}