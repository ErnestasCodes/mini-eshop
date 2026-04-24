import {
    useCallback,
    startTransition,
    useDeferredValue,
    useEffect,
    useEffectEvent,
    useMemo,
    useState,
} from "react";

import {
    buildActiveFilterChips,
    CATEGORY_FILTERS,
    enrichCatalogProduct,
    formatPrice,
    FREE_SHIPPING_THRESHOLD,
    selectFeaturedProducts,
} from "../lib/storefront";
import { getApiBaseUrl, getSwaggerUrl } from "../lib/utils";

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

function readStoredUserId() {
    const storedUserId = Number(localStorage.getItem("myshop_user_id"));
    return Number.isFinite(storedUserId) && storedUserId > 0 ? storedUserId : 0;
}

function readStoredAdminFlag() {
    return localStorage.getItem("myshop_is_admin") === "1";
}

function toBooleanFlag(value) {
    if (typeof value === "boolean") {
        return value;
    }

    if (typeof value === "number") {
        return value === 1;
    }

    if (typeof value === "string") {
        const normalized = value.trim().toLowerCase();
        return normalized === "true" || normalized === "1";
    }

    return false;
}

export default function useStorefrontApp() {
    const [products, setProducts] = useState([]);
    const [error, setError] = useState("");
    const [isLoadingProducts, setIsLoadingProducts] = useState(true);
    const [hasCompletedInitialProductsLoad, setHasCompletedInitialProductsLoad] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [inventoryFilter, setInventoryFilter] = useState("all");
    const [priceFilter, setPriceFilter] = useState("all");
    const [sortOption, setSortOption] = useState("featured");
    const [toast, setToast] = useState(null);
    const [userId, setUserId] = useState(() => readStoredUserId());
    const [cartItems, setCartItems] = useState(() => readCartFromStorage(readStoredUserId()));
    const [userName, setUserName] = useState(() => localStorage.getItem("myshop_user_name") ?? "");
    const [pendingEmail, setPendingEmail] = useState(() => localStorage.getItem("myshop_pending_email") ?? "");
    const [pathname, setPathname] = useState(() => window.location.pathname);
    const [isAdmin, setIsAdmin] = useState(() => readStoredUserId() > 0 && readStoredAdminFlag());
    const [adminError, setAdminError] = useState("");
    const [adminLoading, setAdminLoading] = useState(false);
    const [deletingCartItemId, setDeletingCartItemId] = useState(null);
    const [updatingCartItemId, setUpdatingCartItemId] = useState(null);
    const [isClearingCart, setIsClearingCart] = useState(false);

    const apiBaseUrl = getApiBaseUrl();
    const swaggerUrl = getSwaggerUrl();
    const deferredSearchQuery = useDeferredValue(searchQuery);
    const isLoggedIn = userId > 0;
    const canAccessAdmin = isLoggedIn && isAdmin;
    const shouldShowStartupLoader = isLoadingProducts && !hasCompletedInitialProductsLoad;

    const catalogProducts = useMemo(
        () => products.map((product, index) => enrichCatalogProduct(product, index)),
        [products]
    );

    const featuredProducts = useMemo(() => selectFeaturedProducts(catalogProducts), [catalogProducts]);

    const activeProductCount = useMemo(
        () => catalogProducts.filter((product) => Number(product.stock ?? 0) > 0).length,
        [catalogProducts]
    );

    const categoryBreakdown = useMemo(
        () =>
            CATEGORY_FILTERS.slice(1).map((category) => ({
                ...category,
                count: catalogProducts.filter((product) => product.categoryId === category.id).length,
            })),
        [catalogProducts]
    );

    const filteredProducts = useMemo(() => {
        const query = deferredSearchQuery.trim().toLowerCase();

        const nextProducts = catalogProducts.filter((product) => {
            const stock = Number(product.stock ?? 0);
            const price = Number(product.price ?? 0);
            const searchableText = [
                product.displayName,
                product.displayDescription,
                product.categoryLabel,
                product.productName,
                product.description,
            ]
                .join(" ")
                .toLowerCase();

            if (query && !searchableText.includes(query)) {
                return false;
            }

            if (categoryFilter !== "all" && product.categoryId !== categoryFilter) {
                return false;
            }

            if (inventoryFilter === "in_stock" && stock <= 0) {
                return false;
            }

            if (inventoryFilter === "low_stock" && !(stock > 0 && stock <= 3)) {
                return false;
            }

            if (inventoryFilter === "new_arrivals" && !product.isNewArrival) {
                return false;
            }

            if (inventoryFilter === "sold_out" && stock > 0) {
                return false;
            }

            if (priceFilter === "under_50" && price >= 50) {
                return false;
            }

            if (priceFilter === "50_100" && (price < 50 || price > 100)) {
                return false;
            }

            if (priceFilter === "over_100" && price < 100) {
                return false;
            }

            return true;
        });

        return nextProducts.sort((left, right) => {
            if (sortOption === "newest") {
                return Number(right.newnessRank ?? 0) - Number(left.newnessRank ?? 0);
            }

            if (sortOption === "price_asc") {
                return Number(left.price ?? 0) - Number(right.price ?? 0);
            }

            if (sortOption === "price_desc") {
                return Number(right.price ?? 0) - Number(left.price ?? 0);
            }

            if (sortOption === "name") {
                return String(left.displayName ?? left.productName ?? "").localeCompare(
                    String(right.displayName ?? right.productName ?? ""),
                    "lt"
                );
            }

            if (sortOption === "stock") {
                return Number(right.stock ?? 0) - Number(left.stock ?? 0);
            }

            const leftScore = Number(left.isPopular) * 4 + Number(left.isNewArrival) * 3 + Number(left.stock > 0);
            const rightScore =
                Number(right.isPopular) * 4 + Number(right.isNewArrival) * 3 + Number(right.stock > 0);

            if (leftScore === rightScore) {
                return Number(right.newnessRank ?? 0) - Number(left.newnessRank ?? 0);
            }

            return rightScore - leftScore;
        });
    }, [
        catalogProducts,
        deferredSearchQuery,
        categoryFilter,
        inventoryFilter,
        priceFilter,
        sortOption,
    ]);

    const productIdFromPath = pathname.startsWith("/product/") ? pathname.split("/").pop() : null;
    const selectedProduct = useMemo(() => {
        if (!productIdFromPath) {
            return null;
        }

        return (
            catalogProducts.find(
                (product) => String(product.productId ?? product.id) === String(productIdFromPath)
            ) ?? null
        );
    }, [catalogProducts, productIdFromPath]);

    const cartCount = useMemo(
        () => cartItems.reduce((sum, item) => sum + Number(item.quantity ?? 0), 0),
        [cartItems]
    );
    const cartTotal = useMemo(
        () => cartItems.reduce((sum, item) => sum + Number(item.quantity ?? 0) * Number(item.price ?? 0), 0),
        [cartItems]
    );

    const activeFilterChips = useMemo(
        () =>
            buildActiveFilterChips({
                searchQuery,
                categoryFilter,
                inventoryFilter,
                priceFilter,
                sortOption,
            }),
        [searchQuery, categoryFilter, inventoryFilter, priceFilter, sortOption]
    );

    const loadProducts = useCallback(async () => {
        setIsLoadingProducts(true);

        try {
            const response = await fetch(`${apiBaseUrl}/api/products/Produktai`);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const data = await response.json();
            setProducts(Array.isArray(data) ? data : []);
            setError("");
        } catch (nextError) {
            setError(String(nextError.message || nextError));
        } finally {
            setIsLoadingProducts(false);
            setHasCompletedInitialProductsLoad(true);
        }
    }, [apiBaseUrl]);

    useEffect(() => {
        loadProducts();
    }, [loadProducts]);

    useEffect(() => {
        setCartItems(readCartFromStorage(userId));
    }, [userId]);

    useEffect(() => {
        if (userId > 0 || !isAdmin) {
            return;
        }

        saveAdminSession(false);
    }, [isAdmin, userId]);

    useEffect(() => {
        localStorage.setItem(getCartStorageKey(userId), JSON.stringify(cartItems));
    }, [cartItems, userId]);

    const handlePopState = useEffectEvent(() => {
        setPathname(window.location.pathname);
    });

    useEffect(() => {
        const listener = () => handlePopState();

        window.addEventListener("popstate", listener);
        return () => window.removeEventListener("popstate", listener);
    }, []);

    useEffect(() => {
        if (!toast) {
            return undefined;
        }

        const timeoutId = window.setTimeout(() => {
            setToast(null);
        }, 2800);

        return () => window.clearTimeout(timeoutId);
    }, [toast]);

    function showToast(type, title, message = "") {
        setToast({ type, title, message });
    }

    function clearError() {
        setError("");
    }

    function navigate(nextPath, { replace = false } = {}) {
        if (!nextPath || nextPath === pathname) {
            return;
        }

        if (replace) {
            window.history.replaceState({}, "", nextPath);
        } else {
            window.history.pushState({}, "", nextPath);
        }

        startTransition(() => {
            setPathname(nextPath);
        });
        window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
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

        showToast("success", "Paskyra sukurta", "Prisijunkite ir tęskite apsipirkimą.");
    }

    function handleLogout() {
        saveAdminSession(false);
        setAdminError("");
        saveUserName("");
        saveUserId(0);
        setPendingEmail("");
        localStorage.removeItem("myshop_pending_email");
        navigate("/");
        showToast("success", "Atsijungta", "Galite toliau naršyti kolekciją kaip svečias.");
    }

    function handleAdminLogout() {
        saveAdminSession(false);
        setAdminError("");
        navigate("/");
        showToast("success", "Administratoriaus sesija uždaryta");
    }

    async function handleAdminLoginCheck() {
        setAdminError("");
        if (!isLoggedIn) {
            saveAdminSession(false);
            showToast("error", "Reikalingas prisijungimas", "Valdymas prieinamas tik prisijungusiam administratoriui.");
            navigate("/login");
            return false;
        }

        if (!isAdmin) {
            setAdminError("Jūsų paskyra neturi administratoriaus teisių.");
            return false;
        }

        navigate("/admin");
        return true;
    }

    async function handleAdminCreateProduct(payload) {
        if (!canAccessAdmin) {
            setAdminError("Produktų valdymas leidžiamas tik administratoriui.");
            return false;
        }

        setAdminError("");
        setAdminLoading(true);

        try {
            const response = await fetch(`${apiBaseUrl}/api/products`, {
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
            showToast("success", "Prekė pridėta");
            return true;
        } catch (nextError) {
            setAdminError(String(nextError.message || nextError));
            return false;
        } finally {
            setAdminLoading(false);
        }
    }

    async function handleAdminUpdateProduct(id, payload) {
        if (!canAccessAdmin) {
            setAdminError("Produktų valdymas leidžiamas tik administratoriui.");
            return false;
        }

        setAdminError("");
        setAdminLoading(true);

        try {
            const response = await fetch(`${apiBaseUrl}/api/products/Produktai/${id}`, {
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
            showToast("success", "Pakeitimai išsaugoti");
            return true;
        } catch (nextError) {
            setAdminError(String(nextError.message || nextError));
            return false;
        } finally {
            setAdminLoading(false);
        }
    }

    async function handleAdminDeleteProduct(id) {
        if (!canAccessAdmin) {
            setAdminError("Produktų valdymas leidžiamas tik administratoriui.");
            return false;
        }

        setAdminError("");
        setAdminLoading(true);

        try {
            const response = await fetch(`${apiBaseUrl}/api/products/Produktai/${id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                const failMessage = await response.text();
                throw new Error(failMessage || `HTTP ${response.status}`);
            }

            await loadProducts();
            showToast("success", "Prekė ištrinta");
            return true;
        } catch (nextError) {
            setAdminError(String(nextError.message || nextError));
            return false;
        } finally {
            setAdminLoading(false);
        }
    }

    async function addCartItemToApi(productId, quantity) {
        const response = await fetch(`${apiBaseUrl}/api/cart`, {
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
        const cartResponse = await fetch(`${apiBaseUrl}/api/cart`);

        if (!cartResponse.ok) {
            const failMessage = await cartResponse.text();
            throw new Error(failMessage || `HTTP ${cartResponse.status}`);
        }

        const cartData = await cartResponse.json();
        const cartList = Array.isArray(cartData) ? cartData : cartData?.items ?? [];

        if (!Array.isArray(cartList)) {
            throw new Error("Neteisingas krepšelio atsakymo formatas.");
        }

        const matchingItems = cartList.filter((cartItem) => {
            const cartProductId = Number(cartItem.productId ?? cartItem.ProductId ?? cartItem.product?.productId);
            const cartUserIdRaw = cartItem.userId ?? cartItem.UserId;
            const cartUserId = Number(cartUserIdRaw);
            const hasUserId = Number.isFinite(cartUserId);
            return cartProductId === parsedProductId && (!hasUserId || cartUserId === userId);
        });

        const cartItemIds = matchingItems
            .map((cartItem) => Number(cartItem.cartItemId ?? cartItem.id ?? cartItem.CartItemId))
            .filter((id) => Number.isFinite(id) && id > 0);

        for (const cartItemId of cartItemIds) {
            const response = await fetch(`${apiBaseUrl}/api/cart/delete/${cartItemId}`, {
                method: "DELETE",
            });

            if (!response.ok && response.status !== 404) {
                const failMessage = await response.text();
                throw new Error(failMessage || `HTTP ${response.status}`);
            }
        }
    }

    async function handleAddToCart(product) {
        if (!product) {
            return false;
        }

        if (userId <= 0) {
            setError("Prisijunkite, jei norite dėti prekes į krepšelį.");
            showToast("error", "Reikalingas prisijungimas", "Atidaromas prisijungimo puslapis.");
            navigate("/login");
            return false;
        }

        const productId = String(product.productId ?? product.id);
        const productName = product.displayName ?? product.productName ?? "Produktas";
        const productPrice = Number(product.price ?? 0);
        const parsedProductId = Number(product.productId ?? product.id);

        if (!Number.isFinite(parsedProductId) || parsedProductId <= 0) {
            setError("Neteisingas produkto ID.");
            return false;
        }

        const currentStock = Number(product.stock ?? 0);

        if (!Number.isFinite(currentStock) || currentStock <= 0) {
            setError("Šios prekės sandėlyje nebėra.");
            return false;
        }

        try {
            await addCartItemToApi(parsedProductId, 1);
        } catch (nextError) {
            setError(`Klaida dedant į krepšelį: ${String(nextError.message || nextError)}`);
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

                if (itemId !== parsedProductId) {
                    return item;
                }

                const stock = Number(item.stock ?? 0);
                return {
                    ...item,
                    stock: stock > 0 ? stock - 1 : 0,
                };
            })
        );

        setError("");
        showToast("success", "Prekė įdėta į krepšelį", productName);
        return true;
    }

    async function handleRemoveFromCart(item) {
        if (!item) {
            return false;
        }

        const parsedProductId = Number(item.id);

        if (!Number.isFinite(parsedProductId) || parsedProductId <= 0) {
            setError("Neteisingas krepšelio produkto ID.");
            return false;
        }

        setDeletingCartItemId(item.id);

        const removeFromLocalCart = () => {
            setCartItems((prev) => prev.filter((cartItem) => cartItem.id !== item.id));
            setProducts((prev) =>
                prev.map((product) => {
                    const productId = Number(product.productId ?? product.id);

                    if (productId !== parsedProductId) {
                        return product;
                    }

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
            setError("");
            showToast("success", "Prekė pašalinta iš krepšelio", item.name);
            return true;
        } catch (nextError) {
            setError(`Klaida šalinant iš krepšelio: ${String(nextError.message || nextError)}`);
            return false;
        } finally {
            setDeletingCartItemId(null);
        }
    }

    async function handleChangeCartQuantity(item, nextQuantityRaw) {
        if (!item) {
            return false;
        }

        const parsedProductId = Number(item.id);

        if (!Number.isFinite(parsedProductId) || parsedProductId <= 0) {
            setError("Neteisingas krepšelio produkto ID.");
            return false;
        }

        const currentQuantity = Number(item.quantity ?? 0);
        const nextQuantity = Math.max(0, Number(nextQuantityRaw));

        if (!Number.isFinite(nextQuantity)) {
            return false;
        }

        if (nextQuantity === currentQuantity) {
            return true;
        }

        if (nextQuantity === 0) {
            return handleRemoveFromCart(item);
        }

        const product = products.find(
            (productItem) => Number(productItem.productId ?? productItem.id) === parsedProductId
        );
        const availableStock = Number(product?.stock ?? 0);
        const maxAllowedQuantity = currentQuantity + (Number.isFinite(availableStock) ? availableStock : 0);

        if (nextQuantity > maxAllowedQuantity) {
            setError("Nepakanka likučio pasirinktam kiekiui.");
            return false;
        }

        setUpdatingCartItemId(item.id);

        try {
            const cartResponse = await fetch(`${apiBaseUrl}/api/cart`);

            if (!cartResponse.ok) {
                const failMessage = await cartResponse.text();
                throw new Error(failMessage || `HTTP ${cartResponse.status}`);
            }

            const cartData = await cartResponse.json();
            const cartList = Array.isArray(cartData) ? cartData : cartData?.items ?? [];

            if (!Array.isArray(cartList)) {
                throw new Error("Neteisingas krepšelio atsakymo formatas.");
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
                const patchResponse = await fetch(`${apiBaseUrl}/api/cart/update/quantity/${cartItemIds[0]}`, {
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
                    const deleteResponse = await fetch(`${apiBaseUrl}/api/cart/delete/${extraId}`, {
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

                    if (productId !== parsedProductId) {
                        return productItem;
                    }

                    const stock = Number(productItem.stock ?? 0);
                    return {
                        ...productItem,
                        stock: stock + stockDelta,
                    };
                })
            );

            setError("");
            return true;
        } catch (nextError) {
            setError(`Klaida atnaujinant kiekį: ${String(nextError.message || nextError)}`);
            return false;
        } finally {
            setUpdatingCartItemId(null);
        }
    }

    async function handleClearCart() {
        if (cartItems.length === 0) {
            return true;
        }

        setIsClearingCart(true);
        const previousCartItems = [...cartItems];

        try {
            if (userId > 0) {
                const response = await fetch(`${apiBaseUrl}/api/cart/clear/${userId}`, {
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

                    if (!matchingCartItem) {
                        return product;
                    }

                    const stock = Number(product.stock ?? 0);
                    return {
                        ...product,
                        stock: stock + Number(matchingCartItem.quantity ?? 0),
                    };
                })
            );
            setError("");
            showToast("success", "Krepšelis išvalytas");
            return true;
        } catch (nextError) {
            setError(`Klaida valant krepšelį: ${String(nextError.message || nextError)}`);
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

    function resetCatalogFilters() {
        setCategoryFilter("all");
        setInventoryFilter("all");
        setPriceFilter("all");
        setSortOption("featured");
        setSearchQuery("");
    }

    function clearFilterById(id) {
        if (id === "search") {
            setSearchQuery("");
        }

        if (id === "category") {
            setCategoryFilter("all");
        }

        if (id === "inventory") {
            setInventoryFilter("all");
        }

        if (id === "price") {
            setPriceFilter("all");
        }

        if (id === "sort") {
            setSortOption("featured");
        }
    }

    return {
        pathname,
        navigate,
        swaggerUrl,
        toast,
        showToast,
        error,
        clearError,
        isLoadingProducts,
        shouldShowStartupLoader,
        products,
        catalogProducts,
        featuredProducts,
        filteredProducts,
        selectedProduct,
        activeProductCount,
        categoryBreakdown,
        activeFilterChips,
        isLoggedIn,
        pendingEmail,
        userName,
        isAdmin,
        canAccessAdmin,
        adminError,
        adminLoading,
        userId,
        cartItems,
        cartCount,
        cartTotal,
        deletingCartItemId,
        updatingCartItemId,
        isClearingCart,
        searchQuery,
        setSearchQuery,
        categoryFilter,
        setCategoryFilter,
        inventoryFilter,
        setInventoryFilter,
        priceFilter,
        setPriceFilter,
        sortOption,
        setSortOption,
        resetCatalogFilters,
        clearFilterById,
        loadProducts,
        getQuantityOptions,
        handleRegistered,
        handleLogout,
        handleAdminLogout,
        handleAdminLoginCheck,
        handleAdminCreateProduct,
        handleAdminUpdateProduct,
        handleAdminDeleteProduct,
        handleAddToCart,
        handleRemoveFromCart,
        handleChangeCartQuantity,
        handleClearCart,
        onLoginSuccess(payload) {
            const nextUser = typeof payload === "object" && payload !== null ? payload : null;
            const nextUserName = typeof payload === "string" ? payload : nextUser?.name;
            const nextUserId = nextUser?.userId ?? nextUser?.id ?? null;
            const nextIsAdmin = toBooleanFlag(nextUser?.isAdmin ?? nextUser?.admin);

            saveUserName(nextUserName);
            saveUserId(nextUserId);
            saveAdminSession(nextIsAdmin);
            setAdminError("");
            setPendingEmail("");
            localStorage.removeItem("myshop_pending_email");
            showToast("success", `Sveiki, ${nextUserName || "vartotojau"}`);
        },
        derived: {
            freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
            visibleProductCount: filteredProducts.length,
            totalProductCount: catalogProducts.length,
            newArrivalCount: catalogProducts.filter((product) => product.isNewArrival).length,
            lowStockCount: catalogProducts.filter((product) => {
                const stock = Number(product.stock ?? 0);
                return stock > 0 && stock <= 3;
            }).length,
            cartSummaryLabel:
                cartTotal >= FREE_SHIPPING_THRESHOLD
                    ? "Nemokamas pristatymas jau taikomas"
                    : `Iki nemokamo pristatymo liko ${formatPrice(FREE_SHIPPING_THRESHOLD - cartTotal)}`,
        },
    };
}
