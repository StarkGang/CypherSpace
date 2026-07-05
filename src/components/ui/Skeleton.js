"use client";
import React, { useEffect, useState } from "react";

const shimmerClass = "relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.5s_infinite] before:bg-gradient-to-r before:from-transparent before:via-[rgba(37, 99, 235,0.1)] before:to-transparent";
const baseSkeleton = `bg-[rgba(12,26,46,0.6)] rounded-lg ${shimmerClass} border border-[rgba(37, 99, 235,0.1)]`;

export function SkeletonBase({ className = "", rounded = false }) {
  return (
    <div
      className={`${baseSkeleton} ${rounded ? "!rounded-full" : ""} ${className}`}
    />
  );
}


export function HomeSkeleton() {
  const [blocks, setBlocks] = useState([]);
  const [status, setStatus] = useState("Initializing node...");

  useEffect(() => {
    const statusMessages = [
      "Initializing node...",
      "Syncing with network...",
      "Validating chain...",
      "Fetching latest block...",
      "Decrypting payload...",
      "Chain ready.",
    ];
    let i = 0;
    const addBlock = () => {
      setBlocks((b) => [...b, i]);
      i++;
      setStatus(statusMessages[Math.min(i, statusMessages.length - 1)]);
    };
    const interval = setInterval(() => {
      if (i >= 5) { clearInterval(interval); return; }
      addBlock();
    }, 420);
    addBlock();
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center z-50"
      style={{ background: "#050b18" }}
    >
      
      <div
        className="absolute w-96 h-96 rounded-full pointer-events-none"
        style={{ top: "20%", left: "15%", background: "rgba(37, 99, 235,0.06)", filter: "blur(100px)" }}
      />
      <div
        className="absolute w-80 h-80 rounded-full pointer-events-none"
        style={{ bottom: "20%", right: "15%", background: "rgba(67,97,238,0.06)", filter: "blur(100px)" }}
      />

      
      <div className="flex items-center gap-3 mb-12">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center"
          style={{
            background: "linear-gradient(135deg, rgba(37, 99, 235,0.2), rgba(67,97,238,0.2))",
            border: "1px solid rgba(37, 99, 235,0.4)",
            boxShadow: "0 0 20px rgba(37, 99, 235,0.3)",
            animation: "glow-pulse 2s ease-in-out infinite",
          }}
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" strokeWidth="1.8" stroke="#2563eb">
            <rect x="2" y="7" width="6" height="6" rx="1" />
            <rect x="9" y="2" width="6" height="6" rx="1" />
            <rect x="16" y="7" width="6" height="6" rx="1" />
            <path strokeLinecap="round" d="M5 13v2M12 8v2M19 13v2M5 15l7-3 7 3" />
          </svg>
        </div>
        <span className="font-display font-bold text-2xl">
          <span style={{ color: "#e2e8f0" }}>Chain</span>
          <span style={{ color: "#2563eb" }}>Space</span>
        </span>
      </div>

      
      <div className="flex items-center gap-2 mb-10" style={{ height: 60 }}>
        {[0, 1, 2, 3, 4].map((idx) => (
          <React.Fragment key={idx}>
            <div
              className="flex items-center justify-center rounded-lg text-xs font-mono font-bold transition-all duration-500"
              style={{
                width: 48,
                height: 48,
                background: blocks.includes(idx)
                  ? "linear-gradient(135deg, rgba(37, 99, 235,0.2), rgba(67,97,238,0.2))"
                  : "rgba(12,26,46,0.5)",
                border: `1px solid ${blocks.includes(idx) ? "rgba(37, 99, 235,0.5)" : "rgba(37, 99, 235,0.1)"}`,
                boxShadow: blocks.includes(idx) ? "0 0 16px rgba(37, 99, 235,0.3)" : "none",
                color: blocks.includes(idx) ? "#2563eb" : "#334155",
                transform: blocks.includes(idx) ? "scale(1)" : "scale(0.85)",
                opacity: blocks.includes(idx) ? 1 : 0.4,
              }}
            >
              #{idx + 1}
            </div>
            {idx < 4 && (
              <div
                className="transition-all duration-300"
                style={{
                  width: 20,
                  height: 2,
                  borderRadius: 1,
                  background: blocks.includes(idx + 1)
                    ? "linear-gradient(90deg, #2563eb, #4361ee)"
                    : "rgba(37, 99, 235,0.12)",
                  boxShadow: blocks.includes(idx + 1) ? "0 0 8px rgba(37, 99, 235,0.4)" : "none",
                }}
              />
            )}
          </React.Fragment>
        ))}
      </div>

      
      <p
        className="text-sm font-mono mb-6 min-h-[20px] transition-all duration-300"
        style={{ color: "#2563eb" }}
      >
        {status}
      </p>

      
      <div
        className="rounded-full overflow-hidden"
        style={{
          width: 220,
          height: 3,
          background: "rgba(37, 99, 235,0.1)",
        }}
      >
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${Math.min(100, (blocks.length / 5) * 100)}%`,
            background: "linear-gradient(90deg, #2563eb, #4361ee)",
            boxShadow: "0 0 8px rgba(37, 99, 235,0.6)",
          }}
        />
      </div>
    </div>
  );
}


export function CardSkeleton() {
  return (
    <div
      className="rounded-xl overflow-hidden relative"
      style={{
        background: "rgba(12,26,46,0.6)",
        border: "1px solid rgba(37, 99, 235,0.1)",
        height: 220,
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(90deg, transparent 0%, rgba(37, 99, 235,0.04) 50%, transparent 100%)",
          animation: "shimmer 1.8s infinite",
          transform: "translateX(-100%)",
        }}
      />
      <div className="p-5 flex flex-col gap-3">
        <div className="h-3 rounded-full w-1/3" style={{ background: "rgba(37, 99, 235,0.08)" }} />
        <div className="h-5 rounded-lg w-4/5" style={{ background: "rgba(37, 99, 235,0.06)" }} />
        <div className="h-3 rounded-full w-full" style={{ background: "rgba(37, 99, 235,0.05)" }} />
        <div className="h-3 rounded-full w-2/3" style={{ background: "rgba(37, 99, 235,0.05)" }} />
        <div className="mt-auto h-8 rounded-lg w-1/3" style={{ background: "rgba(37, 99, 235,0.08)" }} />
      </div>
    </div>
  );
}


export function PageSkeleton() {
  return (
    <div className="container mx-auto max-w-7xl px-4 pt-10 pb-20">
      <div className="mb-10">
        <div className="h-3 w-24 rounded-full mb-4" style={{ background: "rgba(37, 99, 235,0.1)" }} />
        <div className="h-10 w-1/2 rounded-xl mb-3" style={{ background: "rgba(37, 99, 235,0.07)" }} />
        <div className="h-4 w-2/3 rounded-full" style={{ background: "rgba(37, 99, 235,0.05)" }} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => <CardSkeleton key={i} />)}
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5 }) {
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <div className={`h-10 w-48 ${baseSkeleton}`} />
        <div className={`h-10 w-32 ${baseSkeleton}`} />
      </div>
      <div className="chain-card p-0 overflow-hidden border border-[rgba(37, 99, 235,0.1)]">
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[rgba(12,26,46,0.8)] border-b border-[rgba(37, 99, 235,0.1)]">
                {[...Array(4)].map((_, i) => (
                  <th key={i} className="p-4">
                    <div className={`h-5 w-24 ${baseSkeleton}`} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...Array(rows)].map((_, i) => (
                <tr key={i} className="border-b border-[rgba(37, 99, 235,0.05)]">
                  <td className="p-4"><div className={`h-6 w-32 ${baseSkeleton}`} /></td>
                  <td className="p-4"><div className={`h-6 w-24 ${baseSkeleton}`} /></td>
                  <td className="p-4"><div className={`h-6 w-16 ${baseSkeleton}`} /></td>
                  <td className="p-4"><div className={`h-8 w-20 ${baseSkeleton}`} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export function FormSkeleton() {
  return (
    <div className="flex flex-col gap-8 pb-20 w-full">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className={`h-6 w-32 mb-4 ${baseSkeleton}`} />
          <div className={`h-10 w-64 ${baseSkeleton}`} />
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 flex flex-col gap-8">
          <div className="chain-card p-6 md:p-8">
            <div className={`h-8 w-48 mb-6 ${baseSkeleton}`} />
            <div className={`h-14 w-full mb-6 ${baseSkeleton}`} />
            <div className={`h-32 w-full mb-6 ${baseSkeleton}`} />
            <div className={`h-14 w-full ${baseSkeleton}`} />
          </div>
        </div>
        
        <div className="lg:col-span-1 flex flex-col gap-8">
          <div className="chain-card p-6">
            <div className={`h-8 w-32 mb-6 ${baseSkeleton}`} />
            <div className={`h-40 w-full mb-6 ${baseSkeleton}`} />
            <div className={`h-14 w-full ${baseSkeleton}`} />
          </div>
        </div>
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="flex flex-col gap-8 w-full">
      <div className={`h-12 w-64 ${baseSkeleton}`} />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="chain-card p-6">
            <div className={`h-8 w-1/2 mb-4 ${baseSkeleton}`} />
            <div className={`h-16 w-3/4 ${baseSkeleton}`} />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="chain-card p-6 h-96">
          <div className={`h-8 w-48 mb-6 ${baseSkeleton}`} />
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className={`h-12 w-full ${baseSkeleton}`} />
            ))}
          </div>
        </div>
        <div className="chain-card p-6 h-96">
          <div className={`h-8 w-48 mb-6 ${baseSkeleton}`} />
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className={`h-12 w-full ${baseSkeleton}`} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
