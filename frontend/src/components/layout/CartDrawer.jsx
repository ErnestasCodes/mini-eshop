import { formatPrice } from "../../lib/storefront";
import { fieldClassName } from "../ui/fieldStyles";
import Button from "../ui/Button";
import EmptyState from "../ui/EmptyState";

function CartDrawerItem({
    item,
    product,
    deletingCartItemId,
    updatingCartItemId,
    isClearingCart,
    getQuantityOptions,
    onChangeQuantity,
    onRemove,
}) {
    const isBusy = deletingCartItemId === item.id || updatingCartItemId === item.id || isClearingCart;

    return (
        <article className="rounded-[26px] border border-[var(--border)] bg-[var(--surface-muted)] p-4">
            <div className="flex gap-3">
                <img
                    src={product?.coverImage}
                    alt={product?.displayName ?? item.name}
                    className="h-20 w-16 rounded-[18px] object-cover"
                />
                <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                        <div>
                            <div className="text-sm font-semibold text-[var(--foreground-strong)]">{item.name}</div>
                            <div className="mt-1 text-xs uppercase tracking-[0.2em] text-[var(--foreground-subtle)]">
                                {product?.categoryLabel ?? "Collection"}
                            </div>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => onRemove(item)} disabled={isBusy}>
                            {deletingCartItemId === item.id ? "..." : "Šalinti"}
                        </Button>
                    </div>

                    <div className="mt-4 flex items-center justify-between gap-3">
                        <select
                            className={fieldClassName("w-24 bg-white px-3 py-2")}
                            value={item.quantity}
                            onChange={(event) => onChangeQuantity(item, Number(event.target.value))}
                            disabled={isBusy}
                            aria-label={`Keisti produkto ${item.name} kiekį`}
                        >
                            {getQuantityOptions(item).map((value) => (
                                <option key={value} value={value}>
                                    {value}
                                </option>
                            ))}
                        </select>
                        <div className="text-right">
                            <div className="text-xs uppercase tracking-[0.2em] text-[var(--foreground-subtle)]">Suma</div>
                            <div className="mt-1 text-sm font-semibold text-[var(--foreground-strong)]">
                                {formatPrice(Number(item.price ?? 0) * Number(item.quantity ?? 0))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </article>
    );
}

export default function CartDrawer({
    open,
    onClose,
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
    onGoToCart,
}) {
    if (!open) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-[130]" aria-modal="true" role="dialog" aria-label="Krepšelio peržiūra">
            <button
                className="absolute inset-0 bg-[rgba(6,10,20,0.4)] backdrop-blur-sm"
                onClick={onClose}
                aria-label="Uždaryti krepšelį"
            />
            <aside className="absolute right-0 top-0 flex h-full w-[min(100%,28rem)] flex-col border-l border-[var(--border)] bg-[var(--panel)] px-5 py-5 shadow-2xl sm:px-6">
                <div className="flex items-start justify-between gap-4 border-b border-[var(--border)] pb-5">
                    <div>
                        <div className="text-xs font-semibold uppercase tracking-[0.26em] text-[var(--foreground-subtle)]">Krepšelis</div>
                        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[var(--foreground-strong)]">Jūsų krepšelis</h2>
                        <p className="mt-2 text-sm text-[var(--foreground-muted)]">{cartSummaryLabel}</p>
                    </div>
                    <button
                        className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--border)] bg-white text-lg text-[var(--foreground-strong)]"
                        onClick={onClose}
                        aria-label="Uždaryti krepšelį"
                    >
                        ×
                    </button>
                </div>

                {cartItems.length === 0 ? (
                    <div className="flex flex-1 items-center">
                        <EmptyState
                            className="w-full bg-transparent px-0 py-0 text-left shadow-none"
                            title="Krepšelis tuščias"
                            description="Peržiūrėkite kolekciją ir pasirinkti modeliai čia atsiras iš karto."
                            actionLabel="Peržiūrėti kolekciją"
                            onAction={() => {
                                onBrowseProducts();
                                onClose();
                            }}
                        />
                    </div>
                ) : (
                    <>
                        <div className="mt-5 flex-1 space-y-3 overflow-y-auto pr-1">
                            {cartItems.map((item) => (
                                <CartDrawerItem
                                    key={item.id}
                                    item={item}
                                    product={catalogProducts.find(
                                        (product) => String(product.productId ?? product.id) === String(item.id)
                                    )}
                                    deletingCartItemId={deletingCartItemId}
                                    updatingCartItemId={updatingCartItemId}
                                    isClearingCart={isClearingCart}
                                    getQuantityOptions={getQuantityOptions}
                                    onChangeQuantity={onChangeQuantity}
                                    onRemove={onRemove}
                                />
                            ))}
                        </div>

                        <div className="border-t border-[var(--border)] pt-5">
                            <div className="rounded-[28px] border border-[var(--border)] bg-[var(--surface-muted)] p-4">
                                <div className="flex items-center justify-between text-sm text-[var(--foreground-muted)]">
                                    <span>Tarpinė suma</span>
                                    <span className="font-semibold text-[var(--foreground-strong)]">{formatPrice(cartTotal)}</span>
                                </div>
                        <div className="mt-2 flex items-center justify-between text-sm text-[var(--foreground-muted)]">
                            <span>Pristatymas</span>
                            <span className="font-semibold text-[var(--foreground-strong)]">
                                {cartTotal > 0 ? "Skaičiuojama apmokėjimo metu" : "-"}
                            </span>
                        </div>
                    </div>

                            <div className="mt-4 flex flex-col gap-3">
                                <Button
                                    size="lg"
                                    onClick={() => {
                                        onGoToCart();
                                        onClose();
                                    }}
                                >
                                    Peržiūrėti krepšelį
                                </Button>
                                <Button variant="secondary" size="lg" onClick={onBrowseProducts}>
                                    Tęsti apsipirkimą
                                </Button>
                                <Button variant="ghost" onClick={onClear} disabled={isClearingCart || updatingCartItemId !== null}>
                                    {isClearingCart ? "Valoma..." : "Išvalyti krepšelį"}
                                </Button>
                            </div>
                        </div>
                    </>
                )}
            </aside>
        </div>
    );
}
