"use client";
import React from "react";
import { motion } from "framer-motion";

export default function Paper({ children, className = "", variant = "default", rotate = 0, noPadding = false }) {
  return (
    <motion.div
      className={`chain-card relative ${noPadding ? "" : "p-6"} ${className}`}
      style={{
        rotate: `${rotate * 0.3}deg`,
      }}
      whileHover={{ rotate: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
    >
      
      {variant === "stacked" && (
        <>
          <div
            className="absolute inset-x-0 top-0 h-px rounded-t-xl"
            style={{ background: "linear-gradient(90deg, transparent, rgba(37, 99, 235,0.4), transparent)" }}
          />
          <div
            className="absolute -bottom-1 -left-1 -right-1 h-full rounded-xl -z-10"
            style={{
              background: "var(--color-glass-hover)",
              border: "1px solid var(--color-glass-border)",
            }}
          />
        </>
      )}
      {variant === "pinned" && (
        <div
          className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full z-10"
          style={{
            background: "#2563eb",
            boxShadow: "0 0 10px rgba(37, 99, 235,0.6)",
          }}
        />
      )}
      {children}
    </motion.div>
  );
}
