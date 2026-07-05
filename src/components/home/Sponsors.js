"use client";
import React from "react";
import Link from "next/link";
import SectionHeading from "../design-system/SectionHeading";

export default function Sponsors({ sponsors = [] }) {
  if (!sponsors || sponsors.length === 0) return null;

  return (
    <section className="py-12 px-4 w-full relative z-10">
      <div className="container mx-auto max-w-7xl">
        <SectionHeading
          title={<>Our <span style={{color: "#2563eb"}}>Sponsors</span></>}
          subtitle="Proudly supported by organizations building the future of Web3."
          metadata="STRATEGIC PARTNERS"
          align="center"
          className="mb-10"
        />

        <div className="flex flex-wrap justify-center gap-4">
          {sponsors.map((s, idx) => (
            <a
              key={idx}
              href={s.url || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="glass-card flex flex-col items-center justify-between p-6 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(37,99,235,0.15)] group relative overflow-hidden"
              style={{
                width: "100%",
                maxWidth: "300px",
                flex: "1 1 260px"
              }}
            >
              
              <div className="w-full h-40 flex items-center justify-center mb-4">
                {s.image ? (
                  <img 
                    src={s.image} 
                    alt={`${s.name} logo`} 
                    className="max-w-[85%] max-h-[85%] object-contain transition-transform duration-500 group-hover:scale-105" 
                  />
                ) : (
                  <div className="text-3xl font-black font-display opacity-40 group-hover:opacity-80 transition-opacity duration-500">
                    {s.name}
                  </div>
                )}
              </div>
              
              
              <div className="flex flex-col items-center text-center w-full">
                <span
                  className="text-sm font-bold font-display tracking-wide group-hover:text-[#2563eb] transition-colors"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  {s.name}
                </span>
                
                {s.description && (
                  <span className="text-xs mt-1 line-clamp-1" style={{ color: "var(--color-text-secondary)" }}>
                    {s.description}
                  </span>
                )}
                
                <span 
                  className="text-[10px] font-mono tracking-widest uppercase mt-2 px-3 py-1 rounded-full" 
                  style={{ 
                    color: "var(--color-text-muted)",
                    background: "var(--color-bg-deep)",
                    border: "1px solid var(--color-border-subtle)"
                  }}
                >
                  {s.tier ? `${s.tier} Sponsor` : "Ecosystem Partner"}
                </span>
              </div>
            </a>
          ))}
        </div>

        <p className="text-center text-xs mt-10 font-mono tracking-widest uppercase" style={{ color: "var(--color-text-muted)" }}>
          Interested in sponsoring?{" "}
          <Link
            href="/contact"
            style={{ color: "#2563eb" }}
            className="hover:underline"
          >
            Get in touch →
          </Link>
        </p>
      </div>
    </section>
  );
}
