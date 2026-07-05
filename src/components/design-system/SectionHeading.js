"use client";
import React from "react";
import { motion } from "framer-motion";

export default function SectionHeading({
  title,
  subtitle,
  metadata,
  className = "",
  align = "left",
}) {
  const textAlign = { left: "text-left items-start", center: "text-center items-center" }[align] || "text-left items-start";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={`flex flex-col gap-3 ${textAlign} ${className}`}
    >
      {metadata && (
        <div className="flex items-center gap-2">
          <div
            className="w-5 h-px"
            style={{ background: "linear-gradient(90deg, #2563eb, transparent)" }}
          />
          <span
            className="text-xs font-mono font-bold tracking-[0.18em] uppercase"
            style={{ color: "#2563eb" }}
          >
            {metadata}
          </span>
        </div>
      )}

      <h2
        className="font-display font-bold leading-tight"
        style={{
          fontSize: "clamp(1.8rem, 4vw, 3rem)",
          letterSpacing: "-0.025em",
          color: "var(--color-text-primary)",
        }}
      >
        {title}
      </h2>

      {subtitle && (
        <p
          className="text-base leading-relaxed max-w-xl"
          style={{ color: "var(--color-text-secondary)" }}
        >
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
