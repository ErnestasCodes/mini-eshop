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
        <div className="mx-auto max-w-5xl overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm lg:grid lg:grid-cols-[minmax(280px,0.9fr)_minmax(0,1.1fr)]">
            <div className="border-b border-slate-200 bg-slate-50 p-8 lg:border-b-0 lg:border-r">
                <div className="text-xs uppercase tracking-[0.22em] text-slate-500">Nauja paskyra</div>
                <h2 className="mt-4 text-3xl font-semibold text-slate-900">Registracija</h2>
                <p className="mt-4 text-sm leading-7 text-slate-600">
                    Susikurkite paskyra, kad parduotuve veiktu kaip normalus pirkimo srautas:
                    prisijungimas, krepselis ir uzsakymo pradzia vienoje vietoje.
                </p>
            </div>

            <div className="p-8">
                <h3 className="text-2xl font-semibold text-slate-900">Jusu duomenys</h3>
                <p className="mt-2 text-sm text-slate-500">Uzpildykite laukus ir susikurkite paskyra.</p>

                <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="name">
                            Vardas
                        </label>
                        <input
                            id="name"
                            className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
                            placeholder="Iveskite varda"
                            value={form.name}
                            onChange={(e) => updateField("name", e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="email">
                            El. pastas
                        </label>
                        <input
                            id="email"
                            type="email"
                            className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
                            placeholder="vardas@email.com"
                            value={form.email}
                            onChange={(e) => updateField("email", e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="password">
                            Slaptazodis
                        </label>
                        <input
                            id="password"
                            type="password"
                            className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
                            placeholder="Iveskite slaptazodi"
                            value={form.password}
                            onChange={(e) => updateField("password", e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
                    >
                        {loading ? "Registruojama..." : "Registruotis"}
                    </button>
                </form>

                {error && (
                    <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                        Klaida: {error}
                    </div>
                )}

                {success && (
                    <div className="mt-5 rounded-2xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
                        {success}
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
