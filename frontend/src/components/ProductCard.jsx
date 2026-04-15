function formatPrice(value) {
    return `${Number(value ?? 0).toFixed(2)} EUR`;
}

export default function ProductCard({ p, onAddToCart, onViewProduct, canAddToCart = true }) {
    const productId = p.productId ?? p.id;
    const stock = Number(p.stock ?? 0);
    const isOutOfStock = !Number.isFinite(stock) || stock <= 0;

    return (
        <article className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md">
            <button
                className="block w-full border-b border-slate-200 bg-slate-50 p-6"
                onClick={() => onViewProduct?.(productId)}
            >
                <img
                    src="https://cdn-icons-png.flaticon.com/512/1170/1170678.png"
                    alt={p.productName || "product"}
                    className="mx-auto h-40 w-full object-contain"
                />
            </button>

            <div className="p-5">
                <div className="flex items-center justify-between gap-3">
                    <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            isOutOfStock
                                ? "bg-red-50 text-red-600"
                                : stock <= 5
                                  ? "bg-amber-50 text-amber-700"
                                  : "bg-emerald-50 text-emerald-700"
                        }`}
                    >
                        {isOutOfStock ? "Neturime" : stock <= 5 ? `Liko ${stock}` : "Turime vietoje"}
                    </span>
                    <span className="text-xs text-slate-400">ID #{productId}</span>
                </div>

                <button
                    className="mt-4 block text-left text-lg font-semibold leading-7 text-slate-900 transition hover:text-slate-700"
                    onClick={() => onViewProduct?.(productId)}
                >
                    {p.productName}
                </button>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                    {p.description || p.productDescription || "Standartinis produkto aprasymas siuo metu nepateiktas."}
                </p>

                <div className="mt-5 flex items-end justify-between gap-3">
                    <div>
                        <div className="text-xs uppercase tracking-[0.16em] text-slate-400">Kaina</div>
                        <div className="mt-1 text-2xl font-semibold text-slate-900">{formatPrice(p.price)}</div>
                    </div>
                    <div className="text-right text-sm text-slate-500">Sandelyje: {Number(p.stock ?? 0)}</div>
                </div>

                <div className="mt-5 flex gap-3">
                    {canAddToCart && (
                        <button
                            className="flex-1 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
                            onClick={onAddToCart}
                            disabled={isOutOfStock}
                        >
                            {isOutOfStock ? "Nera sandelyje" : "I krepseli"}
                        </button>
                    )}
                    <button
                        className="rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                        onClick={() => onViewProduct?.(productId)}
                    >
                        Placiau
                    </button>
                </div>
            </div>
        </article>
    );
}
