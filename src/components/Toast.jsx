import { useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, AlertCircle, Info } from "lucide-react";
import { cx } from "./ui/cx";

const STYLE = {
  success: { icon: CheckCircle, bg: "var(--success-soft)", border: "var(--success-border)", color: "var(--success)" },
  error:   { icon: XCircle,     bg: "var(--danger-soft)",  border: "var(--danger-border)",  color: "var(--danger)" },
  warning: { icon: AlertCircle, bg: "var(--warning-soft)", border: "var(--warning-border)", color: "var(--warning)" },
  info:    { icon: Info,        bg: "var(--info-soft)",    border: "var(--info-border)",    color: "var(--info)" },
};

export default function Toast({ message, type = "success", onClose, duration = 3000 }) {
  useEffect(() => {
    if (duration > 0) {
      const t = setTimeout(onClose, duration);
      return () => clearTimeout(t);
    }
  }, [duration, onClose]);

  const cfg = STYLE[type] || STYLE.info;
  const Icon = cfg.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: -16, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -16, scale: 0.96 }}
      role="status"
      className={cx(
        "fixed top-4 right-4 z-[100] flex items-start gap-2.5 px-4 py-3 rounded-[var(--r-lg)] shadow-[var(--shadow-lg)] border max-w-sm",
      )}
      style={{ background: cfg.bg, borderColor: cfg.border }}
    >
      <Icon className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: cfg.color }} />
      <span className="text-sm font-medium text-[var(--text-primary)] flex-1 leading-snug">
        {message}
      </span>
      <button
        onClick={onClose}
        aria-label="Dismiss"
        className="text-[var(--text-muted)] hover:text-[var(--text-primary)] -mr-1 -mt-1 p-1"
      >
        ×
      </button>
    </motion.div>
  );
}
