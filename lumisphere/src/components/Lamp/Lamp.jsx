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

export default function Lamp() {
    const { isLightOn, toggleLight, isLoggedIn, lampIntensity } = useLight();

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
    const baseAngle = useSpring(isLoggedIn ? 3.5 : 0, {
        stiffness: 60,
        damping: 15,
    });

    useEffect(() => {
        baseAngle.set(isLoggedIn ? 3.5 : 0);
    }, [isLoggedIn, baseAngle]);

    const smoothX = useSpring(mouseX, {
        stiffness: 70,
        damping: 18,
    });

    const mouseAngle = useTransform(
        smoothX,
        [-window.innerWidth / 2, window.innerWidth / 2],
        [-4.5, 4.5]
    );

    // Continuous pendulum ambient swing loop
    useEffect(() => {
        let animationFrameId;
        const startTime = performance.now();

        const animateSwing = (currentTime) => {
            const elapsed = (currentTime - startTime) / 1000;
            // Smooth sine wave pendulum sway: amplitude 1.8 degrees, period ~2.8s
            const currentAmbient = Math.sin(elapsed * 2.25) * 1.8;
            ambientAngle.set(currentAmbient);
            animationFrameId = requestAnimationFrame(animateSwing);
        };

        animationFrameId = requestAnimationFrame(animateSwing);

        return () => cancelAnimationFrame(animationFrameId);
    }, [ambientAngle]);

    // Combined total rotation for physical lamp assembly
    const totalRotate = useTransform(
        [baseAngle, mouseAngle, ambientAngle],
        ([base, mouse, ambient]) => base + mouse + ambient
    );

    useEffect(() => {
        const handleMouseMove = (e) => {
            mouseX.set(e.clientX - window.innerWidth / 2);
        };

        window.addEventListener("mousemove", handleMouseMove);

        return () =>
            window.removeEventListener(
                "mousemove",
                handleMouseMove
            );
    }, [mouseX]);

    return (
        <motion.div
            style={{
                rotate: totalRotate,
                transformOrigin: "top center",
                willChange: "transform",
            }}
            animate={{
                y: isLoggedIn ? -80 : 0,
                x: isLoggedIn ? "-42vw" : 0,
                scale: isLoggedIn ? 0.84 : 1,
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

            <div className="relative h-44 w-[4px] bg-zinc-800 rounded-full shadow-md">
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

            <div className="relative">

                {/* Titanium Mounting Joint */}
                <motion.div
                    animate={{
                        borderColor: isLightOn ? "rgba(255,255,255,0.15)" : "transparent"
                    }}
                    className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-4 bg-gradient-to-r from-zinc-700 via-zinc-500 to-zinc-800 rounded-t-md border-x border-t shadow-md z-15"
                />

                {/* Anodized Dark Titanium/Graphite Shroud Spotlight Case */}
                <motion.div
                    animate={{
                        background: isLightOn
                            ? "linear-gradient(to bottom, #2b2b2e, #1a1a1c, #0d0d0e)"
                            : "linear-gradient(to bottom, #161618, #0e0e0f, #050506)",
                        borderColor: isLightOn ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.03)",
                    }}
                    transition={{
                        duration: 0.8,
                    }}
                    className="
                        relative
                        w-40
                        h-22
                        border
                        rounded-t-3xl
                        rounded-b-lg
                        shadow-[0_20px_50px_rgba(0,0,0,0.8)]
                        z-10
                        overflow-hidden
                    "
                >
                    {/* Metal Cooling Fins (Horizontal Grooves) */}
                    <div className="absolute top-4 inset-x-0 h-10 flex flex-col justify-between opacity-80 z-20 pointer-events-none">
                        <div className="h-[2px] bg-zinc-950 shadow-[inset_0_1px_rgba(255,255,255,0.05)]" />
                        <div className="h-[2px] bg-zinc-950 shadow-[inset_0_1px_rgba(255,255,255,0.05)]" />
                        <div className="h-[2px] bg-zinc-950 shadow-[inset_0_1px_rgba(255,255,255,0.05)]" />
                        <div className="h-[2px] bg-zinc-950 shadow-[inset_0_1px_rgba(255,255,255,0.05)]" />
                    </div>

                    {/* Chrome Parabolic Reflector Cup */}
                    <div className="absolute inset-x-2.5 bottom-0 h-11 bg-gradient-to-t from-zinc-700 via-zinc-900 to-zinc-950 rounded-b-md overflow-hidden flex justify-center z-10">
                        {/* Chrome Mirror Facets */}
                        <div className="absolute inset-0 opacity-20 bg-[repeating-linear-gradient(30deg,transparent,transparent_3px,#ffffff_3px,#ffffff_6px)]" />
                        <div className="absolute inset-0 opacity-15 bg-[repeating-linear-gradient(-30deg,transparent,transparent_3px,#ffffff_3px,#ffffff_6px)]" />
                        {/* Ceramic Socket base */}
                        <div className="w-8 h-4 bg-zinc-400 rounded-t-sm border border-zinc-500 absolute bottom-7" />
                    </div>

                    {/* Outer Housing Refraction highlights */}
                    <div className="absolute inset-x-0 top-0 h-full bg-gradient-to-r from-white/3 via-transparent to-black/30 pointer-events-none z-20" />
                </motion.div>

                {/* Sleek Aluminum/Chrome Rim Bezel at Bottom */}
                <motion.div
                    animate={{
                        borderColor: isLightOn ? "rgba(255, 255, 255, 0.35)" : "transparent",
                        background: isLightOn
                            ? "linear-gradient(to right, #52525b, #e4e4e7, #3f3f46)"
                            : "linear-gradient(to right, #1f1f23, #2e2e33, #0f0f12)",
                        boxShadow: isLightOn
                            ? "inset 0 -1px 3px rgba(255,255,255,0.6), 0 2px 8px rgba(255,255,255,0.15)"
                            : "inset 0 -1px 3px rgba(0,0,0,0.8)",
                    }}
                    className="
                        absolute
                        -bottom-[2px]
                        left-1/2
                        -translate-x-1/2
                        w-[150px]
                        h-[8px]
                        rounded-b-md
                        border-b
                        z-15
                    "
                />

                {/* Sleek Quartz Halogen Capsule */}
                <motion.div
                    animate={
                        isLightOn
                            ? isFlickering
                                ? {
                                    backgroundColor: ["rgba(255, 255, 255, 0.02)", "rgba(255, 255, 255, 0.16)", "rgba(255, 255, 255, 0.05)", "rgba(255, 255, 255, 0.22)", "rgba(255, 255, 255, 0.08)", "rgba(255, 255, 255, 0.16)"],
                                    borderColor: ["rgba(255, 255, 255, 0.15)", "rgba(255, 255, 255, 0.65)", "rgba(255, 255, 255, 0.25)", "rgba(255, 255, 255, 0.75)", "rgba(255, 255, 255, 0.3)", "rgba(255, 255, 255, 0.65)"],
                                    boxShadow: [
                                        "0 0 10px rgba(255, 255, 255, 0.2)",
                                        "0 0 35px rgba(255, 255, 255, 0.95)",
                                        "0 0 15px rgba(255, 255, 255, 0.3)",
                                        "0 0 45px rgba(255, 255, 255, 1.1)",
                                        "0 0 20px rgba(255, 255, 255, 0.4)",
                                        "0 0 35px rgba(255, 255, 255, 0.95)"
                                    ],
                                    scale: [0.96, 1.02, 0.97, 1.04, 0.98, 1],
                                }
                                : {
                                    backgroundColor: "rgba(255, 255, 255, 0.14)",
                                    borderColor: "rgba(255, 255, 255, 0.65)",
                                    boxShadow: "0 0 35px rgba(255, 255, 255, 0.95), 0 12px 50px rgba(255, 246, 209, 0.7), inset 0 2px 6px rgba(255, 255, 255, 0.6)",
                                    scale: [1, 1.012, 1],
                                }
                            : {
                                backgroundColor: "rgba(255, 255, 255, 0.003)",
                                borderColor: "rgba(255, 255, 255, 0.02)",
                                boxShadow: "inset 0 1px 1px rgba(255, 255, 255, 0.03)",
                                scale: 0.98,
                            }
                    }
                    transition={{
                        duration: isFlickering ? 0.45 : isLightOn ? 4 : 0.8,
                        repeat: isFlickering ? 0 : isLightOn ? Infinity : 0,
                        ease: isFlickering ? "linear" : "easeInOut",
                    }}
                    className="
                        absolute
                        left-1/2
                        -bottom-[22px]
                        -translate-x-1/2
                        w-6
                        h-11
                        rounded-md
                        border
                        backdrop-blur-[0.5px]
                        z-10
                        flex
                        items-center
                        justify-center
                        shadow-inner
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
                    {isLightOn && (
                        <motion.div
                            animate={isFlickering ? {
                                scale: [0.5, 1.2, 0.6, 1.1, 0.8, 1.0],
                                opacity: [0.1, 0.9, 0.2, 0.95, 0.3, 0.75],
                            } : {
                                scale: [0.9, 1.15, 0.9],
                                opacity: [0.75, 0.95, 0.75],
                            }}
                            transition={{
                                duration: isFlickering ? 0.45 : 1.5,
                                repeat: isFlickering ? 0 : Infinity,
                                ease: "easeInOut"
                            }}
                            className="absolute w-5 h-5 rounded-full bg-white blur-[3.5px] z-5 pointer-events-none"
                        />
                    )}

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
                                    stroke: "#3f3f46",
                                    strokeWidth: 1.0,
                                }
                            }
                            transition={{
                                duration: isFlickering ? 0.45 : 1.5,
                                repeat: isLightOn ? (isFlickering ? 0 : Infinity) : 0,
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
                        w-[440px]
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
                        w-[740px]
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
                        w-[850px]
                        h-[850px]
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