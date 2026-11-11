import { lazy, Suspense, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

import SimulationCanvas from "../components/Effects/SimulationCanvas";
import Lamp from "../components/Lamp/Lamp";
import LoginCard from "../components/Login/LoginCard";
import AudioToggle from "../components/UI/AudioToggle";
import EnvironmentControlPanel from "../components/UI/EnvironmentControlPanel";
import InteractiveDesk from "../components/InteractiveDesk/InteractiveDesk";

import useSceneStartup from "../hooks/useSceneStartup";
import { useLight } from "../context/LightContext";

// The portfolio only appears after the lamp is lit, so its code loads in the background meanwhile.
const loadAboutPage = () => import("../components/About/AboutPage");
const AboutPage = lazy(loadAboutPage);

export default function LoginPage() {
    const { isLightOn, isLoggedIn, toggleLight } = useLight();
    const sceneReady = useSceneStartup();
    const containerRef = useRef(null);

    // Prefetch the portfolio chunk as soon as the light comes on.
    useEffect(() => {
        if (isLightOn) loadAboutPage();
    }, [isLightOn]);

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
            className="relative w-full min-h-screen min-h-[100dvh] overflow-x-hidden bg-black flex flex-col items-center justify-between p-3 sm:p-6"
            onScroll={(e) => {
                e.currentTarget.scrollTop = 0;
                e.currentTarget.scrollLeft = 0;
            }}
        >

            {/* WebGL GPU Simulation Backdrop */}
            <SimulationCanvas />

            {/* Lamp */}
            <Lamp />

            {/* First-visit cue: pull the chain, or tap this to switch the lamp on */}
            <AnimatePresence>
                {sceneReady && !isLightOn && !isLoggedIn && (
                    <motion.button
                        key="lamp-hint"
                        type="button"
                        onClick={toggleLight}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ delay: 0.8, duration: 0.6 }}
                        className="absolute inset-x-0 mx-auto w-fit max-w-[calc(100vw-2rem)] bottom-[max(6rem,env(safe-area-inset-bottom))] sm:bottom-24 z-[80] flex items-center gap-2.5 px-5 py-3 rounded-full border border-amber-300/30 bg-black/60 backdrop-blur-md text-sm font-semibold text-amber-100 shadow-[0_0_30px_rgba(251,191,36,0.15)] hover:border-amber-300/60 text-center"
                    >
                        <span className="relative flex w-2 h-2">
                            <span className="absolute inline-flex w-full h-full rounded-full bg-amber-300 opacity-70 animate-ping" />
                            <span className="relative inline-flex w-2 h-2 rounded-full bg-amber-300" />
                        </span>
                        Pull the chain to switch on the lamp — or tap here
                    </motion.button>
                )}
            </AnimatePresence>

            {/* Scene helpers step aside once the portfolio is open so nothing covers the content */}
            {!isLoggedIn && <AudioToggle />}
            {!isLoggedIn && <EnvironmentControlPanel />}

            {/* About Page (Portfolio Screen) */}
            <AnimatePresence>
                {isLoggedIn && (
                    <Suspense key="about-portal-screen" fallback={null}>
                        <AboutPage />
                    </Suspense>
                )}
            </AnimatePresence>

            {/* Login Card (Secure Portal Box kept down under light beam) */}
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
                    items-end
                    sm:items-center
                    justify-center
                    pt-[38vh]
                    pb-[max(4.5rem,env(safe-area-inset-bottom))]
                    sm:py-0
                    sm:translate-y-24
                    pointer-events-none
                    w-full
                "
            >
                <div className={(isLightOn && !isLoggedIn) ? "pointer-events-auto w-full flex justify-center px-3" : "pointer-events-none w-full flex justify-center px-3"}>
                    <LoginCard />
                </div>
            </motion.div>

            {/* Playable Interactive Desk Environment Docked vertically along the left edge */}
            <AnimatePresence>
                {sceneReady && isLightOn && !isLoggedIn && (
                    <motion.div
                        key="desk"
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.8 }}
                    >
                        <InteractiveDesk />
                    </motion.div>
                )}
            </AnimatePresence>

        </motion.div>
    );
}
