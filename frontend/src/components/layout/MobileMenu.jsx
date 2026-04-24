import { NAV_ITEMS } from "../../lib/storefront";
import Button from "../ui/Button";

export default function MobileMenu({
    open,
    pathname,
    cartCount,
    userName,
    isAdmin,
    onClose,
    onNavigate,
    onLogout,
}) {
    if (!open) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-[120] lg:hidden" aria-modal="true" role="dialog">
            <button
                className="absolute inset-0 bg-[rgba(5,10,20,0.48)] backdrop-blur-sm"
                onClick={onClose}
                aria-label="Uždaryti mobilų meniu"
            />
            <aside className="absolute right-0 top-0 flex h-full w-[min(88vw,24rem)] flex-col border-l border-[rgba(255,255,255,0.08)] bg-[var(--foreground-strong)] px-6 py-6 text-white shadow-2xl">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Meniu</div>
                        <div className="mt-2 text-2xl font-semibold tracking-tight">Mono Studio</div>
                    </div>
                    <button
                        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-lg"
                        onClick={onClose}
                        aria-label="Uždaryti mobilų meniu"
                    >
                        ×
                    </button>
                </div>

                <div className="mt-8 space-y-2">
                    {NAV_ITEMS.map((item) => {
                        const active =
                            item.path === "/products"
                                ? pathname === "/products" || pathname.startsWith("/product/")
                                : pathname === item.path;

                        return (
                            <button
                                key={item.id}
                                className={`w-full rounded-[22px] px-4 py-3 text-left text-base font-medium transition ${
                                    active ? "bg-white text-[var(--foreground-strong)]" : "bg-white/5 text-slate-100 hover:bg-white/10"
                                }`}
                                onClick={() => {
                                    onNavigate(item.path);
                                    onClose();
                                }}
                            >
                                {item.label}
                            </button>
                        );
                    })}
                    <button
                        className={`w-full rounded-[22px] px-4 py-3 text-left text-base font-medium transition ${
                            pathname === "/cart" ? "bg-white text-[var(--foreground-strong)]" : "bg-white/5 text-slate-100 hover:bg-white/10"
                        }`}
                        onClick={() => {
                            onNavigate("/cart");
                            onClose();
                        }}
                    >
                        Krepšelis ({cartCount})
                    </button>
                    {isAdmin ? (
                        <button
                            className="w-full rounded-[22px] bg-white/5 px-4 py-3 text-left text-base font-medium text-slate-100 transition hover:bg-white/10"
                            onClick={() => {
                                onNavigate("/admin");
                                onClose();
                            }}
                        >
                            Valdymas
                        </button>
                    ) : null}
                </div>

                <div className="mt-auto space-y-3">
                    {userName ? (
                        <>
                            <div className="rounded-[24px] border border-white/10 bg-white/5 px-4 py-4 text-sm text-slate-200">
                                Prisijungęs kaip <span className="font-semibold text-white">{userName}</span>
                            </div>
                            <Button
                                variant="secondary"
                                className="w-full border-white/20 bg-white text-[var(--foreground-strong)]"
                                onClick={() => {
                                    onLogout();
                                    onClose();
                                }}
                            >
                                Atsijungti
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button
                                variant="secondary"
                                className="w-full border-white/20 bg-white text-[var(--foreground-strong)]"
                                onClick={() => {
                                    onNavigate("/login");
                                    onClose();
                                }}
                            >
                                Prisijungti
                            </Button>
                            <Button
                                className="w-full"
                                onClick={() => {
                                    onNavigate("/register");
                                    onClose();
                                }}
                            >
                                Registruotis
                            </Button>
                        </>
                    )}
                </div>
            </aside>
        </div>
    );
}
