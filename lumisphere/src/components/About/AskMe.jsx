import { Fragment, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ArrowUp, RotateCcw, Square, Volume2 } from "lucide-react";
import { answer, starterQuestions } from "../../utils/askMe";
import { profile, projects } from "../../data/profile";
import { AudioEngine } from "../../utils/AudioEngine";

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

export default function AskMe({ onOpenProject, onNavigate }) {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [typingKey, setTypingKey] = useState(null);
    const [speakingId, setSpeakingId] = useState(null);
    const [hint, setHint] = useState(0);
    const listRef = useRef(null);
    const nextKey = useRef(0);

    // Rotate example questions in the placeholder while the box is empty.
    useEffect(() => {
        if (messages.length) return;
        const t = setInterval(() => setHint((h) => (h + 1) % starterQuestions.length), 3200);
        return () => clearInterval(t);
    }, [messages.length]);

    useEffect(() => {
        const el = listRef.current;
        if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    }, [messages, typingKey]);

    useEffect(() => () => canSpeak && window.speechSynthesis.cancel(), []);

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
    };

    return (
        <section aria-label="Ask me anything" className="rounded-2xl border border-amber-400/25 bg-gradient-to-b from-amber-400/[0.07] to-black/30 overflow-hidden">
            <header className="flex items-center justify-between gap-2 px-4 pt-3.5 pb-2">
                <div>
                    <h3 className="text-[14px] font-semibold text-white">Ask me anything</h3>
                    <p className="text-[12px] text-zinc-400">Answers in my own words — no AI service.</p>
                </div>
                {messages.length > 0 && (
                    <button onClick={reset} aria-label="Start over" title="Start over" className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10">
                        <RotateCcw size={14} />
                    </button>
                )}
            </header>

            <AnimatePresence initial={false}>
                {messages.length > 0 && (
                    <motion.div
                        ref={listRef}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="max-h-[340px] lg:max-h-[380px] overflow-y-auto overscroll-contain px-4 py-2 space-y-3"
                        aria-live="polite"
                    >
                        {messages.map((m) =>
                            m.role === "user" ? (
                                <div key={m.key} className="flex justify-end">
                                    <span className="max-w-[85%] rounded-2xl rounded-tr-md bg-amber-400 text-zinc-950 px-3.5 py-2 text-[13.5px] font-medium">{m.text}</span>
                                </div>
                            ) : (
                                <Reply
                                    key={m.key}
                                    msg={m}
                                    live={m.key === typingKey}
                                    onDone={() => setTypingKey(null)}
                                    onAsk={ask}
                                    onOpenProject={onOpenProject}
                                    onNavigate={onNavigate}
                                    speakingId={speakingId}
                                    onSpeak={speak}
                                />
                            )
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {messages.length === 0 && (
                <div className="flex flex-wrap gap-1.5 px-4 pb-2.5">
                    {starterQuestions.slice(0, 4).map((q) => (
                        <button
                            key={q}
                            onClick={() => ask(q)}
                            className="px-2.5 py-1 rounded-full border border-white/10 bg-white/[0.04] text-[12px] text-zinc-300 hover:text-amber-200 hover:border-amber-400/40"
                        >
                            {q}
                        </button>
                    ))}
                </div>
            )}

            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    ask(input);
                }}
                className="flex items-center gap-2 m-3 mt-1 rounded-xl border border-white/10 bg-black/40 focus-within:border-amber-400/60 pl-3.5 pr-1.5 py-1.5"
            >
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    aria-label="Ask Varun a question"
                    placeholder={messages.length ? "Ask a follow-up…" : starterQuestions[hint]}
                    className="flex-1 min-w-0 bg-transparent outline-none text-base lg:text-[13.5px] text-white placeholder-zinc-500"
                    autoComplete="off"
                />
                <button
                    type="submit"
                    disabled={!input.trim() || typingKey !== null}
                    aria-label="Send question"
                    className="w-8 h-8 shrink-0 rounded-lg bg-amber-400 text-zinc-950 flex items-center justify-center hover:bg-amber-300 disabled:opacity-40"
                >
                    <ArrowUp size={16} />
                </button>
            </form>
        </section>
    );
}
