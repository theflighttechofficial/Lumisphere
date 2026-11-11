// Shared framer-motion presets for portfolio sections.
export const sectionMotion = {
    initial: { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
    transition: { duration: 0.28, ease: "easeOut" },
};

export const listMotion = {
    container: { hidden: {}, visible: { transition: { staggerChildren: 0.04 } } },
    item: { hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0, transition: { duration: 0.3 } } },
};
