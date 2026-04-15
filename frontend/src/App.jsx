import { useEffect, useMemo, useState } from "react";

import ProductCard from "./components/ProductCard";
import ProductDetailsPage from "./components/ProductDetailsPage";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import AdminLoginPage from "./components/AdminLoginPage";
import AdminPanelPage from "./components/AdminPanelPage";

export default function App() {
    const [products, setProducts] = useState([]);
    const [err, setErr] = useState("");
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

    const cartCount = useMemo(
        () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
        [cartItems]
    );
    const cartTotal = useMemo(
        () => cartItems.reduce((sum, item) => sum + item.quantity * item.price, 0),
        [cartItems]
    );

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
        }

        window.addEventListener("popstate", handlePopState);
        return () => window.removeEventListener("popstate", handlePopState);
    }, []);

    function navigate(nextPath) {
        if (!nextPath || nextPath === pathname) return;
        window.history.pushState({}, "", nextPath);
        setPathname(nextPath);
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

    return (
        <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-100 overflow-hidden">
            <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-indigo-500 blur-3xl opacity-20"></div>
            <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-blue-500 blur-3xl opacity-20"></div>

            <div className="relative">
                <header className="sticky top-0 z-50 border-b border-slate-700 bg-slate-900/70 backdrop-blur">
                    <div className="mx-auto flex max-w-6xl items-center justify-between p-4">
                        <div className="text-xl font-extrabold tracking-tight">
                            MiniEshop <span className="text-slate-400">projekt</span>
                        </div>

                        <div className="flex gap-2">
                            <input
                                className="w-56 rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="Search..."
                            />
                            {!userName && (
                                <button
                                    className="rounded-xl border border-sky-500 bg-sky-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-sky-500"
                                    onClick={() => {
                                        navigate("/register");
                                    }}
                                >
                                    Registruotis
                                </button>
                            )}
                            {!userName && (
                                <button
                                    className="rounded-xl border border-indigo-500 bg-indigo-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-indigo-500"
                                    onClick={() => {
                                        navigate("/login");
                                    }}
                                >
                                    Prisijungti
                                </button>
                            )}
                            <button
                                className="rounded-xl border border-amber-500 bg-amber-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-amber-500"
                                onClick={() => {
                                    navigate(isAdmin ? "/admin" : "/admin/login");
                                }}
                            >
                                {isAdmin ? "Admin panel" : "Admin"}
                            </button>
                            <div className="relative z-[60]">
                                <button
                                    className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm hover:bg-slate-700 transition"
                                    onClick={() => setIsCartOpen((prev) => !prev)}
                                >
                                    Cart ({cartCount})
                                </button>
                                {isCartOpen && (
                                    <div className="absolute right-0 z-[70] mt-2 w-80 rounded-xl border border-slate-600 bg-slate-800 p-3 shadow-lg">
                                        {cartItems.length === 0 ? (
                                            <p className="text-sm text-slate-300">Krepselis tuscias.</p>
                                        ) : (
                                            <>
                                                <div className="max-h-64 overflow-auto">
                                                    <table className="w-full text-left text-sm text-slate-200">
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
                                                                <tr key={item.id} className="border-t border-slate-700">
                                                                    <td className="py-2 pr-2">{item.name}</td>
                                                                    <td className="py-2 text-center">
                                                                        <select
                                                                            className="w-20 rounded-md border border-slate-600 bg-slate-900 px-2 py-1 text-center text-slate-100 outline-none focus:border-indigo-500"
                                                                            value={item.quantity}
                                                                            onChange={(e) => handleChangeCartQuantity(item, Number(e.target.value))}
                                                                            disabled={
                                                                                deletingCartItemId === item.id ||
                                                                                updatingCartItemId === item.id ||
                                                                                isClearingCart
                                                                            }
                                                                        >
                                                                            {Array.from(
                                                                                {
                                                                                    length: Math.max(
                                                                                        1,
                                                                                        item.quantity +
                                                                                            Math.max(
                                                                                                0,
                                                                                                Number(
                                                                                                    products.find(
                                                                                                        (product) =>
                                                                                                            Number(
                                                                                                                product.productId ??
                                                                                                                    product.id
                                                                                                            ) === Number(item.id)
                                                                                                    )?.stock ?? 0
                                                                                                )
                                                                                            )
                                                                                    ),
                                                                                },
                                                                                (_, index) => {
                                                                                    const value = index + 1;
                                                                                    return (
                                                                                        <option key={value} value={value}>
                                                                                            {value}
                                                                                        </option>
                                                                                    );
                                                                                }
                                                                            )}
                                                                        </select>
                                                                    </td>
                                                                    <td className="py-2 text-right">
                                                                        {(item.price * item.quantity).toFixed(2)} EUR
                                                                    </td>
                                                                    <td className="py-2 text-right">
                                                                        <button
                                                                            className="rounded-lg border border-red-500/40 bg-red-500/20 px-2 py-1 text-xs text-red-200 transition hover:bg-red-500/30 disabled:cursor-not-allowed disabled:opacity-50"
                                                                            onClick={() => handleRemoveFromCart(item)}
                                                                            disabled={
                                                                                deletingCartItemId === item.id ||
                                                                                updatingCartItemId === item.id ||
                                                                                isClearingCart
                                                                            }
                                                                        >
                                                                            {deletingCartItemId === item.id ? "Deleting..." : "Delete"}
                                                                        </button>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                                <div className="mt-3 border-t border-slate-700 pt-2 text-right text-sm font-semibold text-white">
                                                    Viso: {cartTotal.toFixed(2)} EUR
                                                </div>
                                                <div className="mt-2 flex justify-end">
                                                    <button
                                                        className="rounded-lg border border-red-500/50 bg-red-500/20 px-3 py-2 text-xs font-medium text-red-100 transition hover:bg-red-500/30 disabled:cursor-not-allowed disabled:opacity-50"
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
                                        className="flex items-center gap-2 rounded-xl border border-slate-600 bg-slate-800 px-3 py-2"
                                        onClick={() => setIsUserMenuOpen((prev) => !prev)}
                                    >
                                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-cyan-600 text-xs font-bold text-white">
                                            {userName.charAt(0).toUpperCase()}
                                        </div>
                                        <span className="text-sm text-slate-100">{userName}</span>
                                    </button>

                                    {isUserMenuOpen && (
                                        <div className="absolute right-0 z-[70] mt-2 w-40 rounded-xl border border-slate-600 bg-slate-800 p-2 shadow-lg">
                                            <button
                                                className="w-full rounded-lg border border-red-500/40 bg-red-500/20 px-3 py-2 text-sm text-red-200 transition hover:bg-red-500/30"
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

                <main className="mx-auto max-w-6xl p-6">
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
                            <div className="mb-8 rounded-2xl border border-slate-700 bg-slate-800/60 p-8 shadow-lg backdrop-blur">
                                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                                    <div>
                                        <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-400 to-blue-400 bg-clip-text text-transparent">
                                            MiniEshop project
                                        </h1>
                                        <p className="mt-2 text-slate-400">Produktai kraunami i .NET Web API</p>
                                    </div>

                                    <div className="flex gap-2">
                                        <span className="rounded-full bg-indigo-600 px-3 py-1 text-xs font-semibold text-white">
                                            React + Vite
                                        </span>
                                        <span className="rounded-full bg-slate-700 px-3 py-1 text-xs font-semibold text-slate-200">
                                            .NET Web API
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {err && (
                                <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-red-400">
                                    {err}
                                </div>
                            )}

                            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                {products.map((p) => (
                                    <ProductCard
                                        key={p.productId ?? p.id}
                                        p={p}
                                        onAddToCart={() => handleAddToCart(p)}
                                        onViewProduct={(id) => navigate(`/product/${id}`)}
                                        canAddToCart={userId > 0}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </main>
            </div>
        </div>
    );
}
