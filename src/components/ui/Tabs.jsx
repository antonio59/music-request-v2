import { cx } from "./cx";

export default function Tabs({ value, onChange, tabs, className = "" }) {
  return (
    <div
      role="tablist"
      className={cx(
        "flex items-center gap-1 border-b border-[var(--border-subtle)] overflow-x-auto",
        className,
      )}
    >
      {tabs.map((tab) => {
        const active = tab.value === value;
        return (
          <button
            key={tab.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(tab.value)}
            className={cx(
              "relative inline-flex items-center gap-2 px-3 py-2.5 text-sm font-medium whitespace-nowrap transition-colors -mb-px border-b-2",
              active
                ? "text-[var(--brand)] border-[var(--brand)]"
                : "text-[var(--text-muted)] border-transparent hover:text-[var(--text-primary)]",
            )}
          >
            {tab.icon}
            {tab.label}
            {tab.count != null && tab.count > 0 && (
              <span
                className={cx(
                  "inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[10px] font-semibold rounded-full",
                  active
                    ? "bg-[var(--brand)] text-[var(--brand-on)]"
                    : "bg-[var(--surface-2)] text-[var(--text-secondary)] border border-[var(--border-default)]",
                )}
              >
                {tab.count > 99 ? "99+" : tab.count}
              </span>
            )}
            {tab.urgent && (
              <span
                aria-hidden
                className="w-1.5 h-1.5 rounded-full bg-[var(--danger-solid)]"
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
