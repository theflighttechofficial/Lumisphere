import { useEffect, useState } from "react";

export default function useMousePosition() {
    const [mouse, setMouse] = useState({
        x: typeof window !== "undefined" ? window.innerWidth / 2 : 0,
        y: typeof window !== "undefined" ? window.innerHeight / 2 : 0,
    });

    useEffect(() => {
        const handleMove = (e) => {
            const clientX = e.touches && e.touches.length > 0 ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches && e.touches.length > 0 ? e.touches[0].clientY : e.clientY;
            setMouse({
                x: clientX,
                y: clientY,
            });
        };

        window.addEventListener("mousemove", handleMove);
        window.addEventListener("touchstart", handleMove, { passive: true });
        window.addEventListener("touchmove", handleMove, { passive: true });

        return () => {
            window.removeEventListener("mousemove", handleMove);
            window.removeEventListener("touchstart", handleMove);
            window.removeEventListener("touchmove", handleMove);
        };
    }, []);

    return mouse;
}