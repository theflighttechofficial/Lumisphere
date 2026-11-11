import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Check, Clock, Copy, Mail, MapPin, Send } from "lucide-react";
import { profile, socials } from "../../../data/profile";
import { AudioEngine } from "../../../utils/AudioEngine";
import { SocialIcon } from "../BrandIcons";
import { Card, SectionHeading } from "../ui";
import { sectionMotion } from "../motion";

export default function ContactSection({ viewerName, college, onToast }) {
    const [copied, setCopied] = useState(false);
    const [form, setForm] = useState({ name: viewerName || "", org: college || "", message: "" });

    const copyEmail = async () => {
        AudioEngine.playUISelect();
        try {
            await navigator.clipboard.writeText(profile.email);
            setCopied(true);
            onToast("Email copied to clipboard");
            setTimeout(() => setCopied(false), 2000);
        } catch {
            onToast(profile.email);
        }
    };

    // No backend: compose the note in the visitor's own mail client.
    const send = (e) => {
        e.preventDefault();
        const subject = `Hello from ${form.name || "your portfolio"}${form.org ? ` (${form.org})` : ""}`;
        window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(form.message)}`;
    };

    const field = "w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-base sm:text-sm text-white placeholder-zinc-500 outline-none focus:border-amber-400/60";

    return (
        <motion.div {...sectionMotion}>
            <SectionHeading eyebrow="Contact" title="Let's build something" description={`${profile.availability}. I usually reply within a day.`} />

            <div className="grid lg:grid-cols-5 gap-4">
                <div className="lg:col-span-2 space-y-3">
                    <Card className="p-5 bg-gradient-to-br from-amber-400/[0.08] to-transparent border-amber-400/20">
                        <p className="text-[12px] font-mono uppercase tracking-wider text-amber-300/80">Email</p>
                        <a href={`mailto:${profile.email}`} className="mt-1 block text-[15px] sm:text-base font-semibold text-white break-all hover:text-amber-200">{profile.email}</a>
                        <div className="mt-4 flex gap-2">
                            <a href={`mailto:${profile.email}`} className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-amber-400 text-zinc-950 text-sm font-semibold hover:bg-amber-300">
                                <Mail size={15} /> Write
                            </a>
                            <button onClick={copyEmail} className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl border border-white/15 bg-white/5 text-white text-sm font-semibold hover:bg-white/10">
                                {copied ? <Check size={15} className="text-emerald-400" /> : <Copy size={15} />} {copied ? "Copied" : "Copy"}
                            </button>
                        </div>
                    </Card>
                    <Card className="p-5 space-y-2.5 text-sm text-zinc-300">
                        <p className="flex items-center gap-2.5"><MapPin size={15} className="text-zinc-500" /> {profile.location}</p>
                        <p className="flex items-center gap-2.5"><Clock size={15} className="text-zinc-500" /> {profile.timezone}</p>
                    </Card>
                    <Card className="p-2">
                        {socials.map((s) => (
                            <a key={s.id} href={s.url} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5">
                                <SocialIcon id={s.id} size={16} className="text-zinc-400 group-hover:text-amber-300" />
                                <span className="text-sm font-medium text-zinc-200">{s.label}</span>
                                <span className="ml-auto font-mono text-[12px] text-zinc-500 truncate">{s.handle}</span>
                                <ArrowUpRight size={14} className="text-zinc-600 group-hover:text-amber-300 shrink-0" />
                            </a>
                        ))}
                    </Card>
                </div>

                <Card as="form" onSubmit={send} className="lg:col-span-3 p-5 sm:p-6 space-y-3.5">
                    <h3 className="text-[15px] font-semibold text-white">Send a quick note</h3>
                    <div className="grid sm:grid-cols-2 gap-3">
                        <label className="block">
                            <span className="text-[13px] text-zinc-400">Your name</span>
                            <input className={`${field} mt-1`} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} autoComplete="name" />
                        </label>
                        <label className="block">
                            <span className="text-[13px] text-zinc-400">Company / college</span>
                            <input className={`${field} mt-1`} value={form.org} onChange={(e) => setForm({ ...form, org: e.target.value })} autoComplete="organization" />
                        </label>
                    </div>
                    <label className="block">
                        <span className="text-[13px] text-zinc-400">Message</span>
                        <textarea
                            required
                            rows={6}
                            className={`${field} mt-1 resize-y min-h-[140px]`}
                            placeholder="A role, a project, feedback on my work…"
                            value={form.message}
                            onChange={(e) => setForm({ ...form, message: e.target.value })}
                        />
                    </label>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <p className="text-[12px] text-zinc-500">Opens your email app with the note filled in.</p>
                        <button type="submit" className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-300 text-zinc-950 text-sm font-semibold hover:brightness-110">
                            <Send size={15} /> Send
                        </button>
                    </div>
                </Card>
            </div>
        </motion.div>
    );
}
