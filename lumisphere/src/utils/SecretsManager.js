import { AudioEngine } from "./AudioEngine";

// Initial Secrets Registry
const INITIAL_ACHIEVEMENTS = [
    { id: "konami", name: "Konami Master", desc: "Entered the legendary ↑ ↑ ↓ ↓ ← → ← → B A code.", icon: "🕹️", unlocked: false },
    { id: "morse", name: "Morse Decoder", desc: "Flashed the Lamp Pull Chain in S.O.S rhythm.", icon: "⚡", unlocked: false },
    { id: "hacker", name: "Terminal Hacker", desc: "Executed a secret command in the desk terminal.", icon: "💻", unlocked: false },
    { id: "arcade", name: "Arcade Champion", desc: "Played the Retro Cyberpunk Arcade mini-game.", icon: "👾", unlocked: false },
    { id: "devroom", name: "Key to the Vault", desc: "Discovered the Hidden Developer Room.", icon: "🚪", unlocked: false },
    { id: "historian", name: "Developer Historian", desc: "Read the confidential Developer Diary.", icon: "📜", unlocked: false },
    { id: "collector", name: "Relic Hunter", desc: "Found all 4 hidden desk collectibles.", icon: "💎", unlocked: false },
    { id: "stylist", name: "Master Stylist", desc: "Unlocked a secret UI color theme.", icon: "🎨", unlocked: false },
];

const INITIAL_COLLECTIBLES = [
    { id: "keycap", name: "Golden Mech Keycap", location: "Mechanical Keyboard", found: false, icon: "⌨️" },
    { id: "floppy", name: "Cyber Floppy Disk 1.44MB", location: "USB Drive / Storage", found: false, icon: "💾" },
    { id: "relic", name: "Quantum Core Relic", location: "Hidden Dev Room", found: false, icon: "🔮" },
    { id: "coin", name: "Retro Arcade Token", location: "Retro Arcade", found: false, icon: "🪙" },
];

const DRONE_HINTS = [
    "💡 Cryptic Hint: Try entering the legendary 8-bit Konami code on your keyboard: ↑ ↑ ↓ ↓ ← → ← → B A!",
    "⚡ Cryptic Hint: Pull the Lamp chain rhythmically (3 fast, 3 slow, 3 fast) to send an S.O.S Morse signal!",
    "💻 Cryptic Hint: Open the Desk Monitor Terminal and type secret commands like 'arcade', 'matrix', or 'diary'!",
    "🚪 Cryptic Hint: Type 'devroom' in the terminal or solve the Morse code to enter the Hidden Vault!",
    "💎 Cryptic Hint: Click around desk objects to uncover 4 hidden ancient developer relics!"
];

class SecretsManagerClass {
    constructor() {
        this.achievements = INITIAL_ACHIEVEMENTS;
        this.collectibles = INITIAL_COLLECTIBLES;
        this.activeTheme = "amber"; // amber | vaporwave | matrix | cyber | void | gold
        this.listeners = new Set();

        // Konami code sequence tracker
        this.konamiSequence = [];
        this.targetKonami = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];

        // Morse pull timing tracker
        this.lampPulls = [];

        this.loadState();
        this.initKonamiListener();
    }

    loadState() {
        try {
            const saved = localStorage.getItem("lumisphere_secrets_v1");
            if (saved) {
                const parsed = JSON.parse(saved);
                if (parsed.achievements) {
                    this.achievements = this.achievements.map((a) => {
                        const s = parsed.achievements.find((p) => p.id === a.id);
                        return s ? { ...a, unlocked: s.unlocked } : a;
                    });
                }
                if (parsed.collectibles) {
                    this.collectibles = this.collectibles.map((c) => {
                        const s = parsed.collectibles.find((p) => p.id === c.id);
                        return s ? { ...c, found: s.found } : c;
                    });
                }
                if (parsed.activeTheme) {
                    this.activeTheme = parsed.activeTheme;
                }
            }
        } catch (e) {}
    }

    saveState() {
        try {
            localStorage.setItem(
                "lumisphere_secrets_v1",
                JSON.stringify({
                    achievements: this.achievements,
                    collectibles: this.collectibles,
                    activeTheme: this.activeTheme,
                })
            );
        } catch (e) {}
    }

    subscribe(listener) {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    }

    notify() {
        this.listeners.forEach((fn) => fn());
    }

    initKonamiListener() {
        if (typeof window === "undefined") return;

        window.addEventListener("keydown", (e) => {
            const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
            this.konamiSequence.push(key);

            if (this.konamiSequence.length > this.targetKonami.length) {
                this.konamiSequence.shift();
            }

            if (this.konamiSequence.join(",") === this.targetKonami.join(",")) {
                this.konamiSequence = [];
                this.triggerKonamiCode();
            }
        });
    }

    triggerKonamiCode() {
        AudioEngine.playHoloProject();
        this.unlockAchievement("konami");
        this.findCollectible("coin");
        this.notifyEvent("KONAMI_ACTIVATED");
    }

    recordLampPull() {
        const now = Date.now();
        this.lampPulls.push(now);

        // Keep last 9 pulls
        if (this.lampPulls.length > 9) {
            this.lampPulls.shift();
        }

        // Detect 3 fast, 3 slow, 3 fast Morse SOS pattern or 5 rapid pulls
        if (this.lampPulls.length >= 6) {
            const intervals = [];
            for (let i = 1; i < this.lampPulls.length; i++) {
                intervals.push(this.lampPulls[i] - this.lampPulls[i - 1]);
            }

            const avg = intervals.reduce((a, b) => a + b, 0) / intervals.length;
            if (avg < 450) {
                this.unlockAchievement("morse");
                this.notifyEvent("MORSE_ACTIVATED");
            }
        }
    }

    unlockAchievement(id) {
        let newlyUnlocked = null;
        this.achievements = this.achievements.map((a) => {
            if (a.id === id && !a.unlocked) {
                newlyUnlocked = a;
                return { ...a, unlocked: true };
            }
            return a;
        });

        if (newlyUnlocked) {
            this.saveState();
            AudioEngine.playHoloProject();
            this.notify();
            this.notifyEvent("ACHIEVEMENT_UNLOCKED", newlyUnlocked);
        }
    }

    findCollectible(id) {
        let newlyFound = null;
        this.collectibles = this.collectibles.map((c) => {
            if (c.id === id && !c.found) {
                newlyFound = c;
                return { ...c, found: true };
            }
            return c;
        });

        if (newlyFound) {
            this.saveState();
            this.notify();
            if (this.collectibles.every((c) => c.found)) {
                this.unlockAchievement("collector");
            }
        }
    }

    getRandomHint() {
        const idx = Math.floor(Math.random() * DRONE_HINTS.length);
        return DRONE_HINTS[idx];
    }

    notifyEvent(type, payload) {
        if (typeof window !== "undefined") {
            window.dispatchEvent(new CustomEvent("lumisphere_secret_event", { detail: { type, payload } }));
        }
    }
}

export const SecretsManager = new SecretsManagerClass();
