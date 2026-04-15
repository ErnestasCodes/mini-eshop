import { useMemo, useState } from "react";

export default function ProductDetailsPage({ product, onAddToCart, onNavigate, canAddToCart = true }) {
    const [added, setAdded] = useState(false);

    const description = useMemo(() => {
        if (!product) return "";
        return (
            product.description ||
            product.productDescription ||
            "Produkto aprasymas siuo metu nepridetas."
        );
    }, [product]);

    if (!product) {
        return (
            <div className="mx-auto max-w-3xl rounded-2xl border border-slate-700 bg-slate-800/70 p-6 text-slate-200 shadow-lg">
                Produktas nerastas arba dar kraunamas.
            </div>
        );
    }

    const price = Number(product.price || 0).toFixed(2);
    const stock = Number(product.stock ?? 0);
    const isOutOfStock = !Number.isFinite(stock) || stock <= 0;

    return (
        <div className="mx-auto max-w-3xl rounded-2xl border border-slate-700 bg-slate-800/70 p-6 shadow-lg">
            <div className="grid gap-6 md:grid-cols-2">
                <div className="rounded-xl bg-slate-900/50 p-6">
                    <img
                        src="https://cdn-icons-png.flaticon.com/512/1170/1170678.png"
                        alt={product.productName || "product"}
                        className="h-56 w-full rounded-lg object-contain bg-slate-700/50 p-6"
                    />
                </div>

                <div>
                    <h2 className="text-2xl font-bold text-white">{product.productName || "Produktas"}</h2>
                    <p className="mt-2 text-sm text-slate-400">Stock: {product.stock ?? 0}</p>
                    <p className="mt-4 text-slate-300">{description}</p>

                    <div className="mt-6 text-2xl font-extrabold text-white">{price} EUR</div>

                    {canAddToCart && (
                        <button
                            className="mt-4 w-full rounded-xl border border-emerald-500 bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
                            onClick={async () => {
                                const success = await onAddToCart?.();
                                setAdded(Boolean(success));
                            }}
                            disabled={isOutOfStock}
                        >
                            {isOutOfStock ? "Out of stock" : "Add to cart"}
                        </button>
                    )}

                    {added && <p className="mt-3 text-sm text-emerald-300">Product added to cart.</p>}

                    <button
                        className="mt-3 w-full rounded-xl border border-slate-600 bg-slate-700 px-4 py-2 text-sm text-white transition hover:bg-slate-600"
                        onClick={() => {
                            onNavigate?.("/");
                        }}
                    >
                        Back to products
                    </button>
                </div>
            </div>
        </div>
    );
}
