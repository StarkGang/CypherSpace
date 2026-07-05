"use client";
import React from "react";

export default function TickerTape({
  items = [],
  color = "teal",
  speed = "normal",
  rotate = 0,
  className = "",
}) {
  const speeds = { slow: "40s", normal: "25s", fast: "14s" };
  const duration = speeds[speed] || "25s";
  const doubled = [...items, ...items];

  return (
    <div
      className={`overflow-hidden py-3 relative ${className}`}
      style={{
        transform: `rotate(${rotate}deg)`,
        background: "var(--color-bg-dark)",
        borderTop: "1px solid var(--color-border-subtle)",
        borderBottom: "1px solid var(--color-border-subtle)",
      }}
    >
      <div
        className="animate-ticker flex whitespace-nowrap"
        style={{ animationDuration: duration }}
      >
        {doubled.map((item, i) => (
          <span key={i} className="flex items-center">
            <span
              className="text-xs font-mono font-bold uppercase tracking-[0.2em] px-6"
              style={{ color: "#2563eb" }}
            >
              {item}
            </span>
            <span
              className="text-xs"
              style={{ color: "rgba(37,99,235,0.35)" }}
            >
              ⬡
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
