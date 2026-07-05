"use client";
import React from "react";
import NeobrutalistBackground from "./NeobrutalistBackground";

export default function Background({ children, pattern = "gingham" }) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden flex flex-col">
      
      <div className="fixed inset-0 -z-50 bg-[var(--color-paper-white)] dark:bg-[var(--color-bg-sky)]" />

      <NeobrutalistBackground />
      <div 
        className="fixed inset-0 -z-30 pointer-events-none opacity-[0.4] dark:opacity-[0.2]"
        style={{
          backgroundImage: pattern === 'grid' 
            ? `linear-gradient(var(--color-bg-sky) 2px, transparent 2px), linear-gradient(90deg, var(--color-bg-sky) 2px, transparent 2px)`
            : `linear-gradient(90deg, rgba(135,206,235,0.6) 2px, transparent 2px), linear-gradient(rgba(135,206,235,0.6) 2px, transparent 2px)`,
          backgroundSize: '30px 30px',
        }}
      />
    
      <div 
        className="fixed inset-0 -z-20 pointer-events-none opacity-[0.03] mix-blend-overlay dark:opacity-[0.06]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
      
      <main className="flex-grow relative z-0 flex flex-col">
        {children}
      </main>
    </div>
  );
}

