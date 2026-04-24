import AuthSplitLayout from "./ui/AuthSplitLayout";
import Button from "./ui/Button";

export default function AdminLoginPage({
    isLoggedIn = false,
    isAdmin = false,
    userName = "",
    onAdminLogin,
    onNavigate,
    error = "",
}) {
    const title = !isLoggedIn
        ? "Prisijunkite prie valdymo zonos"
        : "Prieiga prie valdymo nesuteikta";
    const description = !isLoggedIn
        ? "Valdymo puslapis pasiekiamas tik prisijungusiam vartotojui, kurio paskyros isAdmin reikšmė yra true."
        : `Paskyra ${userName ? `"${userName}" ` : ""}neturi administratoriaus teisių, todėl valdymas nepasiekiamas.`;

    return (
        <AuthSplitLayout
            eyebrow="Valdymas"
            title={title}
            description={description}
            highlights={["Tik administratoriams", "Privalomas prisijungimas", "Prieiga pagal isAdmin"]}
            insightTitle="Mono Studio"
            insightBody="Produktų valdymas rodomas tik tam vartotojui, kuris yra prisijungęs ir pažymėtas kaip administratorius."
        >
            <div className="max-w-lg">
                <div className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--foreground-subtle)]">
                    Administravimas
                </div>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--foreground-strong)]">
                    {!isLoggedIn ? "Pirmiausia prisijunkite" : "Ši paskyra negali atidaryti valdymo"}
                </h2>
                <p className="mt-3 text-sm leading-7 text-[var(--foreground-muted)]">
                    {!isLoggedIn
                        ? "Prisijunkite su administratoriaus paskyra ir tada atsidarys produktų valdymas."
                        : "Jei turi būti administratoriaus teisės, jos turi būti nustatytos jūsų paskyros isAdmin lauke."}
                </p>

                {!isLoggedIn ? (
                    <div className="mt-8">
                        <Button type="button" size="lg" block onClick={() => onAdminLogin?.()}>
                            Prisijungti
                        </Button>
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
