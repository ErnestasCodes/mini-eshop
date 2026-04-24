import { formatPrice, getBadgeTone, getStockSummary } from "../lib/storefront";
import Button from "./ui/Button";

function truncateText(value, maxLength) {
    const text = String(value ?? "").trim();

    if (text.length <= maxLength) {
        return text;
    }

    return `${text.slice(0, maxLength).trim()}...`;
}

export default function ProductCard({
    p,
    onAddToCart,
    onViewProduct,
    onRequireLogin,
    canAddToCart = true,
}) {
    const productId = p.productId ?? p.id;
    const stock = Number(p.stock ?? 0);
    const isOutOfStock = !Number.isFinite(stock) || stock <= 0;
    const stockSummary = getStockSummary(stock);
    const addButtonLabel = !canAddToCart ? "Prisijungti" : isOutOfStock ? "Išparduota" : "Į krepšelį";
    const summary = truncateText(
        p.displayDescription || p.description || p.productDescription || "Kasdieniam miesto garderobui.",
        118
    );

    return (
        <article className="group overflow-hidden rounded-[30px] border border-[var(--border)] bg-[var(--panel)] shadow-[var(--shadow-soft)] transition duration-300 hover:-translate-y-1.5 hover:shadow-[var(--shadow-lift)]">
            <div className="relative overflow-hidden border-b border-[var(--border)] bg-[var(--surface-muted)]">
                <button className="block w-full p-4 text-left sm:p-5" onClick={() => onViewProduct?.(productId)}>
                    <img
                        src={p.coverImage}
                        alt={p.displayName || p.productName || "produktas"}
                        className="h-64 w-full rounded-[24px] object-cover transition duration-500 group-hover:scale-[1.03]"
                    />
                </button>

                <div className="pointer-events-none absolute left-4 top-4 flex flex-wrap gap-2">
                    {p.badges?.map((badge) => (
                        <span
                            key={badge}
                            className={`rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${getBadgeTone(badge)}`}
                        >
                            {badge}
                        </span>
                    ))}
                </div>

                <div className="pointer-events-none absolute right-4 top-4 rounded-full border border-white/70 bg-white/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--foreground-muted)] shadow-sm">
                    {p.categoryLabel || "Apranga"}
                </div>
            </div>

            <div className="space-y-5 p-5">
                <div className="space-y-3">
                    <div className="flex items-center justify-between gap-3">
                        <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--foreground-subtle)]">
                            {p.editorialTag || "Mono Studio"}
                        </div>
                        <div className={`rounded-full border px-3 py-1 text-xs font-semibold ${stockSummary.surface}`}>
                            {stockSummary.label}
                        </div>
                    </div>

                    <button
                        className="block text-left text-2xl font-semibold tracking-tight text-[var(--foreground-strong)] transition hover:text-[var(--foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
                        onClick={() => onViewProduct?.(productId)}
                    >
                        {p.displayName || p.productName || "Produktas"}
                    </button>

                    <p className="text-sm leading-7 text-[var(--foreground-muted)]">{summary}</p>
                </div>

                <div className="flex items-end justify-between gap-4 rounded-[24px] border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-4">
                    <div>
                        <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--foreground-subtle)]">Kaina</div>
                        <div className="mt-2 text-3xl font-semibold tracking-tight text-[var(--foreground-strong)]">
                            {formatPrice(p.price)}
                        </div>
                    </div>
                    <div className="text-right text-sm text-[var(--foreground-muted)]">
                        <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--foreground-subtle)]">Stilius</div>
                        <div className="mt-2 font-semibold text-[var(--foreground-strong)]">{p.categoryNote || "Minimalus siluetas"}</div>
                    </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
                    <Button
                        size="lg"
                        onClick={() => {
                            if (!canAddToCart) {
                                onRequireLogin?.();
                                return;
                            }

                            onAddToCart?.();
                        }}
                        disabled={isOutOfStock && canAddToCart}
                        aria-label={`${addButtonLabel}: ${p.displayName || p.productName || "produktas"}`}
                    >
                        {addButtonLabel}
                    </Button>
                    <Button
                        variant="secondary"
                        size="lg"
                        onClick={() => onViewProduct?.(productId)}
                        aria-label={`Peržiūrėti produktą ${p.displayName || p.productName || "produktas"}`}
                    >
                        Plačiau
                    </Button>
                </div>
            </div>
        </article>
    );
}
