"use client";

import { useEffect, useState } from "react";
import { formatCurrency } from "@/lib/mock-data";

type SpendingChartProps = {
  data: { month: string; amount: number }[];
};

export function SpendingChart({ data }: SpendingChartProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const max = Math.max(...data.map((d) => d.amount));
  const chartHeight = 120;

  return (
    <div className="flex items-end gap-2 sm:gap-3 h-[160px] pt-4">
      {data.map((item, i) => {
        const height = (item.amount / max) * chartHeight;
        const isLast = i === data.length - 1;

        return (
          <div key={item.month} className="flex-1 flex flex-col items-center gap-2">
            {/* Amount label */}
            <span
              className={`text-[10px] sm:text-xs tabular-nums font-medium transition-all duration-500 ${
                isLast ? "text-navy font-bold" : "text-text-muted"
              }`}
              style={{
                opacity: mounted ? 1 : 0,
                transitionDelay: `${i * 80 + 400}ms`,
              }}
            >
              {formatCurrency(item.amount)}
            </span>

            {/* Bar */}
            <div
              className={`w-full rounded-t-lg transition-all duration-700 ease-out ${
                isLast ? "bg-gold" : "bg-navy/10"
              }`}
              style={{
                height: mounted ? `${height}px` : "0px",
                transitionDelay: `${i * 80}ms`,
              }}
            />

            {/* Month label */}
            <span
              className={`text-[10px] sm:text-xs font-medium ${
                isLast ? "text-navy" : "text-text-muted"
              }`}
            >
              {item.month}
            </span>
          </div>
        );
      })}
    </div>
  );
}
