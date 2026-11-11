import { Globe, PenLine, Plane } from "lucide-react";

export function GithubIcon({ size = 14, className = "" }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
            <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
        </svg>
    );
}

export function LinkedinIcon({ size = 14, className = "" }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
            <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
        </svg>
    );
}

export function KaggleIcon({ size = 14, className = "" }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
            <path d="M18.825 23.859h-3.26l-6.425-9.458-3.033 2.946v6.512H3.14V.141h2.967v12.242l8.847-12.242h3.585l-7.46 9.873 7.746 13.845z" />
        </svg>
    );
}

export function HackerRankIcon({ size = 14, className = "" }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
            <path d="M12 0c1.285 0 9.75 4.886 10.392 6 .642 1.113.642 10.887 0 12-.642 1.113-9.107 6-10.392 6-1.284 0-9.75-4.887-10.392-6C.966 16.887.966 7.113 1.608 6 2.25 4.886 10.715 0 12 0zm2.295 6.799c-.141 0-.258.115-.258.258v3.875H9.963V6.908h.701a.257.257 0 0 0 .183-.439L9.133 4.756a.255.255 0 0 0-.182-.075.256.256 0 0 0-.182.076L7.053 6.47a.256.256 0 0 0 .183.438h.701v10.077c0 .141.115.258.258.258h1.514a.258.258 0 0 0 .258-.258v-4.074h4.074v4.074c0 .141.115.258.258.258h1.514a.258.258 0 0 0 .258-.258V7.057a.258.258 0 0 0-.258-.258h-1.518z" />
        </svg>
    );
}

export function InstagramIcon({ size = 14, className = "" }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
        </svg>
    );
}

const iconMap = {
    github: GithubIcon,
    linkedin: LinkedinIcon,
    kaggle: KaggleIcon,
    hackerrank: HackerRankIcon,
    instagram: InstagramIcon,
    hashnode: PenLine,
    labs: Plane,
};

export function SocialIcon({ id, size = 14, className = "" }) {
    const Icon = iconMap[id] || Globe;
    return <Icon size={size} className={className} />;
}
