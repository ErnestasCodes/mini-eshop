import {
    CATEGORY_FILTERS,
    INVENTORY_FILTERS,
    PRICE_FILTERS,
    SORT_OPTIONS,
} from "../lib/storefront";
import Button from "./ui/Button";
import EmptyState from "./ui/EmptyState";
import Field from "./ui/Field";
import FilterChip from "./ui/FilterChip";
import ProductCard from "./ProductCard";
import ProductCardSkeleton from "./ui/ProductCardSkeleton";

export default function ProductsCatalogPage({
    products,
    isLoading,
    isLoggedIn,
    searchQuery,
    categoryFilter,
    inventoryFilter,
    priceFilter,
    sortOption,
    categoryBreakdown,
    activeFilterChips,
    visibleProductCount,
    totalProductCount,
    newArrivalCount,
    lowStockCount,
    onSearchChange,
    onCategoryFilterChange,
    onInventoryFilterChange,
    onPriceFilterChange,
    onSortOptionChange,
    onClearFilter,
    onResetFilters,
    onReloadProducts,
    onBrowseFeatured,
    onViewProduct,
    onAddToCart,
    onRequireLogin,
}) {
    const hasActiveFilters = activeFilterChips.length > 0;
    const hasCatalogProducts = totalProductCount > 0;
    const hasVisibleProducts = products.length > 0;

    return (
        <div className="page-gap">
            <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
                <div className="rounded-[36px] border border-[var(--border)] bg-[var(--panel)] px-6 py-7 shadow-[var(--shadow-soft)] sm:px-8">
                    <div className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--foreground-subtle)]">Kolekcija</div>
                    <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[var(--foreground-strong)] sm:text-5xl">
                        Atrinkti modeliai kasdieniam miesto stiliui
                    </h1>
                    <p className="mt-4 max-w-3xl text-sm leading-7 text-[var(--foreground-muted)]">
                        Neutralūs tonai, patogūs audiniai ir lengvai derinami siluetai kiekvienai dienai.
                    </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
                    <div className="rounded-[28px] border border-[var(--border)] bg-[var(--panel)] px-5 py-5 shadow-[var(--shadow-soft)]">
                        <div className="text-xs uppercase tracking-[0.2em] text-[var(--foreground-subtle)]">Rodoma</div>
                        <div className="mt-2 text-3xl font-semibold tracking-tight text-[var(--foreground-strong)]">{visibleProductCount}</div>
                        <p className="mt-2 text-sm text-[var(--foreground-muted)]">Iš viso kolekcijoje {totalProductCount}</p>
                    </div>
                    <div className="rounded-[28px] border border-[var(--border)] bg-[var(--panel)] px-5 py-5 shadow-[var(--shadow-soft)]">
                        <div className="text-xs uppercase tracking-[0.2em] text-[var(--foreground-subtle)]">Nauja</div>
                        <div className="mt-2 text-3xl font-semibold tracking-tight text-[var(--foreground-strong)]">{newArrivalCount}</div>
                        <p className="mt-2 text-sm text-[var(--foreground-muted)]">Modeliai su „Nauja“ žyma</p>
                    </div>
                    <div className="rounded-[28px] border border-[var(--border)] bg-[var(--panel)] px-5 py-5 shadow-[var(--shadow-soft)]">
                        <div className="text-xs uppercase tracking-[0.2em] text-[var(--foreground-subtle)]">Ribotas likutis</div>
                        <div className="mt-2 text-3xl font-semibold tracking-tight text-[var(--foreground-strong)]">{lowStockCount}</div>
                        <p className="mt-2 text-sm text-[var(--foreground-muted)]">Modeliai, kurių liko nedaug</p>
                    </div>
                </div>
            </section>

            <section className="grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)]">
                <aside className="h-fit rounded-[32px] border border-[var(--border)] bg-[var(--panel)] p-5 shadow-[var(--shadow-soft)] xl:sticky xl:top-28">
                    <div className="flex items-center justify-between gap-3">
                        <div>
                            <div className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--foreground-subtle)]">Filtrai</div>
                            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[var(--foreground-strong)]">Rask greičiau</h2>
                        </div>
                        <Button variant="ghost" onClick={onResetFilters}>
                            Atstatyti
                        </Button>
                    </div>

                    <div className="mt-5 space-y-4">
                        <Field
                            id="catalog-search"
                            label="Paieška"
                            placeholder="Ieškoti produkto, kategorijos ar aprašo..."
                            value={searchQuery}
                            onChange={(event) => onSearchChange(event.target.value)}
                        />

                        <div className="space-y-2">
                            <div className="text-sm font-medium text-[var(--foreground-strong)]">Kategorijos</div>
                            <div className="space-y-2">
                                {CATEGORY_FILTERS.map((category) => {
                                    const count =
                                        category.id === "all"
                                            ? totalProductCount
                                            : categoryBreakdown.find((item) => item.id === category.id)?.count ?? 0;
                                    const active = categoryFilter === category.id;

                                    return (
                                        <button
                                            key={category.id}
                                            className={`flex w-full items-center justify-between rounded-[20px] border px-4 py-3 text-left text-sm font-medium transition ${
                                                active
                                                    ? "border-[var(--foreground-strong)] bg-[var(--accent-strong)] text-[var(--foreground-strong)]"
                                                    : "border-[var(--border)] bg-[var(--surface-muted)] text-[var(--foreground-muted)] hover:border-[var(--border-strong)] hover:bg-white"
                                            }`}
                                            onClick={() => onCategoryFilterChange(category.id)}
                                        >
                                            <span>{category.label}</span>
                                            <span className="text-xs">{count}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <Field
                            as="select"
                            id="inventory-filter"
                            label="Likutis"
                            value={inventoryFilter}
                            onChange={(event) => onInventoryFilterChange(event.target.value)}
                            options={INVENTORY_FILTERS}
                        />
                        <Field
                            as="select"
                            id="price-filter"
                            label="Kaina"
                            value={priceFilter}
                            onChange={(event) => onPriceFilterChange(event.target.value)}
                            options={PRICE_FILTERS}
                        />
                        <Field
                            as="select"
                            id="sort-filter"
                            label="Rūšiavimas"
                            value={sortOption}
                            onChange={(event) => onSortOptionChange(event.target.value)}
                            options={SORT_OPTIONS}
                        />
                    </div>
                </aside>

                <div className="space-y-5">
                    <div className="rounded-[28px] border border-[var(--border)] bg-[var(--panel)] p-5 shadow-[var(--shadow-soft)]">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                            <div>
                                <div className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--foreground-subtle)]">Pasirinkimas</div>
                                <div className="mt-2 text-2xl font-semibold tracking-tight text-[var(--foreground-strong)]">
                                    {visibleProductCount} modeliai pagal jūsų pasirinkimus
                                </div>
                                <p className="mt-2 text-sm text-[var(--foreground-muted)]">
                                    Susiaurinkite pasirinkimą pagal kategoriją, kainą ar likutį ir raskite tai, kas tinka šiandien.
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <Button variant="secondary" onClick={onBrowseFeatured}>
                                    Grįžti į pradžią
                                </Button>
                                <Button variant="ghost" onClick={onResetFilters}>
                                    Išvalyti filtrus
                                </Button>
                            </div>
                        </div>

                        {hasActiveFilters ? (
                            <div className="mt-5 flex flex-wrap gap-2">
                                {activeFilterChips.map((chip) => (
                                    <FilterChip key={chip.id} label={chip.label} onRemove={() => onClearFilter(chip.id)} />
                                ))}
                            </div>
                        ) : (
                            <div className="mt-5 rounded-[22px] border border-dashed border-[var(--border-strong)] bg-[var(--surface-muted)] px-4 py-3 text-sm text-[var(--foreground-muted)]">
                                Aktyvių filtrų nėra. Rodoma visa kolekcija.
                            </div>
                        )}
                    </div>

                    {isLoading ? (
                        <div className="grid gap-6 md:grid-cols-2 2xl:grid-cols-3">
                            {Array.from({ length: 6 }, (_, index) => (
                                <ProductCardSkeleton key={index} />
                            ))}
                        </div>
                    ) : !hasCatalogProducts ? (
                        <EmptyState
                            title="Katalogas dar tuščias"
                            description="Šiuo metu kolekcija dar nepildyta. Užsukite kiek vėliau ir peržiūrėkite naujus modelius."
                            actionLabel="Atnaujinti"
                            onAction={onReloadProducts}
                        />
                    ) : !hasVisibleProducts ? (
                        <EmptyState
                            title="Nieko neradome pagal dabartinius filtrus"
                            description="Pabandykite pakeisti kategoriją, kainos intervalą ar likutį ir peržiūrėkite visą kolekciją iš naujo."
                            actionLabel="Atstatyti filtrus"
                            onAction={onResetFilters}
                            secondaryLabel="Grįžti į pradžią"
                            onSecondaryAction={onBrowseFeatured}
                        />
                    ) : (
                        <div className="grid gap-6 md:grid-cols-2 2xl:grid-cols-3">
                            {products.map((product) => (
                                <ProductCard
                                    key={product.productId ?? product.id}
                                    p={product}
                                    onAddToCart={() => onAddToCart(product)}
                                    onViewProduct={onViewProduct}
                                    onRequireLogin={onRequireLogin}
                                    canAddToCart={isLoggedIn}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
