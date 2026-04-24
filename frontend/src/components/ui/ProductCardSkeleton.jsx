export default function ProductCardSkeleton() {
    return (
        <div className="overflow-hidden rounded-[30px] border border-[var(--border)] bg-[var(--panel)] shadow-[var(--shadow-soft)]">
            <div className="h-72 animate-pulse bg-[var(--surface-muted)]" />
            <div className="space-y-4 p-5">
                <div className="h-3 w-24 animate-pulse rounded-full bg-[var(--surface-strong)]" />
                <div className="h-8 w-4/5 animate-pulse rounded-2xl bg-[var(--surface-strong)]" />
                <div className="h-4 w-full animate-pulse rounded-full bg-[var(--surface-strong)]" />
                <div className="h-4 w-5/6 animate-pulse rounded-full bg-[var(--surface-strong)]" />
                <div className="grid gap-3 sm:grid-cols-2">
                    <div className="h-11 animate-pulse rounded-full bg-[var(--surface-strong)]" />
                    <div className="h-11 animate-pulse rounded-full bg-[var(--surface-strong)]" />
                </div>
            </div>
        </div>
    );
}
