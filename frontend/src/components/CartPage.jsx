import { formatPrice } from "../lib/storefront";
import { fieldClassName } from "./ui/fieldStyles";
import Button from "./ui/Button";
import EmptyState from "./ui/EmptyState";

export default function CartPage({
    cartItems,
    cartTotal,
    cartSummaryLabel,
    catalogProducts,
    deletingCartItemId,
    updatingCartItemId,
    isClearingCart,
    getQuantityOptions,
    onChangeQuantity,
    onRemove,
    onClear,
    onBrowseProducts,
    onNavigateToOverview,
}) {
    if (cartItems.length === 0) {
        return (
            <EmptyState
                title="Krepšelis tuščias"
                description="Peržiūrėkite kolekciją ir pasirinkti modeliai čia atsiras iš karto."
                actionLabel="Peržiūrėti kolekciją"
                onAction={onBrowseProducts}
                secondaryLabel="Apie Mono Studio"
                onSecondaryAction={onNavigateToOverview}
            />
        );
    }

    return (
        <div className="page-gap">
            <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
                <div className="rounded-[30px] border border-[var(--border)] bg-[var(--panel)] px-5 py-6 shadow-[var(--shadow-soft)] sm:rounded-[36px] sm:px-8 sm:py-7">
                    <div className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--foreground-subtle)]">
                        Krepšelis
                    </div>
                    <h1 className="mt-4 text-3xl font-semibold tracking-tight text-[var(--foreground-strong)] sm:text-4xl lg:text-5xl">
                        Atrinkti modeliai vienoje vietoje
                    </h1>
                    <p className="mt-4 max-w-3xl text-sm leading-7 text-[var(--foreground-muted)]">
                        Peržiūrėkite pasirinktus modelius, atnaujinkite kiekį ir tęskite apsipirkimą savo tempu.
                    </p>
                </div>

                <aside className="rounded-[30px] border border-[var(--border)] bg-[var(--panel)] p-5 shadow-[var(--shadow-soft)] sm:rounded-[32px] sm:p-6">
                    <div className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--foreground-subtle)]">
                        Suvestinė
                    </div>
                    <div className="mt-4 text-3xl font-semibold tracking-tight text-[var(--foreground-strong)]">
                        {formatPrice(cartTotal)}
                    </div>
                    <p className="mt-2 text-sm leading-7 text-[var(--foreground-muted)]">{cartSummaryLabel}</p>

                    <div className="mt-6 rounded-[26px] border border-[var(--border)] bg-[var(--surface-muted)] p-4">
                        <div className="flex items-center justify-between text-sm text-[var(--foreground-muted)]">
                            <span>Prekių kiekis</span>
                            <span className="font-semibold text-[var(--foreground-strong)]">{cartItems.length}</span>
                        </div>
                        <div className="mt-2 flex items-center justify-between text-sm text-[var(--foreground-muted)]">
                            <span>Tarpinė suma</span>
                            <span className="font-semibold text-[var(--foreground-strong)]">{formatPrice(cartTotal)}</span>
                        </div>
                    </div>

                    <div className="mt-6 flex flex-col gap-3">
                        <Button size="lg" block onClick={onBrowseProducts}>
                            Tęsti apsipirkimą
                        </Button>
                        <Button variant="secondary" size="lg" block onClick={onNavigateToOverview}>
                            Apie Mono Studio
                        </Button>
                        <Button
                            variant="ghost"
                            block
                            onClick={onClear}
                            disabled={isClearingCart || updatingCartItemId !== null}
                        >
                            {isClearingCart ? "Valoma..." : "Išvalyti krepšelį"}
                        </Button>
                    </div>
                </aside>
            </section>

            <section className="space-y-4">
                {cartItems.map((item) => {
                    const product = catalogProducts.find(
                        (productItem) => String(productItem.productId ?? productItem.id) === String(item.id)
                    );
                    const isBusy = deletingCartItemId === item.id || updatingCartItemId === item.id || isClearingCart;

                    return (
                        <article
                            key={item.id}
                            className="grid grid-cols-[80px_minmax(0,1fr)] gap-5 rounded-[26px] border border-[var(--border)] bg-[var(--panel)] p-4 shadow-[var(--shadow-soft)] sm:grid-cols-[96px_minmax(0,1fr)] sm:rounded-[30px] sm:p-5 lg:grid-cols-[96px_minmax(0,1fr)_140px_160px]"
                        >
                            <img
                                src={product?.coverImage}
                                alt={product?.displayName ?? item.name}
                                className="h-24 w-20 rounded-[18px] object-cover sm:h-28 sm:w-24 sm:rounded-[22px]"
                            />

                            <div className="min-w-0">
                                <div className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--foreground-subtle)]">
                                    {product?.categoryLabel ?? "Collection"}
                                </div>
                                <h2 className="mt-2 text-xl font-semibold tracking-tight text-[var(--foreground-strong)] sm:text-2xl">
                                    {item.name}
                                </h2>
                                <p className="mt-3 text-sm leading-7 text-[var(--foreground-muted)]">
                                    {product?.displayDescription ??
                                        "Patogus pasirinkimas kasdieniam dėvėjimui ir lengvam derinimui."}
                                </p>
                            </div>

                            <div className="col-span-2 lg:col-span-1 lg:self-start">
                                <div className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--foreground-subtle)]">
                                    Kiekis
                                </div>
                                <select
                                    className={fieldClassName("mt-3 w-full bg-white px-3 py-2.5")}
                                    value={item.quantity}
                                    onChange={(event) => onChangeQuantity(item, Number(event.target.value))}
                                    disabled={isBusy}
                                >
                                    {getQuantityOptions(item).map((value) => (
                                        <option key={value} value={value}>
                                            {value}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="col-span-2 flex flex-col gap-4 border-t border-[var(--border)] pt-4 lg:col-span-1 lg:border-t-0 lg:pt-0">
                                <div>
                                    <div className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--foreground-subtle)]">
                                        Suma
                                    </div>
                                    <div className="mt-3 text-2xl font-semibold tracking-tight text-[var(--foreground-strong)]">
                                        {formatPrice(Number(item.price ?? 0) * Number(item.quantity ?? 0))}
                                    </div>
                                    <div className="mt-1 text-sm text-[var(--foreground-muted)]">
                                        Vieneto kaina {formatPrice(item.price)}
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    block
                                    className="lg:w-full"
                                    onClick={() => onRemove(item)}
                                    disabled={isBusy}
                                >
                                    {deletingCartItemId === item.id ? "Šalinama..." : "Šalinti"}
                                </Button>
                            </div>
                        </article>
                    );
                })}
            </section>
        </div>
    );
}
