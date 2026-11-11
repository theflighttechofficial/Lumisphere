import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { X } from "lucide-react";

// Accessible dialog shell: full-screen sheet on phones, centred card from sm up.
// Closes on Esc and backdrop click, and returns focus to whatever opened it.
export default function Modal({ onClose, title, children, footer, maxWidth = "max-w-2xl", z = "z-[300]" }) {
    const panelRef = useRef(null);
    const onCloseRef = useRef(onClose);
    useEffect(() => {
        onCloseRef.current = onClose;
    });

    // Runs once per open: parents re-render with new onClose functions, which must not steal focus.
    useEffect(() => {
        const opener = document.activeElement;
        // With stacked dialogs (chat → project), Esc closes only the top-most one.
        const onKey = (e) => {
            if (e.key !== "Escape") return;
            const dialogs = document.querySelectorAll('[role="dialog"]');
            if (dialogs[dialogs.length - 1] === panelRef.current) onCloseRef.current();
        };
        window.addEventListener("keydown", onKey);
        if (!panelRef.current?.contains(document.activeElement)) panelRef.current?.focus();
        return () => {
            window.removeEventListener("keydown", onKey);
            opener?.focus?.();
        };
    }, []);

    return createPortal(
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className={`fixed inset-0 ${z} flex items-end sm:items-center justify-center sm:p-6 bg-black/80 backdrop-blur-md`}
        >
            <motion.div
                ref={panelRef}
                role="dialog"
                aria-modal="true"
                aria-label={title}
                tabIndex={-1}
                initial={{ y: 40, opacity: 0, scale: 0.98 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: 40, opacity: 0, scale: 0.98 }}
                transition={{ type: "spring", stiffness: 260, damping: 28 }}
                onClick={(e) => e.stopPropagation()}
                className={`relative w-full ${maxWidth} max-h-[92dvh] sm:max-h-[88dvh] flex flex-col rounded-t-3xl sm:rounded-3xl border border-white/10 bg-gradient-to-b from-zinc-900 to-zinc-950 shadow-[0_30px_100px_rgba(0,0,0,0.8)] outline-none`}
            >
                <div className="sm:hidden mx-auto mt-2.5 h-1 w-10 rounded-full bg-white/20" />
                <button
                    onClick={onClose}
                    aria-label="Close"
                    className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 z-10 w-9 h-9 rounded-full bg-white/10 border border-white/10 text-zinc-300 hover:text-white hover:bg-white/15 flex items-center justify-center"
                >
                    <X size={17} />
                </button>
                <div className="flex-1 overflow-y-auto overscroll-contain p-5 sm:p-7">{children}</div>
                {footer && <div className="border-t border-white/10 p-4 sm:px-7 pb-[max(1rem,env(safe-area-inset-bottom))]">{footer}</div>}
            </motion.div>
        </motion.div>,
        document.body
    );
}
