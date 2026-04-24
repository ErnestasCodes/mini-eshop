import Button from "./Button";
import { cn } from "../../lib/utils";

export default function EmptyState({
    title,
    description,
    actionLabel,
    onAction,
    secondaryLabel,
    onSecondaryAction,
    className,
}) {
    return (
        <section
            className={cn(
                "rounded-[32px] border border-[var(--border)] bg-[var(--panel)] px-6 py-12 text-center shadow-[var(--shadow-soft)]",
                className
            )}
        >
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[var(--border-strong)] bg-[var(--surface-muted)] text-lg font-semibold text-[var(--foreground-strong)]">
                MS
            </div>
            <h3 className="mt-5 text-3xl font-semibold tracking-tight text-[var(--foreground-strong)]">{title}</h3>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-[var(--foreground-muted)]">{description}</p>
            {(actionLabel || secondaryLabel) && (
                <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
                    {actionLabel && (
                        <Button size="lg" onClick={onAction}>
                            {actionLabel}
                        </Button>
                    )}
                    {secondaryLabel && (
                        <Button variant="secondary" size="lg" onClick={onSecondaryAction}>
                            {secondaryLabel}
                        </Button>
                    )}
                </div>
            )}
        </section>
    );
}
