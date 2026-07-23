import { useEffect, useRef, useState } from "react";
import {
    motion,
    useMotionValue,
    useSpring,
    useTransform,
} from "framer-motion";

import PullChain from "./PullChain";
import BulbGlow from "./BulbGlow";
import { useLight } from "../../context/LightContext";
import { AudioEngine } from "../../utils/AudioEngine";
import useMobile from "../../hooks/useMobile";

export default function Lamp() {
    const { isLightOn, toggleLight, isLoggedIn, lampIntensity } = useLight();
    const isMobile = useMobile(1024);

    const firstRender = useRef(true);
    const [isFlickering, setIsFlickering] = useState(false);

    useEffect(() => {
        if (firstRender.current) {
            firstRender.current = false;
            return;
        }

        if (isLightOn) {
            setIsFlickering(true);
            
            // Fast electrical sputter sounds
            const flickerInterval = setInterval(() => {
                AudioEngine.playFlicker();
            }, 75);

            const timer = setTimeout(() => {
                setIsFlickering(false);
                clearInterval(flickerInterval);
                AudioEngine.startBulbHum();
            }, 450);

            return () => {
                clearTimeout(timer);
                clearInterval(flickerInterval);
            };
        } else {
            setIsFlickering(false);
            AudioEngine.stopBulbHum();
        }
    }, [isLightOn]);

    const mouseX = useMotionValue(0);
    const ambientAngle = useMotionValue(0);
    
    // Base resting tilt angle (0 on login page, 3.5 deg on about page)
    const baseAngle = useSpring(isLoggedIn ? (isMobile ? 0 : 3.5) : 0, {
        stiffness: 60,
        damping: 15,
    });

    useEffect(() => {
        baseAngle.set(isLoggedIn ? (isMobile ? 0 : 3.5) : 0);
    }, [isLoggedIn, isMobile, baseAngle]);

    const smoothX = useSpring(mouseX, {
        stiffness: 70,
        damping: 18,
    });

    const windowW = typeof window !== "undefined" ? window.innerWidth : 1024;

    const mouseAngle = useTransform(
        smoothX,
        [-windowW / 2, windowW / 2],
        isMobile ? [-2, 2] : [-4.5, 4.5]
    );

    // Continuous pendulum ambient swing loop
    useEffect(() => {
        let animationFrameId;
        const startTime = performance.now();

        const animateSwing = (currentTime) => {
            const elapsed = (currentTime - startTime) / 1000;
            // Smooth sine wave pendulum sway: amplitude 1.8 degrees, period ~2.8s
            const currentAmbient = Math.sin(elapsed * 2.25) * (isMobile ? 1.0 : 1.8);
            ambientAngle.set(currentAmbient);
            animationFrameId = requestAnimationFrame(animateSwing);
        };

        animationFrameId = requestAnimationFrame(animateSwing);

        return () => cancelAnimationFrame(animationFrameId);
    }, [ambientAngle, isMobile]);

    // Combined total rotation for physical lamp assembly
    const totalRotate = useTransform(
        [baseAngle, mouseAngle, ambientAngle],
        ([base, mouse, ambient]) => base + mouse + ambient
    );

    useEffect(() => {
        const handleMove = (e) => {
            const clientX = e.touches && e.touches.length > 0 ? e.touches[0].clientX : e.clientX;
            const currentW = typeof window !== "undefined" ? window.innerWidth : 1024;
            mouseX.set(clientX - currentW / 2);
        };

        window.addEventListener("mousemove", handleMove);
        window.addEventListener("touchstart", handleMove, { passive: true });
        window.addEventListener("touchmove", handleMove, { passive: true });

        return () => {
            window.removeEventListener("mousemove", handleMove);
            window.removeEventListener("touchstart", handleMove);
            window.removeEventListener("touchmove", handleMove);
        };
    }, [mouseX]);

    return (
        <motion.div
            style={{
                rotate: totalRotate,
                transformOrigin: "top center",
                willChange: "transform",
            }}
            animate={{
                y: isLoggedIn ? (isMobile ? -60 : -80) : 0,
                x: isLoggedIn ? (isMobile ? 0 : "-42vw") : 0,
                scale: isLoggedIn ? (isMobile ? 0.72 : 0.84) : (isMobile ? 0.85 : 1),
            }}
            transition={{
                y: { type: "spring", stiffness: 80, damping: 16 },
                x: {
                    type: "spring",
                    stiffness: 80,
                    damping: 16,
                },
                scale: {
                    type: "spring",
                    stiffness: 80,
                    damping: 16,
                }
            }}
            className="absolute inset-x-0 top-0 flex flex-col items-center z-[70] pointer-events-none"
        >
            <motion.div
                animate={{ y: [0, 3, 0] }}
                transition={{ y: { repeat: Infinity, duration: 4.5, ease: "easeInOut" } }}
                className="flex flex-col items-center w-full pointer-events-none"
            >
            {/* ================= Cable ================= */}

            <div className="relative h-28 w-[4px] bg-zinc-800 rounded-full shadow-md">
                {/* Braided Cord Highlight */}
                <div
                    className="absolute inset-0 w-full h-full opacity-35 animate-[pulse_3s_ease-in-out_infinite]"
                    style={{
                        backgroundImage: "linear-gradient(45deg, #52525b 25%, transparent 25%, transparent 50%, #52525b 50%, #52525b 75%, transparent 75%, transparent)",
                        backgroundSize: "4px 4px",
                    }}
                />
            </div>

            {/* ================= Lamp ================= */}

            <div className="relative flex flex-col items-center">

                {/* Top Mounting Collar */}
                <motion.div
                    animate={{
                        borderColor: isLightOn ? "rgba(251, 191, 36, 0.4)" : "rgba(120, 53, 15, 0.3)"
                    }}
                    className="relative w-8 h-4 bg-gradient-to-r from-amber-950 via-amber-800 to-amber-950 rounded-t-md border-x border-t border-amber-700/50 shadow-md z-20"
                />

                {/* Plain Brown Cone Lamp Housing */}
                <div className="relative w-[156px] h-[110px] z-10 flex flex-col items-center">
                    <motion.div
                        animate={{
                            background: isLightOn
                                ? "linear-gradient(140deg, #92400e 0%, #78350f 45%, #451a03 100%)"
                                : "linear-gradient(140deg, #78350f 0%, #451a03 50%, #270e02 100%)",
                        }}
                        transition={{
                            duration: 0.8,
                        }}
                        style={{
                            clipPath: "polygon(22% 0%, 78% 0%, 100% 100%, 0% 100%)",
                        }}
                        className="
                            w-full
                            h-full
                            shadow-[0_25px_60px_rgba(0,0,0,0.95)]
                            relative
                            overflow-hidden
                        "
                    >
                        {/* Smooth Satin Gloss Surface Highlight */}
                        <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-transparent via-50% to-black/50 pointer-events-none z-20" />
                    </motion.div>

                    {/* Plain Brown Bottom Rim Bezel */}
                    <motion.div
                        animate={{
                            borderColor: isLightOn ? "rgba(251, 191, 36, 0.5)" : "rgba(120, 53, 15, 0.4)",
                            background: isLightOn
                                ? "linear-gradient(to right, #78350f, #b45309, #451a03)"
                                : "linear-gradient(to right, #451a03, #78350f, #1c0a02)",
                        }}
                        className="
                            absolute
                            -bottom-[2px]
                            left-0
                            w-full
                            h-[6px]
                            rounded-b-md
                            border-b
                            z-15
                        "
                    />
                </div>

                {/* Traditional Bright Yellow Rounded Halogen Bulb Casing */}
                <motion.div
                    animate={
                        isLightOn
                            ? isFlickering
                                ? {
                                    backgroundColor: ["rgba(253, 224, 71, 0.6)", "rgba(253, 224, 71, 0.98)", "rgba(253, 224, 71, 0.65)", "rgba(253, 224, 71, 1.0)", "rgba(253, 224, 71, 0.7)"],
                                    borderColor: ["#fde047", "#ffffff", "#fde047", "#ffffff", "#fde047"],
                                    boxShadow: [
                                        "0 0 20px #fbbf24, 0 0 40px #f59e0b",
                                        "0 0 45px #fde047, 0 0 90px #fbbf24",
                                        "0 0 25px #fbbf24, 0 0 50px #f59e0b",
                                        "0 0 55px #fde047, 0 0 100px #fbbf24",
                                        "0 0 30px #fbbf24, 0 0 60px #f59e0b"
                                    ],
                                    scale: [0.96, 1.02, 0.97, 1.04, 0.98, 1],
                                }
                                : {
                                    backgroundColor: "rgba(253, 224, 71, 0.95)",
                                    borderColor: "#fde047",
                                    boxShadow: "0 0 35px #fde047, 0 0 75px #fbbf24, 0 12px 50px rgba(255, 246, 209, 0.8), inset 0 2px 8px #ffffff",
                                    scale: [1, 1.01, 1],
                                }
                            : {
                                // CONTINUOUS OFF-STATE TRADITIONAL YELLOW HALOGEN FLICKER
                                backgroundColor: [
                                    "rgba(251, 191, 36, 0.20)",
                                    "rgba(253, 224, 71, 0.75)",
                                    "rgba(251, 191, 36, 0.25)",
                                    "rgba(253, 224, 71, 0.85)",
                                    "rgba(251, 191, 36, 0.30)",
                                    "rgba(253, 224, 71, 0.70)",
                                    "rgba(251, 191, 36, 0.20)"
                                ],
                                borderColor: [
                                    "rgba(251, 191, 36, 0.6)",
                                    "#fde047",
                                    "rgba(251, 191, 36, 0.65)",
                                    "#fde047",
                                    "rgba(251, 191, 36, 0.7)",
                                    "#fde047",
                                    "rgba(251, 191, 36, 0.6)"
                                ],
                                boxShadow: [
                                    "0 0 8px rgba(245, 158, 11, 0.4)",
                                    "0 0 35px rgba(253, 224, 71, 0.9)",
                                    "0 0 12px rgba(245, 158, 11, 0.45)",
                                    "0 0 45px rgba(253, 224, 71, 1.0)",
                                    "0 0 14px rgba(245, 158, 11, 0.5)",
                                    "0 0 32px rgba(253, 224, 71, 0.85)",
                                    "0 0 8px rgba(245, 158, 11, 0.4)"
                                ],
                                scale: [0.98, 1.02, 0.97, 1.03, 0.98, 1.01, 0.98],
                            }
                    }
                    transition={{
                        duration: isFlickering ? 0.45 : isLightOn ? 4 : 2.5,
                        repeat: Infinity,
                        repeatType: "mirror",
                        ease: "easeInOut",
                    }}
                    className="
                        absolute
                        left-1/2
                        top-[106px]
                        -translate-x-1/2
                        w-11
                        h-14
                        rounded-b-[22px]
                        rounded-t-md
                        border-2
                        border-yellow-300
                        z-30
                        flex
                        items-center
                        justify-center
                        overflow-hidden
                    "
                >
                    {/* Inner Halogen Radial Glow */}
                    <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                            background: isLightOn
                                ? "radial-gradient(circle, rgba(255,212,63,0.55) 0%, transparent 80%)"
                                : "none",
                        }}
                    />

                    {/* Bright Filament Glow Flare */}
                    <motion.div
                        animate={
                            isLightOn
                                ? isFlickering
                                    ? {
                                        scale: [0.5, 1.2, 0.6, 1.1, 0.8, 1.0],
                                        opacity: [0.1, 0.9, 0.2, 0.95, 0.3, 0.75],
                                    }
                                    : {
                                        scale: [0.9, 1.15, 0.9],
                                        opacity: [0.75, 0.95, 0.75],
                                    }
                                : {
                                    // Subtle off-state standby flicker flare
                                    scale: [0.4, 0.95, 0.4, 1.1, 0.5, 0.85, 0.4],
                                    opacity: [0.02, 0.35, 0.05, 0.45, 0.08, 0.30, 0.02],
                                }
                        }
                        transition={{
                            duration: isFlickering ? 0.45 : isLightOn ? 1.5 : 2.6,
                            repeat: Infinity,
                            repeatType: "mirror",
                            ease: "easeInOut"
                        }}
                        className="absolute w-5 h-5 rounded-full bg-amber-200 blur-[3px] z-5 pointer-events-none"
                    />

                    {/* Halogen Pin and Horizontal Coil Filament (SVG) */}
                    <svg width="12" height="20" viewBox="0 0 12 20" fill="none" className="z-10 relative mt-1 opacity-95">
                        {/* Molybdenum support pins */}
                        <line x1="3" y1="20" x2="3" y2="8" stroke="#71717a" strokeWidth="0.8" />
                        <line x1="9" y1="20" x2="9" y2="8" stroke="#71717a" strokeWidth="0.8" />
                        
                        {/* High-intensity Tungsten Coil */}
                        <motion.line
                            x1="3"
                            y1="8"
                            x2="9"
                            y2="8"
                            strokeLinecap="round"
                            animate={isLightOn
                                ? isFlickering
                                    ? {
                                        stroke: ["#78350f", "#ffffff", "#78350f", "#fffae6", "#78350f", "#ffffff"],
                                        strokeWidth: [1.2, 2.5, 1.4, 2.7, 1.5, 2.5],
                                        filter: [
                                            "drop-shadow(0 0 1px rgba(255,255,255,0.2))",
                                            "drop-shadow(0 0 4px #ffffff)",
                                            "drop-shadow(0 0 1px rgba(255,255,255,0.2))"
                                        ]
                                    }
                                    : {
                                        stroke: ["#ffd43f", "#fffbea", "#ffd43f"],
                                        strokeWidth: 2.4,
                                        filter: [
                                            "drop-shadow(0 0 2px #ffcc44) drop-shadow(0 0 5px #ffd43f)",
                                            "drop-shadow(0 0 3px #ffd43f) drop-shadow(0 0 7px #ffcc44)",
                                            "drop-shadow(0 0 2px #ffcc44) drop-shadow(0 0 5px #ffd43f)"
                                        ]
                                    }
                                : {
                                    stroke: ["#52525b", "#fbbf24", "#3f3f46", "#f59e0b", "#52525b"],
                                    strokeWidth: [0.8, 1.8, 0.9, 2.2, 0.8],
                                    filter: [
                                        "drop-shadow(0 0 0px transparent)",
                                        "drop-shadow(0 0 4px #fbbf24)",
                                        "drop-shadow(0 0 0px transparent)",
                                        "drop-shadow(0 0 5px #f59e0b)",
                                        "drop-shadow(0 0 0px transparent)"
                                    ]
                                }
                            }
                            transition={{
                                duration: isFlickering ? 0.45 : isLightOn ? 1.5 : 2.6,
                                repeat: Infinity,
                                repeatType: "mirror",
                                ease: "easeInOut"
                            }}
                        />
                    </svg>

                    {/* Glass Surface Highlights */}
                    <div className="absolute top-1 left-1.5 w-1.5 h-2 rounded-full bg-white/20 blur-[0.3px]" />
                    <div className="absolute bottom-1 right-1.5 w-1 h-1 rounded-full bg-white/10 blur-[0.5px]" />
                </motion.div>

                {/* Bulb Glow Ambient Flares */}
                <BulbGlow
                    isLightOn={isLightOn}
                    warmingUp={isFlickering}
                />

                {/* Shortened Pull Chain */}
                <PullChain
                    key={`chain-${isLoggedIn}-${isLightOn}`}
                    isLightOn={isLightOn}
                    toggleLight={toggleLight}
                />

            </div>

            {/* ===================================================== */}
            {/* Spotlight */}
            {/* ===================================================== */}

            <motion.div
                className="absolute top-44"
            >
                {/* Core Beam */}
                <motion.div
                    animate={
                        isLightOn
                            ? isFlickering
                                ? {
                                    opacity: [
                                        0.05 * (lampIntensity / 100),
                                        0.45 * (lampIntensity / 100),
                                        0.10 * (lampIntensity / 100),
                                        0.52 * (lampIntensity / 100),
                                        0.15 * (lampIntensity / 100),
                                        0.48 * (lampIntensity / 100)
                                    ],
                                    scaleX: [0.95, 1.02, 0.96, 1.01, 0.97, 0.98],
                                }
                                : {
                                    opacity: [
                                        0.45 * (lampIntensity / 100),
                                        0.50 * (lampIntensity / 100),
                                        0.45 * (lampIntensity / 100)
                                    ],
                                    scaleX: [0.98, 1.02, 0.98],
                                }
                            : { opacity: 0 }
                    }
                    transition={{
                        duration: isLightOn ? (isFlickering ? 0.45 : 6) : 0.2,
                        repeat: isLightOn ? (isFlickering ? 0 : Infinity) : 0,
                        ease: "easeInOut",
                    }}
                    className="
                        absolute
                        h-[900px]
                        w-[90vw]
                        max-w-[440px]
                        -translate-x-1/2
                        left-1/2
                    "
                    style={{
                        clipPath:
                            "polygon(48% 0%,52% 0%,84% 100%,16% 100%)",

                        background:
                            "linear-gradient(to bottom, rgba(255,212,63,.55), rgba(255,196,36,.12), transparent)",

                        filter: "blur(24px)",
                        willChange: "transform, opacity",
                    }}
                />

                {/* Soft Outer Beam */}
                <motion.div
                    animate={
                        isLightOn
                            ? isFlickering
                                ? {
                                    opacity: [
                                        0.03 * (lampIntensity / 100),
                                        0.24 * (lampIntensity / 100),
                                        0.08 * (lampIntensity / 100),
                                        0.28 * (lampIntensity / 100),
                                        0.10 * (lampIntensity / 100),
                                        0.25 * (lampIntensity / 100)
                                    ],
                                    scaleX: [0.96, 1.01, 0.97, 1.0, 0.98, 0.99],
                                }
                                : {
                                    opacity: [
                                        0.24 * (lampIntensity / 100),
                                        0.28 * (lampIntensity / 100),
                                        0.24 * (lampIntensity / 100)
                                    ],
                                    scaleX: [0.99, 1.01, 0.99],
                                }
                            : { opacity: 0 }
                    }
                    transition={{
                        duration: isLightOn ? (isFlickering ? 0.45 : 8) : 0.2,
                        repeat: isLightOn ? (isFlickering ? 0 : Infinity) : 0,
                        ease: "easeInOut",
                    }}
                    className="
                        absolute
                        h-[920px]
                        w-[100vw]
                        max-w-[740px]
                        -translate-x-1/2
                        left-1/2
                    "
                    style={{
                        clipPath:
                            "polygon(49% 0%,51% 0%,100% 100%,0% 100%)",

                        background:
                            "linear-gradient(to bottom, rgba(255,212,63,.24), transparent)",

                        filter: "blur(70px)",
                        willChange: "transform, opacity",
                    }}
                />

                {/* Atmospheric Glow */}
                <motion.div
                    animate={{
                        opacity: isLightOn ? (isFlickering ? [0.08, 0.35, 0.12, 0.28, 0.35] : 0.35) * (lampIntensity / 100) : 0,
                        scale: isLightOn ? 1 : 0.9,
                    }}
                    transition={{
                        duration: isFlickering ? 0.45 : 0.8,
                    }}
                    style={{
                        willChange: "transform, opacity",
                    }}
                    className="
                        absolute
                        left-1/2
                        -translate-x-1/2
                        w-[90vw]
                        max-w-[850px]
                        h-[90vw]
                        max-h-[850px]
                        rounded-full
                        bg-yellow-400/8
                        blur-[160px]
                    "
                />
            </motion.div>
        </motion.div>
    </motion.div>
    );
}