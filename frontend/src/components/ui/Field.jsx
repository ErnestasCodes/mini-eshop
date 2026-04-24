import { fieldClassName } from "./fieldStyles";

export default function Field({
    as = "input",
    label,
    hint,
    error,
    className,
    options = [],
    id,
    ...props
}) {
    const Component = as;

    return (
        <label className="block">
            {label && <span className="mb-2 block text-sm font-medium text-[var(--foreground-strong)]">{label}</span>}
            <Component id={id} className={fieldClassName(className)} {...props}>
                {as === "select"
                    ? options.map((option) => (
                          <option key={option.id} value={option.id}>
                              {option.label}
                          </option>
                      ))
                    : props.children}
            </Component>
            {hint && !error && <span className="mt-2 block text-sm text-[var(--foreground-muted)]">{hint}</span>}
            {error && <span className="mt-2 block text-sm text-rose-700">{error}</span>}
        </label>
    );
}
