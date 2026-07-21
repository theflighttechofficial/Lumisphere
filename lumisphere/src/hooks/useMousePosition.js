import { useEffect, useState } from "react";

export default function useMousePosition() {
    const [mouse, setMouse] = useState({
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
    });

    useEffect(() => {
        const handleMove = (e) => {
            setMouse({
                x: e.clientX,
                y: e.clientY,
            });
        };

        window.addEventListener("mousemove", handleMove);

        return () =>
            window.removeEventListener("mousemove", handleMove);
    }, []);

    return mouse;
}