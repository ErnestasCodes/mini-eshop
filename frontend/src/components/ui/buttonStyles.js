import { cn } from "../../lib/utils";

export function buttonClassName({ variant = "primary", size = "md", block = false, className = "" } = {}) {
    const base =
        "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-semibold transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] disabled:pointer-events-none disabled:opacity-50";
    const variants = {
        primary:
            "bg-[var(--foreground-strong)] px-5 text-white shadow-[var(--shadow-soft)] hover:-translate-y-0.5 hover:bg-[var(--foreground)]",
        secondary:
            "border border-[var(--border-strong)] bg-white px-5 text-[var(--foreground-strong)] hover:border-[var(--foreground-strong)] hover:bg-[var(--surface-strong)]",
        ghost: "px-4 text-[var(--foreground-muted)] hover:bg-[var(--surface-strong)] hover:text-[var(--foreground-strong)]",
        subtle:
            "border border-[var(--border)] bg-[var(--surface-muted)] px-4 text-[var(--foreground-strong)] hover:border-[var(--border-strong)] hover:bg-white",
        danger:
            "border border-rose-200 bg-white px-4 text-rose-700 hover:bg-rose-50 hover:text-rose-800",
    };
    const sizes = {
        sm: "min-h-10 text-sm",
        md: "min-h-11 text-sm",
        lg: "min-h-12 text-[0.95rem]",
    };

    return cn(base, variants[variant], sizes[size], block && "w-full", className);
}
