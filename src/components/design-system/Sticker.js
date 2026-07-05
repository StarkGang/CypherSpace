"use client";
import React from "react";

const colorMap = {
  pink:   { bg: "rgba(244,114,182,0.12)", border: "rgba(244,114,182,0.35)", text: "#f472b6" },
  lime:   { bg: "rgba(37,99,235,0.12)",   border: "rgba(37,99,235,0.4)",    text: "#2563eb" },
  yellow: { bg: "rgba(251,191,36,0.12)",  border: "rgba(251,191,36,0.35)",  text: "#fbbf24" },
  blue:   { bg: "rgba(67,97,238,0.12)",   border: "rgba(67,97,238,0.4)",    text: "#4361ee" },
  purple: { bg: "rgba(124,58,237,0.12)",  border: "rgba(124,58,237,0.4)",   text: "#7c3aed" },
};

const sizeMap = {
  sm: "px-2 py-0.5 text-xs",
  md: "px-3 py-1 text-xs",
  lg: "px-4 py-1.5 text-sm",
};

export default function Sticker({ children, color = "lime", size = "md", className = "", animate = true, peel = false }) {
  const c = colorMap[color] || colorMap.lime;

  return (
    <span
      className={`inline-flex items-center font-mono font-bold rounded-md tracking-wide uppercase transition-all duration-200 ${sizeMap[size]} ${className}`}
      style={{
        background: c.bg,
        border: `1px solid ${c.border}`,
        color: c.text,
        boxShadow: `0 0 8px ${c.border}`,
        letterSpacing: "0.08em",
      }}
    >
      {peel && (
        <span className="mr-1.5" style={{ fontSize: "0.7em", opacity: 0.7 }}>⬡</span>
      )}
      {children}
    </span>
  );
}
