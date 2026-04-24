import { BRAND_NAME } from "../../lib/storefront";

export default function AuthSplitLayout({
    eyebrow,
    title,
    description,
    highlights,
    insightTitle,
    insightBody,
    children,
}) {
    return (
        <div className="mx-auto max-w-6xl overflow-hidden rounded-[28px] border border-[var(--border)] bg-[var(--panel)] shadow-[var(--shadow-soft)] sm:rounded-[34px] lg:grid lg:grid-cols-[minmax(320px,0.92fr)_minmax(0,1.08fr)]">
            <aside className="relative overflow-hidden bg-[var(--foreground-strong)] px-5 py-8 text-white sm:px-8 sm:py-10">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(154,167,187,0.22),transparent_45%)]" />
                <div className="absolute inset-x-0 bottom-0 h-32 bg-[linear-gradient(180deg,transparent,rgba(3,9,19,0.34))]" />
                <div className="relative">
                    <div className="inline-flex rounded-full border border-white/15 bg-white/5 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.26em] text-slate-300">
                        {BRAND_NAME}
                    </div>
                    <div className="mt-8 text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">{eyebrow}</div>
                    <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1>
                    <p className="mt-4 max-w-md text-sm leading-7 text-slate-300">{description}</p>

                    <div className="mt-8 space-y-3">
                        {highlights.map((item) => (
                            <div
                                key={item}
                                className="rounded-[24px] border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-100"
                            >
                                {item}
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 rounded-[28px] border border-white/10 bg-white/5 px-5 py-5">
                        <div className="text-xs uppercase tracking-[0.2em] text-slate-400">{insightTitle}</div>
                        <p className="mt-3 text-sm leading-7 text-slate-300">{insightBody}</p>
                    </div>
                </div>
            </aside>

            <div className="px-5 py-8 sm:px-8 sm:py-10 lg:px-10">{children}</div>
        </div>
    );
}
