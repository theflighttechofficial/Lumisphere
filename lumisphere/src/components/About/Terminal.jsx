import { useEffect, useRef, useState } from "react";
import { TerminalSquare } from "lucide-react";
import { AudioEngine } from "../../utils/AudioEngine";
import {
    profile, socials, education, experience, projects, certifications, achievements, goals, findProject,
} from "../../data/profile";
import { themePalettes } from "./themes";

const HELP = `Commands
  about            Who I am, in 4 lines
  exp              Internships
  projects         List every project
  open <name>      Open a project (e.g. open documind)
  skills           Jump to the skills section
  certs            Certifications
  awards           Hackathons, research & competitions
  goals            What's next
  contact          How to reach me
  resume           Open the résumé
  theme <name>     amber | green | cyan | purple | red
  dim <0-100>      Set the lamp brightness
  clear            Clear the screen`;

const CHIPS = ["help", "about", "exp", "projects", "awards", "contact", "open trustpulse"];

export default function Terminal({ viewerName, college, onNavigate, onOpenProject, onOpenResume, onTheme, onDim }) {
    const [input, setInput] = useState("");
    const [history, setHistory] = useState(() => [
        { text: `lumisphere shell — ${profile.name}`, type: "system" },
        { text: `Welcome${viewerName ? `, ${viewerName}` : ""}${college ? ` from ${college}` : ""}. Type 'help' or tap a chip below.`, type: "output" },
    ]);
    const [past, setPast] = useState([]);
    const [pastIdx, setPastIdx] = useState(-1);
    const scrollRef = useRef(null);

    useEffect(() => {
        const el = scrollRef.current;
        if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    }, [history]);

    const run = (raw) => {
        const text = raw.trim();
        if (!text) return;
        AudioEngine.playUISelect();
        setPast((p) => [text, ...p].slice(0, 30));
        setPastIdx(-1);

        const [cmdRaw, ...rest] = text.replace(/^\//, "").split(/\s+/);
        const cmd = cmdRaw.toLowerCase();
        const arg = rest.join(" ");
        let out = "";
        let type = "output";

        switch (cmd) {
            case "help":
                out = HELP;
                break;
            case "about":
            case "whoami":
            case "profile":
                out = `${profile.name} — ${profile.role}\n${education.degree}, ${education.schoolShort} (${education.period}) · CGPA ${education.cgpa}/10\n${profile.headline}\n${profile.availability}.`;
                break;
            case "exp":
            case "experience":
                out = experience.map((e) => `▸ ${e.role} @ ${e.company} (${e.period})\n  ${e.metrics.join(" · ")}`).join("\n");
                onNavigate("experience");
                break;
            case "projects":
            case "ls":
                out = projects.map((p) => `  ${p.id.padEnd(16)} ${p.title}`).join("\n") + "\n\nTry: open <id>";
                break;
            case "open":
            case "cat": {
                const p = findProject(arg);
                if (p) {
                    out = `Opening ${p.title}…`;
                    onOpenProject(p);
                } else {
                    out = `No project matches '${arg}'. Type 'projects' to list them.`;
                    type = "error";
                }
                break;
            }
            case "skills":
                out = "Jumping to skills…";
                onNavigate("skills");
                break;
            case "certs":
                out = certifications.map((c) => `✓ ${c.title} — ${c.issuer} (${c.date})`).join("\n");
                break;
            case "awards":
                out = achievements.map((a) => `★ ${a.title}\n  ${a.detail}`).join("\n");
                break;
            case "goals":
                out = `Next: ${goals.shortTerm}\nLater: ${goals.longTerm}`;
                break;
            case "contact":
                out = [`Email     ${profile.email}`, ...socials.map((s) => `${s.label.padEnd(9)} ${s.url.replace(/^https?:\/\/(www\.)?/, "")}`)].join("\n");
                break;
            case "resume":
            case "cv":
                out = "Opening résumé…";
                onOpenResume();
                break;
            case "theme":
                if (themePalettes[arg?.toLowerCase()]) {
                    onTheme(arg.toLowerCase());
                    out = `Theme set to ${arg.toLowerCase()}.`;
                } else {
                    out = `Themes: ${Object.keys(themePalettes).join(", ")}`;
                    type = "error";
                }
                break;
            case "dim": {
                const v = Number.parseInt(arg, 10);
                if (Number.isFinite(v) && v >= 0 && v <= 100) {
                    onDim(v);
                    out = `Lamp set to ${v}%.`;
                } else {
                    out = "Usage: dim <0-100>";
                    type = "error";
                }
                break;
            }
            case "sudo":
                out = "Nice try. Hiring me is the only privilege escalation available. → contact";
                break;
            case "clear":
                setHistory([]);
                setInput("");
                return;
            default:
                out = `command not found: ${cmd}. Type 'help'.`;
                type = "error";
        }

        setHistory((h) => [...h, { text: `$ ${text}`, type: "input" }, { text: out, type }]);
        setInput("");
    };

    const onKeyDown = (e) => {
        if (e.key === "ArrowUp" && past.length) {
            e.preventDefault();
            const i = Math.min(pastIdx + 1, past.length - 1);
            setPastIdx(i);
            setInput(past[i]);
        } else if (e.key === "ArrowDown") {
            e.preventDefault();
            const i = pastIdx - 1;
            setPastIdx(Math.max(i, -1));
            setInput(i >= 0 ? past[i] : "");
        }
    };

    return (
        <div className="flex flex-col h-[320px] sm:h-[360px] rounded-2xl border border-white/10 bg-black/70 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/10 bg-white/[0.03]">
                <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                    <span className="ml-2 font-mono text-xs text-zinc-400 flex items-center gap-1.5">
                        <TerminalSquare size={13} className="text-amber-400" /> varun@lumisphere:~
                    </span>
                </div>
                <span className="font-mono text-[11px] text-zinc-500 hidden sm:inline">↑↓ history</span>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 font-mono text-[12.5px] leading-relaxed space-y-1.5 select-text" aria-live="polite">
                {history.map((l, i) => (
                    <div
                        key={i}
                        className={
                            l.type === "system" ? "text-amber-300 font-semibold" :
                            l.type === "input" ? "text-white" :
                            l.type === "error" ? "text-red-400" : "text-zinc-400"
                        }
                        style={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}
                    >
                        {l.text}
                    </div>
                ))}
            </div>

            <div className="flex gap-1.5 px-3 py-2 border-t border-white/10 overflow-x-auto scrollbar-none">
                {CHIPS.map((c) => (
                    <button
                        key={c}
                        type="button"
                        onClick={() => run(c)}
                        className="shrink-0 px-2 py-1 rounded-md border border-white/10 bg-white/5 font-mono text-[11px] text-zinc-300 hover:bg-amber-400 hover:text-zinc-950 hover:border-amber-400 transition-colors"
                    >
                        {c}
                    </button>
                ))}
            </div>

            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    run(input);
                }}
                className="flex items-center border-t border-white/10 bg-black/60"
            >
                <span className="pl-4 font-mono text-sm text-amber-400" aria-hidden="true">$</span>
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={onKeyDown}
                    aria-label="Terminal command"
                    autoComplete="off"
                    autoCapitalize="off"
                    spellCheck={false}
                    placeholder="type a command…"
                    className="flex-1 bg-transparent outline-none font-mono text-base sm:text-[13px] text-white px-2.5 py-2.5 placeholder-zinc-600 caret-amber-400"
                />
            </form>
        </div>
    );
}
