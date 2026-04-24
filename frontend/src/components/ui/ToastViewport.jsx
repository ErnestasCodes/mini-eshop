import { cn } from "../../lib/utils";

export default function ToastViewport({ toast }) {
    if (!toast) {
        return null;
    }

    const tone =
        toast.type === "error"
            ? "border-rose-200 bg-rose-50 text-rose-800"
            : "border-emerald-200 bg-emerald-50 text-emerald-800";

    return (
        <div className="pointer-events-none fixed bottom-5 right-5 z-[140] w-[min(92vw,24rem)]">
            <div className={cn("rounded-[26px] border px-5 py-4 shadow-[var(--shadow-soft)] backdrop-blur", tone)}>
                <div className="text-sm font-semibold">{toast.title}</div>
                {toast.message ? <div className="mt-1 text-sm leading-6">{toast.message}</div> : null}
            </div>
        </div>
    );
}
