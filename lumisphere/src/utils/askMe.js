// "Ask me anything" — an offline, first-person answer engine. It speaks as Varun, and every fact
// comes from src/data/profile.js, so it never claims anything the rest of the site doesn't.
//
// answer(question) -> { text, followUps, projects, section }
//   text       paragraphs separated by blank lines; lines starting with "• " render as bullets
//   followUps  suggested next questions
//   projects   project ids to show as tappable cards
//   section    portfolio section to offer a jump to

import {
    profile, socials, education, experience, projects, featuredProjects, skillGroups, certifications,
    achievements, research, goals, nowBuilding, leadership,
} from "../data/profile";

const lnt = experience.find((e) => e.id === "lnt");
const neoshaan = experience.find((e) => e.id === "neoshaan");
const linkedin = socials.find((s) => s.id === "linkedin").url;
const github = socials.find((s) => s.id === "github").url;

// Hand-written explanations for the projects people ask about most — how I'd tell it in person.
const stories = {
    "lnt-rag": `This is the one I'm proudest of. At L&T, someone on the team would spend 3–4 days reading 1,200-page tender PDFs and copying specs into Excel by hand. I wanted that to be a button.

The trick is retrieval. Pure vector search (FAISS) is good at meaning but misses exact strings like "IP65" or "11 kV". Keyword search (BM25) nails those but misses paraphrases. So I run both and merge the rankings with Reciprocal Rank Fusion — it only looks at rank positions, so I don't have to calibrate two different scoring scales.

Then GPT-4o extracts the specs and GPT-4o-mini double-checks them. The first version cost about $22 a run, which wasn't going to fly, so I moved embeddings offline, cached everything I could and added rules to skip checks that didn't need an LLM. It ended up at about $2 a run and roughly 15 minutes instead of days. It's still in use there.`,

    scan2sheet: `Same internship, nastier problem. The electrical single-line diagrams came as AutoCAD PDFs with no text layer at all — just pixels. So there was nothing to "read"; I had to OCR drawings.

I rasterize each page, clean it up with adaptive thresholding (drawings have uneven toner, so one global threshold doesn't work), run Tesseract, then group the tokens back into rows to rebuild the feeder and panel schedules in Excel. Not glamorous, but it saves people a lot of squinting.`,

    trustpulse: `This was for the IBM Z Datathon. Instant-payment scams are hard to catch one transaction at a time — each transfer looks normal. The giveaway is how accounts behave together.

So TrustPulse scores every payment as it arrives, using what it already knows about both accounts and their links, and returns APPROVE, VERIFY or REVIEW with a reason an analyst can read. We built and ran all of it on an IBM LinuxONE machine: the live engine does a payment in about 0.26 ms at the median and handles ~3,450 payments a second. I also benchmarked the Telum II on-chip AI accelerator against the CPU and encrypted the engine state with the hardware crypto unit, because "we ran it on a mainframe" should mean actually using the mainframe.`,

    navik: `NAVIK was our Smart India Hackathon 2026 entry (SIH26037, from MathWorks), and I led a team of six. The problem: self-driving assumes lanes. Indian roads have cows, auto-rickshaws cutting in, wrong-way bikes, potholes and monsoon roads.

We built a browser simulator to prove the planning maths before moving it to MATLAB/Simulink — a physics engine with friction-aware braking (dry road vs. monsoon slick), time-to-collision radar with emergency braking, a risk heat-map that steers the car around hazards, and Gemini for scenario reasoning. We made it to the national round. Leading six people taught me as much as the code did.`,

    "road-ai": `Road-AI takes dashcam, phone or drone footage and turns it into repair tickets. An ensemble of YOLOv8 models finds damage; I fuse detections across video frames and use Monte Carlo Dropout so the model can say "I'm not sure" instead of guessing.

The fun part was estimating depth without LiDAR — I use shadow gradients — and pricing the repair from Tamil Nadu PWD and NHAI rate schedules. It hit mAP50 0.648 on RDD2022 with 38% fewer false positives, and I presented it at SRIHER Research Day 2026.`,

    documind: `DocuMind is what I wish every "chat with your PDF" tool did: every answer cites the exact page and passage, and if the document doesn't contain the answer, it says so instead of making something up.

It compares semantic, keyword and hybrid retrieval side by side, reranks with a cross-encoder, and runs on a local model — I QLoRA fine-tuned Qwen3-4B on my own laptop GPU and serve it through Ollama, so documents never leave the machine. There's a built-in evaluation suite (Precision@K, MRR, BERTScore, ROUGE) because I don't trust a RAG system I can't measure.`,

    "paws-care": `This one's personal — it's my family's veterinary clinic, and it's live. Pet owners book appointments with payment-gated slots through Razorpay, doctors and admins manage health records and schedules, bookings sync to Google Calendar and Meet, and emails go out through Resend.

It's the project that taught me what "production" means: real users, real money, password resets at midnight, and caring about SEO and accessibility.`,

    resumeforge: `ResumeForge reads your resume the way an ATS and a recruiter would, scores it against a job description and suggests edits. Two rules I set: the score comes from a deterministic engine, never from the LLM, and every AI suggestion is labelled supported, inferred or unsupported so it can't quietly invent experience.

It's a Windows app that runs 100% offline with a local model by default — your resume is about the most personal document you have, so it shouldn't need to leave your PC.`,

    "trust-tab": `TRUST-TAB is my research project: does a language model know when a financial table can't answer the question? I take FinQA and create five variants — answerable, missing evidence, contradictory numbers, questions about rows that don't exist, and ambiguous questions — then measure whether the model answers or abstains.

I track four confidence signals and ten metrics (abstention F1, AURC, calibration error and so on), and ran a pilot on Qwen2.5-7B. I'm writing it up as an IEEE-format paper. It's the same instinct as DocuMind: an AI that says "I don't know" is more useful than one that's confidently wrong.`,

    lumisphere: `You're standing in it. I wanted a portfolio that felt like walking into my room at night: pull the chain, the lamp comes on, and the work appears in its light.

The light cone and background are custom GLSL shaders, the dust is a GPU particle simulation, every sound is synthesized live with the Web Audio API (there isn't a single audio file), and the hologram in the sidebar morphs for each section. And this chat is just me — no AI service, answers written from my own notes.`,
};

