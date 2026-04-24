import {
    ARCHITECTURE_PILLARS,
    PROJECT_FEATURES,
    PROJECT_STACK,
    PROJECT_SUMMARY,
} from "../lib/storefront";
import Button from "./ui/Button";

export default function ProjectOverviewPage({ onBrowseProducts, onOpenSwagger }) {
    return (
        <div className="page-gap">
            <section className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)]">
                <article className="rounded-[32px] border border-[var(--border)] bg-[var(--panel)] px-5 py-6 shadow-[var(--shadow-soft)] sm:rounded-[40px] sm:px-8 sm:py-7">
                    <div className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--foreground-subtle)]">
                        Apie Mono Studio
                    </div>
                    <h1 className="mt-4 text-3xl font-semibold tracking-tight text-[var(--foreground-strong)] sm:text-4xl lg:text-5xl">
                        Kolekcija, sukurta kasdieniam miesto ritmui.
                    </h1>
                    <p className="mt-5 max-w-3xl text-sm leading-7 text-[var(--foreground-muted)]">
                        Mono Studio renkasi švarius siluetus, neutralius tonus ir patogius audinius, prie kurių lengva
                        grįžti kiekvieną dieną.
                    </p>
                    <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                        <Button size="lg" block className="sm:w-auto" onClick={onBrowseProducts}>
                            Peržiūrėti kolekciją
                        </Button>
                        <Button
                            as="a"
                            href={onOpenSwagger}
                            target="_blank"
                            rel="noreferrer"
                            variant="secondary"
                            size="lg"
                            block
                            className="sm:w-auto"
                        >
                            Daugiau informacijos
                        </Button>
                    </div>
                </article>

                <article className="rounded-[30px] border border-[var(--border)] bg-[var(--foreground-strong)] p-6 text-white shadow-[var(--shadow-lift)] sm:rounded-[34px] sm:p-7">
                    <div className="text-xs font-semibold uppercase tracking-[0.26em] text-slate-400">Mono Studio</div>
                    <div className="mt-5 space-y-5">
                        <div>
                            <div className="text-sm font-semibold text-slate-300">Požiūris</div>
                            <p className="mt-2 text-sm leading-7 text-slate-300">{PROJECT_SUMMARY.problem}</p>
                        </div>
                        <div>
                            <div className="text-sm font-semibold text-slate-300">Kolekcija</div>
                            <p className="mt-2 text-sm leading-7 text-slate-300">{PROJECT_SUMMARY.role}</p>
                        </div>
                        <div>
                            <div className="text-sm font-semibold text-slate-300">Kasdienai</div>
                            <p className="mt-2 text-sm leading-7 text-slate-300">{PROJECT_SUMMARY.result}</p>
                        </div>
                    </div>
                </article>
            </section>

            <section className="rounded-[30px] border border-[var(--border)] bg-[var(--panel)] p-5 shadow-[var(--shadow-soft)] sm:rounded-[36px] sm:p-6">
                <div className="text-xs font-semibold uppercase tracking-[0.26em] text-[var(--foreground-subtle)]">
                    Svarbiausia
                </div>
                <div className="mt-5 flex flex-wrap gap-3">
                    {PROJECT_STACK.map((item) => (
                        <span
                            key={item}
                            className="rounded-full border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-2 text-sm font-medium text-[var(--foreground-strong)]"
                        >
                            {item}
                        </span>
                    ))}
                </div>
            </section>

            <section className="grid gap-4 xl:grid-cols-2">
                {PROJECT_FEATURES.map((feature) => (
                    <article
                        key={feature.title}
                        className="rounded-[28px] border border-[var(--border)] bg-[var(--panel)] p-5 shadow-[var(--shadow-soft)] sm:rounded-[30px] sm:p-6"
                    >
                        <div className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--foreground-subtle)]">
                            Mono Studio
                        </div>
                        <h2 className="mt-4 text-2xl font-semibold tracking-tight text-[var(--foreground-strong)]">
                            {feature.title}
                        </h2>
                        <p className="mt-4 text-sm leading-7 text-[var(--foreground-muted)]">{feature.description}</p>
                    </article>
                ))}
            </section>

            <section className="rounded-[30px] border border-[var(--border)] bg-[var(--panel)] p-5 shadow-[var(--shadow-soft)] sm:rounded-[36px] sm:p-6">
                <div className="flex flex-col gap-3 border-b border-[var(--border)] pb-5 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <div className="text-xs font-semibold uppercase tracking-[0.26em] text-[var(--foreground-subtle)]">
                            Mūsų požiūris
                        </div>
                        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-[var(--foreground-strong)] sm:text-3xl">
                            Paprasti sprendimai, prie kurių norisi grįžti kasdien
                        </h2>
                    </div>
                    <Button as="a" href={onOpenSwagger} target="_blank" rel="noreferrer" variant="ghost" block className="sm:w-auto">
                        Daugiau informacijos
                    </Button>
                </div>

                <div className="mt-6 grid gap-4 xl:grid-cols-5">
                    {ARCHITECTURE_PILLARS.map((pillar) => (
                        <article
                            key={pillar.title}
                            className="rounded-[24px] border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-4 sm:rounded-[26px] sm:px-5 sm:py-5"
                        >
                            <h3 className="text-lg font-semibold text-[var(--foreground-strong)]">{pillar.title}</h3>
                            <p className="mt-3 text-sm leading-7 text-[var(--foreground-muted)]">{pillar.description}</p>
                        </article>
                    ))}
                </div>
            </section>
        </div>
    );
}
