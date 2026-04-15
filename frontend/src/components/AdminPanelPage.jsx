import { useMemo, useState } from "react";

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
            <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <div className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Administravimas</div>
                        <h2 className="mt-2 text-3xl font-semibold text-slate-900">Produktu valdymas</h2>
                        <p className="mt-2 text-sm text-slate-600">Kurti, redaguoti ir salinti prekes viename puslapyje.</p>
                    </div>
                    <button
                        className="rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                        onClick={onAdminLogout}
                    >
                        Admin atsijungti
                    </button>
                </div>
            </div>

            <form className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm" onSubmit={handleCreate}>
                <h3 className="text-xl font-semibold text-slate-900">Prideti nauja preke</h3>
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                    <input
                        className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
                        placeholder="Pavadinimas"
                        value={createForm.productName}
                        onChange={(e) => setCreateForm((prev) => ({ ...prev, productName: e.target.value }))}
                        required
                    />
                    <input
                        className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
                        placeholder="Kaina"
                        type="number"
                        step="0.01"
                        value={createForm.price}
                        onChange={(e) => setCreateForm((prev) => ({ ...prev, price: e.target.value }))}
                        required
                    />
                    <input
                        className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
                        placeholder="Kiekis sandelyje"
                        type="number"
                        value={createForm.stock}
                        onChange={(e) => setCreateForm((prev) => ({ ...prev, stock: e.target.value }))}
                        required
                    />
                    <input
                        className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
                        placeholder="Aprasymas"
                        value={createForm.description}
                        onChange={(e) => setCreateForm((prev) => ({ ...prev, description: e.target.value }))}
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="mt-5 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                    {loading ? "Vykdoma..." : "Prideti preke"}
                </button>
            </form>

            {error && (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    Klaida: {error}
                </div>
            )}

            <div className="space-y-4">
                {sortedProducts.map((p) => {
                    const productId = Number(p.productId ?? p.id);
                    const draft = drafts[productId] ?? normalizeProduct(p);

                    return (
                        <div key={productId} className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                            <div className="mb-4 text-sm font-medium text-slate-500">Prekes ID #{productId}</div>
                            <div className="grid gap-4 md:grid-cols-2">
                                <input
                                    className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
                                    value={draft.productName}
                                    onChange={(e) =>
                                        setDrafts((prev) => ({
                                            ...prev,
                                            [productId]: { ...draft, productName: e.target.value },
                                        }))
                                    }
                                />
                                <input
                                    className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
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
                                    className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
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
                                    className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
                                    value={draft.description}
                                    onChange={(e) =>
                                        setDrafts((prev) => ({
                                            ...prev,
                                            [productId]: { ...draft, description: e.target.value },
                                        }))
                                    }
                                />
                            </div>
                            <div className="mt-5 flex flex-wrap gap-3">
                                <button
                                    className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
                                    onClick={() => handleUpdate(productId)}
                                    disabled={loading}
                                >
                                    Issaugoti
                                </button>
                                <button
                                    className="rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
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
