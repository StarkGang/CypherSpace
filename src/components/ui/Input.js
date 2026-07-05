"use client";
import React, { forwardRef, useId } from "react";

const Input = forwardRef(({ 
  label, 
  error, 
  helperText, 
  id, 
  className = "", 
  type = "text",
  as = "input",
  rows = 4,
  ...props 
}, ref) => {
  const reactId = useId();
  const generatedId = id || `input-${reactId}`;
  
  const baseInputClasses = `
    w-full px-4 py-3 bg-[var(--color-bg-deep)] text-[var(--color-text-primary)] 
    border border-[var(--color-border-subtle)] rounded-lg font-mono text-sm sm:text-base
    focus:outline-none focus:border-[var(--color-brand-primary)] focus:ring-1 focus:ring-[var(--color-brand-primary)]
    disabled:opacity-50 disabled:cursor-not-allowed
    transition-all duration-200
    placeholder:text-[var(--color-text-muted)] placeholder:font-sans
    ${error ? "border-red-500 ring-1 ring-red-500 focus:border-red-500 focus:ring-red-500" : ""}
    ${className}
  `;

  return (
    <div className="flex flex-col w-full mb-4">
      {label && (
        <label 
          htmlFor={generatedId} 
          className="mb-2 font-display font-semibold uppercase tracking-wider text-xs text-[var(--color-text-secondary)] flex items-center"
        >
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {as === "textarea" ? (
          <textarea
            ref={ref}
            id={generatedId}
            rows={rows}
            className={baseInputClasses}
            {...props}
          />
        ) : (
          <input
            ref={ref}
            id={generatedId}
            type={type}
            className={baseInputClasses}
            {...props}
          />
        )}
      </div>
      
      {(error || helperText) && (
        <p className={`mt-2 text-xs font-mono font-medium ${error ? "text-red-500" : "text-[var(--color-text-muted)]"}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
});

Input.displayName = "Input";

export default Input;

