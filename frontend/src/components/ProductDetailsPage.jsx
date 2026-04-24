import { useMemo, useState } from "react";

import { BRAND_NAME, formatPrice, getBadgeTone, getStockSummary, PRODUCT_DETAIL_POINTS } from "../lib/storefront";
import Button from "./ui/Button";
import EmptyState from "./ui/EmptyState";
import ProductCardSkeleton from "./ui/ProductCardSkeleton";

export default function ProductDetailsPage({
    product,
    loading = false,
    onNavigate,
    onAddToCart,
    onRequireLogin,
    canAddToCart = true,
}) {
    const [added, setAdded] = useState(false);

    const description = useMemo(() => {
        if (!product) {
            return "";
        }

        return (
            product.displayDescription ||
            product.description ||
            product.productDescription ||
            "Produkto aprašymas šiuo metu nepridėtas."
        );
    }, [product]);

    if (loading && !product) {
        return (
            <div className="space-y-6">
                <div className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(340px,0.95fr)]">
                    <div className="overflow-hidden rounded-[30px] border border-[var(--border)] bg-[var(--panel)] p-4 shadow-[var(--shadow-soft)] sm:rounded-[34px] sm:p-6">
                        <div className="h-[320px] animate-pulse rounded-[24px] bg-[var(--surface-muted)] sm:h-[420px] sm:rounded-[28px] lg:h-[520px]" />
                    </div>
                    <ProductCardSkeleton />
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <EmptyState
                title="Produktas nerastas"
                description={`Patikrinkite nuorodą arba grįžkite į ${BRAND_NAME} katalogą ir peržiūrėkite visą kolekciją.`}
                actionLabel="Grįžti į katalogą"
                onAction={() => onNavigate?.("/products")}
            />
        );
    }

    const stock = Number(product.stock ?? 0);
    const isOutOfStock = !Number.isFinite(stock) || stock <= 0;
    const stockSummary = getStockSummary(stock);

    return (
        <div className="space-y-6">
            <nav className="flex flex-wrap items-center gap-2 text-sm text-[var(--foreground-muted)]" aria-label="Breadcrumb">
                <button className="transition hover:text-[var(--foreground-strong)]" onClick={() => onNavigate?.("/")}>
                    Pradžia
                </button>
                <span>/</span>
                <button className="transition hover:text-[var(--foreground-strong)]" onClick={() => onNavigate?.("/products")}>
                    Katalogas
                </button>
                <span>/</span>
                <span className="break-words text-[var(--foreground-strong)]">
                    {product.displayName || product.productName || "Produktas"}
                </span>
            </nav>

            <div className="grid gap-6 lg:grid-cols-[minmax(0,1.02fr)_minmax(340px,0.98fr)]">
                <section className="overflow-hidden rounded-[30px] border border-[var(--border)] bg-[var(--panel)] shadow-[var(--shadow-soft)] sm:rounded-[34px]">
                    <div className="border-b border-[var(--border)] bg-[var(--surface-muted)] px-4 py-4 sm:px-6 sm:py-5">
                        <div className="flex flex-wrap gap-2">
                            {product.badges?.map((badge) => (
                                <span
                                    key={badge}
                                    className={`rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${getBadgeTone(
                                        badge
                                    )}`}
                                >
                                    {badge}
                                </span>
                            ))}
                            <span className="rounded-full border border-[var(--border)] bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--foreground-muted)]">
                                {product.categoryLabel || "Apranga"}
                            </span>
                        </div>
                    </div>
                    <div className="p-4 sm:p-6 lg:p-8">
                        <img
                            src={product.coverImage}
                            alt={product.displayName || product.productName || "produktas"}
                            className="h-[300px] w-full rounded-[24px] object-cover sm:h-[420px] sm:rounded-[28px] lg:h-[520px]"
                        />
                    </div>
                </section>

                <aside className="rounded-[30px] border border-[var(--border)] bg-[var(--panel)] p-5 shadow-[var(--shadow-soft)] sm:rounded-[34px] sm:p-7 lg:sticky lg:top-28 lg:self-start">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--foreground-subtle)]">
                        {product.editorialTag || "Mono Studio"}
                    </div>
                    <h1 className="mt-4 text-3xl font-semibold tracking-tight text-[var(--foreground-strong)] sm:text-4xl">
                        {product.displayName || product.productName || "Produktas"}
                    </h1>
                    <p className="mt-4 text-sm leading-7 text-[var(--foreground-muted)]">{description}</p>

                    <div className="mt-6 rounded-[28px] border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-4 sm:px-5 sm:py-5">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--foreground-subtle)]">
                                    Kaina
                                </div>
                                <div className="mt-2 text-3xl font-semibold tracking-tight text-[var(--foreground-strong)] sm:text-4xl">
                                    {formatPrice(product.price)}
                                </div>
                            </div>
                            <div className={`rounded-full border px-3 py-1 text-sm font-semibold ${stockSummary.surface}`}>
                                {stockSummary.label}
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                        {PRODUCT_DETAIL_POINTS.map((item) => (
                            <div key={item.title} className="rounded-[24px] border border-[var(--border)] bg-white px-4 py-4">
                                <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--foreground-subtle)]">
                                    {item.title}
                                </div>
                                <div className="mt-2 text-sm font-semibold text-[var(--foreground-strong)]">{item.value}</div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 flex flex-col gap-3">
                        <Button
                            size="lg"
                            block
                            onClick={async () => {
                                setAdded(false);

                                if (!canAddToCart) {
                                    onRequireLogin?.();
                                    return;
                                }

                                const success = await onAddToCart?.();
                                setAdded(Boolean(success));
                            }}
                            disabled={isOutOfStock && canAddToCart}
                        >
                            {!canAddToCart
                                ? "Prisijungti apsipirkimui"
                                : isOutOfStock
                                  ? "Prekės šiuo metu nėra"
                                  : "Į krepšelį"}
                        </Button>

                        <Button variant="secondary" size="lg" block onClick={() => onNavigate?.("/products")}>
                            Grįžti į katalogą
                        </Button>
                    </div>

                    {added ? (
                        <div className="mt-5 rounded-[24px] border border-emerald-200 bg-emerald-50 px-4 py-4 text-sm text-emerald-800">
                            Prekė sėkmingai įdėta į krepšelį.
                        </div>
                    ) : null}

                    <div className="mt-8 space-y-3 border-t border-[var(--border)] pt-6 text-sm leading-7 text-[var(--foreground-muted)]">
                        <p>
                            Prekės kodas #{product.productId ?? product.id}. Sukurta kasdieniam dėvėjimui ir lengvam
                            derinimui prie neutralaus garderobo.
                        </p>
                        <p>
                            Paprastas siluetas, patogus kritimas ir subtilios detalės leidžia šį modelį dėvėti nuo ryto
                            iki vakaro.
                        </p>
                    </div>
                </aside>
            </div>
        </div>
    );
}
