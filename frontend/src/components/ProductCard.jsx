export default function ProductCard({ p, onAddToCart, onViewProduct, canAddToCart = true }) {
    const productId = p.productId ?? p.id;
    const stock = Number(p.stock ?? 0);
    const isOutOfStock = !Number.isFinite(stock) || stock <= 0;

    return (
        <div className="rounded-2xl border border-slate-700 bg-slate-800 p-4 shadow-md hover:shadow-xl hover:scale-[1.02] transition duration-300">
            <img
                src="https://cdn-icons-png.flaticon.com/512/1170/1170678.png"
                alt="product"
                className="h-32 w-full rounded-lg object-contain mb-3 bg-slate-700/60 p-6"
            />
            <div className="text-sm text-gray-500">Stock: {p.stock}</div>

            <div className="font-semibold">{p.productName}</div>

            <div className="mt-2 flex items-center justify-between">
                <div className="font-bold">{Number(p.price).toFixed(2)} EUR</div>

                <div className="flex gap-2">
                    {canAddToCart && (
                        <button
                            className="rounded-lg border border-emerald-500 bg-emerald-600 px-3 py-1.5 text-sm text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
                            onClick={onAddToCart}
                            disabled={isOutOfStock}
                        >
                            {isOutOfStock ? "Out of stock" : "Add"}
                        </button>
                    )}
                    <button
                        className="rounded-lg bg-black px-3 py-1.5 text-sm text-white"
                        onClick={() => onViewProduct?.(productId)}
                    >
                        View
                    </button>
                </div>
            </div>
        </div>
    );
}
