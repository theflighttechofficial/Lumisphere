import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    BookOpen,
    Coffee,
    Keyboard,
    Mouse,
    StickyNote,
    Edit3,
    HardDrive,
    Bookmark,
    Monitor,
    Sparkles,
    ChevronLeft,
    ChevronRight
} from "lucide-react";
import DeskObject from "./DeskObject";
import CoffeeMugSteam from "./CoffeeMugSteam";
import NotebookModal from "./NotebookModal";
import USBProjectsModal from "./USBProjectsModal";
import StickyNotesApp from "./StickyNotesApp";
import ScribbleCanvas from "./ScribbleCanvas";
import MechKeyboardModal from "./MechKeyboardModal";
import BookshelfModal from "./BookshelfModal";
import MonitorDisplayModal from "./MonitorDisplayModal";
import { AudioEngine } from "../../utils/AudioEngine";

export default function InteractiveDesk() {
    // Modal states
    const [activeModal, setActiveModal] = useState(null);
    const [isCollapsed, setIsCollapsed] = useState(false);
    
    // Object-specific physics toggles
    const [steamActive, setSteamActive] = useState(true);
    const [mouseLaserActive, setMouseLaserActive] = useState(false);
    const [mugSipCount, setMugSipCount] = useState(0);

    const handleObjectClick = (id) => {
        switch (id) {
            case "notebook":
                setActiveModal("notebook");
                break;
            case "mug":
                AudioEngine.playCoffeeClink();
                setSteamActive((prev) => !prev);
                setMugSipCount((prev) => prev + 1);
                break;
            case "keyboard":
                setActiveModal("keyboard");
                break;
            case "mouse":
                AudioEngine.playMouseClick();
                setMouseLaserActive((prev) => !prev);
                break;
            case "notes":
                setActiveModal("notes");
                break;
            case "pen":
                setActiveModal("pen");
                break;
            case "usb":
                AudioEngine.playUsbPlug();
                setActiveModal("usb");
                break;
            case "books":
                setActiveModal("books");
                break;
            case "monitor":
                AudioEngine.playMonitorPower();
                setActiveModal("monitor");
                break;
            default:
                break;
        }
    };

    return (
        <div className="fixed left-2 sm:left-4 top-1/2 -translate-y-1/2 z-[70] flex items-center">
            {/* Main Vertical Desk Toolbar Dock Container */}
            <motion.div
                initial={{ opacity: 0, x: -80 }}
                animate={{
                    opacity: 1,
                    x: isCollapsed ? "calc(-100% - 12px)" : 0,
                }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="relative flex items-center"
            >
                <div className="relative rounded-2xl p-2.5 sm:p-3 bg-neutral-950/90 border border-amber-500/30 shadow-[0_0_40px_rgba(0,0,0,0.85)] backdrop-blur-md flex flex-col items-center gap-2 max-h-[92vh] overflow-y-auto custom-scrollbar select-none">
                    {/* Desk Vertical Header Title */}
                    <div className="w-full pb-2 mb-1 border-b border-amber-500/20 flex flex-col items-center text-center">
                        <div className="flex items-center gap-1.5 mb-1">
                            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                            <span className="font-mono text-[10px] font-bold text-amber-300 tracking-wider uppercase">
                                DESK RIG
                            </span>
                        </div>
                        <span className="text-[9px] font-mono text-neutral-400">Interactive</span>
                    </div>

                    {/* 9 Playable Desk Objects Vertical Column (Top to Bottom) */}
                    <div className="flex flex-col gap-2 w-full">
                        {/* 1. Notebook */}
                        <DeskObject
                            id="notebook"
                            label="Notebook"
                            subtitle="Project Notes"
                            shortcut="Click"
                            icon={BookOpen}
                            glowColor="rgba(251, 191, 36, 0.4)"
                            onClick={handleObjectClick}
                            className="w-16 h-16 !p-1.5"
                        >
                            <div className="relative w-8 h-9 bg-amber-950/80 rounded-md border border-amber-600/60 shadow-sm flex items-center justify-center">
                                <BookOpen className="w-4 h-4 text-amber-400" />
                                <div className="absolute top-1 right-1 w-0.5 h-2 bg-amber-400 rounded-sm" />
                            </div>
                        </DeskObject>

                        {/* 2. Coffee Mug */}
                        <DeskObject
                            id="mug"
                            label="Coffee Mug"
                            subtitle={steamActive ? "Steam ON" : "Warm Up"}
                            shortcut="Click"
                            icon={Coffee}
                            badgeText={mugSipCount > 0 ? `Sips: ${mugSipCount}` : null}
                            glowColor="rgba(245, 158, 11, 0.4)"
                            onClick={handleObjectClick}
                            className="w-16 h-16 !p-1.5"
                        >
                            <div className="relative flex flex-col items-center">
                                <CoffeeMugSteam active={steamActive} density={0.6} />
                                <div className="w-7 h-8 bg-amber-600/90 rounded-b-lg rounded-t-sm border border-amber-400/80 shadow-sm flex items-center justify-center relative">
                                    <Coffee className="w-3.5 h-3.5 text-amber-100" />
                                    <div className="absolute -right-2 top-1.5 w-2 h-3.5 border border-amber-400/80 rounded-r-md" />
                                </div>
                            </div>
                        </DeskObject>

                        {/* 3. Mechanical Keyboard */}
                        <DeskObject
                            id="keyboard"
                            label="Keyboard"
                            subtitle="Audio Typing"
                            shortcut="Click"
                            icon={Keyboard}
                            glowColor="rgba(192, 132, 252, 0.4)"
                            onClick={handleObjectClick}
                            className="w-16 h-16 !p-1.5"
                        >
                            <div className="w-9 h-7 bg-purple-950/80 rounded-md border border-purple-500/60 shadow-sm flex items-center justify-center relative">
                                <Keyboard className="w-4 h-4 text-purple-400" />
                                <div className="absolute bottom-0.5 inset-x-1 h-0.5 bg-purple-400 animate-pulse" />
                            </div>
                        </DeskObject>

                        {/* 4. Mouse */}
                        <DeskObject
                            id="mouse"
                            label="Mouse"
                            subtitle={mouseLaserActive ? "Laser RGB" : "Click DPI"}
                            shortcut="Click"
                            icon={Mouse}
                            glowColor="rgba(56, 189, 248, 0.4)"
                            onClick={handleObjectClick}
                            className="w-16 h-16 !p-1.5"
                        >
                            <div className={`relative w-6 h-8 rounded-t-full rounded-b-md border transition-all flex flex-col items-center justify-start pt-1 ${
                                mouseLaserActive ? "bg-sky-950 border-sky-400 shadow-[0_0_10px_rgba(56,189,248,0.8)]" : "bg-neutral-900 border-neutral-700"
                            }`}>
                                <div className="w-1 h-2 bg-sky-400 rounded-full animate-pulse" />
                            </div>
                        </DeskObject>

                        {/* 5. Sticky Notes */}
                        <DeskObject
                            id="notes"
                            label="Sticky Notes"
                            subtitle="To-Do Notes"
                            shortcut="Click"
                            icon={StickyNote}
                            glowColor="rgba(234, 179, 8, 0.4)"
                            onClick={handleObjectClick}
                            className="w-16 h-16 !p-1.5"
                        >
                            <div className="w-8 h-8 bg-yellow-400/90 rounded-md border border-yellow-300 shadow-sm flex items-center justify-center transform -rotate-3">
                                <StickyNote className="w-4 h-4 text-neutral-950" />
                            </div>
                        </DeskObject>

                        {/* 6. Pen */}
                        <DeskObject
                            id="pen"
                            label="Pen"
                            subtitle="Doodle Mode"
                            shortcut="Click"
                            icon={Edit3}
                            glowColor="rgba(52, 211, 153, 0.4)"
                            onClick={handleObjectClick}
                            className="w-16 h-16 !p-1.5"
                        >
                            <div className="w-3 h-9 bg-gradient-to-b from-emerald-500 to-emerald-800 rounded-full border border-emerald-300 shadow-sm flex flex-col items-center justify-between py-0.5 transform rotate-12">
                                <div className="w-1.5 h-1.5 bg-emerald-200 rounded-full" />
                            </div>
                        </DeskObject>

                        {/* 7. USB Drive */}
                        <DeskObject
                            id="usb"
                            label="USB Drive"
                            subtitle="Launch Projects"
                            shortcut="Click"
                            icon={HardDrive}
                            glowColor="rgba(56, 189, 248, 0.4)"
                            onClick={handleObjectClick}
                            className="w-16 h-16 !p-1.5"
                        >
                            <div className="w-8 h-6 bg-sky-950/80 rounded border border-sky-500/80 shadow-sm flex items-center justify-between px-1 relative">
                                <div className="w-2 h-3.5 bg-neutral-300 rounded-sm" />
                                <div className="w-1 h-1 rounded-full bg-emerald-400 animate-ping" />
                            </div>
                        </DeskObject>

                        {/* 8. Books */}
                        <DeskObject
                            id="books"
                            label="Books"
                            subtitle="Tech Library"
                            shortcut="Click"
                            icon={Bookmark}
                            glowColor="rgba(251, 191, 36, 0.4)"
                            onClick={handleObjectClick}
                            className="w-16 h-16 !p-1.5"
                        >
                            <div className="relative flex flex-col gap-0.5 items-center">
                                <div className="w-8 h-2 bg-amber-700/80 rounded border border-amber-500" />
                                <div className="w-8.5 h-2 bg-sky-700/80 rounded border border-sky-500" />
                                <div className="w-9 h-2 bg-emerald-700/80 rounded border border-emerald-500" />
                            </div>
                        </DeskObject>

                        {/* 9. Monitor */}
                        <DeskObject
                            id="monitor"
                            label="Monitor"
                            subtitle="Interactive OS"
                            shortcut="Click"
                            icon={Monitor}
                            glowColor="rgba(56, 189, 248, 0.4)"
                            onClick={handleObjectClick}
                            className="w-16 h-16 !p-1.5"
                        >
                            <div className="w-9 h-7 bg-neutral-900 rounded-md border border-sky-400/80 shadow-sm flex items-center justify-center relative">
                                <Monitor className="w-4 h-4 text-sky-400" />
                                <div className="absolute top-0.5 right-0.5 w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
                            </div>
                        </DeskObject>
                    </div>
                </div>

                {/* Panel Collapse Toggle Handle */}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-10 bg-neutral-900 border border-amber-500/40 text-amber-400 rounded-r-lg flex items-center justify-center hover:bg-neutral-800 shadow-lg z-50 transition cursor-pointer"
                    title={isCollapsed ? "Expand Desk Rig" : "Collapse Desk Rig"}
                >
                    {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                </button>
            </motion.div>

            {/* Render Active Modals */}
            <NotebookModal
                isOpen={activeModal === "notebook"}
                onClose={() => setActiveModal(null)}
            />
            <USBProjectsModal
                isOpen={activeModal === "usb"}
                onClose={() => setActiveModal(null)}
            />
            <StickyNotesApp
                isOpen={activeModal === "notes"}
                onClose={() => setActiveModal(null)}
            />
            <ScribbleCanvas
                isOpen={activeModal === "pen"}
                onClose={() => setActiveModal(null)}
            />
            <MechKeyboardModal
                isOpen={activeModal === "keyboard"}
                onClose={() => setActiveModal(null)}
            />
            <BookshelfModal
                isOpen={activeModal === "books"}
                onClose={() => setActiveModal(null)}
            />
            <MonitorDisplayModal
                isOpen={activeModal === "monitor"}
                onClose={() => setActiveModal(null)}
            />
        </div>
    );
}
