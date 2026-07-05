"use client";
import React from "react";
import { motion } from "framer-motion";

export default function Button({
  children,
  href,
  onClick,
  type = "button",
  variant = "primary",
  size = "md",
  className = "",
  disabled = false,
  fullWidth = false,
  icon,
  iconPosition = "left",
}) {
  const base = `inline-flex items-center justify-center font-semibold transition-all duration-300
    focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:ring-offset-2 focus:ring-offset-transparent
    disabled:opacity-40 disabled:cursor-not-allowed rounded-xl
    ${fullWidth ? "w-full" : ""}`;

  const sizes = {
    sm: "px-4 py-2 text-sm gap-1.5",
    md: "px-5 py-2.5 text-sm gap-2",
    lg: "px-7 py-3.5 text-base gap-2",
  };

  const variants = {
    primary: {
      background: "#2563eb",
      color: "#fff",
      border: "none",
      boxShadow: "none",
    },
    secondary: {
      background: "var(--color-bg-dark)",
      color: "var(--color-text-primary)",
      border: "1px solid var(--color-border-subtle)",
      boxShadow: "none",
    },
    outline: {
      background: "transparent",
      color: "#2563eb",
      border: "1px solid rgba(37,99,235,0.4)",
      boxShadow: "none",
    },
    ghost: {
      background: "transparent",
      color: "#94a3b8",
      border: "none",
      boxShadow: "none",
    },
  };

  const style = variants[variant] || variants.primary;

  const content = (
    <>
      {icon && iconPosition === "left" && <span>{icon}</span>}
      {children}
      {icon && iconPosition === "right" && <span>{icon}</span>}
    </>
  );

  const containerClass = `${base} ${sizes[size]} ${className}`;

  if (href) {
    const isExternal = href.startsWith("http") || href.startsWith("mailto");
    const Tag = isExternal ? "a" : "a";
    const extraProps = isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {};
    return (
      <a href={href} {...extraProps} className={containerClass} style={style}>
        {content}
      </a>
    );
  }

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={containerClass}
      style={style}
      whileTap={disabled ? {} : { scale: 0.97 }}
      whileHover={disabled ? {} : {
        boxShadow: "none",
      }}
    >
      {content}
    </motion.button>
  );
}
