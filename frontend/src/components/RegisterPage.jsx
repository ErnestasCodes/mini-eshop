import { useMemo, useState } from "react";

export default function RegisterPage({ onRegistered, onNavigate }) {
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const endpoint = useMemo(() => {
        const base = (import.meta.env.VITE_API_BASE_URL ?? "").replace(/\/$/, "");
        return `${base}/api/users`;
    }, []);

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);

        try {
            const response = await fetch(endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: form.name,
                    email: form.email,
                    password: form.password,
                }),
            });

            if (!response.ok) {
                const message = await response.text();
                throw new Error(message || `HTTP ${response.status}`);
            }

            const registeredName = form.name.trim();
            const registeredEmail = form.email.trim();
            setSuccess("Registracija sekminga. Perkeliama i prisijungima...");
            onRegistered?.({ name: registeredName, email: registeredEmail });
            setForm({ name: "", email: "", password: "" });
            onNavigate?.("/login");
        } catch (err) {
            setError(String(err.message || err));
        } finally {
            setLoading(false);
        }
    }

    function updateField(key, value) {
        setForm((prev) => ({ ...prev, [key]: value }));
    }

    return (
        <div className="mx-auto max-w-md rounded-2xl border border-slate-700 bg-slate-800/70 p-6 shadow-lg">
            <h2 className="text-2xl font-bold text-white">Registracija</h2>
            <p className="mt-2 text-sm text-slate-400">
                API endpoint: <span className="font-mono text-slate-200">POST {endpoint}</span>
            </p>

            <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
                <div>
                    <label className="mb-1 block text-sm text-slate-300" htmlFor="name">
                        Vardas
                    </label>
                    <input
                        id="name"
                        className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Ivesk varda"
                        value={form.name}
                        onChange={(e) => updateField("name", e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label className="mb-1 block text-sm text-slate-300" htmlFor="email">
                        El. pastas
                    </label>
                    <input
                        id="email"
                        type="email"
                        className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="vardas@email.com"
                        value={form.email}
                        onChange={(e) => updateField("email", e.target.value)}
                    />
                </div>

                <div>
                    <label className="mb-1 block text-sm text-slate-300" htmlFor="password">
                        Slaptazodis
                    </label>
                    <input
                        id="password"
                        type="password"
                        className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Ivesk slaptazodi"
                        value={form.password}
                        onChange={(e) => updateField("password", e.target.value)}
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-xl border border-indigo-500 bg-indigo-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {loading ? "Registruojama..." : "Registruotis"}
                </button>
            </form>

            {error && (
                <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
                    Klaida: {error}
                </div>
            )}

            {success && (
                <div className="mt-4 rounded-xl border border-green-500/30 bg-green-500/10 p-3 text-sm text-green-300">
                    {success}
                </div>
            )}
        </div>
    );
}
