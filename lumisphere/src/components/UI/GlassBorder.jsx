import { motion } from "framer-motion";
import { useLight } from "../../context/LightContext";

export default function GlassBorder() {

    const { isLightOn } = useLight();

    return (

        <>

            {/* Outer Border */}

            <motion.div

                animate={{
                    opacity: isLightOn ? .45 : .15
                }}

                className="
                    absolute
                    inset-0

                    rounded-[34px]

                    border

                    border-white/10
                "

            />

            {/* Inner Highlight */}

            <motion.div

                animate={{
                    opacity: isLightOn ? .9 : .2
                }}

                className="
                    absolute

                    inset-[1px]

                    rounded-[33px]

                    border

                    border-white/10
                "

            />

        </>

    );

}