import { motion } from "framer-motion";

export default function Header() {
    return (
        <div className="text-center mb-6 sm:mb-12">

            {/* Logo */}

            <motion.div

                animate={{
                    y: [-2, 2, -2],
                    opacity: [.8, 1, .8]
                }}

                transition={{
                    repeat: Infinity,
                    duration: 5
                }}

                className="
                    mx-auto
                    mb-5
                    sm:mb-7

                    flex
                    items-center
                    justify-center

                    w-12
                    h-12
                    sm:w-16
                    sm:h-16

                    rounded-full

                    bg-gradient-to-br
                    from-violet-500
                    to-indigo-600

                    shadow-[0_0_45px_rgba(124,58,237,.55)]
                "

            >

                <motion.div

                    animate={{
                        scale: [1, 1.1, 1]
                    }}

                    transition={{
                        repeat: Infinity,
                        duration: 3
                    }}

                    className="
                        w-5
                        h-5
                        sm:w-7
                        sm:h-7
                        rounded-full
                        bg-white/90
                    "

                />

            </motion.div>

            <motion.h1

                className="
                    text-2xl
                    sm:text-4xl
                    md:text-5xl
                    font-bold
                    tracking-[0.12em]
                    sm:tracking-[0.18em]
                    uppercase
                "

            >

                Welcome Back

            </motion.h1>

            <motion.p

                className="
                    mt-2
                    sm:mt-4
                    text-xs
                    sm:text-sm
                    text-gray-400
                    tracking-wide
                "

            >

                Continue your journey.

            </motion.p>

        </div>
    );
}