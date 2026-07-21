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

    const width = window.innerWidth;
    const height = window.innerHeight;

    const rotateY = ((x - width / 2) / width) * 10;
    const rotateX = -((y - height / 2) / height) * 10;

    const reflectionTx = (x / width - 0.5) * 80;
    const reflectionTy = (y / height - 0.5) * 80;

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
                w-[440px]
                rounded-[30px]
                bg-white/[0.06]
                backdrop-blur-3xl
                p-12
                text-white
            "
        >
            {/* Base Card Animating States */}
            <motion.div
                className="absolute inset-0 rounded-[30px] pointer-events-none"
                animate={{
                    x: shake ? [-12, 12, -8, 8, -4, 4, 0] : 0,
                    boxShadow: isLightOn
                        ? "0 30px 100px rgba(0,0,0,0.85), 0 0 90px rgba(251, 191, 36, 0.22)"
                        : "0 18px 80px rgba(0,0,0,.95)",
                }}
                transition={{
                    x: { duration: 0.45, ease: "easeInOut" },
                    boxShadow: { duration: 0.8 },
                }}
            />

            {/* Lamp Illumination */}
            <motion.div
                animate={{
                    opacity: isLightOn ? 0.65 : 0,
                }}
                transition={{
                    duration: 0.8,
                }}
                className="
                    absolute
                    left-1/2
                    -translate-x-1/2
                    -top-24
                    w-[480px]
                    h-[220px]
                    rounded-full
                    bg-yellow-200/25
                    blur-[120px]
                    pointer-events-none
                "
            />
            <motion.div
                animate={{
                    opacity: isLightOn ? 0.55 : 0,
                }}
                transition={{
                    duration: 0.8,
                }}
                className="
                    absolute
                    top-0
                    left-0
                    right-0
                    h-56
                    rounded-t-[30px]
                    pointer-events-none
                "
                style={{
                    background:
                        "linear-gradient(to bottom, rgba(253,224,71,.30), rgba(253,224,71,.10), transparent)",
                }}
            />

            {/* Top Glass Highlight */}
            <motion.div
                animate={{
                    opacity: isLightOn ? 0.85 : 0.15,
                }}
                transition={{
                    duration: 0.8,
                }}
                className="
                    absolute
                    top-0
                    left-6
                    right-6
                    h-px
                    rounded-full
                    bg-yellow-300/80
                    pointer-events-none
                "
            />

            {/* Dynamic Reflection */}
            <div className="absolute inset-0 rounded-[30px] overflow-hidden pointer-events-none">
                <motion.div
                    className="absolute pointer-events-none"
                    style={{
                        inset: "-80px",
                        background: `
                            radial-gradient(
                                circle at 50% 50%,
                                rgba(255,255,255,.30),
                                transparent 30%
                            ),
                            radial-gradient(
                                circle at 56% 58%,
                                rgba(255,255,255,.08),
                                transparent 50%
                            )
                        `,
                        willChange: "transform, opacity",
                    }}
                    animate={{
                        opacity: isLightOn ? 1 : 0.12,
                        x: reflectionTx,
                        y: reflectionTy,
                    }}
                    transition={{
                        opacity: { duration: 0.8 },
                        x: {
                            type: "spring",
                            stiffness: 35,
                            damping: 18,
                        },
                        y: {
                            type: "spring",
                            stiffness: 35,
                            damping: 18,
                        }
                    }}
                />
            </div>

            {/* Side Reflection */}
            <motion.div
                animate={{
                    x: ["-180%", "220%"],
                    opacity: isLightOn ? 0.08 : 0,
                }}
                transition={{
                    duration: 12,
                    repeat: Infinity,
                    ease: "linear",
                }}
                className="
                    absolute
                    top-0
                    bottom-0
                    w-32
                    bg-white/8
                    blur-2xl
                    -skew-x-12
                    pointer-events-none
                "
            />

            {/* Glass Shine */}
            <motion.div
                animate={{
                    opacity: isLightOn ? 1 : 0.2,
                }}
                className="
                    absolute
                    inset-0
                    rounded-[30px]
                    pointer-events-none
                    bg-gradient-to-br
                    from-white/14
                    via-transparent
                    to-transparent
                "
            />

            {/* Bottom Inner Shadow */}
            <motion.div
                animate={{
                    opacity: isLightOn ? 0.55 : 0.85,
                }}
                transition={{
                    duration: 0.8,
                }}
                className="
                    absolute
                    bottom-0
                    left-0
                    right-0
                    h-44
                    rounded-b-[30px]
                    pointer-events-none
                "
                style={{
                    background:
                        "linear-gradient(to top, rgba(0,0,0,.18), transparent)",
                }}
            />

            {/* Glass Borders */}
            <motion.div
                animate={{
                    opacity: isLightOn ? 0.55 : 0.15,
                }}
                className="
                    absolute
                    inset-0
                    rounded-[30px]
                    border
                    border-white/10
                    pointer-events-none
                "
            />

            <motion.div
                animate={{
                    opacity: isLightOn ? 0.35 : 0.05,
                }}
                className="
                    absolute
                    inset-[1px]
                    rounded-[29px]
                    border
                    border-yellow-400/35
                    pointer-events-none
                "
            />

            {/* Noise Layer */}
            <NoiseLayer />

            {/* Glass Refraction */}
            <motion.div
                animate={{
                    opacity: isLightOn ? 0.16 : 0.04,
                }}
                transition={{
                    duration: 1,
                }}
                className="
                    absolute
                    inset-0
                    rounded-[30px]
                    overflow-hidden
                    pointer-events-none
                "
            >
                <motion.div
                    animate={{
                        x: ["-120%", "120%"],
                    }}
                    transition={{
                        repeat: Infinity,
                        duration: 18,
                        ease: "linear",
                    }}
                    className="
                        absolute
                        top-0
                        h-full
                        w-40
                        -skew-x-12
                        blur-3xl
                        bg-white/10
                    "
                />
            </motion.div>
            
            <motion.div
                animate={{
                    opacity: isLightOn ? .14 : .04,
                }}
                className="
                    absolute
                    inset-12
                    rounded-[22px]
                    bg-white/5
                    blur-xl
                    pointer-events-none
                "
            />

            {/* Content */}
            <div
                className="relative z-10"
                style={{
                    transform: "translateZ(30px)",
                }}
            >
                {/* Secure Gateway Pulse Badge */}
                <motion.div variants={childVariants} className="flex justify-start pl-2 mb-3">
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-yellow-500/20 bg-yellow-500/5 backdrop-blur-md">
                        <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
                        <span className="text-[9px] font-bold tracking-[0.2em] text-yellow-300 uppercase">SECURE PORTAL</span>
                    </div>
                </motion.div>

                <motion.h1
                    variants={childVariants}
                    animate={{
                        opacity: isLightOn ? 1 : 0.8,
                    }}
                    className="text-[34px] font-extrabold tracking-tight bg-gradient-to-r from-white via-zinc-100 to-yellow-300 bg-clip-text text-transparent drop-shadow-sm pl-2"
                >
                    Identify Yourself
                </motion.h1>

                <motion.p
                    variants={childVariants}
                    animate={{
                        opacity: isLightOn ? 0.9 : 0.5,
                    }}
                    className="mt-2.5 mb-9 text-sm text-zinc-400 font-medium tracking-wide pl-2"
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