import { cx } from "./cx";

export default function Card({
  as: As = "div",
  padding = "md",
  className = "",
  children,
  ...rest
}) {
  const pad = {
    none: "",
    sm: "p-3",
    md: "p-4 sm:p-5",
    lg: "p-6",
  }[padding];

  return (
    <As
      className={cx(
        "bg-[var(--surface)] border border-[var(--border-subtle)] rounded-[var(--r-lg)]",
        pad,
        className,
      )}
      {...rest}
    >
      {children}
    </As>
  );
}

export function SectionHeader({ title, description, action, className = "" }) {
  return (
    <div className={cx("flex items-start justify-between gap-3 mb-4", className)}>
      <div className="min-w-0">
        <h2 className="text-base font-semibold text-[var(--text-primary)] leading-tight">
          {title}
        </h2>
        {description && (
          <p className="text-sm text-[var(--text-muted)] mt-0.5">
            {description}
          </p>
        )}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}
