import { motion } from "framer-motion";
import { useState, forwardRef } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useLight } from "../../context/LightContext";

const PremiumInput = forwardRef(({
    icon: Icon,
    label,
    type = "text",
    error,
    onChange,
    onBlur,
    onFocus,
    ...props
}, ref) => {
    const { isLightOn, setIsInputFocused } = useLight();

    const [focused, setFocused] = useState(false);
    const [localValue, setLocalValue] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const isActive = focused || localValue.length > 0 || (props.value && String(props.value).length > 0);

    const handleFocus = (e) => {
        setFocused(true);
        if (onFocus) onFocus(e);
        if (setIsInputFocused) setIsInputFocused(true);
    };

    const handleBlur = (e) => {
        setFocused(false);
        if (onBlur) onBlur(e);
        if (setIsInputFocused) setIsInputFocused(false);
    };

    const handleChange = (e) => {
        setLocalValue(e.target.value);
        if (onChange) onChange(e);
    };

    return (
        <motion.div
            whileHover={{
                y: -2,
                scale: 1.01,
            }}
            animate={{
                filter: isLightOn
                    ? "brightness(1)"
                    : "brightness(.82)",

                boxShadow: focused
                    ? isLightOn
                        ? "0 12px 35px rgba(139, 92, 246, 0.2), inset 0 1px 0 rgba(255,255,255,0.08)"
                        : "0 12px 35px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255,255,255,0.04)"
                    : isLightOn
                        ? "0 4px 16px rgba(0,0,0,.06), inset 0 1px 0 rgba(255,255,255,0.04)"
                        : "0 4px 16px rgba(0,0,0,.22), inset 0 1px 0 rgba(255,255,255,0.01)",
            }}
            transition={{
                type: "spring",
                stiffness: 260,
                damping: 22,
            }}
            style={{
                transform: "translateZ(15px)",
                transformStyle: "preserve-3d",
            }}
            className="relative w-full h-[76px] rounded-2xl flex items-center"
        >

            {/* ================= Premium Glass Body ================= */}

            <motion.div
                animate={{
                    opacity: focused ? 1 : 0.85,
                    scale: focused ? 1 : 0.995,
                    borderColor: error
                        ? "rgba(239, 68, 68, 0.45)"
                        : focused
                            ? "rgba(251,191,36,.35)"
                            : "rgba(255,255,255,.06)",
                    backgroundColor: error
                        ? "rgba(239, 68, 68, 0.03)"
                        : focused
                            ? "rgba(10,10,12,0.65)"
                            : "rgba(10,10,12,0.45)",
                }}
                transition={{
                    duration: .25,
                }}
                className="absolute inset-0 rounded-2xl border backdrop-blur-xl pointer-events-none"
            />

            {/* Inner Highlight */}

            <div
                className="absolute inset-[1px] rounded-2xl pointer-events-none"
                style={{
                    boxShadow:
                        "inset 0 1px rgba(255,255,255,.08)",
                }}
            />

            {/* Bottom Depth */}

            <div
                className="absolute inset-[1px] rounded-2xl pointer-events-none"
                style={{
                    boxShadow:
                        "inset 0 -12px 25px rgba(0,0,0,.15)",
                }}
            />

            {/* ================= Lamp Reflection ================= */}

            <motion.div

                animate={{

                    opacity: focused && isLightOn ? .3 : 0,

                    x: focused ? 25 : -25,

                }}

                transition={{
                    duration: .5,
                }}

                className="absolute top-1 left-6 w-20 h-10 rounded-full bg-white/10 blur-xl pointer-events-none"
            />

            {/* ================= Glass Icon Capsule ================= */}

            <motion.div

                animate={{

                    scale: focused ? 1.05 : 1,

                    rotate: focused ? -3 : 0,

                    borderColor: error
                        ? "rgba(239, 68, 68, 0.3)"
                        : focused
                            ? "rgba(251,191,36,.3)"
                            : "rgba(255,255,255,.06)",

                    backgroundColor: focused
                        ? "rgba(255,255,255,.06)"
                        : "rgba(255,255,255,.02)"

                }}

                className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-xl border backdrop-blur-lg flex items-center justify-center pointer-events-none shadow-[inset_0_1px_rgba(255,255,255,0.08)]"

            >

                <motion.div

                    animate={{
                        color: error
                            ? "#F87171"
                            : focused
                                ? "#FDE047"
                                : "#9CA3AF",
                    }}

                >

                    <Icon size={18} />

                </motion.div>

            </motion.div>

            {/* ================= Label ================= */}

            <motion.label

                animate={{

                    y: isActive ? 13 : 32,

                    x: 72,

                    scale: isActive ? .72 : 1,

                    color: error
                        ? "#F87171"
                        : focused
                            ? "#FDE047"
                            : "#A1A1AA",

                }}

                transition={{

                    type: "spring",

                    stiffness: 260,

                    damping: 20,

                }}

                className="absolute top-0 origin-left uppercase tracking-[.25em] text-[10.5px] font-semibold pointer-events-none flex items-center gap-1.5"

            >

                <span>{label}</span>
                {error && (
                    <motion.span 
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-[9px] text-red-400/90 lowercase tracking-normal font-normal"
                    >
                        - {error.message}
                    </motion.span>
                )}

            </motion.label>

            {/* ================= Input ================= */}

            <input
                ref={ref}
                type={
                    type === "password"
                        ? showPassword
                            ? "text"
                            : "password"
                        : type
                }
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                {...props}
                style={{
                    paddingLeft: "72px",
                    paddingRight: "56px",
                    paddingTop: "16px",
                }}

                className="relative z-20 w-full h-full bg-transparent text-[15px] font-medium text-white outline-none caret-yellow-400"
            />

            {/* Focused Ambient Glow Line */}
            {focused && (
                <motion.div
                    layoutId={`glow-line-${label}`}
                    className={`absolute bottom-0 left-6 right-6 h-[2px] bg-gradient-to-r ${error ? 'from-transparent via-red-500/80 to-transparent' : 'from-transparent via-yellow-400/80 to-transparent'} blur-[0.5px]`}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    exit={{ scaleX: 0 }}
                    transition={{ duration: 0.25 }}
                />
            )}

            {/* ================= Password Toggle ================= */}

            {type === "password" && (

                <motion.button

                    whileHover={{
                        scale: 1.1,
                    }}

                    whileTap={{
                        scale: .92,
                    }}

                    type="button"

                    onClick={() =>
                        setShowPassword(!showPassword)
                    }

                    className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition z-30"
                >

                    {showPassword
                        ? <EyeOff size={18} />
                        : <Eye size={18} />}

                </motion.button>

            )}

        </motion.div>
    );
});

PremiumInput.displayName = "PremiumInput";
export default PremiumInput;