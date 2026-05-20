import { cx } from "./cx";

const tones = {
  neutral:
    "bg-[var(--surface-2)] text-[var(--text-secondary)] border-[var(--border-default)]",
  brand:
    "bg-[var(--brand-soft)] text-[var(--brand)] border-[var(--brand-soft-strong)]",
  success:
    "bg-[var(--success-soft)] text-[var(--success)] border-[var(--success-border)]",
  warning:
    "bg-[var(--warning-soft)] text-[var(--warning)] border-[var(--warning-border)]",
  danger:
    "bg-[var(--danger-soft)] text-[var(--danger)] border-[var(--danger-border)]",
  info:
    "bg-[var(--info-soft)] text-[var(--info)] border-[var(--info-border)]",
  yoto:
    "bg-[var(--yoto-soft)] text-[var(--yoto)] border-[var(--yoto-soft)]",
  ipod:
    "bg-[var(--ipod-soft)] text-[var(--ipod)] border-[var(--ipod-soft)]",
};

export default function Badge({
  tone = "neutral",
  size = "sm",
  icon,
  className = "",
  children,
}) {
  const sz = size === "xs" ? "text-[10px] px-1.5 py-0.5" : "text-xs px-2 py-0.5";
  return (
    <span
      className={cx(
        "inline-flex items-center gap-1 font-medium rounded-[var(--r-pill)] border",
        sz,
        tones[tone],
        className,
      )}
    >
      {icon}
      {children}
    </span>
  );
}

const STATUS = {
  pending:     { tone: "warning", label: "Pending",     dot: "var(--status-pending-dot)" },
  approved:    { tone: "info",    label: "Approved",    dot: "var(--status-approved-dot)" },
  downloading: { tone: "brand",   label: "Downloading", dot: "var(--status-downloading-dot)", pulse: true },
  completed:   { tone: "success", label: "Ready",       dot: "var(--status-ready-dot)" },
  failed:      { tone: "danger",  label: "Failed",      dot: "var(--status-failed-dot)" },
  rejected:    { tone: "neutral", label: "Rejected",    dot: "var(--status-rejected-dot)" },
};

export function StatusBadge({ status, size = "sm" }) {
  const cfg = STATUS[status] ?? STATUS.pending;
  return (
    <Badge tone={cfg.tone} size={size}>
      <span
        aria-hidden
        className={cx(
          "w-1.5 h-1.5 rounded-full",
          cfg.pulse && "animate-pulse",
        )}
        style={{ background: cfg.dot }}
      />
      {cfg.label}
    </Badge>
  );
}
