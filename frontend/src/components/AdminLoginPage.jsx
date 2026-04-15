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
        <div className="mx-auto max-w-4xl overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm lg:grid lg:grid-cols-[minmax(260px,0.85fr)_minmax(0,1.15fr)]">
            <div className="bg-slate-900 p-8 text-white">
                <div className="text-xs uppercase tracking-[0.22em] text-slate-300">Valdymo zona</div>
                <h2 className="mt-4 text-3xl font-semibold">Admin prisijungimas</h2>
                <p className="mt-4 text-sm leading-7 text-slate-300">
                    Cia paliktas paprastas administravimo ekranas be tamsaus demo stiliaus.
                </p>
            </div>

            <div className="p-8">
                <h3 className="text-2xl font-semibold text-slate-900">Patvirtinkite teises</h3>
                <p className="mt-2 text-sm text-slate-500">
                    Paspaudus mygtuka bus patikrinta, ar dabartine sesija turi admin prieiga.
                </p>

                <form className="mt-8 space-y-4" onSubmit={handleAdminCheck}>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
                    >
                        {loading ? "Tikrinama..." : "Patikrinti admin teises"}
                    </button>
                </form>

                {localMessage && (
                    <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
                        {localMessage}
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