const intro = `Hey, I'm Varun — an AI & data analytics engineer from Chennai, in my third year of B.Tech CSE (AI & Data Analytics) at SRIHER.

What I like doing is taking slow, manual work and turning it into something that runs by itself. The best example: at L&T Construction I built a pipeline that cut a 3–4 day document job down to about 15 minutes a run.

I work end to end — data pipelines and models, then the product people actually click on. Ask me about any project, my internships, or what I'm building now.`;

const intents = [
    {
        id: "greeting",
        test: (q) => /^(hi|hey|hello|yo|hola|vanakkam|namaste|sup)\b/.test(q) && q.length < 25,
        answer: () => ({
            text: `Hey! 👋 I'm Varun. This is me answering, not a chatbot — I wrote these replies myself. What would you like to know?`,
            followUps: ["Tell me about yourself", "What's your best project?", "Why should we hire you?"],
        }),
    },
    {
        id: "hire",
        test: (q) => /(why (should|would|hire)|hire you|stand out|strength|good at|value|what makes you)/.test(q),
        answer: () => ({
            text: `Honest answer: I ship things that run in production, and I care about whether they actually save time or money.

• At L&T I took a 3–4 day manual process to about 15 minutes per run and cut its LLM cost from ~$22 to $2. It's still being used.
• I led a six-person team to the Smart India Hackathon 2026 national round, and built sub-millisecond fraud scoring on an IBM mainframe for the IBM Z Datathon.
• I cover the full path — data, models, backend, frontend — so I can take an idea all the way to something people use, like the live booking platform for my family's clinic.
• I measure things. My RAG projects come with evaluation suites, and my research is literally about making models admit when they don't know.

I'm ${profile.availability.toLowerCase()}.`,
            followUps: ["Tell me about L&T", "What are you building now?", "How do I contact you?"],
            projects: ["lnt-rag", "trustpulse"],
        }),
    },
    {
        id: "about",
        test: (q) => /(about (you|yourself)\b|who are you|introduce|yourself|who is varun|your story|background|summar)/.test(q),
        answer: () => ({ text: intro, followUps: ["What's your best project?", "What do you do for fun?", "What's next for you?"] }),
    },
    {
        id: "neoshaan",
        test: (q) => /(neoshaan|first internship|web intern)/.test(q),
        answer: () => ({
            text: `My first internship — ${neoshaan.role} at ${neoshaan.company}, ${neoshaan.period}, remote.\n\n${neoshaan.points.map((p) => `• ${p}`).join("\n")}\n\nIt's where I learned to build for a client instead of for myself: real deadlines, real feedback, and a lot of testing on cheap phones.`,
            followUps: ["Tell me about L&T", "What's your frontend stack?"],
            section: "experience",
        }),
    },
    {
        id: "lnt",
        test: (q) => /(l&t|l and t|larsen|lnt|internship|intern\b|tender|spec extract)/.test(q),
        answer: () => ({
            text: `I was a ${lnt.role} at ${lnt.company} (${lnt.period}), in the ${lnt.team}. I shipped two tools there.\n\n${stories["lnt-rag"]}\n\nThe second was Scan2Sheet, an OCR tool for electrical drawings that have no text layer. I came away with a letter of recommendation from the department. The source code belongs to L&T, so my public repos only have the documentation.`,
            followUps: ["How does hybrid RAG work?", "Tell me about Scan2Sheet", "What did you do at Neoshaan?"],
            projects: ["lnt-rag", "scan2sheet"],
            section: "experience",
        }),
    },
    {
        id: "rag-explain",
        test: (q) => /(how .*rag|what is rag|explain rag|hybrid (rag|search|retrieval)|rrf|reciprocal rank|bm25|faiss)/.test(q),
        answer: () => ({
            text: `Here's how I explain it to friends. RAG = before the AI answers, you go fetch the right pages and hand them over, so it answers from the document instead of memory.

The "fetch" step is where most systems go wrong. Vector search (FAISS) finds passages that *mean* the same thing, but it fumbles exact codes like "IP65". Keyword search (BM25) is perfect for exact terms but misses paraphrases.

So I run both and merge them with Reciprocal Rank Fusion: each passage gets 1/(60 + its rank) from each list, and you add those up. It only uses rank positions, so you never have to make two very different scores comparable. Simple, and it works shockingly well.`,
            followUps: ["Tell me about L&T", "Tell me about DocuMind"],
            projects: ["lnt-rag", "documind"],
        }),
    },
    {
        id: "best",
        test: (q) => /(best|favou?rite|proud|coolest|top|main|biggest) (project|work|thing)|top projects|best work|featured/.test(q),
        answer: () => ({
            text: `If I had to pick: the L&T tender extractor, because it's in production and saves real people days of work. TrustPulse, because getting sub-millisecond fraud scoring running on a mainframe was hard and fun. And NAVIK, because leading six people through a national hackathon taught me the most.

Tap any of these to see the details:`,
            followUps: ["Show me everything you've built", "What are you building now?"],
            projects: ["lnt-rag", "trustpulse", "navik", "documind", "paws-care"],
        }),
    },
    {
        id: "ai-projects",
        test: (q) => /(ai|ml|machine learning|llm) projects|projects .*(ai|ml)/.test(q),
        answer: () => ({
            text: `Most of my work touches AI somewhere, but these are the ones where it's the core:`,
            projects: projects.filter((p) => p.category === "ai").slice(0, 6).map((p) => p.id),
            followUps: ["How does hybrid RAG work?", "Tell me about your research"],
        }),
    },
    {
        id: "all-projects",
        test: (q) => /(all|every|list|how many) .*(project|built)|projects\b|portfolio|what have you built|show me/.test(q),
        answer: () => ({
            text: `${projects.length} so far — production tools, research, hackathon builds, products and a few things I made just because I loved the idea (a Tamil bus-journey experience, a Škoda/VW buyer's guide, a wedding invitation).\n\nThe ones I'd start with:`,
            followUps: ["What's your best project?", "Which projects use AI?", "What do you do for fun?"],
            projects: featuredProjects.slice(0, 6).map((p) => p.id),
            section: "projects",
        }),
    },
    {
        id: "education",
        test: (q) => /(cgpa|gpa|grade|marks|college|sriher|education|degree|university|study|studying|semester)/.test(q),
        answer: () => ({
            text: `I'm doing my ${education.degree} at ${education.school} (${education.period}).

My CGPA is ${education.cgpa}/10. It hasn't been a straight line — I started at 6.86 in my first year and it's gone up every semester since, which I'm honestly prouder of than if I'd started high. I got O grades in the ${education.honours.join(", ")} labs.

I also ran an Overleaf/LaTeX seminar for juniors on writing research papers.`,
            followUps: ["What's next after graduation?", "What are your strongest skills?"],
            section: "experience",
        }),
    },
    {
        id: "skills",
        test: (q) => /(skill|stack|tech|language|tools|framework|good with|what do you use|python|react)/.test(q),
        answer: () => ({
            text: `Day to day it's Python and SQL for data and ML, and TypeScript + React for products. The rest depends on the problem:

${skillGroups.map((g) => `• ${g.label}: ${g.items.slice(0, 6).join(", ")}${g.items.length > 6 ? "…" : ""}`).join("\n")}

I pick boring, reliable tools when I can and fancy ones only when they earn it.`,
            followUps: ["How does hybrid RAG work?", "Which certifications do you have?"],
            section: "skills",
        }),
    },
    {
        id: "certs",
        test: (q) => /(cert|course|coursera|badge|stanford|google)/.test(q),
        answer: () => ({
            text: `I've done ${certifications.length}. The ones that changed how I work were Andrew Ng's Machine Learning Specialization and the Google Data Analytics certificate.\n\n${certifications.map((c) => `• ${c.title} — ${c.issuer} (${c.date})`).join("\n")}`,
            followUps: ["What are your strongest skills?", "Any hackathons?"],
            section: "achievements",
        }),
    },
    {
        id: "hackathons",
        test: (q) => /(hackathon|sih|smart india|competition|kaggle|award|achievement|won|orchestrate|datathon)/.test(q),
        answer: () => ({
            text: `2026 was hackathon season for me:\n\n${achievements.map((a) => `• ${a.title} — ${a.detail}`).join("\n")}`,
            followUps: ["Tell me about NAVIK", "Tell me about TrustPulse"],
            projects: ["navik", "trustpulse", "messagemind"],
            section: "achievements",
        }),
    },
    {
        id: "leadership",
        test: (q) => /(\blead|\bteam\b|leadership|manage)/.test(q),
        answer: () => ({
            text: `${leadership.map((l) => `• ${l.title}: ${l.detail}`).join("\n")}\n\nWhat I learned leading NAVIK: split the problem so people can work in parallel, and decide early what "done" looks like for the demo.`,
            followUps: ["Tell me about NAVIK", "Any hackathons?"],
            projects: ["navik"],
        }),
    },
    {
        id: "research",
        test: (q) => /(research|paper|ieee|publication|benchmark|kumari|lemuria)/.test(q),
        answer: () => ({
            text: `Two research threads right now:\n\n${research.map((r) => `• ${r.title} (${r.venue}) — ${r.detail}`).join("\n")}\n\nThe first is pure curiosity about history and myth; the second comes from my RAG work — I want AI that can say "I don't know".`,
            followUps: ["Tell me about TRUST-TAB", "Tell me about DocuMind"],
            projects: ["trust-tab", "kumarikandam"],
            section: "achievements",
        }),
    },
    {
        id: "now",
        test: (q) => /(\bnow\b|currently|working on|building|these days|latest|recent)/.test(q),
        answer: () => ({
            text: `Right now:\n\n${nowBuilding.map((n) => `• ${n.title} — ${n.detail}`).join("\n")}\n\nAnd I'm learning German — A2 now, aiming for B2.`,
            followUps: ["Tell me about DocuMind", "What's next for you?"],
            projects: ["documind", "resumeforge", "trust-tab"],
        }),
    },
    {
        id: "goals",
        test: (q) => /(future|goal|plan|next|after graduat|masters|ms\b|asu|career|5 years|aspir)/.test(q),
        answer: () => ({
            text: `Short term: ${goals.shortTerm.toLowerCase()} I want to be somewhere I can ship data and AI systems that people rely on.

Longer term: ${goals.longTerm.charAt(0).toLowerCase() + goals.longTerm.slice(1)} Before that I'd like a year in industry after graduating in 2028, so I go into a master's knowing what problems I actually want to solve.`,
            followUps: ["Why should we hire you?", "How do I contact you?"],
            section: "journey",
        }),
    },
    {
        id: "fun",
        test: (q) => /(\bfun\b|hobb|free time|interest|passion|outside work|aviation|avgeek|flight|\bcars?\b|german|music|personal)/.test(q),
        answer: () => ({
            text: `I'm an avgeek at heart — that's where "The Flight Tech Labs", my little brand for side projects, gets its name.

I also love German engineering (I built a whole Škoda & Volkswagen buyer's guide just for fun, and I'm learning German), and Tamil culture — Oru Payanam Aayiram Kathaigal is a night bus journey through Tamil Nadu's food, cinema and music. Most of my "hobbies" end up as websites, honestly.`,
            followUps: ["What's your best project?", "How did you build this site?"],
            projects: ["oru-payanam", "skoda", "kumarikandam"],
        }),
    },
    {
        id: "site",
        test: (q) => /(this (site|website|portfolio)|lumisphere|lamp|how.*built.*site|shader|who made this)/.test(q),
        answer: () => ({ text: stories.lumisphere, followUps: ["What's your best project?", "What do you do for fun?"], projects: ["lumisphere"] }),
    },
    {
        id: "contact",
        test: (q) => /(contact|email|reach|linkedin|github|connect|talk|call|phone|resume|cv|hire|available|availability|open to)/.test(q),
        answer: () => ({
            text: `Easiest is email: ${profile.email}. I usually reply within a day.

• LinkedIn: ${linkedin.replace("https://", "")}
• GitHub: ${github.replace("https://", "")}

I'm ${profile.availability.toLowerCase()}, based in ${profile.location} (${profile.timezone}). My résumé button is right above this chat.`,
            followUps: ["Why should we hire you?", "What's next for you?"],
            section: "contact",
        }),
    },
];

