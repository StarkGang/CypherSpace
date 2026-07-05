"use client";
import React from "react";

export default function Badge({ 
  children, 
  variant = "neutral", 
  className = "" 
}) {
  const variantMap = {
    success: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
    warning: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20",
    error: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
    neutral: "bg-[var(--color-border-subtle)] text-[var(--color-text-secondary)] border-[var(--color-border-subtle)]",
    info: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  };

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${variantMap[variant]} ${className}`}>
      {children}
    </span>
  );
}

