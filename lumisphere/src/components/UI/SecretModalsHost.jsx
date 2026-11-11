import { useEffect, useState } from "react";
import RetroArcadeModal from "../InteractiveDesk/RetroArcadeModal";
import HiddenDevRoomModal from "../InteractiveDesk/HiddenDevRoomModal";
import AchievementsModal from "../InteractiveDesk/AchievementsModal";

// Hosts the easter-egg modals (Konami arcade, Morse dev room, achievements) and opens them
// from global events fired by the desk monitor terminal and SecretsManager.
export default function SecretModalsHost() {
    const [open, setOpen] = useState(null);

    useEffect(() => {
        const onSecret = (e) => {
            if (e.detail?.type === "KONAMI_ACTIVATED") setOpen("arcade");
            if (e.detail?.type === "MORSE_ACTIVATED") setOpen("devroom");
        };
        const onOpen = (e) => setOpen(e.detail?.modal ?? null);
        window.addEventListener("lumisphere_secret_event", onSecret);
        window.addEventListener("lumisphere_open_modal", onOpen);
        return () => {
            window.removeEventListener("lumisphere_secret_event", onSecret);
            window.removeEventListener("lumisphere_open_modal", onOpen);
        };
    }, []);

    const close = () => setOpen(null);

    return (
        <>
            <RetroArcadeModal isOpen={open === "arcade"} onClose={close} />
            <HiddenDevRoomModal isOpen={open === "devroom"} onClose={close} />
            <AchievementsModal isOpen={open === "achievements"} onClose={close} />
        </>
    );
}