// Match a project by name/id words so "tell me about rigforge" or "what's cooked" works.
const matchProject = (q) => {
    let best = null;
    let bestScore = 0;
    for (const p of projects) {
        let score = 0;
        const title = p.title.toLowerCase();
        if (q.includes(title)) score += 10;
        if (q.includes(p.id) || q.includes(p.id.replace(/-/g, " "))) score += 8;
        title.split(/[^a-z0-9]+/).filter((w) => w.length > 3 && !["clinic", "explorer", "showcase", "simulator", "model", "survival"].includes(w)).forEach((w) => new RegExp(`\\b${w}\\b`).test(q) && (score += 4));
        if (score > bestScore) [best, bestScore] = [p, score];
    }
    return bestScore >= 4 ? best : null;
};

const projectAnswer = (p) => {
    const story =
        stories[p.id] ||
        `I built ${p.title} — ${p.tagline.charAt(0).toLowerCase() + p.tagline.slice(1)}\n\n${p.description}\n\nThe parts I'm happiest with:\n${p.highlights.map((h) => `• ${h}`).join("\n")}`;
    const extra = p.note ? `\n\n(${p.note})` : "";
    return {
        text: story + extra,
        projects: [p.id],
        followUps: ["What's your best project?", "What are you building now?", "Which projects use AI?"].slice(0, 3),
    };
};

export const starterQuestions = [
    "Tell me about yourself",
    "Why should we hire you?",
    "What did you build at L&T?",
    "What's your best project?",
    "What are you building now?",
    "What do you do for fun?",
];

export function answer(question) {
    const q = question.toLowerCase().replace(/[’']/g, "'").replace(/[?!.]+$/g, "").trim();
    if (!q) return null;

    // Specific intents that should win over a project-name match
    for (const id of ["greeting", "rag-explain", "hire"]) {
        const intent = intents.find((i) => i.id === id);
        if (intent.test(q)) return { id, ...intent.answer() };
    }

    const p = matchProject(q);
    if (p) return { id: `project:${p.id}`, ...projectAnswer(p) };

    for (const intent of intents) {
        if (intent.test(q)) return { id: intent.id, ...intent.answer() };
    }

    return {
        id: "fallback",
        text: `Hmm, I don't have a written answer for that one. Try asking about a project, my internships, skills or plans — or just email me at ${profile.email} and I'll answer properly.`,
        followUps: starterQuestions.slice(0, 3),
    };
}
