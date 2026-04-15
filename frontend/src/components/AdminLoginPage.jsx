import { useState } from "react";

export default function AdminLoginPage({ onAdminLogin, onNavigate, loading = false, error = "" }) {
    const [localMessage, setLocalMessage] = useState("");

    async function handleAdminCheck(e) {
        e.preventDefault();
        setLocalMessage("");

        const success = await onAdminLogin?.();
        if (success) {
            setLocalMessage("Admin prieiga patvirtinta.");
        }
    }

    return (
        <div className="mx-auto max-w-md rounded-2xl border border-slate-700 bg-slate-800/70 p-6 shadow-lg">
            <h2 className="text-2xl font-bold text-white">Admin prisijungimas</h2>
            <p className="mt-2 text-sm text-slate-400">
                Patikra vykdoma per endpointa <span className="font-mono text-slate-200">GET /api/users/isadmin</span>
            </p>

            <form className="mt-5 space-y-4" onSubmit={handleAdminCheck}>
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-xl border border-amber-500 bg-amber-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-amber-500 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {loading ? "Tikrinama..." : "Patikrinti admin teises"}
                </button>
            </form>

            {localMessage && (
                <div className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-300">
                    {localMessage}
                </div>
            )}

            {error && (
                <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
                    Klaida: {error}
                </div>
            )}

            <button
                className="mt-4 w-full rounded-xl border border-slate-600 bg-slate-700 px-4 py-2 text-sm text-white transition hover:bg-slate-600"
                onClick={() => onNavigate?.("/")}
            >
                Grizti i parduotuve
            </button>
        </div>
    );
}
