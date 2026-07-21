import { motion } from "framer-motion";
import useMousePosition from "../../hooks/useMousePosition";

export default function LampReflection() {
    const { x, y } = useMousePosition();

    // Map mouse position to sub-pixel translations relative to screen center
    const tx = (x / window.innerWidth - 0.5) * 60;
    const ty = (y / window.innerHeight - 0.5) * 60;

    return (
        <div className="absolute inset-0 rounded-[34px] overflow-hidden pointer-events-none">
            <motion.div
                animate={{
                    x: tx,
                    y: ty,
                }}
                transition={{
                    type: "spring",
                    stiffness: 35,
                    damping: 18
                }}
                style={{
                    position: "absolute",
                    inset: "-60px",
                    background: "radial-gradient(circle at center, rgba(255,255,255,.22), transparent 45%)",
                    willChange: "transform",
                }}
            />
        </div>
    );
}