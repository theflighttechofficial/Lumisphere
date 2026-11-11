import { Fragment, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUp, RotateCcw, Sparkles, Square, Volume2 } from "lucide-react";
import { answer, starterQuestions } from "../../utils/askMe";
import { profile, projects } from "../../data/profile";
import { AudioEngine } from "../../utils/AudioEngine";
import Modal from "./Modal";

const sectionLabels = {
    experience: "Experience",
    projects: "Projects",
    skills: "Skills",
    achievements: "Awards & Research",
    journey: "Journey",
    contact: "Contact",
};

const canSpeak = typeof window !== "undefined" && "speechSynthesis" in window;

// Render reply text: blank lines split paragraphs, "• " lines become bullets.
function ReplyText({ text }) {
    return text.split(/\n{2,}/).map((block, i) => {
        const lines = block.split("\n");
        if (lines.every((l) => l.startsWith("• "))) {
            return (
                <ul key={i} className="space-y-1">
                    {lines.map((l) => (
                        <li key={l} className="flex gap-2">
                            <span className="mt-[7px] w-1 h-1 rounded-full bg-amber-400 shrink-0" />
                            <span>{l.slice(2)}</span>
                        </li>
                    ))}
                </ul>
            );
        }
        return (
            <p key={i}>
                {lines.map((l, j) => (
                    <Fragment key={j}>
                        {j > 0 && <br />}
                        {l}
                    </Fragment>
                ))}
            </p>
        );
    });
}

function Reply({ msg, live, onDone, onAsk, onOpenProject, onNavigate, speakingId, onSpeak }) {
    const words = msg.text.split(/(\s+)/);
    const [shown, setShown] = useState(live ? 0 : words.length);
    const onDoneRef = useRef(onDone);
    useEffect(() => {
        onDoneRef.current = onDone;
    });

    // Type the reply out word by word, the way I'd say it.
    useEffect(() => {
        if (!live) return;
        let i = 0;
        const t = setInterval(() => {
            i += 3;
            setShown(Math.min(i, words.length));
            if (i >= words.length) {
                clearInterval(t);
                onDoneRef.current();
            }
        }, 28);
        return () => clearInterval(t);
    }, [live, words.length]);

    const done = shown >= words.length;
    const cards = (msg.projects || []).map((id) => projects.find((p) => p.id === id)).filter(Boolean);

    return (
        <div className="flex gap-2.5">
            <span className="shrink-0 w-7 h-7 rounded-lg bg-gradient-to-br from-amber-300 to-orange-500 p-px">
                <span className="flex w-full h-full items-center justify-center rounded-[7px] bg-zinc-950 text-[10px] font-bold text-amber-200">{profile.initials}</span>
            </span>
            <div className="min-w-0 flex-1 space-y-2.5">
                <div className="rounded-2xl rounded-tl-md bg-white/[0.05] border border-white/10 px-3.5 py-2.5 text-[13.5px] leading-relaxed text-zinc-200 space-y-2.5">
                    <ReplyText text={done ? msg.text : words.slice(0, shown).join("")} />
                    {!done && <span className="inline-block w-1.5 h-3.5 align-middle bg-amber-400 animate-pulse" />}
                </div>

                {done && (
                    <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
                        {cards.length > 0 && (
                            <div className="grid grid-cols-[minmax(0,1fr)] gap-1.5">
                                {cards.map((p) => (
                                    <button
                                        key={p.id}
                                        onClick={() => onOpenProject(p)}
                                        className="group w-full min-w-0 flex items-center gap-2 text-left rounded-xl border border-amber-400/20 bg-amber-400/[0.05] hover:bg-amber-400/10 px-3 py-2"
                                    >
                                        <span className="min-w-0 flex-1">
                                            <span className="block text-[13px] font-semibold text-amber-100 truncate">{p.title}</span>
                                            <span className="block text-[12px] text-zinc-400 truncate">{p.tagline}</span>
                                        </span>
                                        <ArrowRight size={14} className="text-amber-300 shrink-0 group-hover:translate-x-0.5 transition-transform" />
                                    </button>
                                ))}
                            </div>
                        )}

                        <div className="flex flex-wrap items-center gap-1.5">
                            {msg.section && (
                                <button
                                    onClick={() => onNavigate(msg.section)}
                                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-400 text-zinc-950 text-[12px] font-semibold hover:bg-amber-300"
                                >
                                    Open {sectionLabels[msg.section]} <ArrowRight size={12} />
                                </button>
                            )}
                            {canSpeak && (
                                <button
                                    onClick={() => onSpeak(msg)}
                                    aria-label={speakingId === msg.key ? "Stop reading" : "Read this answer aloud"}
                                    className="inline-flex items-center gap-1 px-2 py-1 rounded-full border border-white/10 text-[12px] text-zinc-400 hover:text-white hover:border-white/25"
                                >
                                    {speakingId === msg.key ? <Square size={11} /> : <Volume2 size={12} />}
                                    {speakingId === msg.key ? "Stop" : "Listen"}
                                </button>
                            )}
                        </div>

                        {msg.followUps?.length > 0 && (
                            <div className="flex flex-wrap gap-1.5">
                                {msg.followUps.map((f) => (
                                    <button
                                        key={f}
                                        onClick={() => onAsk(f)}
                                        className="px-2.5 py-1 rounded-full border border-white/10 bg-white/[0.03] text-[12px] text-zinc-300 hover:text-amber-200 hover:border-amber-400/40"
                                    >
                                        {f}
                                    </button>
                                ))}
                            </div>
                        )}
                    </motion.div>
                )}
            </div>
        </div>
    );
}

