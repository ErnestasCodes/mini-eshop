import { cn } from "../../lib/utils";

export function fieldClassName(className = "") {
    return cn(
        "w-full rounded-[22px] border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-3.5 text-sm text-[var(--foreground-strong)] transition placeholder:text-[var(--foreground-subtle)] focus:border-[var(--border-strong)] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] disabled:cursor-not-allowed disabled:opacity-60",
        className
    );
}
