import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";

export default function InputField({
    icon: Icon,
    label,
    type = "text",
}) {
    const [focused, setFocused] = useState(false);
    const [value, setValue] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const isPassword = type === "password";

    return (
        <motion.div
            whileHover={{ scale: 1.01 }}
            className="
                relative
                rounded-xl
                border
                border-white/10
                bg-white/5
                transition-all
                duration-300
                focus-within:border-violet-500
                focus-within:bg-white/10
                focus-within:shadow-[0_0_25px_rgba(124,58,237,.35)]
            "
        >
            {/* Icon */}
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <Icon size={18} />
            </div>

            {/* Floating Label */}
            <motion.label
                animate={{
                    top: focused || value ? 10 : 22,
                    fontSize: focused || value ? 12 : 16,
                    color: focused
                        ? "#a855f7"
                        : "#9ca3af",
                }}
                transition={{
                    duration: 0.2,
                }}
                className="
                    absolute
                    left-12
                    pointer-events-none
                "
            >
                {label}
            </motion.label>

            {/* Input */}
            <input
                type={
                    isPassword
                        ? showPassword
                            ? "text"
                            : "password"
                        : type
                }
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                className="
                    w-full
                    bg-transparent
                    pt-8
                    pb-3
                    pl-12
                    pr-12
                    outline-none
                    text-white
                "
            />

            {/* Password Toggle */}
            {isPassword && (
                <button
                    type="button"
                    onClick={() =>
                        setShowPassword(!showPassword)
                    }
                    className="
                        absolute
                        right-4
                        top-1/2
                        -translate-y-1/2
                        text-gray-400
                        hover:text-white
                    "
                >
                    {showPassword ? (
                        <EyeOff size={18} />
                    ) : (
                        <Eye size={18} />
                    )}
                </button>
            )}
        </motion.div>
    );
}