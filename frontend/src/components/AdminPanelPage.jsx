import { useEffect, useMemo, useState } from "react";

function normalizeProduct(product) {
    const id = Number(product.productId ?? product.id);
    return {
        productId: id,
        productName: product.productName ?? "",
        price: String(product.price ?? 0),
        stock: String(product.stock ?? 0),
        description: product.description ?? product.productDescription ?? "",
    };
}

export default function AdminPanelPage({
    products,
    onCreate,
    onUpdate,
    onDelete,
    onAdminLogout,
    loading = false,
    error = "",
}) {
    const [createForm, setCreateForm] = useState({
        productName: "",
        price: "",
        stock: "",
        description: "",
    });
    const [drafts, setDrafts] = useState({});

    useEffect(() => {
        const next = {};
        for (const p of products) {
            const normalized = normalizeProduct(p);
            next[normalized.productId] = normalized;
        }
        setDrafts(next);
    }, [products]);

    const sortedProducts = useMemo(
        () => [...products].sort((a, b) => Number(a.productId ?? a.id) - Number(b.productId ?? b.id)),
        [products]
    );

    async function handleCreate(e) {
        e.preventDefault();

        await onCreate?.({
            productName: createForm.productName.trim(),
            price: Number(createForm.price),
            stock: Number(createForm.stock),
            description: createForm.description.trim(),
        });

        setCreateForm({
            productName: "",
            price: "",
            stock: "",
            description: "",
        });
    }

    async function handleUpdate(productId) {
        const draft = drafts[productId];
        if (!draft) return;

        await onUpdate?.(productId, {
            productName: draft.productName.trim(),
            price: Number(draft.price),
            stock: Number(draft.stock),
            description: draft.description.trim(),
        });
    }

    return (
        <div className="space-y-6">
            <div className="rounded-2xl border border-slate-700 bg-slate-800/70 p-6 shadow-lg">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-white">Admin panel</h2>
                        <p className="mt-1 text-sm text-slate-400">Prekiu valdymas: kurti, redaguoti, trinti.</p>
                    </div>
                    <button
                        className="rounded-xl border border-red-500/40 bg-red-500/20 px-3 py-2 text-sm text-red-200 transition hover:bg-red-500/30"
                        onClick={onAdminLogout}
                    >
                        Admin atsijungti
                    </button>
                </div>
            </div>

            <form
                className="rounded-2xl border border-slate-700 bg-slate-800/70 p-6 shadow-lg"
                onSubmit={handleCreate}
            >
                <h3 className="text-lg font-semibold text-white">Prideti nauja preke</h3>
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                    <input
                        className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Pavadinimas"
                        value={createForm.productName}
                        onChange={(e) => setCreateForm((prev) => ({ ...prev, productName: e.target.value }))}
                        required
                    />
                    <input
                        className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Kaina"
                        type="number"
                        step="0.01"
                        value={createForm.price}
                        onChange={(e) => setCreateForm((prev) => ({ ...prev, price: e.target.value }))}
                        required
                    />
                    <input
                        className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Kiekis sandelyje"
                        type="number"
                        value={createForm.stock}
                        onChange={(e) => setCreateForm((prev) => ({ ...prev, stock: e.target.value }))}
                        required
                    />
                    <input
                        className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Aprasymas (nebutina)"
                        value={createForm.description}
                        onChange={(e) => setCreateForm((prev) => ({ ...prev, description: e.target.value }))}
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="mt-4 rounded-xl border border-emerald-500 bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {loading ? "Vykdoma..." : "Prideti preke"}
                </button>
            </form>

            {error && (
                <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
                    Klaida: {error}
                </div>
            )}

            <div className="space-y-3">
                {sortedProducts.map((p) => {
                    const productId = Number(p.productId ?? p.id);
                    const draft = drafts[productId] ?? normalizeProduct(p);

                    return (
                        <div key={productId} className="rounded-2xl border border-slate-700 bg-slate-800/70 p-4 shadow-lg">
                            <div className="mb-3 text-xs text-slate-400">ID: {productId}</div>
                            <div className="grid gap-3 md:grid-cols-2">
                                <input
                                    className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-indigo-500"
                                    value={draft.productName}
                                    onChange={(e) =>
                                        setDrafts((prev) => ({
                                            ...prev,
                                            [productId]: { ...draft, productName: e.target.value },
                                        }))
                                    }
                                />
                                <input
                                    className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-indigo-500"
                                    type="number"
                                    step="0.01"
                                    value={draft.price}
                                    onChange={(e) =>
                                        setDrafts((prev) => ({
                                            ...prev,
                                            [productId]: { ...draft, price: e.target.value },
                                        }))
                                    }
                                />
                                <input
                                    className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-indigo-500"
                                    type="number"
                                    value={draft.stock}
                                    onChange={(e) =>
                                        setDrafts((prev) => ({
                                            ...prev,
                                            [productId]: { ...draft, stock: e.target.value },
                                        }))
                                    }
                                />
                                <input
                                    className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-indigo-500"
                                    value={draft.description}
                                    onChange={(e) =>
                                        setDrafts((prev) => ({
                                            ...prev,
                                            [productId]: { ...draft, description: e.target.value },
                                        }))
                                    }
                                />
                            </div>
                            <div className="mt-3 flex gap-2">
                                <button
                                    className="rounded-xl border border-indigo-500 bg-indigo-600 px-3 py-2 text-sm text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
                                    onClick={() => handleUpdate(productId)}
                                    disabled={loading}
                                >
                                    Issaugoti
                                </button>
                                <button
                                    className="rounded-xl border border-red-500/40 bg-red-500/20 px-3 py-2 text-sm text-red-200 transition hover:bg-red-500/30 disabled:cursor-not-allowed disabled:opacity-60"
                                    onClick={() => onDelete?.(productId)}
                                    disabled={loading}
                                >
                                    Istrinti
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
