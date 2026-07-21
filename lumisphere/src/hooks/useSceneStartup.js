import { useEffect, useState } from "react";

export default function useSceneStartup() {
    const [sceneReady, setSceneReady] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setSceneReady(true);
        }, 1800);

        return () => clearTimeout(timer);
    }, []);

    return sceneReady;
}