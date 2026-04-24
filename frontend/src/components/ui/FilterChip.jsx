import Button from "./Button";

export default function FilterChip({ label, onRemove }) {
    return (
        <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border-strong)] bg-white px-4 py-2 text-sm font-medium text-[var(--foreground-strong)] shadow-[var(--shadow-xs)]">
            <span>{label}</span>
            <Button
                variant="ghost"
                size="sm"
                className="min-h-0 rounded-full p-0 text-[var(--foreground-muted)] hover:bg-transparent hover:text-[var(--foreground-strong)]"
                aria-label={`Pašalinti filtrą ${label}`}
                onClick={onRemove}
            >
                ×
            </Button>
        </span>
    );
}
