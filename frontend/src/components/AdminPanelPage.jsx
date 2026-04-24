import { useMemo, useState } from "react";

import { BRAND_NAME, formatPrice } from "../lib/storefront";
import Button from "./ui/Button";
import EmptyState from "./ui/EmptyState";
import Field from "./ui/Field";

function parseDecimalInput(value) {
    const normalized = String(value ?? "").trim().replace(",", ".");

    if (!normalized) {
        return NaN;
    }

    return Number(normalized);
}

function parseIntegerInput(value) {
    const normalized = String(value ?? "").trim();

    if (!normalized) {
        return NaN;
    }

    return Number(normalized);
}

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
    isReadOnlyAdmin = false,
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
    const [localError, setLocalError] = useState("");

    const sortedProducts = useMemo(
        () => [...products].sort((a, b) => Number(a.productId ?? a.id) - Number(b.productId ?? b.id)),
        [products]
    );
    const productCount = sortedProducts.length;
    const activeCount = sortedProducts.filter((product) => Number(product.stock ?? 0) > 0).length;
    const stockValue = sortedProducts.reduce(
        (sum, product) => sum + Number(product.price ?? 0) * Number(product.stock ?? 0),
        0
    );

    async function handleCreate(event) {
        event.preventDefault();

        const productName = createForm.productName.trim();
        const price = parseDecimalInput(createForm.price);
        const stock = parseIntegerInput(createForm.stock);

        if (!productName) {
            setLocalError("Įveskite produkto pavadinimą.");
            return;
        }

        if (!Number.isFinite(price) || price < 0) {
            setLocalError("Įveskite teisingą kainą. Naudokite skaičius, pvz. 49.99 arba 49,99.");
            return;
        }

        if (!Number.isInteger(stock) || stock < 0) {
            setLocalError("Įveskite teisingą likutį. Naudokite sveiką skaičių.");
            return;
        }

        setLocalError("");

        const success = await onCreate?.({
            productName,
            price,
            stock,
            description: createForm.description.trim(),
        });

        if (success) {
            setCreateForm({
                productName: "",
                price: "",
                stock: "",
                description: "",
            });
        }
    }

    async function handleUpdate(productId) {
        const draft = drafts[productId];
        if (!draft) {
            return;
        }

        const productName = draft.productName.trim();
        const price = parseDecimalInput(draft.price);
        const stock = parseIntegerInput(draft.stock);

        if (!productName || !Number.isFinite(price) || price < 0 || !Number.isInteger(stock) || stock < 0) {
            setLocalError("Patikrinkite pavadinimą, kainą ir likutį prieš saugodami pakeitimus.");
            return;
        }

        setLocalError("");

        await onUpdate?.(productId, {
            productName,
            price,
            stock,
            description: draft.description.trim(),
        });
    }

    return (
        <div className="page-gap">
            <section className="rounded-[30px] border border-[var(--border)] bg-[var(--panel)] p-5 shadow-[var(--shadow-soft)] sm:rounded-[36px] sm:p-6">
                <div className="flex flex-col gap-5 border-b border-[var(--border)] pb-6 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <div className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--foreground-subtle)]">
                            {BRAND_NAME} administravimas
                        </div>
                        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--foreground-strong)] sm:text-4xl">
                            Produktų valdymas
                        </h1>
                        <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--foreground-muted)]">
                            Atnaujinkite kolekciją, koreguokite aprašymus ir prižiūrėkite modelių likutį vienoje vietoje.
                        </p>
                    </div>
                    {isReadOnlyAdmin ? (
                        <div className="rounded-[20px] border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 lg:mr-auto">
                            Si seed administratoriaus paskyra turi tik perziuros teises. Produktu kurti, redaguoti ir trinti negalima.
                        </div>
                    ) : null}
                    <Button variant="danger" block className="sm:w-auto" onClick={onAdminLogout}>
                        Atsijungti
                    </Button>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-3">
                    <div className="rounded-[26px] border border-[var(--border)] bg-[var(--surface-muted)] px-5 py-4">
                        <div className="text-xs uppercase tracking-[0.2em] text-[var(--foreground-subtle)]">Produktai</div>
                        <div className="mt-2 text-3xl font-semibold tracking-tight text-[var(--foreground-strong)]">{productCount}</div>
                    </div>
                    <div className="rounded-[26px] border border-[var(--border)] bg-[var(--surface-muted)] px-5 py-4">
                        <div className="text-xs uppercase tracking-[0.2em] text-[var(--foreground-subtle)]">Turime vietoje</div>
                        <div className="mt-2 text-3xl font-semibold tracking-tight text-[var(--foreground-strong)]">{activeCount}</div>
                    </div>
                    <div className="rounded-[26px] border border-[var(--border)] bg-[var(--surface-muted)] px-5 py-4">
                        <div className="text-xs uppercase tracking-[0.2em] text-[var(--foreground-subtle)]">Inventoriaus vertė</div>
                        <div className="mt-2 text-2xl font-semibold tracking-tight text-[var(--foreground-strong)]">{formatPrice(stockValue)}</div>
                    </div>
                </div>
            </section>

            <form className="rounded-[30px] border border-[var(--border)] bg-[var(--panel)] p-5 shadow-[var(--shadow-soft)] sm:rounded-[34px] sm:p-6" onSubmit={handleCreate}>
                <div className="flex flex-col gap-2">
                    <div className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--foreground-subtle)]">
                        Naujas produktas
                    </div>
                    <h2 className="text-2xl font-semibold tracking-tight text-[var(--foreground-strong)]">
                        Pridėti naują prekę
                    </h2>
                </div>
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                    <Field
                        id="create-product-name"
                        label="Pavadinimas"
                        placeholder="Pavadinimas"
                        value={createForm.productName}
                        onChange={(event) => setCreateForm((prev) => ({ ...prev, productName: event.target.value }))}
                        disabled={isReadOnlyAdmin || loading}
                        required
                    />
                    <Field
                        id="create-product-price"
                        label="Kaina"
                        type="number"
                        step="0.01"
                        placeholder="Kaina"
                        value={createForm.price}
                        onChange={(event) => setCreateForm((prev) => ({ ...prev, price: event.target.value }))}
                        disabled={isReadOnlyAdmin || loading}
                        required
                    />
                    <Field
                        id="create-product-stock"
                        label="Likutis"
                        type="number"
                        placeholder="Kiekis sandėlyje"
                        value={createForm.stock}
                        onChange={(event) => setCreateForm((prev) => ({ ...prev, stock: event.target.value }))}
                        disabled={isReadOnlyAdmin || loading}
                        required
                    />
                    <Field
                        id="create-product-description"
                        label="Aprašymas"
                        placeholder="Aprašymas"
                        value={createForm.description}
                        onChange={(event) => setCreateForm((prev) => ({ ...prev, description: event.target.value }))}
                        disabled={isReadOnlyAdmin || loading}
                    />
                </div>

                <Button type="submit" className="mt-5 w-full sm:w-auto" size="lg" disabled={loading || isReadOnlyAdmin}>
                    {loading ? "Vykdoma..." : "Pridėti produktą"}
                </Button>
            </form>

            {localError ? (
                <div className="rounded-[24px] border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
                    Klaida: {localError}
                </div>
            ) : null}

            {error ? (
                <div className="rounded-[24px] border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
                    Klaida: {error}
                </div>
            ) : null}

            {sortedProducts.length === 0 ? (
                <EmptyState
                    title="Produktų dar nėra"
                    description="Pridėkite pirmuosius modelius ir suformuokite Mono Studio kolekciją."
                />
            ) : (
                <div className="grid gap-4">
                    {sortedProducts.map((product) => {
                        const productId = Number(product.productId ?? product.id);
                        const draft = drafts[productId] ?? normalizeProduct(product);

                        return (
                            <article
                                key={productId}
                                className="rounded-[26px] border border-[var(--border)] bg-[var(--panel)] p-4 shadow-[var(--shadow-soft)] sm:rounded-[30px] sm:p-6"
                            >
                                <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                                    <div>
                                        <div className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--foreground-subtle)]">
                                            Produkto ID #{productId}
                                        </div>
                                        <div className="mt-2 break-words text-xl font-semibold tracking-tight text-[var(--foreground-strong)] sm:text-2xl">
                                            {draft.productName || "Be pavadinimo"}
                                        </div>
                                    </div>
                                    <div className="inline-flex max-w-full rounded-full border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-2 text-sm text-[var(--foreground-muted)]">
                                        Likutis: {draft.stock || 0}
                                    </div>
                                </div>

                                <div className="grid gap-4 md:grid-cols-2">
                                    <Field
                                        id={`product-name-${productId}`}
                                        label="Pavadinimas"
                                        value={draft.productName}
                                        onChange={(event) =>
                                            setDrafts((prev) => ({
                                                ...prev,
                                                [productId]: { ...draft, productName: event.target.value },
                                            }))
                                        }
                                        disabled={isReadOnlyAdmin || loading}
                                    />
                                    <Field
                                        id={`product-price-${productId}`}
                                        label="Kaina"
                                        type="number"
                                        step="0.01"
                                        value={draft.price}
                                        onChange={(event) =>
                                            setDrafts((prev) => ({
                                                ...prev,
                                                [productId]: { ...draft, price: event.target.value },
                                            }))
                                        }
                                        disabled={isReadOnlyAdmin || loading}
                                    />
                                    <Field
                                        id={`product-stock-${productId}`}
                                        label="Likutis"
                                        type="number"
                                        value={draft.stock}
                                        onChange={(event) =>
                                            setDrafts((prev) => ({
                                                ...prev,
                                                [productId]: { ...draft, stock: event.target.value },
                                            }))
                                        }
                                        disabled={isReadOnlyAdmin || loading}
                                    />
                                    <Field
                                        id={`product-description-${productId}`}
                                        label="Aprašymas"
                                        value={draft.description}
                                        onChange={(event) =>
                                            setDrafts((prev) => ({
                                                ...prev,
                                                [productId]: { ...draft, description: event.target.value },
                                            }))
                                        }
                                        disabled={isReadOnlyAdmin || loading}
                                    />
                                </div>

                                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                                    <Button block className="sm:w-auto" onClick={() => handleUpdate(productId)} disabled={loading || isReadOnlyAdmin}>
                                        Išsaugoti
                                    </Button>
                                    <Button
                                        variant="danger"
                                        block
                                        className="sm:w-auto"
                                        onClick={() => onDelete?.(productId)}
                                        disabled={loading || isReadOnlyAdmin}
                                    >
                                        Ištrinti
                                    </Button>
                                </div>
                            </article>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
