import { motion } from "framer-motion";
import { useLight } from "../../context/LightContext";

const rays = [...Array(22)];

export default function GodRays() {

    const { isLightOn } = useLight();

    return (

        <div
            className="
                absolute
                left-1/2
                top-[170px]
                -translate-x-1/2
                pointer-events-none
                z-5
            "
        >

            {rays.map((_, i) => (

                <motion.div

                    key={i}

                    animate={{

                        opacity: isLightOn
                            ? [.02, .12, .02]
                            : 0,

                        scaleY: isLightOn
                            ? [1, 1.08, 1]
                            : .9,

                    }}

                    transition={{

                        duration: 5 + Math.random() * 6,

                        repeat: Infinity,

                        delay: Math.random() * 4

                    }}

                    className="absolute"

                    style={{

                        left: `${(i - 11) * 24}px`,

                        width: `${1 + Math.random() * 2}px`,

                        height: "850px",

                        transform: `rotate(${(i - 11) * 1.4}deg)`,

                        transformOrigin: "top",

                        background:
                            "linear-gradient(to bottom, rgba(255,255,230,.35), transparent)",

                        filter: "blur(1px)"

                    }}

                />

            ))}

        </div>

    );

}