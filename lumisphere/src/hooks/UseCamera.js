import { useMotionValue, useSpring } from "framer-motion";
import { useEffect } from "react";

export default function useCamera() {

    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const x = useSpring(mouseX, {
        stiffness: 35,
        damping: 18,
    });

    const y = useSpring(mouseY, {
        stiffness: 35,
        damping: 18,
    });

    useEffect(() => {

        const move = (e) => {

            mouseX.set(
                (e.clientX - window.innerWidth / 2) / 45
            );

            mouseY.set(
                (e.clientY - window.innerHeight / 2) / 45
            );

        };

        window.addEventListener("mousemove", move);

        return () =>
            window.removeEventListener(
                "mousemove",
                move
            );

    }, []);

    return { x, y };

}