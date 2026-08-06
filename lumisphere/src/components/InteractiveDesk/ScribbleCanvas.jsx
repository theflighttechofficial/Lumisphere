import React, { useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Edit3, Eraser, Trash2, X, Check } from "lucide-react";
import { AudioEngine } from "../../utils/AudioEngine";

const PEN_COLORS = [
    { name: "Cyber Amber", color: "#fbbf24" },
    { name: "Neon Cyan", color: "#38bdf8" },
    { name: "Emerald Green", color: "#34d399" },
    { name: "Electric Purple", color: "#c084fc" },
    { name: "Hot Pink", color: "#f472b6" },
    { name: "Crisp White", color: "#ffffff" }
];

export default function ScribbleCanvas({ isOpen, onClose }) {
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [currentColor, setCurrentColor] = useState("#fbbf24");
    const [brushSize, setBrushSize] = useState(3);
    const [isEraser, setIsEraser] = useState(false);

    useEffect(() => {
        if (!isOpen) return;
        const canvas = canvasRef.current;
        if (!canvas) return;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const ctx = canvas.getContext("2d");
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        const handleResize = () => {
            if (!canvas) return;
            const tempCanvas = document.createElement("canvas");
            tempCanvas.width = canvas.width;
            tempCanvas.height = canvas.height;
            const tempCtx = tempCanvas.getContext("2d");
            tempCtx.drawImage(canvas, 0, 0);

            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            ctx.drawImage(tempCanvas, 0, 0);
            ctx.lineCap = "round";
            ctx.lineJoin = "round";
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [isOpen]);

    if (!isOpen || typeof document === "undefined") return null;

    const startDrawing = (e) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        ctx.beginPath();
        ctx.moveTo(x, y);
        setIsDrawing(true);
        AudioEngine.playPenScribble();
    };

    const draw = (e) => {
        if (!isDrawing) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (isEraser) {
            ctx.globalCompositeOperation = "destination-out";
            ctx.arc(x, y, brushSize * 4, 0, Math.PI * 2, false);
            ctx.fill();
        } else {
            ctx.globalCompositeOperation = "source-over";
            ctx.strokeStyle = currentColor;
            ctx.lineWidth = brushSize;
            ctx.lineTo(x, y);
            ctx.stroke();
        }

        if (Math.random() < 0.15) {
            AudioEngine.playPenScribble();
        }
    };

    const stopDrawing = () => {
        setIsDrawing(false);
    };

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        AudioEngine.playUISelect();
    };

    return createPortal(
        <AnimatePresence>
            <div className="fixed inset-0 z-[9999] pointer-events-auto cursor-crosshair">
                {/* Freehand Canvas */}
                <canvas
                    ref={canvasRef}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    className="absolute inset-0 w-full h-full"
                />

                {/* Floating Floating Pen Toolbar */}
                <motion.div
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -50, opacity: 0 }}
                    className="absolute top-6 left-1/2 -translate-x-1/2 bg-neutral-900/90 border border-amber-500/40 backdrop-blur-md rounded-2xl p-2.5 shadow-[0_0_40px_rgba(251,191,36,0.3)] flex items-center gap-3 z-[10000] pointer-events-auto"
                >
                    <div className="flex items-center gap-2 px-2 border-r border-neutral-800">
                        <Edit3 className="w-5 h-5 text-amber-400" />
                        <span className="font-mono text-xs font-bold text-amber-300">
                            DESK DOODLE MODE
                        </span>
                    </div>

                    {/* Color Swatches */}
                    <div className="flex items-center gap-1.5 px-2 border-r border-neutral-800">
                        {PEN_COLORS.map((c) => (
                            <button
                                key={c.color}
                                onClick={() => {
                                    setCurrentColor(c.color);
                                    setIsEraser(false);
                                    AudioEngine.playUISelect();
                                }}
                                className={`w-6 h-6 rounded-full border-2 transition-transform ${
                                    currentColor === c.color && !isEraser
                                        ? "scale-125 border-white ring-2 ring-amber-400"
                                        : "border-transparent opacity-80 hover:opacity-100"
                                }`}
                                style={{ backgroundColor: c.color }}
                                title={c.name}
                            />
                        ))}
                    </div>

                    {/* Eraser & Clear */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => {
                                setIsEraser(!isEraser);
                                AudioEngine.playUISelect();
                            }}
                            className={`p-2 rounded-xl text-xs font-mono flex items-center gap-1 transition ${
                                isEraser
                                    ? "bg-amber-500 text-neutral-950 font-bold"
                                    : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
                            }`}
                        >
                            <Eraser className="w-4 h-4" />
                            <span>Eraser</span>
                        </button>

                        <button
                            onClick={clearCanvas}
                            className="p-2 rounded-xl bg-neutral-800 hover:bg-red-500/20 text-neutral-300 hover:text-red-400 text-xs font-mono transition"
                            title="Clear Canvas"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>

                        <button
                            onClick={onClose}
                            className="p-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-mono font-bold text-xs flex items-center gap-1 transition"
                        >
                            <Check className="w-4 h-4" />
                            <span>Done</span>
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>,
        document.body
    );
}
