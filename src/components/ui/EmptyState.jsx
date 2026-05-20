import { cx } from "./cx";

export default function EmptyState({
  icon,
  title,
  description,
  action,
  className = "",
}) {
  return (
    <div
      className={cx(
        "flex flex-col items-center justify-center text-center py-10 px-4",
        className,
      )}
    >
      {icon && (
        <div className="w-12 h-12 rounded-[var(--r-lg)] bg-[var(--surface-2)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-muted)] mb-3">
          {icon}
        </div>
      )}
      <h3 className="text-sm font-semibold text-[var(--text-primary)]">
        {title}
      </h3>
      {description && (
        <p className="text-sm text-[var(--text-muted)] mt-1 max-w-sm">
          {description}
        </p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
