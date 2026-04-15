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
        <div className="mx-auto max-w-5xl overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm lg:grid lg:grid-cols-[minmax(280px,0.9fr)_minmax(0,1.1fr)]">
            <div className="bg-slate-900 p-8 text-white">
                <div className="text-xs uppercase tracking-[0.22em] text-slate-300">Kliento zona</div>
                <h2 className="mt-4 text-3xl font-semibold">Prisijungimas</h2>
                <p className="mt-4 text-sm leading-7 text-slate-300">
                    Prisijunkite prie savo paskyros ir toliau pildykite krepseli iprastu parduotuves srautu.
                </p>
            </div>

            <div className="p-8">
                <h3 className="text-2xl font-semibold text-slate-900">Iveskite duomenis</h3>
                <p className="mt-2 text-sm text-slate-500">Naudokite savo el. pasta ir slaptazodi.</p>

                <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="login-email">
                            El. pastas
                        </label>
                        <input
                            id="login-email"
                            type="email"
                            className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
                            placeholder="vardas@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="login-password">
                            Slaptazodis
                        </label>
                        <input
                            id="login-password"
                            type="password"
                            className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
                            placeholder="Iveskite slaptažodį"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
                    >
                        {loading ? "Jungiama..." : "Prisijungti"}
                    </button>
                </form>

                {message && (
                    <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
                        {message}
                    </div>
                )}
                {error && (
                    <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                        Klaida: {error}
                    </div>
                )}

                <button
                    className="mt-5 w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                    onClick={() => onNavigate?.("/")}
                >
                    Grizti i parduotuve
                </button>
            </div>
        </div>
    );
}
