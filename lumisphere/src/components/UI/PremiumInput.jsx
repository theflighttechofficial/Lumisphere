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
                boxShadow: focused
                    ? "0 12px 35px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255,255,255,0.02)"
                    : "0 4px 16px rgba(0,0,0,.4)",
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
            className="relative w-full h-[76px] rounded-2xl flex items-center bg-black"
        >

            {/* Pitch Black Glass Body */}
            <motion.div
                animate={{
                    borderColor: error
                        ? "rgba(239, 68, 68, 0.8)"
                        : focused
                            ? "rgba(239, 68, 68, 0.6)"
                            : "rgba(39, 39, 42, 0.8)",
                    backgroundColor: "#050505",
                }}
                transition={{
                    duration: .25,
                }}
                className="absolute inset-0 rounded-2xl border pointer-events-none"
            />

            {/* Black Icon Capsule */}
            <motion.div
                animate={{
                    scale: focused ? 1.05 : 1,
                    borderColor: focused ? "rgba(239, 68, 68, 0.5)" : "rgba(39, 39, 42, 0.8)",
                    backgroundColor: "#09090b"
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-xl border flex items-center justify-center pointer-events-none"
            >
                <motion.div animate={{ color: "#F87171" }}>
                    <Icon size={18} />
                </motion.div>
            </motion.div>

            {/* Red Floating Label Text Only */}
            <motion.label
                animate={{
                    y: isActive ? 13 : 32,
                    x: 72,
                    scale: isActive ? .72 : 1,
                    color: "#F87171",
                }}
                transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 20,
                }}
                className="absolute top-0 origin-left uppercase tracking-[.25em] text-[10.5px] font-extrabold pointer-events-none flex items-center gap-1.5"
            >
                <span>{label}</span>
                {error && (
                    <motion.span 
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-[9px] text-red-400 font-bold lowercase tracking-normal"
                    >
                        - {error.message}
                    </motion.span>
                )}
            </motion.label>

            {/* Red Typed Input Value Text Only */}
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
                className="relative z-20 w-full h-full bg-transparent text-[15px] font-bold text-red-400 outline-none caret-red-500 tracking-wide"
            />

            {/* Focused Glow Line */}
            {focused && (
                <motion.div
                    layoutId={`glow-line-${label}`}
                    className="absolute bottom-0 left-6 right-6 h-[2px] bg-red-500 blur-[0.5px]"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    exit={{ scaleX: 0 }}
                    transition={{ duration: 0.25 }}
                />
            )}

            {/* Password Toggle */}
            {type === "password" && (
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: .92 }}
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-red-400 hover:text-red-300 transition z-30"
                >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </motion.button>
            )}
        </motion.div>
    );
});

PremiumInput.displayName = "PremiumInput";
export default PremiumInput;