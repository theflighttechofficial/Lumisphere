import { motion } from "framer-motion";
import { useLight } from "../../context/LightContext";

export default function BulbGlow({
    isLightOn,
    warmingUp,
}) {
    const { lampIntensity } = useLight();
    const dimFactor = lampIntensity / 100;

    const glowAnimation = warmingUp
        ? {
            opacity: [0.05 * dimFactor, 0.6 * dimFactor, 0.15 * dimFactor, 0.75 * dimFactor, 0.25 * dimFactor, 0.8 * dimFactor],
            scale: [0.6, 1.05, 0.7, 1.1, 0.85, 1],
        }
        : isLightOn
        ? {
            opacity: 0.65 * dimFactor,
            scale: 1,
        }
        : {
            opacity: [0.02, 0.18, 0.04, 0.24, 0.05, 0.20, 0.02],
            scale: [0.75, 0.90, 0.78, 0.94, 0.80, 0.88, 0.75],
        };

    const glowTransition = warmingUp
        ? {
            duration: 0.45,
            times: [0, 0.2, 0.4, 0.6, 0.8, 1],
            ease: "linear",
        }
        : isLightOn
        ? {
            duration: 0.6,
        }
        : {
            duration: 2.6,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "easeInOut",
        };

    return (
        <>

            {/* ================= Filament Glow ================= */}

            <motion.div
                animate={glowAnimation}
                transition={glowTransition}
                className="
                    absolute
                    left-1/2
                    top-[70px]
                    -translate-x-1/2
                    w-16
                    h-16
                    rounded-full
                    bg-yellow-400/95
                    shadow-[0_0_20px_#fbbf24]
                    blur-xl
                    pointer-events-none
                "
            />

            {/* ================= Inner Bloom ================= */}

            <motion.div
                animate={glowAnimation}
                transition={{
                    ...glowTransition,
                    duration: isLightOn ? 0.8 : 0.2,
                }}
                className="
                    absolute
                    left-1/2
                    top-[66px]
                    -translate-x-1/2
                    w-28
                    h-28
                    rounded-full
                    bg-yellow-400/45
                    blur-3xl
                    pointer-events-none
                "
            />

            {/* ================= Main Bloom ================= */}

            <motion.div
                animate={{
                    opacity: isLightOn ? 0.45 * dimFactor : 0,
                    scale: isLightOn ? 1 : 0.75,
                }}
                transition={{
                    duration: isLightOn ? 0.8 : 0.2,
                }}
                className="
                    absolute
                    left-1/2
                    top-[60px]
                    -translate-x-1/2
                    w-52
                    h-52
                    rounded-full
                    bg-yellow-300/22
                    blur-[80px]
                    pointer-events-none
                "
            />

            {/* ================= Lens Bloom ================= */}

            <motion.div
                animate={{
                    opacity: isLightOn ? 0.1 * dimFactor : 0,
                    scale: isLightOn ? 1 : 0.8,
                }}
                transition={{
                    duration: isLightOn ? 1 : 0.2,
                }}
                className="
                    absolute
                    left-1/2
                    top-[46px]
                    -translate-x-1/2
                    w-80
                    h-80
                    rounded-full
                    bg-yellow-200/14
                    blur-[140px]
                    pointer-events-none
                "
            />

            {/* ================= Atmospheric Halo ================= */}

            <motion.div
                animate={{
                    opacity: isLightOn ? 0.06 * dimFactor : 0,
                    scale: isLightOn ? [1, 1.05, 1] : 0.8,
                }}
                transition={{
                    repeat: isLightOn ? Infinity : 0,
                    duration: isLightOn ? 6 : 0.2,
                    ease: "easeInOut",
                }}
                className="
                    absolute
                    left-1/2
                    top-[32px]
                    -translate-x-1/2
                    w-[520px]
                    h-[520px]
                    rounded-full
                    bg-yellow-100/8
                    blur-[220px]
                    pointer-events-none
                "
            />

            {/* ================= Gentle Pulse ================= */}

            <motion.div
                animate={{
                    scale: isLightOn ? [1, 1.08, 1] : 1,
                    opacity: isLightOn ? [0.05 * dimFactor, 0.12 * dimFactor, 0.05 * dimFactor] : 0,
                }}
                transition={{
                    repeat: isLightOn ? Infinity : 0,
                    duration: isLightOn ? 3 : 0.2,
                    ease: "easeInOut",
                }}
                className="
                    absolute
                    left-1/2
                    top-[60px]
                    -translate-x-1/2
                    w-60
                    h-60
                    rounded-full
                    bg-yellow-300/16
                    blur-[110px]
                    pointer-events-none
                "
            />

        </>
    );
}