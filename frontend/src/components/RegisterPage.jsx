import { useMemo, useState } from "react";

import AuthSplitLayout from "./ui/AuthSplitLayout";
import Button from "./ui/Button";
import Field from "./ui/Field";

const PROMISES = ["Greita registracija", "Išsaugotas krepšelis", "Patogus apsipirkimas"];

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

    async function handleSubmit(event) {
        event.preventDefault();
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
            setSuccess("Registracija sėkminga. Perkeliama į prisijungimą...");
            onRegistered?.({ name: registeredName, email: registeredEmail });
            setForm({ name: "", email: "", password: "" });
            onNavigate?.("/login");
        } catch (nextError) {
            setError(String(nextError.message || nextError));
        } finally {
            setLoading(false);
        }
    }

    function updateField(key, value) {
        setForm((prev) => ({ ...prev, [key]: value }));
    }

    return (
        <AuthSplitLayout
            eyebrow="Nauja paskyra"
            title="Susikurkite paskyrą"
            description="Išsaugokite savo pasirinkimus ir grįžkite prie mėgstamų modelių kada panorėję."
            highlights={PROMISES}
            insightTitle="Patogus apsipirkimas"
            insightBody="Paskyra leidžia patogiau sekti pasirinktus modelius ir tęsti apsipirkimą savu tempu."
        >
            <div className="max-w-lg">
                <div className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--foreground-subtle)]">Registracija</div>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--foreground-strong)]">Jūsų duomenys</h2>
                <p className="mt-3 text-sm leading-7 text-[var(--foreground-muted)]">
                    Užpildykite laukus ir susikurkite paskyrą.
                </p>

                <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
                    <Field
                        id="register-name"
                        label="Vardas"
                        placeholder="Įveskite vardą"
                        value={form.name}
                        onChange={(event) => updateField("name", event.target.value)}
                        required
                    />
                    <Field
                        id="register-email"
                        type="email"
                        label="El. paštas"
                        placeholder="vardas@pastas.lt"
                        value={form.email}
                        onChange={(event) => updateField("email", event.target.value)}
                        required
                    />
                    <Field
                        id="register-password"
                        type="password"
                        label="Slaptažodis"
                        placeholder="Įveskite slaptažodį"
                        value={form.password}
                        onChange={(event) => updateField("password", event.target.value)}
                        required
                    />

                    <Button type="submit" size="lg" block disabled={loading}>
                        {loading ? "Registruojama..." : "Registruotis"}
                    </Button>
                </form>

                {error ? (
                    <div className="mt-5 rounded-[24px] border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
                        Klaida: {error}
                    </div>
                ) : null}

                {success ? (
                    <div className="mt-5 rounded-[24px] border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
                        {success}
                    </div>
                ) : null}

                <Button variant="secondary" size="lg" block className="mt-5" onClick={() => onNavigate?.("/")}>
                    Grįžti į pradžią
                </Button>
            </div>
        </AuthSplitLayout>
    );
}
