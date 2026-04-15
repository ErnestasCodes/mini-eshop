import { useEffect, useMemo, useState } from "react";

import ProductCard from "./components/ProductCard";
import ProductDetailsPage from "./components/ProductDetailsPage";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import AdminLoginPage from "./components/AdminLoginPage";
import AdminPanelPage from "./components/AdminPanelPage";

function formatPrice(value) {
    return `${Number(value ?? 0).toFixed(2)} EUR`;
}

function getCartStorageKey(nextUserId) {
    return Number.isFinite(nextUserId) && nextUserId > 0
        ? `myshop_cart_items_${nextUserId}`
        : "myshop_cart_items_guest";
}

function readCartFromStorage(nextUserId) {
    try {
        const stored = localStorage.getItem(getCartStorageKey(nextUserId));
        const parsed = stored ? JSON.parse(stored) : [];
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

export default function App() {
    const [products, setProducts] = useState([]);
    const [err, setErr] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [stockFilter, setStockFilter] = useState("all");
    const [sortOption, setSortOption] = useState("featured");
    const initialUserId = (() => {
        const storedUserId = Number(localStorage.getItem("myshop_user_id"));
        return Number.isFinite(storedUserId) && storedUserId > 0 ? storedUserId : 0;
    })();
    const [userId, setUserId] = useState(initialUserId);
    const [cartItems, setCartItems] = useState(() => {
        return readCartFromStorage(initialUserId);
    });
    const [userName, setUserName] = useState(() => localStorage.getItem("myshop_user_name") ?? "");
    const [pendingEmail, setPendingEmail] = useState(() => localStorage.getItem("myshop_pending_email") ?? "");
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [pathname, setPathname] = useState(window.location.pathname);
    const [isAdmin, setIsAdmin] = useState(() => localStorage.getItem("myshop_is_admin") === "1");
    const [adminError, setAdminError] = useState("");
    const [adminLoading, setAdminLoading] = useState(false);
    const [deletingCartItemId, setDeletingCartItemId] = useState(null);
    const [updatingCartItemId, setUpdatingCartItemId] = useState(null);
    const [isClearingCart, setIsClearingCart] = useState(false);

    const isLoginPage = pathname === "/login";
    const isRegisterPage = pathname === "/register";
    const isAdminLoginPage = pathname === "/admin/login";
    const isAdminPanelPage = pathname === "/admin";
    const isProductPage = pathname.startsWith("/product/");
    const productIdFromPath = isProductPage ? pathname.split("/").pop() : null;

    const selectedProduct = useMemo(() => {
        if (!productIdFromPath) return null;

        return products.find((p) => String(p.productId ?? p.id) === String(productIdFromPath)) ?? null;
    }, [products, productIdFromPath]);
    const filteredProducts = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();

        const nextProducts = products.filter((product) => {
            const name = String(product.productName ?? "").toLowerCase();
            const description = String(product.description ?? product.productDescription ?? "").toLowerCase();
            const stock = Number(product.stock ?? 0);
            const price = Number(product.price ?? 0);
            const matchesQuery = !query || name.includes(query) || description.includes(query);

            if (!matchesQuery) return false;
            if (stockFilter === "in_stock") return stock > 0;
            if (stockFilter === "low_stock") return stock > 0 && stock <= 5;
            if (stockFilter === "premium") return price >= 100;

            return true;
        });

        return nextProducts.sort((left, right) => {
            if (sortOption === "price_asc") return Number(left.price ?? 0) - Number(right.price ?? 0);
            if (sortOption === "price_desc") return Number(right.price ?? 0) - Number(left.price ?? 0);
            if (sortOption === "name") {
                return String(left.productName ?? "").localeCompare(String(right.productName ?? ""));
            }
            if (sortOption === "stock") return Number(right.stock ?? 0) - Number(left.stock ?? 0);
            return Number(left.productId ?? left.id ?? 0) - Number(right.productId ?? right.id ?? 0);
        });
    }, [products, searchQuery, sortOption, stockFilter]);

    const cartCount = useMemo(
        () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
        [cartItems]
    );
    const cartTotal = useMemo(
        () => cartItems.reduce((sum, item) => sum + item.quantity * item.price, 0),
        [cartItems]
    );
    const activeProductCount = useMemo(
        () => products.filter((product) => Number(product.stock ?? 0) > 0).length,
        [products]
    );

    async function loadProducts() {
        const base = import.meta.env.VITE_API_BASE_URL;
        try {
            const response = await fetch(`${base}/api/products/Produktai`);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            const data = await response.json();
            setProducts(data);
        } catch (e) {
            setErr(String(e.message || e));
        }
    }

    useEffect(() => {
        loadProducts();
    }, []);

    useEffect(() => {
        setCartItems(readCartFromStorage(userId));
    }, [userId]);

    useEffect(() => {
        localStorage.setItem(getCartStorageKey(userId), JSON.stringify(cartItems));
    }, [cartItems, userId]);

    useEffect(() => {
        function handlePopState() {
            setPathname(window.location.pathname);
            setIsCartOpen(false);
            setIsUserMenuOpen(false);
        }

        window.addEventListener("popstate", handlePopState);
        return () => window.removeEventListener("popstate", handlePopState);
    }, []);

    function navigate(nextPath) {
        if (!nextPath || nextPath === pathname) return;
        window.history.pushState({}, "", nextPath);
        setPathname(nextPath);
        setIsCartOpen(false);
        setIsUserMenuOpen(false);
    }

    function saveUserName(nextName) {
        const clean = String(nextName ?? "").trim();
        setUserName(clean);
        if (clean) {
            localStorage.setItem("myshop_user_name", clean);
        } else {
            localStorage.removeItem("myshop_user_name");
        }
    }

    function saveUserId(nextUserId) {
        const parsed = Number(nextUserId);
        const normalized = Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
        setUserId(normalized);

        if (normalized > 0) {
            localStorage.setItem("myshop_user_id", String(normalized));
        } else {
            localStorage.removeItem("myshop_user_id");
        }
    }

    function saveAdminSession(nextIsAdmin) {
        const value = Boolean(nextIsAdmin);
        setIsAdmin(value);

        if (value) {
            localStorage.setItem("myshop_is_admin", "1");
        } else {
            localStorage.removeItem("myshop_is_admin");
        }
    }

    function handleRegistered({ name, email }) {
        saveUserName(name);
        const cleanEmail = String(email ?? "").trim();
        setPendingEmail(cleanEmail);
        if (cleanEmail) {
            localStorage.setItem("myshop_pending_email", cleanEmail);
        } else {
            localStorage.removeItem("myshop_pending_email");
        }
    }

    function handleLogout() {
        saveUserName("");
        saveUserId(0);
        setPendingEmail("");
        localStorage.removeItem("myshop_pending_email");
        setIsUserMenuOpen(false);
        navigate("/");
    }

    function handleAdminLogout() {
        saveAdminSession(false);
        setAdminError("");
        navigate("/");
    }

    async function handleAdminLoginCheck() {
        const base = (import.meta.env.VITE_API_BASE_URL ?? "").replace(/\/$/, "");
        setAdminError("");
        setAdminLoading(true);

        try {
            const response = await fetch(`${base}/api/users/isadmin`);
            if (!response.ok) {
                const failMessage = await response.text();
                throw new Error(failMessage || `HTTP ${response.status}`);
            }

            const raw = await response.text();
            let data = null;
            try {
                data = raw ? JSON.parse(raw) : null;
            } catch {
                data = raw;
            }

            const approved =
                typeof data === "boolean"
                    ? data
                    : Boolean(data?.isAdmin ?? data?.value ?? data?.result ?? data);

            if (!approved) {
                throw new Error("Admin teises nepatvirtintos.");
            }

            saveAdminSession(true);
            navigate("/admin");
            return true;
        } catch (error) {
            setAdminError(String(error.message || error));
            return false;
        } finally {
            setAdminLoading(false);
        }
    }

    async function handleAdminCreateProduct(payload) {
        const base = (import.meta.env.VITE_API_BASE_URL ?? "").replace(/\/$/, "");
        setAdminError("");
        setAdminLoading(true);

        try {
            const response = await fetch(`${base}/api/products`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const failMessage = await response.text();
                throw new Error(failMessage || `HTTP ${response.status}`);
            }

            await loadProducts();
            return true;
        } catch (error) {
            setAdminError(String(error.message || error));
            return false;
        } finally {
            setAdminLoading(false);
        }
    }

    async function handleAdminUpdateProduct(id, payload) {
        const base = (import.meta.env.VITE_API_BASE_URL ?? "").replace(/\/$/, "");
        setAdminError("");
        setAdminLoading(true);

        try {
            const response = await fetch(`${base}/api/products/Produktai/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const failMessage = await response.text();
                throw new Error(failMessage || `HTTP ${response.status}`);
            }

            await loadProducts();
            return true;
        } catch (error) {
            setAdminError(String(error.message || error));
            return false;
        } finally {
            setAdminLoading(false);
        }
    }

    async function handleAdminDeleteProduct(id) {
        const base = (import.meta.env.VITE_API_BASE_URL ?? "").replace(/\/$/, "");
        setAdminError("");
        setAdminLoading(true);

        try {
            const response = await fetch(`${base}/api/products/Produktai/${id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                const failMessage = await response.text();
                throw new Error(failMessage || `HTTP ${response.status}`);
            }

            await loadProducts();
            return true;
        } catch (error) {
            setAdminError(String(error.message || error));
            return false;
        } finally {
            setAdminLoading(false);
        }
    }

    async function addCartItemToApi(productId, quantity) {
        const base = (import.meta.env.VITE_API_BASE_URL ?? "").replace(/\/$/, "");
        const response = await fetch(`${base}/api/cart`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                userId,
                productId,
                quantity,
            }),
        });

        if (!response.ok) {
            const failMessage = await response.text();
            throw new Error(failMessage || `HTTP ${response.status}`);
        }
    }

    async function deleteCartItemRowsByProductId(parsedProductId) {
        const base = (import.meta.env.VITE_API_BASE_URL ?? "").replace(/\/$/, "");
        const cartResponse = await fetch(`${base}/api/cart`);
        if (!cartResponse.ok) {
            const failMessage = await cartResponse.text();
            throw new Error(failMessage || `HTTP ${cartResponse.status}`);
        }

        const cartData = await cartResponse.json();
        const cartList = Array.isArray(cartData) ? cartData : cartData?.items ?? [];
        if (!Array.isArray(cartList)) {
            throw new Error("Invalid cart response format.");
        }

        const matchingItems = cartList.filter((cartItem) => {
            const cartProductId = Number(
                cartItem.productId ?? cartItem.ProductId ?? cartItem.product?.productId
            );
            const cartUserIdRaw = cartItem.userId ?? cartItem.UserId;
            const cartUserId = Number(cartUserIdRaw);
            const hasUserId = Number.isFinite(cartUserId);
            return cartProductId === parsedProductId && (!hasUserId || cartUserId === userId);
        });

        const cartItemIds = matchingItems
            .map((cartItem) => Number(cartItem.cartItemId ?? cartItem.id ?? cartItem.CartItemId))
            .filter((id) => Number.isFinite(id) && id > 0);

        for (const cartItemId of cartItemIds) {
            const response = await fetch(`${base}/api/cart/delete/${cartItemId}`, {
                method: "DELETE",
            });

            if (!response.ok && response.status !== 404) {
                const failMessage = await response.text();
                throw new Error(failMessage || `HTTP ${response.status}`);
            }
        }
    }

    async function handleAddToCart(product) {
        if (!product) return;
        if (userId <= 0) {
            setErr("Please login to add items to cart.");
            return false;
        }

        const productId = String(product.productId ?? product.id);
        const productName = product.productName ?? "Produktas";
        const productPrice = Number(product.price ?? 0);
        const parsedProductId = Number(product.productId ?? product.id);
        if (!Number.isFinite(parsedProductId) || parsedProductId <= 0) {
            setErr("Neteisingas produkto ID.");
            return false;
        }
        const currentStock = Number(product.stock ?? 0);
        if (!Number.isFinite(currentStock) || currentStock <= 0) {
            setErr("Sios prekes sandelyje nebera.");
            return false;
        }

        try {
            await addCartItemToApi(parsedProductId, 1);
        } catch (error) {
            setErr(`Klaida dedant i krepseli: ${String(error.message || error)}`);
            return false;
        }

        setCartItems((prev) => {
            const existingIndex = prev.findIndex((item) => item.id === productId);
            if (existingIndex === -1) {
                return [
                    ...prev,
                    {
                        id: productId,
                        name: productName,
                        price: productPrice,
                        quantity: 1,
                    },
                ];
            }

            return prev.map((item, index) =>
                index === existingIndex ? { ...item, quantity: item.quantity + 1 } : item
            );
        });

        setProducts((prev) =>
            prev.map((item) => {
                const itemId = Number(item.productId ?? item.id);
                if (itemId !== parsedProductId) return item;

                const stock = Number(item.stock ?? 0);
                return {
                    ...item,
                    stock: stock > 0 ? stock - 1 : 0,
                };
            })
        );

        setErr("");
        return true;
    }

    async function handleRemoveFromCart(item) {
        if (!item) return false;

        const parsedProductId = Number(item.id);
        if (!Number.isFinite(parsedProductId) || parsedProductId <= 0) {
            setErr("Invalid cart product id.");
            return false;
        }

        setDeletingCartItemId(item.id);

        const removeFromLocalCart = () => {
            setCartItems((prev) => prev.filter((cartItem) => cartItem.id !== item.id));
            setProducts((prev) =>
                prev.map((product) => {
                    const productId = Number(product.productId ?? product.id);
                    if (productId !== parsedProductId) return product;

                    const stock = Number(product.stock ?? 0);
                    return {
                        ...product,
                        stock: stock + Number(item.quantity ?? 0),
                    };
                })
            );
        };

        try {
            await deleteCartItemRowsByProductId(parsedProductId);
            removeFromLocalCart();
            setErr("");
            return true;
        } catch (error) {
            setErr(`Error deleting from cart: ${String(error.message || error)}`);
            return false;
        } finally {
            setDeletingCartItemId(null);
        }
    }

    async function handleChangeCartQuantity(item, nextQuantityRaw) {
        if (!item) return false;

        const parsedProductId = Number(item.id);
        if (!Number.isFinite(parsedProductId) || parsedProductId <= 0) {
            setErr("Invalid cart product id.");
            return false;
        }

        const currentQuantity = Number(item.quantity ?? 0);
        const nextQuantity = Math.max(0, Number(nextQuantityRaw));

        if (!Number.isFinite(nextQuantity)) return false;
        if (nextQuantity === currentQuantity) return true;
        if (nextQuantity === 0) {
            return handleRemoveFromCart(item);
        }

        const product = products.find(
            (productItem) => Number(productItem.productId ?? productItem.id) === parsedProductId
        );
        const availableStock = Number(product?.stock ?? 0);
        const maxAllowedQuantity = currentQuantity + (Number.isFinite(availableStock) ? availableStock : 0);

        if (nextQuantity > maxAllowedQuantity) {
            setErr("Not enough stock for selected quantity.");
            return false;
        }

        setUpdatingCartItemId(item.id);

        try {
            const base = (import.meta.env.VITE_API_BASE_URL ?? "").replace(/\/$/, "");
            const cartResponse = await fetch(`${base}/api/cart`);
            if (!cartResponse.ok) {
                const failMessage = await cartResponse.text();
                throw new Error(failMessage || `HTTP ${cartResponse.status}`);
            }

            const cartData = await cartResponse.json();
            const cartList = Array.isArray(cartData) ? cartData : cartData?.items ?? [];
            if (!Array.isArray(cartList)) {
                throw new Error("Invalid cart response format.");
            }

            const matchingItems = cartList.filter((cartItem) => {
                const cartProductId = Number(
                    cartItem.productId ?? cartItem.ProductId ?? cartItem.product?.productId
                );
                const cartUserIdRaw = cartItem.userId ?? cartItem.UserId;
                const cartUserId = Number(cartUserIdRaw);
                const hasUserId = Number.isFinite(cartUserId);
                return cartProductId === parsedProductId && (!hasUserId || cartUserId === userId);
            });

            const cartItemIds = matchingItems
                .map((cartItem) => Number(cartItem.cartItemId ?? cartItem.id ?? cartItem.CartItemId))
                .filter((id) => Number.isFinite(id) && id > 0);

            if (cartItemIds.length === 0) {
                await addCartItemToApi(parsedProductId, nextQuantity);
            } else {
                const patchResponse = await fetch(`${base}/api/cart/update/quantity/${cartItemIds[0]}`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        quantity: nextQuantity,
                    }),
                });

                if (!patchResponse.ok) {
                    const failMessage = await patchResponse.text();
                    throw new Error(failMessage || `HTTP ${patchResponse.status}`);
                }

                for (const extraId of cartItemIds.slice(1)) {
                    const deleteResponse = await fetch(`${base}/api/cart/delete/${extraId}`, {
                        method: "DELETE",
                    });

                    if (!deleteResponse.ok && deleteResponse.status !== 404) {
                        const failMessage = await deleteResponse.text();
                        throw new Error(failMessage || `HTTP ${deleteResponse.status}`);
                    }
                }
            }

            const stockDelta = currentQuantity - nextQuantity;

            setCartItems((prev) =>
                prev.map((cartItem) =>
                    cartItem.id === item.id ? { ...cartItem, quantity: nextQuantity } : cartItem
                )
            );
            setProducts((prev) =>
                prev.map((productItem) => {
                    const productId = Number(productItem.productId ?? productItem.id);
                    if (productId !== parsedProductId) return productItem;

                    const stock = Number(productItem.stock ?? 0);
                    return {
                        ...productItem,
                        stock: stock + stockDelta,
                    };
                })
            );

            setErr("");
            return true;
        } catch (error) {
            setErr(`Error updating quantity: ${String(error.message || error)}`);
            return false;
        } finally {
            setUpdatingCartItemId(null);
        }
    }

    async function handleClearCart() {
        if (cartItems.length === 0) return true;

        setIsClearingCart(true);
        const previousCartItems = [...cartItems];

        try {
            if (userId > 0) {
                const base = (import.meta.env.VITE_API_BASE_URL ?? "").replace(/\/$/, "");
                const response = await fetch(`${base}/api/cart/clear/${userId}`, {
                    method: "DELETE",
                });

                if (!response.ok) {
                    const failMessage = await response.text();
                    throw new Error(failMessage || `HTTP ${response.status}`);
                }
            }

            setCartItems([]);
            setProducts((prev) =>
                prev.map((product) => {
                    const productId = Number(product.productId ?? product.id);
                    const matchingCartItem = previousCartItems.find(
                        (cartItem) => Number(cartItem.id) === productId
                    );

                    if (!matchingCartItem) return product;

                    const stock = Number(product.stock ?? 0);
                    return {
                        ...product,
                        stock: stock + Number(matchingCartItem.quantity ?? 0),
                    };
                })
            );
            setErr("");
            return true;
        } catch (error) {
            setErr(`Klaida valant krepseli: ${String(error.message || error)}`);
            return false;
        } finally {
            setIsClearingCart(false);
        }
    }

    function getQuantityOptions(item) {
        const stockForProduct = Number(
            products.find((product) => Number(product.productId ?? product.id) === Number(item.id))?.stock ?? 0
        );
        const maxQuantity = Math.max(1, Number(item.quantity ?? 0) + Math.max(0, stockForProduct));

        return Array.from({ length: maxQuantity }, (_, index) => index + 1);
    }

    return (
        <div className="min-h-screen bg-slate-100 text-slate-900">
            <div className="border-b bg-slate-900 text-white">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 text-xs sm:px-6 lg:px-8">
                    <span>Nemokamas pristatymas nuo 100 EUR</span>
                    <span className="text-slate-300">Saugus atsiskaitymas ir greitas aptarnavimas</span>
                </div>
            </div>

            <div className="relative">
                <header className="sticky top-0 z-50 border-b border-slate-200 bg-white">
                    <div className="mx-auto flex max-w-7xl items-center justify-between p-4 sm:px-6 lg:px-8">
                        <div className="text-left">
                            <div className="text-2xl font-semibold text-slate-900">MyShop</div>
                            <div className="text-sm text-slate-500">Paprastas internetines parduotuves dizainas</div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                            <input
                                className="w-64 rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white"
                                placeholder="Ieskoti prekiu"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            {!userName && (
                                <button
                                    className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                                    onClick={() => {
                                        navigate("/register");
                                    }}
                                >
                                    Registruotis
                                </button>
                            )}
                            {!userName && (
                                <button
                                    className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
                                    onClick={() => {
                                        navigate("/login");
                                    }}
                                >
                                    Prisijungti
                                </button>
                            )}
                            <button
                                className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                                onClick={() => {
                                    navigate(isAdmin ? "/admin" : "/admin/login");
                                }}
                            >
                                {isAdmin ? "Admin panel" : "Admin"}
                            </button>
                            <div className="relative z-[60]">
                                <button
                                    className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                                    onClick={() => setIsCartOpen((prev) => !prev)}
                                >
                                    Krepselis ({cartCount})
                                </button>
                                {isCartOpen && (
                                    <div className="absolute right-0 z-[70] mt-2 w-80 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl">
                                        {cartItems.length === 0 ? (
                                            <p className="text-sm text-slate-600">Krepselis tuscias.</p>
                                        ) : (
                                            <>
                                                <div className="max-h-64 overflow-auto">
                                                    <table className="w-full text-left text-sm text-slate-700">
                                                        <thead>
                                                            <tr className="text-slate-400">
                                                                <th className="pb-2">Product</th>
                                                                <th className="pb-2 text-center">Quantity</th>
                                                                <th className="pb-2 text-right">Total</th>
                                                                <th className="pb-2 text-right">Action</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {cartItems.map((item) => (
                                                                <tr key={item.id} className="border-t border-slate-200">
                                                                    <td className="py-2 pr-2">{item.name}</td>
                                                                    <td className="py-2 text-center">
                                                                        <select
                                                                            className="w-20 rounded-md border border-slate-300 bg-white px-2 py-1 text-center text-slate-700 outline-none focus:border-slate-400"
                                                                            value={item.quantity}
                                                                            onChange={(e) => handleChangeCartQuantity(item, Number(e.target.value))}
                                                                            disabled={
                                                                                deletingCartItemId === item.id ||
                                                                                updatingCartItemId === item.id ||
                                                                                isClearingCart
                                                                            }
                                                                        >
                                                                            {getQuantityOptions(item).map((value) => (
                                                                                <option key={value} value={value}>
                                                                                    {value}
                                                                                </option>
                                                                            ))}
                                                                        </select>
                                                                    </td>
                                                                    <td className="py-2 text-right">
                                                                        {(item.price * item.quantity).toFixed(2)} EUR
                                                                    </td>
                                                                    <td className="py-2 text-right">
                                                                        <button
                                                                            className="rounded-lg border border-red-200 px-2 py-1 text-xs text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                                                                            onClick={() => handleRemoveFromCart(item)}
                                                                            disabled={
                                                                                deletingCartItemId === item.id ||
                                                                                updatingCartItemId === item.id ||
                                                                                isClearingCart
                                                                            }
                                                                        >
                                                                            {deletingCartItemId === item.id ? "Trinama..." : "Salinti"}
                                                                        </button>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                                <div className="mt-3 border-t border-slate-200 pt-3 text-right text-sm font-semibold text-slate-900">
                                                    Viso: {formatPrice(cartTotal)}
                                                </div>
                                                <div className="mt-2 flex justify-end">
                                                    <button
                                                        className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                                                        onClick={handleClearCart}
                                                        disabled={isClearingCart || deletingCartItemId !== null || updatingCartItemId !== null}
                                                    >
                                                        {isClearingCart ? "Valoma..." : "Isvalyti krepseli"}
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>
                            {userName && (
                                <div className="relative z-[60]">
                                    <button
                                        className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-3 py-2.5"
                                        onClick={() => setIsUserMenuOpen((prev) => !prev)}
                                    >
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
                                            {userName.charAt(0).toUpperCase()}
                                        </div>
                                        <span className="text-sm text-slate-700">{userName}</span>
                                    </button>

                                    {isUserMenuOpen && (
                                        <div className="absolute right-0 z-[70] mt-2 w-40 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
                                            <button
                                                className="w-full rounded-xl px-3 py-2 text-sm text-red-600 transition hover:bg-red-50"
                                                onClick={handleLogout}
                                            >
                                                Atsijungti
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                <main className="mx-auto max-w-7xl p-6">
                    {isRegisterPage ? (
                        <RegisterPage
                            onRegistered={handleRegistered}
                            onNavigate={navigate}
                        />
                    ) : isAdminLoginPage ? (
                        <AdminLoginPage
                            onAdminLogin={handleAdminLoginCheck}
                            onNavigate={navigate}
                            loading={adminLoading}
                            error={adminError}
                        />
                    ) : isAdminPanelPage ? (
                        isAdmin ? (
                            <AdminPanelPage
                                products={products}
                                onCreate={handleAdminCreateProduct}
                                onUpdate={handleAdminUpdateProduct}
                                onDelete={handleAdminDeleteProduct}
                                onAdminLogout={handleAdminLogout}
                                loading={adminLoading}
                                error={adminError}
                            />
                        ) : (
                            <AdminLoginPage
                                onAdminLogin={handleAdminLoginCheck}
                                onNavigate={navigate}
                                loading={adminLoading}
                                error={adminError || "Pirma prisijunk kaip admin."}
                            />
                        )
                    ) : isLoginPage ? (
                        <LoginPage
                            defaultEmail={pendingEmail}
                            onNavigate={navigate}
                            onLoginSuccess={(payload) => {
                                const nextUserName =
                                    typeof payload === "string" ? payload : payload?.name;
                                const nextUserId =
                                    typeof payload === "object" && payload !== null ? payload.userId : null;

                                saveUserName(nextUserName);
                                saveUserId(nextUserId);
                                setPendingEmail("");
                                localStorage.removeItem("myshop_pending_email");
                            }}
                        />
                    ) : isProductPage ? (
                        <ProductDetailsPage
                            product={selectedProduct}
                            onNavigate={navigate}
                            onAddToCart={() => handleAddToCart(selectedProduct)}
                            canAddToCart={userId > 0}
                        />
                    ) : (
                        <>
                            <div className="mb-8 rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm">
                                <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                                    <div>
                                        <div className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                                            Internetine parduotuve
                                        </div>
                                        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-900">
                                            Baltas fonas, aiskios kainos ir standartinis parduotuves isdestymas.
                                        </h1>
                                        <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
                                            Produktu sarasas, filtrai, krepstelis ir prisijungimas rodomi taip, kaip
                                            iprasta daugumoje el. parduotuviu.
                                        </p>
                                    </div>

                                    <div className="grid gap-3 sm:grid-cols-2">
                                        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4">
                                            <div className="text-sm text-slate-500">Aktyviu prekiu</div>
                                            <div className="mt-1 text-2xl font-semibold text-slate-900">{activeProductCount}</div>
                                        </div>
                                        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4">
                                            <div className="text-sm text-slate-500">Krepselio suma</div>
                                            <div className="mt-1 text-2xl font-semibold text-slate-900">{formatPrice(cartTotal)}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {err && (
                                <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                                    {err}
                                </div>
                            )}

                            {!userName && (
                                <div className="mb-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                                    Prisijunkite, jei norite deti prekes i krepseli.
                                </div>
                            )}

                            <div className="mb-6 flex flex-col gap-4 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                                <div className="flex flex-wrap gap-2">
                                    <button className={`rounded-full px-4 py-2 text-sm font-medium transition ${stockFilter === "all" ? "bg-slate-900 text-white" : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"}`} onClick={() => setStockFilter("all")}>Visos prekes</button>
                                    <button className={`rounded-full px-4 py-2 text-sm font-medium transition ${stockFilter === "in_stock" ? "bg-slate-900 text-white" : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"}`} onClick={() => setStockFilter("in_stock")}>Turimos vietoje</button>
                                    <button className={`rounded-full px-4 py-2 text-sm font-medium transition ${stockFilter === "low_stock" ? "bg-slate-900 text-white" : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"}`} onClick={() => setStockFilter("low_stock")}>Mazas likutis</button>
                                    <button className={`rounded-full px-4 py-2 text-sm font-medium transition ${stockFilter === "premium" ? "bg-slate-900 text-white" : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"}`} onClick={() => setStockFilter("premium")}>Brangesnes</button>
                                </div>
                                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                        <div className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Produktu katalogas</div>
                                        <p className="mt-1 text-sm text-slate-600">Rasta {filteredProducts.length} is {products.length} prekiu.</p>
                                    </div>
                                    <select className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none transition focus:border-slate-400" value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
                                        <option value="featured">Rekomenduojamos</option>
                                        <option value="price_asc">Kaina: nuo maziausios</option>
                                        <option value="price_desc">Kaina: nuo didziausios</option>
                                        <option value="name">Pavadinimas</option>
                                        <option value="stock">Didziausias likutis</option>
                                    </select>
                                </div>
                            </div>

                            {filteredProducts.length === 0 ? (
                                <div className="rounded-[28px] border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
                                    <div className="text-lg font-semibold text-slate-900">Nieko nerasta</div>
                                    <p className="mt-2 text-sm text-slate-600">Pabandykite pakeisti paieska arba filtrus.</p>
                                </div>
                            ) : (
                                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                                    {filteredProducts.map((p) => (
                                        <ProductCard
                                            key={p.productId ?? p.id}
                                            p={p}
                                            onAddToCart={() => handleAddToCart(p)}
                                            onViewProduct={(id) => navigate(`/product/${id}`)}
                                            canAddToCart={userId > 0}
                                        />
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </main>
            </div>
        </div>
    );
}
