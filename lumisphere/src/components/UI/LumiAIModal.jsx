import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    Bot,
    Mic,
    MicOff,
    Volume2,
    VolumeX,
    Send,
    X,
    Sparkles,
    User,
    Briefcase,
    Brain,
    HelpCircle,
    Terminal,
    RefreshCw
} from "lucide-react";
import { AudioEngine } from "../../utils/AudioEngine";
import { LumiAIEngine } from "../../utils/LumiAI";
import { useLight } from "../../context/LightContext";

export default function LumiAIModal({ isOpen: externalIsOpen, onClose: externalOnClose }) {
    const { timeOfDay, weather } = useLight();

    const [internalIsOpen, setInternalIsOpen] = useState(false);
    const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;

    const handleClose = () => {
        if (externalOnClose) externalOnClose();
        setInternalIsOpen(false);
    };

    useEffect(() => {
        const handleGlobalOpen = (e) => {
            setInternalIsOpen(true);
            AudioEngine.playHoloProject();
        };

        window.addEventListener("lumisphere_open_lumi_ai", handleGlobalOpen);
        return () => window.removeEventListener("lumisphere_open_lumi_ai", handleGlobalOpen);
    }, []);

    const [messages, setMessages] = useState([
        {
            sender: "lumi",
            text: "Hello! I am Lumi AI — Varun's AI Companion. Ask me about Varun's production RAG systems, L&T internship, CGPA trajectory, or credentials!",
        },
    ]);
    const [input, setInput] = useState("");
    const [isRecording, setIsRecording] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const canvasRef = useRef(null);

    // Audio Waveform Animation Loop during Speech/Recording
    useEffect(() => {
        if (!isOpen) return;

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        let animId;

        const width = (canvas.width = 300);
        const height = (canvas.height = 40);

        let phase = 0;

        const drawWaveform = () => {
            ctx.clearRect(0, 0, width, height);

            if (isRecording || isSpeaking) {
                ctx.beginPath();
                ctx.lineWidth = 2;
                ctx.strokeStyle = isRecording ? "#ef4444" : "#22d3ee";

                for (let x = 0; x < width; x++) {
                    const y = height / 2 + Math.sin(x * 0.05 + phase) * 12 * Math.sin(x * 0.01);
                    if (x === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }
                ctx.stroke();
                phase += 0.15;
            } else {
                ctx.beginPath();
                ctx.lineWidth = 1;
                ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
                ctx.moveTo(0, height / 2);
                ctx.lineTo(width, height / 2);
                ctx.stroke();
            }

            animId = requestAnimationFrame(drawWaveform);
        };

        drawWaveform();

        return () => cancelAnimationFrame(animId);
    }, [isOpen, isRecording, isSpeaking]);

    if (!isOpen || typeof document === "undefined") return null;

    const handleSend = (textToSend) => {
        const queryText = textToSend || input;
        if (!queryText.trim()) return;

        AudioEngine.playUISelect();

        const userMsg = { sender: "user", text: queryText };
        setMessages((prev) => [...prev, userMsg]);
        if (!textToSend) setInput("");

        setTimeout(() => {
            const aiReply = LumiAIEngine.query(queryText, { timeOfDay, weather });
            setMessages((prev) => [...prev, { sender: "lumi", text: aiReply }]);
            speakResponse(aiReply);
        }, 400);
    };

    const speakResponse = (text) => {
        if (typeof window !== "undefined" && "speechSynthesis" in window) {
            try {
                window.speechSynthesis.cancel();
                const cleanText = text.replace(/[^\w\s.,!?]/gi, "");
                const utterance = new SpeechSynthesisUtterance(cleanText);
                utterance.rate = 1.05;
                utterance.pitch = 1.2;
                utterance.volume = 0.6;

                utterance.onstart = () => setIsSpeaking(true);
                utterance.onend = () => setIsSpeaking(false);
                utterance.onerror = () => setIsSpeaking(false);

                window.speechSynthesis.speak(utterance);
            } catch (e) {}
        }
    };

    const toggleMicRecording = () => {
        AudioEngine.playUISelect();

        if (typeof window === "undefined") return;

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

        if (!SpeechRecognition) {
            alert("Web Speech API Voice Recognition is not supported in this browser. Please type your query.");
            return;
        }

        if (isRecording) {
            setIsRecording(false);
            return;
        }

        try {
            const recognition = new SpeechRecognition();
            recognition.continuous = false;
            recognition.interimResults = false;
            recognition.lang = "en-US";

            recognition.onstart = () => setIsRecording(true);
            recognition.onend = () => setIsRecording(false);

            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                setInput(transcript);
                handleSend(transcript);
            };

            recognition.start();
        } catch (e) {
            setIsRecording(false);
        }
    };

    return createPortal(
        <AnimatePresence>
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
                <motion.div
                    initial={{ opacity: 0, scale: 0.88, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.88 }}
                    className="relative w-full max-w-2xl rounded-2xl bg-neutral-950 border-4 border-cyan-500/50 shadow-[0_0_60px_rgba(34,211,238,0.3)] overflow-hidden flex flex-col h-[580px] font-mono select-none"
                >
                    {/* Header */}
                    <div className="bg-neutral-900 px-6 py-4 border-b border-cyan-500/30 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 animate-pulse">
                                <Bot className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-cyan-300 flex items-center gap-2">
                                    <span>LUMI AI CONVERSATIONAL ASSISTANT</span>
                                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                                </h3>
                                <p className="text-[11px] text-neutral-400">
                                    Context-Aware • Project Explainer • Recruiter Q&A • Voice STT/TTS
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={handleClose}
                            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Audio Waveform Canvas Banner */}
                    <div className="bg-neutral-900/60 px-6 py-2 border-b border-neutral-800 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs text-neutral-400">
                            <span>Status: {isSpeaking ? "Speaking Response..." : isRecording ? "Listening Mic..." : "Idle Ready"}</span>
                        </div>
                        <canvas ref={canvasRef} className="w-[180px] h-[24px]" />
                    </div>

                    {/* Chat Messages Log */}
                    <div className="p-4 flex-1 overflow-y-auto space-y-3 bg-gradient-to-b from-neutral-950 to-black">
                        {messages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`flex items-start gap-2.5 ${
                                    msg.sender === "user" ? "justify-end" : "justify-start"
                                }`}
                            >
                                {msg.sender === "lumi" && (
                                    <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 shrink-0">
                                        <Bot className="w-4 h-4" />
                                    </div>
                                )}

                                <div
                                    className={`p-3 rounded-xl max-w-lg text-xs leading-relaxed ${
                                        msg.sender === "user"
                                            ? "bg-amber-500 text-neutral-950 font-bold"
                                            : "bg-neutral-900 border border-neutral-800 text-cyan-200"
                                    }`}
                                >
                                    <p className="whitespace-pre-line">{msg.text}</p>
                                </div>

                                {msg.sender === "user" && (
                                    <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 shrink-0">
                                        <User className="w-4 h-4" />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Quick Recruiter Prompt Chips */}
                    <div className="px-4 py-2 bg-neutral-900/80 border-t border-neutral-800 flex flex-wrap items-center gap-1.5 overflow-x-auto">
                        <span className="text-[10px] text-neutral-500 font-bold mr-1">PROMPTS:</span>
                        {[
                            "Why hire Varun?",
                            "Explain L&T internship",
                            "CGPA trajectory",
                            "Explain RAG project",
                            "Summarize resume",
                            "Recommend skills",
                        ].map((prompt, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleSend(prompt)}
                                className="px-2.5 py-1 rounded-lg bg-black/60 border border-neutral-700 hover:border-cyan-400 text-neutral-300 hover:text-cyan-300 text-[10px] transition whitespace-nowrap"
                            >
                                {prompt}
                            </button>
                        ))}
                    </div>

                    {/* Form Input Bar */}
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleSend();
                        }}
                        className="p-4 bg-neutral-900 border-t border-neutral-800 flex items-center gap-2"
                    >
                        <button
                            type="button"
                            onClick={toggleMicRecording}
                            className={`p-2.5 rounded-xl border transition ${
                                isRecording
                                    ? "bg-red-500 text-white border-red-400 animate-pulse"
                                    : "bg-neutral-800 text-neutral-400 hover:text-white border-neutral-700"
                            }`}
                            title="Voice STT Recording"
                        >
                            {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                        </button>

                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask Lumi AI (e.g., Why hire Varun, RAG project, L&T LOR)..."
                            className="flex-1 bg-black text-white text-xs px-4 py-2.5 rounded-xl border border-neutral-700 focus:border-cyan-400 focus:outline-none"
                        />

                        <button
                            type="submit"
                            className="px-4 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-neutral-950 font-bold text-xs rounded-xl flex items-center gap-1.5 transition"
                        >
                            <span>Send</span>
                            <Send className="w-3.5 h-3.5" />
                        </button>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>,
        document.body
    );
}
