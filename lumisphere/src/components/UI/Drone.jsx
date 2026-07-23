import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useLight } from "../../context/LightContext";
import useMousePosition from "../../hooks/useMousePosition";
import { AudioEngine } from "../../utils/AudioEngine";
import useMobile from "../../hooks/useMobile";

export default function Drone() {
    const { isLightOn } = useLight();
    const mouse = useMousePosition();
    const droneRef = useRef(null);
    const isMobile = useMobile(768);

    const [tilt, setTilt] = useState(0);
    const [isScanning, setIsScanning] = useState(false);

    // Track mouse distance to drone
    useEffect(() => {
        if (!droneRef.current || isLightOn) {
            setIsScanning(false);
            setTilt(0);
            return;
        }

        const rect = droneRef.current.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        
        const dx = mouse.x - cx;
        const dy = mouse.y - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const radius = isMobile ? 140 : 220;

        if (dist < radius) {
            if (!isScanning) {
                setIsScanning(true);
                AudioEngine.playDroneScan();
            }
            // Map the horizontal offset to a tilt angle (-25 to 25 degrees)
            const angle = Math.max(-25, Math.min(25, (dx / radius) * 35));
            setTilt(angle);
        } else {
            setIsScanning(false);
            setTilt(0);
        }
    }, [mouse, isLightOn, isScanning, isMobile]);

    return (
        <motion.div
            ref={droneRef}
            animate={
                isLightOn
                    ? {
                        opacity: 0,
                        scale: 0.7,
                        y: 150,
                        pointerEvents: "none",
                    }
                    : {
                        opacity: 1,
                        scale: isMobile ? 0.85 : 1,
                        pointerEvents: "auto",
                        // Scaled organic floating motion to fit device boundaries
                        x: isMobile ? [0, 40, -35, 30, -40, 25, -20, 0] : [0, 320, -280, 240, -340, 200, -180, 0],
                        y: isMobile ? [0, -20, 25, -30, 35, -15, 20, 0] : [0, -90, 140, -150, 200, -70, 120, 0],
                        rotate: [0, 4, -3, 3, -2, 3, -2, 0],
                    }
            }
            transition={
                isLightOn
                    ? {
                        opacity: { duration: 0.6, ease: "easeInOut" },
                        scale: { duration: 0.6, ease: "easeInOut" },
                        y: { type: "spring", stiffness: 80, damping: 20 },
                    }
                    : {
                        opacity: { duration: 0.6 },
                        scale: { duration: 0.6 },
                        x: { duration: 26, repeat: Infinity, ease: "easeInOut" },
                        y: { duration: 26, repeat: Infinity, ease: "easeInOut" },
                        rotate: { duration: 26, repeat: Infinity, ease: "easeInOut" },
                    }
            }
            className="
                absolute
                top-28 sm:top-44
                left-1/2 sm:left-[calc(50%+110px)]
                -translate-x-1/2 sm:translate-x-0
                z-[100]
                flex
                flex-col
                items-center
                pointer-events-none
                select-none
            "
        >
            {/* Holographic Projection Message */}
            <motion.div
                animate={{
                    opacity: [0.75, 1, 0.75, 0.9, 0.75],
                    y: [0, -3, 0],
                }}
                transition={{
                    opacity: {
                        duration: 3,
                        repeat: Infinity,
                        ease: "linear",
                    },
                    y: {
                        duration: 2.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }
                }}
                className="
                    absolute
                    bottom-14
                    left-1/2
                    -translate-x-1/2
                    flex
                    items-center
                    gap-2
                    px-3
                    py-1.5
                    rounded-lg
                    border
                    border-red-500/40
                    bg-red-950/60
                    backdrop-blur-md
                    text-[10px]
                    font-extrabold
                    tracking-widest
                    text-red-400
                    uppercase
                    whitespace-nowrap
                    shadow-[0_0_15px_rgba(239,68,68,0.3)]
                    drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]
                "
            >
                <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"></span>
                </span>
                
                <span>{isScanning ? "Scanning Presence" : "Pull chain to login"}</span>
            </motion.div>

            {/* Projection Beam Flare (SVG) */}
            <svg
                width="60"
                height="30"
                viewBox="0 0 60 30"
                fill="none"
                className="absolute bottom-6 left-1/2 -translate-x-1/2 opacity-25 pointer-events-none z-10"
            >
                <polygon
                    points="30,30 5,0 55,0"
                    fill="url(#holo-beam-grad)"
                />
                <defs>
                    <linearGradient id="holo-beam-grad" x1="30" y1="30" x2="30" y2="0" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
                    </linearGradient>
                </defs>
            </svg>

            {/* Drone Interactive Tilt Body Wrapper */}
            <motion.div
                animate={{
                    rotate: tilt,
                }}
                transition={{
                    type: "spring",
                    stiffness: 120,
                    damping: 15,
                }}
                className="relative flex flex-col items-center pointer-events-auto cursor-pointer"
                onMouseEnter={() => {
                    if (!isLightOn) {
                        AudioEngine.playUIHover();
                    }
                }}
            >
                {/* Drone Core Pod */}
                <div className="relative w-8 h-8 rounded-full bg-gradient-to-br from-zinc-700 via-zinc-800 to-zinc-950 border border-zinc-600/40 shadow-2xl flex items-center justify-center">
                    
                    {/* Pulsing Scanner Eye */}
                    <motion.div
                        animate={isScanning ? {
                            scale: [0.95, 1.35, 0.95],
                            backgroundColor: ["#22d3ee", "#e0f2fe", "#22d3ee"],
                        } : {
                            scale: [0.9, 1.25, 0.9],
                        }}
                        transition={{
                            duration: isScanning ? 0.8 : 1.5,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                        className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_10px_#22d3ee]"
                    />

                    {/* Left Thruster/Wing */}
                    <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-4.5 h-3 rounded-l-md bg-zinc-800 border-l-[1.5px] border-cyan-400 shadow-[0_0_6px_rgba(34,211,238,0.4)] flex items-center justify-end">
                        <span className="w-1 h-1 rounded-full bg-cyan-400 opacity-60 mr-0.5 animate-pulse" />
                    </div>

                    {/* Right Thruster/Wing */}
                    <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-4.5 h-3 rounded-r-md bg-zinc-800 border-r-[1.5px] border-cyan-400 shadow-[0_0_6px_rgba(34,211,238,0.4)] flex items-center justify-start">
                        <span className="w-1 h-1 rounded-full bg-cyan-400 opacity-60 ml-0.5 animate-pulse" />
                    </div>

                    {/* Top Antenna */}
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-[1.5px] h-4 bg-zinc-600">
                        <span className="absolute -top-0.5 -left-[1.5px] w-1 h-1 rounded-full bg-red-500 animate-ping" />
                    </div>
                </div>

                {/* Bottom Glow / Hover Flame */}
                <motion.div
                    animate={{
                        opacity: [0.5, 0.95, 0.5],
                        scaleY: [0.8, 1.3, 0.8],
                    }}
                    transition={{
                        duration: 0.15,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                    className="w-2 h-3 bg-gradient-to-b from-cyan-400 to-transparent blur-[0.5px] origin-top mt-0.5"
                />

                {/* ================= Laser Grid Scan Beam ================= */}
                <AnimatePresence>
                    {isScanning && (
                        <>
                            {/* Volumetric Laser Cone */}
                            <motion.div
                                initial={{ opacity: 0, scaleY: 0 }}
                                animate={{
                                    opacity: [0.25, 0.5, 0.32, 0.55, 0.25],
                                    scaleY: 1
                                }}
                                exit={{ opacity: 0, scaleY: 0 }}
                                transition={{
                                    opacity: { duration: 0.2, repeat: Infinity, ease: "linear" },
                                    scaleY: { type: "spring", stiffness: 150, damping: 15 }
                                }}
                                style={{
                                    originY: 0,
                                    clipPath: "polygon(50% 0%, 15% 100%, 85% 100%)",
                                    background: "linear-gradient(to bottom, rgba(34,211,238,0.6) 0%, rgba(34,211,238,0.02) 100%)",
                                }}
                                className="absolute top-7 w-48 h-56 pointer-events-none z-10 blur-[0.5px]"
                            />

                            {/* Scanning Grid Line */}
                            <motion.div
                                initial={{ y: 0, opacity: 0 }}
                                animate={{
                                    y: [0, 210, 0],
                                    opacity: [0.4, 0.9, 0.4]
                                }}
                                exit={{ opacity: 0 }}
                                transition={{
                                    duration: 1.8,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                                className="absolute top-7 w-32 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/80 to-transparent shadow-[0_0_8px_#22d3ee] z-20 pointer-events-none"
                            />
                        </>
                    )}
                </AnimatePresence>
            </motion.div>
        </motion.div>
    );
}
