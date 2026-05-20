import { cx } from "./cx";

export default function Skeleton({ className = "", rounded = "md" }) {
  const r = {
    sm: "rounded-[var(--r-sm)]",
    md: "rounded-[var(--r-md)]",
    lg: "rounded-[var(--r-lg)]",
    full: "rounded-full",
  }[rounded];
  return (
    <div
      className={cx(
        "animate-pulse bg-[var(--surface-2)] border border-[var(--border-subtle)]",
        r,
        className,
      )}
    />
  );
}

export function SkeletonRow() {
  return (
    <div className="flex items-center gap-3 p-3 border border-[var(--border-subtle)] rounded-[var(--r-lg)]">
      <Skeleton className="w-10 h-10" rounded="md" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-3 w-2/3" />
        <Skeleton className="h-2 w-1/3" />
      </div>
    </div>
  );
}
