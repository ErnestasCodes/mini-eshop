import { useEffect, useState } from "react";

import AdminLoginPage from "./components/AdminLoginPage";
import AdminPanelPage from "./components/AdminPanelPage";
import CartPage from "./components/CartPage";
import LoginPage from "./components/LoginPage";
import ProductDetailsPage from "./components/ProductDetailsPage";
import ProductsCatalogPage from "./components/ProductsCatalogPage";
import ProjectOverviewPage from "./components/ProjectOverviewPage";
import RegisterPage from "./components/RegisterPage";
import StorefrontHome from "./components/StorefrontHome";
import AppHeader from "./components/layout/AppHeader";
import CartDrawer from "./components/layout/CartDrawer";
import MobileMenu from "./components/layout/MobileMenu";
import StatusBanner from "./components/ui/StatusBanner";
import ToastViewport from "./components/ui/ToastViewport";
import EmptyState from "./components/ui/EmptyState";
import Button from "./components/ui/Button";
import useStorefrontApp from "./hooks/useStorefrontApp";
import { BRAND_NAME } from "./lib/storefront";

function StartupLoader() {
    return (
        <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
            <div className="flex min-h-screen items-center justify-center px-6">
                <div className="w-full max-w-xl rounded-[36px] border border-[var(--border)] bg-[var(--panel)] p-10 text-center shadow-[var(--shadow-lift)]">
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface-muted)]">
                        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[var(--accent-strong)] border-t-[var(--foreground-strong)]" />
                    </div>
                    <div className="mt-8 text-xs font-semibold uppercase tracking-[0.28em] text-[var(--foreground-subtle)]">
                        Mono Studio
                    </div>
                    <h1 className="mt-4 text-3xl font-semibold tracking-tight text-[var(--foreground-strong)] sm:text-4xl">
                        Waking up the server...
                    </h1>
                    <p className="mt-4 text-base leading-8 text-[var(--foreground-muted)]">
                        Please wait about a minute. The backend is running on a free host, so the first response can be slow.
                    </p>
                </div>
            </div>
        </div>
    );
}

function Footer({ onNavigate, swaggerUrl }) {
    return (
        <footer className="mt-16 border-t border-[var(--border)]">
            <div className="app-shell flex flex-col gap-5 py-8 text-sm text-[var(--foreground-muted)] md:flex-row md:items-center md:justify-between">
                <div>
                    <div className="font-semibold text-[var(--foreground-strong)]">{BRAND_NAME}</div>
                    <div className="mt-1">Švarūs siluetai, neutralūs tonai ir patogūs audiniai kiekvienai dienai.</div>
                </div>
                <div className="flex flex-wrap gap-3">
                    <Button variant="ghost" size="sm" onClick={() => onNavigate("/")}>
                        Pradžia
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => onNavigate("/products")}>
                        Katalogas
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => onNavigate("/project-overview")}>
                        Apie Mono Studio
                    </Button>
                    <Button as="a" href={swaggerUrl} target="_blank" rel="noreferrer" variant="ghost" size="sm">
                        Informacija
                    </Button>
                </div>
            </div>
        </footer>
    );
}

