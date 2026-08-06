import React, { useEffect, useState, useRef } from "react";
import { motion, useSpring, AnimatePresence } from "framer-motion";
import { AudioEngine } from "../../utils/AudioEngine";
import useMobile from "../../hooks/useMobile";

export default function MagneticCustomCursor() {
    const isMobile = useMobile(768);

    const [isHovered, setIsHovered] = useState(false);
    const [isMouseDown, setIsMouseDown] = useState(false);
    const [ripples, setRipples] = useState([]);
    const [trails, setTrails] = useState([]);

    // Spring physics for smooth magnetic cursor tracking
    const cursorX = useSpring(0, { stiffness: 450, damping: 28 });
    const cursorY = useSpring(0, { stiffness: 450, damping: 28 });

    const ringX = useSpring(0, { stiffness: 180, damping: 20 });
    const ringY = useSpring(0, { stiffness: 180, damping: 20 });

    useEffect(() => {
        if (isMobile) return;

        const handleMouseMove = (e) => {
            let targetX = e.clientX;
            let targetY = e.clientY;

            // Check if cursor is near an interactive magnetic element
            const hoveredEl = document.elementFromPoint(e.clientX, e.clientY);
            const magneticEl = hoveredEl?.closest("button, a, input, select, [data-magnetic='true']");

            if (magneticEl) {
                setIsHovered(true);
                const rect = magneticEl.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;

                // Pull cursor magnetic center toward target element center
                targetX = targetX + (centerX - targetX) * 0.4;
                targetY = targetY + (centerY - targetY) * 0.4;
            } else {
                setIsHovered(false);
            }

            cursorX.set(targetX);
            cursorY.set(targetY);
            ringX.set(targetX);
            ringY.set(targetY);

            // Add particle comet spark trail
            if (Math.random() < 0.35) {
                const newSpark = {
                    id: Date.now() + Math.random(),
                    x: e.clientX,
                    y: e.clientY,
                    size: Math.random() * 4 + 2,
                    color: Math.random() > 0.5 ? "#22d3ee" : "#fbbf24",
                };
                setTrails((prev) => [...prev.slice(-12), newSpark]);
            }
        };

        const handleMouseDown = (e) => {
            setIsMouseDown(true);
            AudioEngine.playMouseClick();

            // Spawn Click Ripple Shockwave
            const newRipple = {
                id: Date.now() + Math.random(),
                x: e.clientX,
                y: e.clientY,
            };
            setRipples((prev) => [...prev.slice(-6), newRipple]);
        };

        const handleMouseUp = () => {
            setIsMouseDown(false);
        };

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mousedown", handleMouseDown);
        window.addEventListener("mouseup", handleMouseUp);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mousedown", handleMouseDown);
            window.removeEventListener("mouseup", handleMouseUp);
        };
    }, [isMobile, cursorX, cursorY, ringX, ringY]);

    if (isMobile) return null;

    return (
        <div className="pointer-events-none fixed inset-0 z-[99999] overflow-hidden select-none">
            {/* Click Ripple Shockwaves */}
            <AnimatePresence>
                {ripples.map((ripple) => (
                    <motion.div
                        key={ripple.id}
                        initial={{ opacity: 0.8, scale: 0.2 }}
                        animate={{ opacity: 0, scale: 2.5 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.65, ease: "easeOut" }}
                        style={{
                            left: ripple.x - 40,
                            top: ripple.y - 40,
                        }}
                        onAnimationComplete={() => {
                            setRipples((prev) => prev.filter((r) => r.id !== ripple.id));
                        }}
                        className="absolute w-20 h-20 rounded-full border-2 border-cyan-400 shadow-[0_0_20px_#22d3ee] pointer-events-none"
                    />
                ))}
            </AnimatePresence>

            {/* Cursor Comet Particle Trails */}
            {trails.map((spark) => (
                <motion.div
                    key={spark.id}
                    initial={{ opacity: 0.8, scale: 1 }}
                    animate={{ opacity: 0, scale: 0.2, y: spark.y + 12 }}
                    transition={{ duration: 0.45 }}
                    style={{
                        left: spark.x - spark.size / 2,
                        top: spark.y - spark.size / 2,
                        width: spark.size,
                        height: spark.size,
                        backgroundColor: spark.color,
                        boxShadow: `0 0 8px ${spark.color}`,
                    }}
                    onAnimationComplete={() => {
                        setTrails((prev) => prev.filter((t) => t.id !== spark.id));
                    }}
                    className="absolute rounded-full pointer-events-none"
                />
            ))}

            {/* Glowing Outer Tracking Ring */}
            <motion.div
                style={{
                    x: ringX,
                    y: ringY,
                }}
                animate={{
                    scale: isMouseDown ? 0.7 : isHovered ? 1.8 : 1,
                    borderColor: isHovered ? "rgba(34, 211, 238, 0.8)" : "rgba(251, 191, 36, 0.5)",
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="
                    fixed -left-5 -top-5
                    w-10 h-10
                    rounded-full
                    border-2
                    shadow-[0_0_15px_rgba(34,211,238,0.4)]
                    pointer-events-none
                "
            />

            {/* Core Solid Cursor Dot */}
            <motion.div
                style={{
                    x: cursorX,
                    y: cursorY,
                }}
                animate={{
                    scale: isMouseDown ? 0.5 : isHovered ? 1.4 : 1,
                    backgroundColor: isHovered ? "#22d3ee" : "#fbbf24",
                }}
                className="
                    fixed -left-1.5 -top-1.5
                    w-3 h-3
                    rounded-full
                    shadow-[0_0_10px_#fbbf24]
                    pointer-events-none
                "
            />
        </div>
    );
}
