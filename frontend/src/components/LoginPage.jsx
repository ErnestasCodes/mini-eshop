import { useState } from "react";

import AuthSplitLayout from "./ui/AuthSplitLayout";
import Button from "./ui/Button";
import Field from "./ui/Field";

const BENEFITS = ["Išsaugotas krepšelis", "Greitesnis apsipirkimas", "Patogus grįžimas prie prekių"];

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

export default function LoginPage({ onLoginSuccess, onNavigate, defaultEmail = "" }) {
    const [email, setEmail] = useState(defaultEmail);
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(event) {
        event.preventDefault();
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

            const userData = data?.user ?? data ?? null;
            const resolvedName =
                userData?.name ||
                userData?.Name ||
                userData?.userName ||
                userData?.username ||
                userData?.fullName ||
                email.split("@")[0];
            const resolvedUserId = Number(userData?.userId ?? userData?.id ?? userData?.Id);
            const resolvedIsAdmin = toBooleanFlag(userData?.isAdmin ?? userData?.IsAdmin);

            onLoginSuccess?.({
                name: resolvedName,
                userId: Number.isFinite(resolvedUserId) && resolvedUserId > 0 ? resolvedUserId : null,
                isAdmin: resolvedIsAdmin,
            });
            setMessage("Prisijungimas sėkmingas.");
            onNavigate?.("/");
        } catch (nextError) {
            setError(String(nextError.message || nextError));
        } finally {
            setLoading(false);
        }
    }

    return (
        <AuthSplitLayout
            eyebrow="Kliento zona"
            title="Prisijunkite prie savo paskyros"
            description="Tęskite apsipirkimą, peržiūrėkite pasirinktus modelius ir grįžkite prie krepšelio vienu paspaudimu."
            highlights={BENEFITS}
            insightTitle="Patogiau kasdienai"
            insightBody="Prisijungus lengviau grįžti prie patikusių modelių ir tęsti apsipirkimą bet kuriuo metu."
        >
            <div className="max-w-lg">
                <div className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--foreground-subtle)]">Kliento paskyra</div>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--foreground-strong)]">Įveskite savo duomenis</h2>
                <p className="mt-3 text-sm leading-7 text-[var(--foreground-muted)]">
                    Prisijunkite, kad galėtumėte tęsti apsipirkimą ir valdyti krepšelį.
                </p>

                <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
                    <Field
                        id="login-email"
                        type="email"
                        label="El. paštas"
                        placeholder="vardas@pastas.lt"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        required
                    />
                    <Field
                        id="login-password"
                        type="password"
                        label="Slaptažodis"
                        placeholder="Įveskite slaptažodį"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        required
                    />
                    <Button type="submit" size="lg" block disabled={loading}>
                        {loading ? "Jungiama..." : "Prisijungti"}
                    </Button>
                </form>

                {message ? (
                    <div className="mt-5 rounded-[24px] border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
                        {message}
                    </div>
                ) : null}

                {error ? (
                    <div className="mt-5 rounded-[24px] border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
                        Klaida: {error}
                    </div>
                ) : null}

                <Button variant="secondary" size="lg" block className="mt-5" onClick={() => onNavigate?.("/")}>
                    Grįžti į pradžią
                </Button>
            </div>
        </AuthSplitLayout>
    );
}
