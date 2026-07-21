import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";
import { useLight } from "../../context/LightContext";
import { AudioEngine } from "../../utils/AudioEngine";

export default function AudioToggle() {
    const { isMuted, toggleMute } = useLight();

    const handleToggle = () => {
        // Toggle sound
        toggleMute();
        // Play click sound on new state (if unmuting, it will sound immediately)
        setTimeout(() => {
            AudioEngine.playUISelect();
        }, 30);
    };

    return (
        <motion.button
            onClick={handleToggle}
            onMouseEnter={() => AudioEngine.playUIHover()}
            whileHover={{ scale: 1.08, y: -1 }}
            whileTap={{ scale: 0.95, y: 1 }}
            className="
                absolute
                top-6
                right-6
                z-[200]
                w-11
                h-11
                rounded-xl
                flex
                items-center
                justify-center
                bg-white/[0.04]
                border
                border-white/10
                backdrop-blur-md
                cursor-pointer
                text-zinc-400
                hover:text-white
                hover:border-violet-500/30
                shadow-[inset_0_1px_rgba(255,255,255,0.08),0_4px_12px_rgba(0,0,0,0.2)]
                transition-colors
                duration-300
                pointer-events-auto
            "
        >
            <AnimatePresence mode="wait" initial={false}>
                {isMuted ? (
                    <motion.div
                        key="muted"
                        initial={{ opacity: 0, scale: 0.8, rotate: -15 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        exit={{ opacity: 0, scale: 0.8, rotate: 15 }}
                        transition={{ duration: 0.15 }}
                    >
                        <VolumeX size={18} />
                    </motion.div>
                ) : (
                    <motion.div
                        key="unmuted"
                        initial={{ opacity: 0, scale: 0.8, rotate: 15 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        exit={{ opacity: 0, scale: 0.8, rotate: -15 }}
                        transition={{ duration: 0.15 }}
                        className="flex items-center gap-[3px]"
                    >
                        <Volume2 size={18} className="mr-[2px]" />
                        
                        {/* Dynamic Micro soundwave bars */}
                        <div className="flex items-end gap-[1.5px] h-3">
                            <motion.span
                                animate={{ height: [4, 10, 4] }}
                                transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
                                className="w-[1.5px] bg-violet-400 rounded-full"
                            />
                            <motion.span
                                animate={{ height: [6, 12, 6] }}
                                transition={{ repeat: Infinity, duration: 0.9, ease: "easeInOut", delay: 0.1 }}
                                className="w-[1.5px] bg-violet-400 rounded-full"
                            />
                            <motion.span
                                animate={{ height: [3, 8, 3] }}
                                transition={{ repeat: Infinity, duration: 1.4, ease: "easeInOut", delay: 0.25 }}
                                className="w-[1.5px] bg-violet-400 rounded-full"
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.button>
    );
}
