import Button from "./Button";

export default function StatusBanner({ title, message, onDismiss, onRetry }) {
    return (
        <div className="rounded-[26px] border border-rose-200 bg-rose-50 px-5 py-4 text-rose-800 shadow-[var(--shadow-xs)]">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <div className="text-sm font-semibold">{title}</div>
                    <p className="mt-1 text-sm leading-6">{message}</p>
                </div>
                <div className="flex flex-wrap gap-3">
                    {onRetry ? (
                        <Button variant="secondary" size="sm" onClick={onRetry}>
                            Bandyti dar kartą
                        </Button>
                    ) : null}
                    {onDismiss ? (
                        <Button variant="ghost" size="sm" onClick={onDismiss}>
                            Uždaryti
                        </Button>
                    ) : null}
                </div>
            </div>
        </div>
    );
}
