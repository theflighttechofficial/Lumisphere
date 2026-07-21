import { createContext, useContext, useEffect, useState } from "react";

const SceneContext = createContext();

export function SceneProvider({ children }) {
    const [sceneReady, setSceneReady] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setSceneReady(true);
        }, 4000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <SceneContext.Provider
            value={{
                sceneReady,
            }}
        >
            {children}
        </SceneContext.Provider>
    );
}

export const useScene = () => useContext(SceneContext);