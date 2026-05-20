import { cx } from "../ui";

const TONE = {
  brand: "text-[var(--brand)] bg-[var(--brand-soft)]",
  warning: "text-[var(--warning)] bg-[var(--warning-soft)]",
  info: "text-[var(--info)] bg-[var(--info-soft)]",
  success: "text-[var(--success)] bg-[var(--success-soft)]",
  danger: "text-[var(--danger)] bg-[var(--danger-soft)]",
  neutral: "text-[var(--text-secondary)] bg-[var(--surface-2)]",
};

export default function SummaryCounters({ items, activeKey, onSelect }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
      {items.map((it) => {
        const active = it.key === activeKey;
        const interactive = !!onSelect;
        const Tag = interactive ? "button" : "div";
        return (
          <Tag
            key={it.key}
            onClick={interactive ? () => onSelect(it.key) : undefined}
            className={cx(
              "text-left rounded-[var(--r-lg)] border p-3 transition-colors",
              active
                ? "border-[var(--brand)] bg-[var(--brand-soft)]"
                : "border-[var(--border-subtle)] bg-[var(--surface)]",
              interactive && "hover:border-[var(--border-default)]",
            )}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide">
                {it.label}
              </span>
              {it.icon && (
                <span
                  className={cx(
                    "inline-flex items-center justify-center w-6 h-6 rounded-[var(--r-sm)]",
                    TONE[it.tone || "neutral"],
                  )}
                >
                  {it.icon}
                </span>
              )}
            </div>
            <p className="text-2xl font-bold text-[var(--text-primary)] tabular-nums mt-1 leading-none">
              {it.value}
            </p>
            {it.hint && (
              <p className="text-[11px] text-[var(--text-muted)] mt-1">{it.hint}</p>
            )}
          </Tag>
        );
      })}
    </div>
  );
}
