"use client";

import { useEffect, useState } from "react";

type DataUsageRingProps = {
  used: number;
  total: number | null; // null = unlimited
  size?: number;
  variant?: "light" | "dark"; // dark = on navy background
};

export function DataUsageRing({ used, total, size = 180, variant = "light" }: DataUsageRingProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const isTiny = size <= 64;
  const isCompact = size < 100;
  const strokeWidth = isCompact ? 6 : 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const percentage = total ? Math.min((used / total) * 100, 100) : Math.min(used * 2.5, 80);
  const offset = circumference - (percentage / 100) * circumference;
  const center = size / 2;

  const isDark = variant === "dark";
  const primaryText = isDark ? "text-white" : "text-navy";
  const mutedText = isDark ? "text-white/50" : "text-text-muted";
  const trackClass = isDark ? "text-white/10" : "text-border/30";

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <defs>
          <linearGradient id={`ringGrad-${size}-${variant}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f5c518" />
            <stop offset="60%" stopColor="#d4a810" />
            <stop offset="100%" stopColor={isDark ? "#f5c518" : "#1a2b4a"} />
          </linearGradient>
        </defs>

        {/* Track */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className={trackClass}
        />

        {/* Progress */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={`url(#ringGrad-${size}-${variant})`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={mounted ? offset : circumference}
          style={{
            transition: "stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1) 0.3s",
          }}
        />
      </svg>

      {/* Center text */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center"
        style={{
          opacity: mounted ? 1 : 0,
          transform: mounted ? "scale(1)" : "scale(0.8)",
          transition: "all 0.6s ease-out 0.8s",
        }}
      >
        {isTiny ? (
          <span className={`font-heading text-[11px] font-bold ${primaryText} tabular-nums leading-none`}>
            {used % 1 === 0 ? used : used.toFixed(1).replace(".", ",")}
            <span className={`text-[8px] font-medium ${mutedText}`}> GB</span>
          </span>
        ) : isCompact ? (
          <>
            <span className={`font-heading text-sm font-bold ${primaryText} tabular-nums leading-none`}>
              {used % 1 === 0 ? used : used.toFixed(1).replace(".", ",")}
            </span>
            <span className={`text-[9px] ${mutedText} leading-tight mt-0.5`}>
              {total ? `/ ${total}` : "GB"}
            </span>
          </>
        ) : (
          <>
            <span className={`text-[10px] font-semibold ${mutedText} uppercase tracking-widest`}>
              Brukt
            </span>
            <span className={`font-heading text-3xl font-bold ${isDark ? "text-gold" : "text-navy"} tabular-nums leading-none mt-1`}>
              {used % 1 === 0 ? used : used.toFixed(1).replace(".", ",")}
            </span>
            <span className={`text-xs ${mutedText} mt-1`}>
              {total ? `av ${total} GB` : "GB denne mnd"}
            </span>
          </>
        )}
      </div>
    </div>
  );
}
