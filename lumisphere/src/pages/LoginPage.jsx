import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

import SimulationCanvas from "../components/Effects/SimulationCanvas";
import Lamp from "../components/Lamp/Lamp";
import LoginCard from "../components/Login/LoginCard";
import Drone from "../components/UI/Drone";
import AudioToggle from "../components/UI/AudioToggle";
import AboutPage from "../components/About/AboutPage";

import useSceneStartup from "../hooks/useSceneStartup";
import { useLight } from "../context/LightContext";

export default function LoginPage() {
    const { isLightOn, isLoggedIn } = useLight();
    const sceneReady = useSceneStartup();
    const containerRef = useRef(null);

    useEffect(() => {
        if (isLoggedIn && containerRef.current) {
            containerRef.current.scrollTop = 0;
            
            // Periodically reset the scroll during the login transition to ensure
            // any browser-initiated scrolling due to animated focused inputs is neutralized
            const interval = setInterval(() => {
                if (containerRef.current) {
                    containerRef.current.scrollTop = 0;
                }
            }, 50);
            
            const timeout = setTimeout(() => {
                clearInterval(interval);
            }, 1500);

            return () => {
                clearInterval(interval);
                clearTimeout(timeout);
            };
        }
    }, [isLoggedIn]);

    return (
        <motion.div
            ref={containerRef}
            initial={{
                opacity: 0,
                scale: 1.03,
            }}
            animate={{
                opacity: sceneReady ? 1 : 0,
                scale: sceneReady ? 1 : 1.03,
            }}
            transition={{
                duration: 1.2,
                ease: "easeOut",
            }}
            className="relative w-screen h-screen overflow-hidden bg-black"
            onScroll={(e) => {
                e.currentTarget.scrollTop = 0;
                e.currentTarget.scrollLeft = 0;
            }}
        >

            {/* WebGL GPU Simulation Backdrop */}
            <SimulationCanvas />

            {/* Lamp */}
            <Lamp />

            {/* Helper Floating Hover Drone (Tells user to pull the chain) */}
            <Drone />

            {/* Audio Toggle Control */}
            <AudioToggle />

            {/* About Page (Portfolio Screen) */}
            <AnimatePresence>
                {isLoggedIn && (
                    <AboutPage key="about-portal-screen" />
                )}
            </AnimatePresence>

            {/* Login Card */}
            <motion.div
                initial={{
                    opacity: 0,
                    y: 100,
                    scale: 0.92,
                }}
                animate={{
                    opacity: sceneReady ? (isLightOn ? (isLoggedIn ? 0 : 1) : 0) : 0,
                    y: sceneReady ? (isLoggedIn ? -120 : 0) : 100,
                    scale: sceneReady ? (isLightOn ? (isLoggedIn ? 0.8 : 1) : 0.85) : 0.92,
                }}
                transition={{
                    duration: 0.8,
                    ease: "easeOut",
                }}
                className="
                    absolute
                    inset-0
                    z-[60]
                    flex
                    items-center
                    justify-center
                    translate-y-24
                    pointer-events-none
                "
            >
                <div className={(isLightOn && !isLoggedIn) ? "pointer-events-auto" : "pointer-events-none"}>
                    <LoginCard />
                </div>
            </motion.div>

        </motion.div>
    );
}