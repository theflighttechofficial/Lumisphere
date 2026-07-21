import { motion } from "framer-motion";
import { useLight } from "../../context/LightContext";

export default function FloorReflection() {

    const { isLightOn } = useLight();

    return (

        <motion.div

            animate={{

                opacity: isLightOn ? .22 : 0,

                scaleX: isLightOn ? 1 : .9

            }}

            transition={{

                duration: 1.2

            }}

            className="
                absolute

                left-1/2
                bottom-20

                -translate-x-1/2

                w-[520px]
                h-24

                rounded-full

                pointer-events-none
            "

            style={{

                background:
                    "radial-gradient(circle, rgba(255,255,255,.18), transparent 75%)",

                filter: "blur(45px)"

            }}

        />

    );

}