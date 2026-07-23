import { motion, AnimatePresence } from "framer-motion";
import { User, GraduationCap, ShieldCheck, Cpu, HardDrive } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import useMousePosition from "../../hooks/useMousePosition";
import PremiumInput from "../UI/PremiumInput";
import PremiumButton from "../UI/PremiumButton";
import NoiseLayer from "../UI/NoiseLayer";
import { useLight } from "../../context/LightContext";
import { AudioEngine } from "../../utils/AudioEngine";

// Validation schema using Zod
const loginSchema = z.object({
    viewerName: z
        .string()
        .min(1, { message: "Viewer name is required" }),
    college: z
        .string()
        .min(1, { message: "College is required" }),
});

const childVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.96 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            type: "spring",
            stiffness: 140,
            damping: 14,
        }
    }
};

export default function LoginCard() {
    const { isLightOn, isLoggedIn, setIsLoggedIn, setLoginTriggerTime, setViewerName, setCollege } = useLight();
    const { x, y } = useMousePosition();

    const [isLoading, setIsLoading] = useState(false);
    const [shake, setShake] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            viewerName: "",
            college: "",
        }
    });

    const width = typeof window !== "undefined" ? window.innerWidth : 1024;
    const height = typeof window !== "undefined" ? window.innerHeight : 768;
    const isSmall = width < 768;

    const rotateY = isSmall ? 0 : ((x - width / 2) / width) * 8;
    const rotateX = isSmall ? 0 : -((y - height / 2) / height) * 8;

    const triggerShake = () => {
        setShake(true);
        AudioEngine.playChainRelease(); // play feedback sound
        setTimeout(() => setShake(false), 500);
    };

    const onSubmit = (data) => {
        if (isLoading) return;
        setIsLoading(true);
        AudioEngine.playUISelect();
        
        // Blur active element to prevent auto-scrolling during animations
        if (document.activeElement && typeof document.activeElement.blur === "function") {
            document.activeElement.blur();
        }

        if (setLoginTriggerTime) {
            setLoginTriggerTime(Date.now());
        }

        if (setViewerName) {
            setViewerName(data.viewerName);
        }
        if (setCollege) {
            setCollege(data.college);
        }

        setTimeout(() => {
            setIsLoading(false);
            setIsLoggedIn(true);
            setTimeout(() => {
                AudioEngine.playDroneScan();
            }, 150);
        }, 1600);
    };

    const onInvalidSubmit = () => {
        triggerShake();
    };

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={{
                hidden: {},
                visible: {
                    transition: {
                        staggerChildren: 0.08,
                        delayChildren: 0.1,
                    }
                }
            }}
            style={{
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
            }}
            className="
                relative
                overflow-hidden
                w-full
                max-w-[440px]
                rounded-[24px]
                sm:rounded-[30px]
                bg-black
                p-6
                sm:p-8
                md:p-12
                text-red-400
                border
                border-zinc-800/80
                shadow-[0_30px_100px_rgba(0,0,0,0.95)]
                mx-auto
            "
        >
            {/* Base Card Animating States */}
            <motion.div
                className="absolute inset-0 rounded-[24px] sm:rounded-[30px] pointer-events-none"
                animate={{
                    x: shake ? [-12, 12, -8, 8, -4, 4, 0] : 0,
                    boxShadow: "0 30px 100px rgba(0,0,0,0.95)",
                }}
                transition={{
                    x: { duration: 0.45, ease: "easeInOut" },
                }}
            />

            {/* Noise Layer */}
            <NoiseLayer />

            {/* Content */}
            <div
                className="relative z-10"
                style={{
                    transform: "translateZ(30px)",
                }}
            >
                {/* Secure Gateway Pulse Badge with Red Text Only */}
                <motion.div variants={childVariants} className="flex justify-start pl-1 sm:pl-2 mb-3">
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-800 bg-zinc-900/90 shadow-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping shadow-[0_0_8px_#ef4444]" />
                        <span className="text-[8.5px] sm:text-[9.5px] font-black tracking-[0.2em] text-red-400 uppercase">SECURE PORTAL</span>
                    </div>
                </motion.div>

                {/* Pitch Black Card - Red Headline Text Only */}
                <motion.h1
                    variants={childVariants}
                    animate={{
                        opacity: isLightOn ? 1 : 0.85,
                    }}
                    className="text-2xl sm:text-3xl md:text-[34px] font-black tracking-tight text-red-500 drop-shadow-[0_0_12px_rgba(239,68,68,0.7)] pl-1 sm:pl-2"
                >
                    Identify Yourself
                </motion.h1>

                {/* Pitch Black Card - Red Subtitle Text Only */}
                <motion.p
                    variants={childVariants}
                    animate={{
                        opacity: isLightOn ? 0.95 : 0.65,
                    }}
                    className="mt-2 mb-6 sm:mb-9 text-xs sm:text-sm text-red-400 font-bold tracking-wide pl-1 sm:pl-2"
                >
                    Enter your details to view the portfolio.
                </motion.p>

                <form onSubmit={handleSubmit(onSubmit, onInvalidSubmit)} className="space-y-6">
                    <motion.div variants={childVariants}>
                        <PremiumInput
                            icon={User}
                            label="Viewer Name"
                            type="text"
                            error={errors.viewerName}
                            {...register("viewerName")}
                        />
                    </motion.div>

                    <motion.div variants={childVariants}>
                        <PremiumInput
                            icon={GraduationCap}
                            label="College / Institution"
                            type="text"
                            error={errors.college}
                            {...register("college")}
                        />
                    </motion.div>

                    <motion.div variants={childVariants}>
                        <PremiumButton
                            isLoading={isLoading}
                            text="Connect Rig"
                        />
                    </motion.div>
                </form>
            </div>
        </motion.div>
    );
}