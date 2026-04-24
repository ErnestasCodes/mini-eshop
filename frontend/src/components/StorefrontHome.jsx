import {
    HERO_METRICS,
    HOME_BENEFITS,
    PROJECT_SUMMARY,
    TRUST_POINTS,
    formatPrice,
} from "../lib/storefront";
import Button from "./ui/Button";
import ProductCard from "./ProductCard";

export default function StorefrontHome({
    featuredProducts,
    isLoggedIn,
    activeProductCount,
    cartCount,
    cartTotal,
    categoryBreakdown,
    cartSummaryLabel,
    onBrowseProducts,
    onOpenCart,
    onNavigateToCart,
    onNavigateToOverview,
    onViewProduct,
    onAddToCart,
    onRequireLogin,
    swaggerUrl,
}) {
    return (
        <div className="page-gap">
            <section className="relative overflow-hidden rounded-[40px] border border-[var(--border)] bg-[var(--panel)] px-6 py-8 shadow-[var(--shadow-soft)] sm:px-8 lg:px-10 lg:py-10">
                <div className="absolute inset-x-0 top-0 h-56 bg-[radial-gradient(circle_at_top_left,rgba(12,20,35,0.12),transparent_52%)]" />
                <div className="absolute -right-20 top-10 h-56 w-56 rounded-full bg-[rgba(10,24,44,0.06)] blur-3xl" />
                <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1.12fr)_minmax(320px,0.88fr)]">
                    <div className="max-w-3xl">
                        <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--foreground-muted)]">
                            Mono Studio
                            <span className="h-1.5 w-1.5 rounded-full bg-[var(--foreground-strong)]" />
                            Nauja kolekcija
                        </div>

                        <h1 className="mt-6 max-w-3xl text-4xl font-semibold tracking-tight text-[var(--foreground-strong)] sm:text-5xl lg:text-[4.25rem] lg:leading-[1.02]">
                            Švarūs siluetai kasdieniam miesto stiliui
                        </h1>

                        <p className="mt-5 max-w-2xl text-base leading-8 text-[var(--foreground-muted)]">
                            Neutralūs tonai, patogūs audiniai ir lengvai derinami modeliai kiekvienai dienai.
                        </p>

                        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                            <Button size="lg" onClick={onBrowseProducts}>
                                Peržiūrėti kolekciją
                            </Button>
                            <Button
                                variant="secondary"
                                size="lg"
                                onClick={isLoggedIn ? onNavigateToCart : onOpenCart}
                            >
                                Atidaryti krepšelį
                            </Button>
                            <Button variant="ghost" size="lg" onClick={onNavigateToOverview}>
                                Apie Mono Studio
                            </Button>
                        </div>

                        <div className="mt-8 flex flex-wrap gap-3">
                            {TRUST_POINTS.map((item) => (
                                <span
                                    key={item}
                                    className="rounded-full border border-[var(--border)] bg-white px-4 py-2 text-sm text-[var(--foreground-muted)] shadow-[var(--shadow-xs)]"
                                >
                                    {item}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="grid gap-4">
                        <div className="rounded-[32px] bg-[var(--foreground-strong)] p-6 text-white shadow-[var(--shadow-lift)]">
                            <div className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">Mono Studio</div>
                            <div className="mt-4 text-3xl font-semibold tracking-tight">
                                Sukurta kasdieniam dėvėjimui.
                            </div>
                            <p className="mt-4 text-sm leading-7 text-slate-300">
                                Minimalūs drabužiai, kurie lengvai prisitaiko prie tavo ritmo – nuo ryto iki vakaro.
                            </p>

                            <div className="mt-6 grid gap-3">
                                {categoryBreakdown.map((category) => (
                                    <div
                                        key={category.id}
                                        className="flex items-center justify-between rounded-[22px] border border-white/10 bg-white/5 px-4 py-3 text-sm"
                                    >
                                        <span>{category.label}</span>
                                        <span className="text-slate-300">{category.count}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-3">
                            <div className="rounded-[26px] border border-[var(--border)] bg-[var(--surface-muted)] px-5 py-4">
                                <div className="text-xs uppercase tracking-[0.2em] text-[var(--foreground-subtle)]">Kolekcija</div>
                                <div className="mt-2 text-3xl font-semibold tracking-tight text-[var(--foreground-strong)]">{activeProductCount}</div>
                                <p className="mt-2 text-sm text-[var(--foreground-muted)]">Modeliai kolekcijoje</p>
                            </div>
                            <div className="rounded-[26px] border border-[var(--border)] bg-[var(--surface-muted)] px-5 py-4">
                                <div className="text-xs uppercase tracking-[0.2em] text-[var(--foreground-subtle)]">Krepšelis</div>
                                <div className="mt-2 text-3xl font-semibold tracking-tight text-[var(--foreground-strong)]">{cartCount}</div>
                                <p className="mt-2 text-sm text-[var(--foreground-muted)]">Prekės krepšelyje</p>
                            </div>
                            <div className="rounded-[26px] border border-[var(--border)] bg-[var(--surface-muted)] px-5 py-4">
                                <div className="text-xs uppercase tracking-[0.2em] text-[var(--foreground-subtle)]">Pristatymas</div>
                                <div className="mt-2 text-2xl font-semibold tracking-tight text-[var(--foreground-strong)]">{formatPrice(cartTotal)}</div>
                                <p className="mt-2 text-sm text-[var(--foreground-muted)]">{cartSummaryLabel}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="grid gap-4 lg:grid-cols-3">
                {HOME_BENEFITS.map((item) => (
                    <article
                        key={item.title}
                        className="rounded-[30px] border border-[var(--border)] bg-[var(--panel)] p-6 shadow-[var(--shadow-soft)]"
                    >
                        <div className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--foreground-subtle)]">Svarbiausia</div>
                        <h2 className="mt-4 text-2xl font-semibold tracking-tight text-[var(--foreground-strong)]">{item.title}</h2>
                        <p className="mt-4 text-sm leading-7 text-[var(--foreground-muted)]">{item.description}</p>
                    </article>
                ))}
            </section>

            <section className="rounded-[36px] border border-[var(--border)] bg-[var(--panel)] p-6 shadow-[var(--shadow-soft)] sm:p-7">
                <div className="flex flex-col gap-4 border-b border-[var(--border)] pb-6 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <div className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--foreground-subtle)]">Atrinkti modeliai</div>
                        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--foreground-strong)] sm:text-4xl">
                            Modeliai, prie kurių lengva grįžti kasdien
                        </h2>
                        <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--foreground-muted)]">
                            Paprasti siluetai, neutralūs tonai ir patogūs audiniai lengvam kasdieniam derinimui.
                        </p>
                    </div>
                    <Button variant="secondary" size="lg" onClick={onBrowseProducts}>
                        Visa kolekcija
                    </Button>
                </div>

                <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                    {featuredProducts.map((product) => (
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
            </section>

            <section className="grid gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
                <article className="rounded-[34px] border border-[var(--border)] bg-[var(--foreground-strong)] p-7 text-white shadow-[var(--shadow-lift)]">
                    <div className="text-xs font-semibold uppercase tracking-[0.26em] text-slate-400">Apie Mono Studio</div>
                    <h2 className="mt-4 text-3xl font-semibold tracking-tight">Drabužiai, sukurti ramiam miesto ritmui.</h2>
                    <p className="mt-4 text-sm leading-7 text-slate-300">{PROJECT_SUMMARY.problem}</p>
                    <p className="mt-4 text-sm leading-7 text-slate-300">{PROJECT_SUMMARY.role}</p>
                    <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                        <Button
                            variant="secondary"
                            className="bg-white text-[var(--foreground-strong)]"
                            onClick={onNavigateToOverview}
                        >
                            Skaityti daugiau
                        </Button>
                        <Button as="a" href={swaggerUrl} target="_blank" rel="noreferrer" variant="ghost" className="text-white hover:bg-white/10 hover:text-white">
                            Daugiau informacijos
                        </Button>
                    </div>
                </article>

                <article className="rounded-[34px] border border-[var(--border)] bg-[var(--panel)] p-7 shadow-[var(--shadow-soft)]">
                    <div className="text-xs font-semibold uppercase tracking-[0.26em] text-[var(--foreground-subtle)]">Mono Studio</div>
                    <div className="mt-5 grid gap-4 sm:grid-cols-3">
                        {HERO_METRICS.map((metric) => (
                            <div key={metric.label} className="rounded-[24px] border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-4">
                                <div className="text-xs uppercase tracking-[0.18em] text-[var(--foreground-subtle)]">{metric.label}</div>
                                <div className="mt-3 text-lg font-semibold text-[var(--foreground-strong)]">{metric.value}</div>
                            </div>
                        ))}
                    </div>
                    <p className="mt-5 text-sm leading-7 text-[var(--foreground-muted)]">{PROJECT_SUMMARY.result}</p>
                </article>
            </section>
        </div>
    );
}