export default function App() {
    const app = useStorefrontApp();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);

    useEffect(() => {
        if (!isMobileMenuOpen && !isCartOpen) {
            return undefined;
        }

        const handleEscape = (event) => {
            if (event.key === "Escape") {
                setIsMobileMenuOpen(false);
                setIsCartOpen(false);
            }
        };

        window.addEventListener("keydown", handleEscape);
        return () => window.removeEventListener("keydown", handleEscape);
    }, [isMobileMenuOpen, isCartOpen]);

    function handleNavigate(nextPath, options) {
        setIsMobileMenuOpen(false);
        setIsCartOpen(false);
        app.navigate(nextPath, options);
    }

    function handleOpenCart() {
        setIsMobileMenuOpen(false);
        setIsCartOpen(true);
    }

    function handleLogout() {
        setIsMobileMenuOpen(false);
        setIsCartOpen(false);
        app.handleLogout();
    }

    const isLoginPage = app.pathname === "/login";
    const isRegisterPage = app.pathname === "/register";
    const isAdminLoginPage = app.pathname === "/admin/login";
    const isAdminPanelPage = app.pathname === "/admin";
    const isProductPage = app.pathname.startsWith("/product/");
    const isProductsPage = app.pathname === "/products";
    const isCartPage = app.pathname === "/cart";
    const isOverviewPage = app.pathname === "/project-overview";
    const isHomePage = app.pathname === "/";

    if (app.shouldShowStartupLoader) {
        return <StartupLoader />;
    }

    let content = null;

    if (isRegisterPage) {
        content = <RegisterPage onRegistered={app.handleRegistered} onNavigate={handleNavigate} />;
    } else if (isAdminLoginPage || isAdminPanelPage) {
        content = app.canAccessAdmin ? (
            <AdminPanelPage
                products={app.products}
                onCreate={app.handleAdminCreateProduct}
                onUpdate={app.handleAdminUpdateProduct}
                onDelete={app.handleAdminDeleteProduct}
                onAdminLogout={app.handleAdminLogout}
                loading={app.adminLoading}
                error={app.adminError}
            />
        ) : (
            <AdminLoginPage
                isLoggedIn={app.isLoggedIn}
                isAdmin={app.isAdmin}
                userName={app.userName}
                onAdminLogin={app.handleAdminLoginCheck}
                onNavigate={handleNavigate}
                error={app.adminError}
            />
        );
    } else if (isLoginPage) {
        content = (
            <LoginPage
                defaultEmail={app.pendingEmail}
                onNavigate={handleNavigate}
                onLoginSuccess={app.onLoginSuccess}
            />
        );
    } else if (isProductPage) {
        content = (
            <ProductDetailsPage
                product={app.selectedProduct}
                loading={app.isLoadingProducts}
                onNavigate={handleNavigate}
                onAddToCart={() => app.handleAddToCart(app.selectedProduct)}
                onRequireLogin={() => handleNavigate("/login")}
                canAddToCart={app.isLoggedIn}
            />
        );
    } else if (isProductsPage) {
        content = (
            <ProductsCatalogPage
                products={app.filteredProducts}
                isLoading={app.isLoadingProducts}
                isLoggedIn={app.isLoggedIn}
                searchQuery={app.searchQuery}
                categoryFilter={app.categoryFilter}
                inventoryFilter={app.inventoryFilter}
                priceFilter={app.priceFilter}
                sortOption={app.sortOption}
                categoryBreakdown={app.categoryBreakdown}
                activeFilterChips={app.activeFilterChips}
                visibleProductCount={app.derived.visibleProductCount}
                totalProductCount={app.derived.totalProductCount}
                newArrivalCount={app.derived.newArrivalCount}
                lowStockCount={app.derived.lowStockCount}
                onSearchChange={app.setSearchQuery}
                onCategoryFilterChange={app.setCategoryFilter}
                onInventoryFilterChange={app.setInventoryFilter}
                onPriceFilterChange={app.setPriceFilter}
                onSortOptionChange={app.setSortOption}
                onClearFilter={app.clearFilterById}
                onResetFilters={app.resetCatalogFilters}
                onReloadProducts={app.loadProducts}
                onBrowseFeatured={() => handleNavigate("/")}
                onViewProduct={(id) => handleNavigate(`/product/${id}`)}
                onAddToCart={app.handleAddToCart}
                onRequireLogin={() => handleNavigate("/login")}
            />
        );
    } else if (isCartPage) {
        content = (
            <CartPage
                cartItems={app.cartItems}
                cartTotal={app.cartTotal}
                cartSummaryLabel={app.derived.cartSummaryLabel}
                catalogProducts={app.catalogProducts}
                deletingCartItemId={app.deletingCartItemId}
                updatingCartItemId={app.updatingCartItemId}
                isClearingCart={app.isClearingCart}
                getQuantityOptions={app.getQuantityOptions}
                onChangeQuantity={app.handleChangeCartQuantity}
                onRemove={app.handleRemoveFromCart}
                onClear={app.handleClearCart}
                onBrowseProducts={() => handleNavigate("/products")}
                onNavigateToOverview={() => handleNavigate("/project-overview")}
            />
        );
    } else if (isOverviewPage) {
        content = (
            <ProjectOverviewPage
                onBrowseProducts={() => handleNavigate("/products")}
                onOpenSwagger={app.swaggerUrl}
            />
        );
    } else if (isHomePage) {
        content = (
            <StorefrontHome
                featuredProducts={app.featuredProducts}
                isLoggedIn={app.isLoggedIn}
                activeProductCount={app.activeProductCount}
                cartCount={app.cartCount}
                cartTotal={app.cartTotal}
                categoryBreakdown={app.categoryBreakdown}
                cartSummaryLabel={app.derived.cartSummaryLabel}
                onBrowseProducts={() => handleNavigate("/products")}
                onOpenCart={handleOpenCart}
                onNavigateToCart={() => handleNavigate("/cart")}
                onNavigateToOverview={() => handleNavigate("/project-overview")}
                onViewProduct={(id) => handleNavigate(`/product/${id}`)}
                onAddToCart={app.handleAddToCart}
                onRequireLogin={() => handleNavigate("/login")}
                swaggerUrl={app.swaggerUrl}
            />
        );
    } else {
        content = (
            <EmptyState
                title="Puslapis nerastas"
                description="Patikrinkite adresą arba grįžkite į pradžią."
                actionLabel="Grįžti į pradžią"
                onAction={() => handleNavigate("/", { replace: true })}
            />
        );
    }

    return (
        <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
            <AppHeader
                pathname={app.pathname}
                cartCount={app.cartCount}
                userName={app.userName}
                isAdmin={app.canAccessAdmin}
                onNavigate={handleNavigate}
                onOpenCart={handleOpenCart}
                onToggleMobileMenu={() => setIsMobileMenuOpen(true)}
                onLogout={handleLogout}
            />

            <MobileMenu
                open={isMobileMenuOpen}
                pathname={app.pathname}
                cartCount={app.cartCount}
                userName={app.userName}
                isAdmin={app.canAccessAdmin}
                onClose={() => setIsMobileMenuOpen(false)}
                onNavigate={handleNavigate}
                onLogout={handleLogout}
            />

            <CartDrawer
                open={isCartOpen}
                onClose={() => setIsCartOpen(false)}
                cartItems={app.cartItems}
                cartTotal={app.cartTotal}
                cartSummaryLabel={app.derived.cartSummaryLabel}
                catalogProducts={app.catalogProducts}
                deletingCartItemId={app.deletingCartItemId}
                updatingCartItemId={app.updatingCartItemId}
                isClearingCart={app.isClearingCart}
                getQuantityOptions={app.getQuantityOptions}
                onChangeQuantity={app.handleChangeCartQuantity}
                onRemove={app.handleRemoveFromCart}
                onClear={app.handleClearCart}
                onBrowseProducts={() => handleNavigate("/products")}
                onGoToCart={() => handleNavigate("/cart")}
            />

            <main className="app-shell py-8">
                {app.error ? (
                    <div className="mb-6">
                        <StatusBanner
                            title="Reikalingas dėmesys"
                            message={app.error}
                            onDismiss={app.clearError}
                            onRetry={app.loadProducts}
                        />
                    </div>
                ) : null}

                {content}
            </main>

            <Footer onNavigate={handleNavigate} swaggerUrl={app.swaggerUrl} />
            <ToastViewport toast={app.toast} />
        </div>
    );
}
