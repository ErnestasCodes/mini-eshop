import { useMemo, useState } from "react";

function formatPrice(value) {
    return `${Number(value ?? 0).toFixed(2)} EUR`;
}

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
            <div className="mx-auto max-w-4xl rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm">
                <div className="text-lg font-semibold text-slate-900">Produktas nerastas</div>
                <p className="mt-2 text-sm text-slate-600">Patikrinkite nuoroda arba grizkite i kataloga.</p>
                <button
                    className="mt-6 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                    onClick={() => onNavigate?.("/")}
                >
                    Grizti i prekes
                </button>
            </div>
        );
    }

    const stock = Number(product.stock ?? 0);
    const isOutOfStock = !Number.isFinite(stock) || stock <= 0;

    return (
        <div className="mx-auto max-w-6xl space-y-6">
            <div className="text-sm text-slate-500">
                <button className="transition hover:text-slate-900" onClick={() => onNavigate?.("/")}>
                    Parduotuve
                </button>
                <span className="mx-2">/</span>
                <span className="text-slate-700">{product.productName || "Produktas"}</span>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                <div className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm">
                    <div className="flex h-full items-center justify-center rounded-[24px] border border-slate-200 bg-slate-50 p-8">
                        <img
                            src="https://cdn-icons-png.flaticon.com/512/1170/1170678.png"
                            alt={product.productName || "product"}
                            className="h-72 w-full object-contain"
                        />
                    </div>
                </div>

                <div className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm">
                    <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                            isOutOfStock
                                ? "bg-red-50 text-red-600"
                                : stock <= 5
                                  ? "bg-amber-50 text-amber-700"
                                  : "bg-emerald-50 text-emerald-700"
                        }`}
                    >
                        {isOutOfStock ? "Neturime sandelyje" : stock <= 5 ? `Likutis: ${stock}` : "Turime vietoje"}
                    </span>

                    <h1 className="mt-4 text-3xl font-semibold text-slate-900">{product.productName || "Produktas"}</h1>
                    <div className="mt-2 text-sm text-slate-500">Prekes kodas #{product.productId ?? product.id}</div>
                    <div className="mt-6 text-4xl font-semibold text-slate-900">{formatPrice(product.price)}</div>

                    <div className="mt-6 border-t border-slate-200 pt-6">
                        <div className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">Aprasymas</div>
                        <p className="mt-3 text-sm leading-7 text-slate-600">{description}</p>
                    </div>

                    <div className="mt-6 grid gap-3 sm:grid-cols-2">
                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                            <div className="text-xs uppercase tracking-[0.16em] text-slate-500">Pristatymas</div>
                            <div className="mt-2 text-sm font-semibold text-slate-900">1-3 darbo dienos</div>
                        </div>
                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                            <div className="text-xs uppercase tracking-[0.16em] text-slate-500">Apmokejimas</div>
                            <div className="mt-2 text-sm font-semibold text-slate-900">Saugus atsiskaitymas</div>
                        </div>
                    </div>

                    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                        {canAddToCart && (
                            <button
                                className="flex-1 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
                                onClick={async () => {
                                    const success = await onAddToCart?.();
                                    setAdded(Boolean(success));
                                }}
                                disabled={isOutOfStock}
                            >
                                {isOutOfStock ? "Prekes siuo metu nera" : "Deti i krepseli"}
                            </button>
                        )}

                        <button
                            className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                            onClick={() => onNavigate?.("/")}
                        >
                            Grizti i kataloga
                        </button>
                    </div>

                    {added && <p className="mt-4 text-sm font-medium text-emerald-700">Preke sekmingai ideta i krepseli.</p>}
                </div>
            </div>
        </div>
    );
}
