import { useState } from "react";

export default function LoginPage({ onLoginSuccess, onNavigate, defaultEmail = "" }) {
    const [email, setEmail] = useState(defaultEmail);
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setMessage("");
        setLoading(true);

        const base = (import.meta.env.VITE_API_BASE_URL ?? "").replace(/\/$/, "");

        try {
            const response = await fetch(`${base}/api/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
            });

            if (!response.ok) {
                const failMessage = await response.text();
                throw new Error(failMessage || `HTTP ${response.status}`);
            }

            const raw = await response.text();
            let data = null;
            try {
                data = raw ? JSON.parse(raw) : null;
            } catch {
                data = null;
            }

            const resolvedName =
                data?.name ||
                data?.userName ||
                data?.username ||
                data?.fullName ||
                email.split("@")[0];
            const resolvedUserId = Number(
                data?.userId ?? data?.id ?? data?.user?.userId ?? data?.user?.id
            );

            onLoginSuccess?.({
                name: resolvedName,
                userId: Number.isFinite(resolvedUserId) && resolvedUserId > 0 ? resolvedUserId : null,
            });
            setMessage("Prisijungimas sekmingas.");
            onNavigate?.("/");
        } catch (err) {
            setError(String(err.message || err));
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="mx-auto max-w-md rounded-2xl border border-slate-700 bg-slate-800/70 p-6 shadow-lg">
            <h2 className="text-2xl font-bold text-white">Prisijungimas</h2>
            <p className="mt-2 text-sm text-slate-400">Ivesk savo duomenis ir prisijunk.</p>

            <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
                <div>
                    <label className="mb-1 block text-sm text-slate-300" htmlFor="login-email">
                        El. pastas
                    </label>
                    <input
                        id="login-email"
                        type="email"
                        className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="vardas@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label className="mb-1 block text-sm text-slate-300" htmlFor="login-password">
                        Slaptazodis
                    </label>
                    <input
                        id="login-password"
                        type="password"
                        className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Ivesk slaptazodi"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-xl border border-indigo-500 bg-indigo-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-indigo-500"
                >
                    {loading ? "Jungiama..." : "Prisijungti"}
                </button>
            </form>

            {message && (
                <div className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-300">
                    {message}
                </div>
            )}
            {error && (
                <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
                    Klaida: {error}
                </div>
            )}

            <button
                className="mt-4 w-full rounded-xl border border-slate-600 bg-slate-700 px-4 py-2 text-sm text-white transition hover:bg-slate-600"
                onClick={() => {
                    onNavigate?.("/");
                }}
            >
                Grizti i pradini puslapi
            </button>
        </div>
    );
}
