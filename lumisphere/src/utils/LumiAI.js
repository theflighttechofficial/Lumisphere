// Lumi AI — offline, rule-based assistant. Every answer is generated from src/data/profile.js,
// so it stays in sync with the portfolio and never invents facts.
import {
    profile, socials, education, experience, projects, featuredProjects, skillGroups, certifications,
    achievements, research, goals, nowBuilding, leadership, impactStats,
} from "../data/profile";

const has = (input, ...words) => words.some((w) => input.includes(w));

const describeProject = (p) =>
    `${p.title} — ${p.tagline}\n\n${p.description}\n\n` +
    (p.metrics?.length ? `Results: ${p.metrics.join(" · ")}\n` : "") +
    `Stack: ${p.stack.join(", ")}` +
    (p.links?.live ? `\nLive: ${p.links.live}` : "") +
    (p.links?.repo ? `\nCode: ${p.links.repo}` : "");

const matchProject = (input) => {
    let best = null;
    let bestScore = 0;
    for (const p of projects) {
        let score = 0;
        const title = p.title.toLowerCase();
        if (input.includes(title)) score += 10;
        if (input.includes(p.id.replace(/-/g, " ")) || input.includes(p.id)) score += 8;
        title.split(/[^a-z0-9]+/).filter((w) => w.length > 3).forEach((w) => input.includes(w) && (score += 3));
        if (score > bestScore) {
            best = p;
            bestScore = score;
        }
    }
    return bestScore >= 3 ? best : null;
};

const SUGGESTIONS = `Try: "why hire Varun", "L&T internship", "top projects", "tell me about TrustPulse", "skills", "certifications", "CGPA", "what's next", or "contact".`;

export const LumiAIKnowledge = { profile, projects, experience };

export class LumiAIEngine {
    static query(userInput, context = {}) {
        const input = userInput.toLowerCase().trim();
        const lnt = experience.find((e) => e.id === "lnt");

        if (!input) return SUGGESTIONS;

        if (has(input, "hello", "hi ", "hey") && input.length < 12) {
            return `Hey! I'm Lumi, Varun's assistant. ${SUGGESTIONS}`;
        }

        if (has(input, "why hire", "why should", "hire him", "hire varun", "strength", "stand out")) {
            return (
                `Because he ships things that run in production and save real money.\n\n` +
                `• At L&T he cut a 3–4 day tender-extraction process to about 15 minutes per run, and LLM cost from ~$22 to $2 per run.\n` +
                `• He led a 6-person team to SIH 2026 selection (NAVIK) and built sub-millisecond fraud scoring on IBM LinuxONE for the IBM Z Datathon.\n` +
                `• He works the full stack: data pipelines and ML models through to live products like the Paws & Care clinic platform.\n` +
                `• ${projects.length} projects, ${certifications.length} certifications, CGPA ${education.cgpa} and climbing.`
            );
        }

        if (has(input, "l&t", "larsen", "internship", "intern", "experience", "work history", "job")) {
            return experience
                .map((e) => `${e.role} — ${e.company} (${e.period})\n${e.points.map((p) => `• ${p}`).join("\n")}`)
                .join("\n\n");
        }

        if (has(input, "cgpa", "gpa", "grade", "academic", "college", "sriher", "education", "degree", "university")) {
            return `${education.degree}\n${education.school}, ${education.period}\nCGPA ${education.cgpa}/10 — ${education.cgpaNote.toLowerCase()}.\n${education.honoursLabel}: ${education.honours.join(", ")}.`;
        }

        const project = matchProject(input);
        if (project) return describeProject(project);

        if (has(input, "rag", "retrieval", "llm", "genai")) {
            return describeProject(projects.find((p) => p.id === "lnt-rag")) + `\n\nSee also DocuMind AI (cited answers on a local fine-tuned model) and TRUST-TAB (LLM abstention research).`;
        }

        if (has(input, "ocr", "autocad", "sld", "single line")) return describeProject(projects.find((p) => p.id === "scan2sheet"));
        if (has(input, "yolo", "road", "pothole", "vision")) return describeProject(projects.find((p) => p.id === "road-ai"));
        if (has(input, "fraud", "ibm", "linuxone", "datathon")) return describeProject(projects.find((p) => p.id === "trustpulse"));
        if (has(input, "sih", "hackathon", "autonomous", "vehicle")) return describeProject(projects.find((p) => p.id === "navik"));

        if (has(input, "project", "portfolio", "built", "work on", "showcase")) {
            return `Featured work:\n${featuredProjects.map((p) => `• ${p.title}: ${p.tagline}`).join("\n")}\n\nAsk about any of them by name for details.`;
        }

        if (has(input, "skill", "stack", "tech", "language", "tools")) {
            return skillGroups.map((g) => `${g.label}: ${g.items.join(", ")}`).join("\n");
        }

        if (has(input, "cert", "course", "coursera", "badge")) {
            return certifications.map((c) => `✓ ${c.title} — ${c.issuer} (${c.date})`).join("\n");
        }

        if (has(input, "award", "achievement", "competition", "kaggle", "research", "paper")) {
            return (
                achievements.map((a) => `★ ${a.title} — ${a.detail}`).join("\n") +
                `\n\nResearch: ${research.map((r) => `${r.title} (${r.venue})`).join("; ")}`
            );
        }

        if (has(input, "lead", "team")) {
            return leadership.map((l) => `• ${l.title}: ${l.detail}`).join("\n");
        }

        if (has(input, "future", "goal", "plan", "next", "master", "ms ", "asu")) {
            return `Next: ${goals.shortTerm}\nLong term: ${goals.longTerm}\n\nRight now: ${nowBuilding.map((n) => n.title).join(", ")}.`;
        }

        if (has(input, "now", "currently", "working on", "building")) {
            return nowBuilding.map((n) => `• ${n.title} — ${n.detail}`).join("\n");
        }

        if (has(input, "contact", "email", "reach", "linkedin", "github", "connect", "phone")) {
            return `Email: ${profile.email}\n${socials.map((s) => `${s.label}: ${s.url}`).join("\n")}\n\nBased in ${profile.location} (${profile.timezone}).`;
        }

        if (has(input, "pitch", "summary", "summarize", "who is", "about", "introduce")) {
            return `${profile.name} — ${profile.role}.\n\n${profile.summary}\n\nHighlights: ${impactStats.map((s) => `${s.value} (${s.label.toLowerCase()})`).join("; ")}.`;
        }

        if (has(input, "lnt", "cost", "$22")) return lnt.points.join("\n");

        const ctx = context.timeOfDay ? ` (It's ${context.timeOfDay}${context.weather && context.weather !== "clear" ? ` and ${context.weather}y` : ""} in the room.)` : "";
        return `I'm not sure about that one.${ctx} ${SUGGESTIONS}`;
    }
}
