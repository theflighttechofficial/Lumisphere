import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { skillGroups, projects, profile } from "../../../data/profile";
import { Card, Chip, MotionItem, MotionList, SectionHeading } from "../ui";
import { sectionMotion } from "../motion";

export default function SkillsSection() {
    const [query, setQuery] = useState("");

    // How many projects use each skill — shown as evidence, not a made-up percentage.
    const usage = useMemo(() => {
        const map = {};
        projects.forEach((p) => p.stack.forEach((s) => (map[s.toLowerCase()] = (map[s.toLowerCase()] || 0) + 1)));
        return map;
    }, []);

    const q = query.toLowerCase().trim();
    const groups = skillGroups
        .map((g) => ({ ...g, items: g.items.filter((i) => !q || i.toLowerCase().includes(q)) }))
        .filter((g) => g.items.length);

    return (
        <motion.div {...sectionMotion}>
            <SectionHeading
                eyebrow="Skills"
                title="The toolkit"
                description="Highlighted skills are the ones I reach for first. Numbers show how many projects on this site use that tool."
                action={
                    <label className="relative flex items-center sm:w-56 shrink-0">
                        <Search size={15} className="absolute left-3 text-zinc-500 pointer-events-none" />
                        <input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Find a skill…"
                            aria-label="Search skills"
                            className="w-full pl-9 pr-3 py-2 rounded-xl bg-black/40 border border-white/10 text-base sm:text-sm text-white placeholder-zinc-500 outline-none focus:border-amber-400/60"
                        />
                    </label>
                }
            />

            <MotionList key={q} className="grid md:grid-cols-2 gap-3">
                {groups.map((g) => (
                    <MotionItem key={g.id}>
                        <Card className="h-full p-5">
                            <h3 className="text-[15px] font-semibold text-white mb-3">{g.label}</h3>
                            <div className="flex flex-wrap gap-1.5">
                                {g.items.map((item) => {
                                    const n = usage[item.toLowerCase()];
                                    return (
                                        <Chip key={item} highlight={g.core?.includes(item)}>
                                            {item}
                                            {n ? <span className="ml-1.5 text-[10px] text-zinc-500">{n}</span> : null}
                                        </Chip>
                                    );
                                })}
                            </div>
                        </Card>
                    </MotionItem>
                ))}
            </MotionList>
            {!groups.length && <p className="py-16 text-center text-sm text-zinc-500">No skill matches “{query}”.</p>}

            <Card className="mt-4 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <p className="text-sm text-zinc-300">Spoken languages</p>
                <div className="flex flex-wrap gap-1.5">{profile.languages.map((l) => <Chip key={l}>{l}</Chip>)}</div>
            </Card>
        </motion.div>
    );
}
