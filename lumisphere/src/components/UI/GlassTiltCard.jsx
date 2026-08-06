import React, { useRef, useState } from "react";
import { motion, useSpring, useTransform } from "framer-motion";
import { AudioEngine } from "../../utils/AudioEngine";

export default function GlassTiltCard({
    children,
    className = "",
    tiltIntensity = 15,
    glowColor = "rgba(34, 211, 238, 0.15)",
    onClick,
    ...props
}) {
    const cardRef = useRef(null);
    const [isHovered, setIsHovered] = useState(false);

    // Raw tilt motion values
    const x = useSpring(0, { stiffness: 350, damping: 25 });
    const y = useSpring(0, { stiffness: 350, damping: 25 });

    // Transform offsets into 3D degrees
    const rotateX = useTransform(y, [-0.5, 0.5], [tiltIntensity, -tiltIntensity]);
    const rotateY = useTransform(x, [-0.5, 0.5], [-tiltIntensity, tiltIntensity]);

    const handleMouseMove = (e) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;

        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        // Normalized offsets (-0.5 to 0.5)
        const pctX = mouseX / width - 0.5;
        const pctY = mouseY / height - 0.5;

        x.set(pctX);
        y.set(pctY);
    };

    const handleMouseEnter = () => {
        setIsHovered(true);
        AudioEngine.playUIHover();
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            ref={cardRef}
            style={{
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
            }}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={onClick}
            whileTap={{ scale: 0.97, translateZ: -10 }}
            className={`relative transition-all duration-200 ease-out select-none ${className}`}
            {...props}
        >
            {/* Interactive Dynamic Glass Glow Highlight */}
            {isHovered && (
                <div
                    className="absolute inset-0 rounded-inherit pointer-events-none transition-opacity duration-300"
                    style={{
                        background: `radial-gradient(circle at 50% 50%, ${glowColor} 0%, transparent 70%)`,
                    }}
                />
            )}
            {children}
        </motion.div>
    );
}
