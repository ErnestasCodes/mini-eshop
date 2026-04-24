import { BRAND_NAME, BRAND_TAGLINE, FREE_SHIPPING_THRESHOLD, NAV_ITEMS } from "../../lib/storefront";
import { cn } from "../../lib/utils";
import Button from "../ui/Button";

function isNavActive(pathname, path) {
    if (path === "/products") {
        return pathname === "/products" || pathname.startsWith("/product/");
    }

    return pathname === path;
}

export default function AppHeader({
    pathname,
    cartCount,
    userName,
    isAdmin,
    onNavigate,
    onOpenCart,
    onToggleMobileMenu,
    onLogout,
}) {
    return (
        <>
            <div className="border-b border-[rgba(255,255,255,0.08)] bg-[var(--foreground-strong)] text-white">
                <div className="app-shell flex flex-col gap-1 py-2 text-xs sm:flex-row sm:items-center sm:justify-between">
                    <span>Nemokamas pristatymas nuo {FREE_SHIPPING_THRESHOLD} €.</span>
                    <span className="text-slate-300">Minimalūs miesto siluetai kasdieniam stiliui.</span>
                </div>
            </div>

            <header className="sticky top-0 z-[90] border-b border-[var(--border)] bg-[rgba(244,247,251,0.86)] backdrop-blur-xl">
                <div className="app-shell py-4">
                    <div className="flex items-center justify-between gap-4">
                        <button
                            className="flex items-center gap-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
                            onClick={() => onNavigate("/")}
                            aria-label="Grįžti į pradžią"
                        >
                            <div className="flex h-12 w-12 items-center justify-center rounded-[18px] bg-[var(--foreground-strong)] text-sm font-semibold text-white">
                                MS
                            </div>
                            <div>
                                <div className="text-lg font-semibold tracking-tight text-[var(--foreground-strong)]">{BRAND_NAME}</div>
                                <div className="text-sm text-[var(--foreground-muted)]">{BRAND_TAGLINE}</div>
                            </div>
                        </button>

                        <nav className="hidden items-center gap-2 lg:flex" aria-label="Pagrindinė navigacija">
                            {NAV_ITEMS.map((item) => (
                                <button
                                    key={item.id}
                                    className={cn(
                                        "rounded-full px-4 py-2.5 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]",
                                        isNavActive(pathname, item.path)
                                            ? "bg-[var(--accent-strong)] text-[var(--foreground-strong)]"
                                            : "text-[var(--foreground-muted)] hover:bg-white hover:text-[var(--foreground-strong)]"
                                    )}
                                    onClick={() => onNavigate(item.path)}
                                    aria-current={isNavActive(pathname, item.path) ? "page" : undefined}
                                >
                                    {item.label}
                                </button>
                            ))}
                        </nav>

                        <div className="hidden items-center gap-3 lg:flex">
                            <button
                                className={cn(
                                    "inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]",
                                    pathname === "/cart"
                                        ? "border-[var(--foreground-strong)] bg-[var(--foreground-strong)] text-white"
                                        : "border-[var(--border-strong)] bg-white text-[var(--foreground-strong)] hover:border-[var(--foreground-strong)] hover:bg-[var(--surface-strong)]"
                                )}
                                onClick={onOpenCart}
                                aria-label={`Atidaryti krepšelį. Šiuo metu ${cartCount} prekės`}
                            >
                                <span>Krepšelis</span>
                                <span className="inline-flex min-w-7 items-center justify-center rounded-full bg-[rgba(255,255,255,0.14)] px-2 py-0.5 text-xs text-current">
                                    {cartCount}
                                </span>
                            </button>

                            {isAdmin ? (
                                <Button variant="subtle" onClick={() => onNavigate("/admin")}>
                                    Valdymas
                                </Button>
                            ) : null}

                            {userName ? (
                                <>
                                    <div className="rounded-full border border-[var(--border)] bg-white px-4 py-2.5 text-sm text-[var(--foreground-strong)] shadow-[var(--shadow-xs)]">
                                        Prisijungęs kaip <span className="font-semibold">{userName}</span>
                                    </div>
                                    <Button variant="ghost" onClick={onLogout}>
                                        Atsijungti
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Button variant="secondary" onClick={() => onNavigate("/register")}>
                                        Registruotis
                                    </Button>
                                    <Button onClick={() => onNavigate("/login")}>Prisijungti</Button>
                                </>
                            )}
                        </div>

                        <div className="flex items-center gap-2 lg:hidden">
                            <button
                                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--border-strong)] bg-white text-[var(--foreground-strong)] shadow-[var(--shadow-xs)] transition hover:bg-[var(--surface-strong)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
                                onClick={onOpenCart}
                                aria-label={`Atidaryti krepšelį. ${cartCount} prekės`}
                            >
                                <span className="text-sm font-semibold">{cartCount}</span>
                            </button>
                            <button
                                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--border-strong)] bg-white text-[var(--foreground-strong)] shadow-[var(--shadow-xs)] transition hover:bg-[var(--surface-strong)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
                                onClick={onToggleMobileMenu}
                                aria-label="Atidaryti mobilų meniu"
                            >
                                <span className="text-lg">☰</span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>
        </>
    );
}
