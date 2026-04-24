import { buttonClassName } from "./buttonStyles";

export default function Button({
    as: Component = "button",
    variant = "primary",
    size = "md",
    block = false,
    className,
    type = "button",
    ...props
}) {
    return (
        <Component
            className={buttonClassName({ variant, size, block, className })}
            type={Component === "button" ? type : undefined}
            {...props}
        />
    );
}
