import { cx } from "./cx";

const tones = {
  neutral: "text-[var(--text-primary)]",
  brand: "text-[var(--brand)]",
  success: "text-[var(--success)]",
  warning: "text-[var(--warning)]",
  danger: "text-[var(--danger)]",
  info: "text-[var(--info)]",
};

export default function KpiCard({
  label,
  value,
  hint,
  tone = "neutral",
  trend,
  icon,
  className = "",
}) {
  return (
    <div
      className={cx(
        "bg-[var(--surface)] border border-[var(--border-subtle)] rounded-[var(--r-lg)] p-4 sm:p-5",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <span className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide">
          {label}
        </span>
        {icon && (
          <span className={cx("flex-shrink-0", tones[tone])}>{icon}</span>
        )}
      </div>
      <div className={cx("text-3xl font-bold tabular-nums leading-none", tones[tone])}>
        {value}
      </div>
      {(hint || trend) && (
        <div className="mt-2 flex items-center gap-2 text-xs text-[var(--text-muted)]">
          {trend && (
            <span
              className={cx(
                "inline-flex items-center gap-0.5 font-medium",
                trend.direction === "up" && "text-[var(--success)]",
                trend.direction === "down" && "text-[var(--danger)]",
              )}
            >
              {trend.direction === "up" ? "↑" : trend.direction === "down" ? "↓" : "→"}{" "}
              {trend.label}
            </span>
          )}
          {hint && <span>{hint}</span>}
        </div>
      )}
    </div>
  );
}
