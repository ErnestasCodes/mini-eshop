export function cn(...parts) {
    return parts.filter(Boolean).join(" ");
}

export function getApiBaseUrl() {
    return String(import.meta.env.VITE_API_BASE_URL ?? "").replace(/\/$/, "");
}

export function getSwaggerUrl() {
    const base = getApiBaseUrl();
    return base ? `${base}/swagger/index.html` : "/swagger/index.html";
}
