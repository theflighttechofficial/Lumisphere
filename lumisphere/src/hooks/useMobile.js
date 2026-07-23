import { useState, useEffect } from "react";

/**
 * Custom hook to detect mobile screen width dynamically.
 * @param {number} breakpoint - Pixel width threshold for mobile layout (default: 1024px)
 * @returns {boolean} isMobile - True if screen width is less than breakpoint
 */
export default function useMobile(breakpoint = 1024) {
    const [isMobile, setIsMobile] = useState(() => {
        if (typeof window !== "undefined") {
            return window.innerWidth < breakpoint;
        }
        return false;
    });

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < breakpoint);
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [breakpoint]);

    return isMobile;
}
