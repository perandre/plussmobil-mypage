"use client";

import { useEffect, useState } from "react";

type UsageBarProps = {
  label?: string;
  used: number;
  total: number;
  unit?: string;
  color?: string;
  delay?: number;
};

export function UsageBar({
  label,
  used,
  total,
  unit,
  color = "bg-gold",
  delay = 0,
}: UsageBarProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  const pct = Math.min((used / total) * 100, 100);

  return (
    <div className="space-y-1.5">
      {(label || unit) && (
        <div className="flex items-center justify-between text-sm">
          {label && <span className="font-medium text-text">{label}</span>}
          {unit && (
            <span className="text-text-muted tabular-nums">
              {used.toLocaleString("nb-NO")} / {total.toLocaleString("nb-NO")} {unit}
            </span>
          )}
        </div>
      )}
      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${color} transition-all duration-1000 ease-out`}
          style={{ width: mounted ? `${pct}%` : "0%" }}
        />
      </div>
    </div>
  );
}