export default function AskMe({ messages, setMessages, onClose, onOpenProject, onNavigate }) {
    const [input, setInput] = useState("");
    const [typingKey, setTypingKey] = useState(null);
    const [speakingId, setSpeakingId] = useState(null);
    const [hint, setHint] = useState(0);
    const endRef = useRef(null);
    const inputRef = useRef(null);
    const nextKey = useRef(messages.length);

    // Rotate example questions in the placeholder while the chat is empty.
    useEffect(() => {
        if (messages.length) return;
        const t = setInterval(() => setHint((h) => (h + 1) % starterQuestions.length), 3200);
        return () => clearInterval(t);
    }, [messages.length]);

    useEffect(() => {
        endRef.current?.scrollIntoView({ block: "end", behavior: "smooth" });
    }, [messages, typingKey]);

    useEffect(() => {
        // Phones skip autofocus so the keyboard doesn't cover the starter questions.
        if (window.matchMedia("(min-width: 1024px)").matches) inputRef.current?.focus();
        return () => canSpeak && window.speechSynthesis.cancel();
    }, []);

    const ask = (q) => {
        const question = q.trim();
        if (!question || typingKey !== null) return;
        AudioEngine.playUISelect();
        const reply = answer(question);
        const key = nextKey.current++;
        setMessages((m) => [...m, { role: "user", text: question, key: `u${key}` }, { role: "me", ...reply, key }]);
        setTypingKey(key);
        setInput("");
    };

    const speak = (msg) => {
        window.speechSynthesis.cancel();
        if (speakingId === msg.key) return setSpeakingId(null);
        const u = new SpeechSynthesisUtterance(msg.text.replace(/• /g, ""));
        u.rate = 1.03;
        u.lang = "en-IN";
        u.onend = () => setSpeakingId(null);
        setSpeakingId(msg.key);
        window.speechSynthesis.speak(u);
    };

    const reset = () => {
        if (canSpeak) window.speechSynthesis.cancel();
        setSpeakingId(null);
        setTypingKey(null);
        setMessages([]);
        inputRef.current?.focus();
    };

    return (
        <Modal
            onClose={onClose}
            title="Ask Lumi AI about Varun"
            maxWidth="max-w-2xl"
            z="z-[290]"
            footer={
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        ask(input);
                    }}
                    className="flex items-center gap-2 rounded-2xl border border-white/10 bg-black/40 focus-within:border-amber-400/60 pl-4 pr-1.5 py-1.5"
                >
                    <input
                        ref={inputRef}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        aria-label="Ask a question about Varun"
                        placeholder={messages.length ? "Ask a follow-up…" : starterQuestions[hint]}
                        className="flex-1 min-w-0 bg-transparent outline-none focus-visible:outline-none text-base sm:text-[14px] text-white placeholder-zinc-500"
                        autoComplete="off"
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || typingKey !== null}
                        aria-label="Send question"
                        className="w-10 h-10 shrink-0 rounded-xl bg-amber-400 text-zinc-950 flex items-center justify-center hover:bg-amber-300 disabled:opacity-40"
                    >
                        <ArrowUp size={18} />
                    </button>
                </form>
            }
        >
            <header className="flex items-center gap-3 pr-12 pb-4 mb-4 border-b border-white/10">
                <span className="relative shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br from-amber-300 to-orange-500 p-px">
                    <span className="flex w-full h-full items-center justify-center rounded-[11px] bg-zinc-950 text-amber-300">
                        <Sparkles size={18} />
                    </span>
                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-zinc-900" />
                </span>
                <div className="min-w-0 flex-1">
                    <h2 className="text-[16px] font-semibold text-white">Lumi AI · about {profile.shortName}</h2>
                    <p className="text-[12.5px] text-zinc-400">Answers in Varun's own words, written by him. Runs offline.</p>
                </div>
                {messages.length > 0 && (
                    <button onClick={reset} aria-label="Start over" title="Start over" className="w-9 h-9 rounded-lg flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10">
                        <RotateCcw size={15} />
                    </button>
                )}
            </header>

            {messages.length === 0 ? (
                <div className="py-2">
                    <p className="text-[15px] text-zinc-200 leading-relaxed">
                        Hey 👋 Ask me anything about my work, internships, projects or plans — I'll answer the way I'd explain it in person.
                    </p>
                    <p className="mt-5 mb-2.5 text-[12px] font-mono uppercase tracking-wider text-zinc-500">Try one of these</p>
                    <div className="grid sm:grid-cols-2 gap-2">
                        {starterQuestions.map((q) => (
                            <button
                                key={q}
                                onClick={() => ask(q)}
                                className="group flex items-center justify-between gap-2 text-left rounded-xl border border-white/10 bg-white/[0.03] hover:border-amber-400/40 hover:bg-amber-400/[0.06] px-3.5 py-3 text-[13.5px] text-zinc-200"
                            >
                                {q}
                                <ArrowRight size={14} className="text-zinc-500 group-hover:text-amber-300 shrink-0" />
                            </button>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="space-y-4" aria-live="polite">
                    {messages.map((m) =>
                        m.role === "user" ? (
                            <div key={m.key} className="flex justify-end">
                                <span className="max-w-[85%] rounded-2xl rounded-tr-md bg-amber-400 text-zinc-950 px-3.5 py-2 text-[14px] font-medium">{m.text}</span>
                            </div>
                        ) : (
                            <Reply
                                key={m.key}
                                msg={m}
                                live={m.key === typingKey}
                                onDone={() => setTypingKey(null)}
                                onAsk={ask}
                                onOpenProject={onOpenProject}
                                onNavigate={(id) => {
                                    onClose();
                                    onNavigate(id);
                                }}
                                speakingId={speakingId}
                                onSpeak={speak}
                            />
                        )
                    )}
                    <div ref={endRef} />
                </div>
            )}
        </Modal>
    );
}
