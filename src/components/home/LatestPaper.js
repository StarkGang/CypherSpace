"use client";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import SectionHeading from "../design-system/SectionHeading";

export default function LatestPaper({ paper }) {
  if (!paper) return null;

  return (
    <section className="py-12 px-4 relative z-10 border-t border-[var(--color-border-subtle)]" style={{ background: "linear-gradient(to bottom, transparent, rgba(124,58,237,0.02))" }}>
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row-reverse items-center gap-12 lg:gap-16">
          
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex-1 w-full flex flex-col items-start"
          >
            <SectionHeading
              title={paper.title}
              subtitle={paper.abstract ? (paper.abstract.substring(0, 150) + "...") : "Institutional-grade research and cryptographic protocol specifications published by network participants."}
              metadata="LATEST WHITEPAPER"
              align="left"
              className="mb-6"
            />
            
            <div className="flex flex-col gap-3 mb-8 text-sm font-mono" style={{ color: "var(--color-text-secondary)" }}>
              <div className="flex items-center gap-2">
                <span style={{ color: "var(--color-text-muted)" }}>[AUTHORS]</span>
                <span style={{ color: "var(--color-text-primary)" }}>{paper.authors?.join(", ") || "Various"}</span>
              </div>
              <div className="flex items-center gap-2">
                <span style={{ color: "var(--color-text-muted)" }}>[NETWORK]</span>
                <span style={{ color: "var(--color-text-primary)" }}>{paper.conference || "Mainnet"}</span>
              </div>
            </div>

            <Link
              href={`/papers/${paper.slug}`}
              className="inline-flex items-center gap-3 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 group"
              style={{
                background: "linear-gradient(135deg, #7c3aed, #4361ee)",
                color: "#fff",
                boxShadow: "0 0 20px rgba(124,58,237,0.3)",
              }}
            >
              Read Whitepaper
              <span className="transform group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex-1 w-full"
          >
            <div className="chain-card p-6 relative group overflow-hidden">
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                  background: "linear-gradient(135deg, rgba(124,58,237,0.1), transparent)",
                }}
              />
              
              <div className="font-mono text-[10px] uppercase font-bold tracking-widest mb-4 border-b pb-2 flex justify-between items-center text-[var(--color-text-muted)] border-[var(--color-border-subtle)]">
                <span>ABSTRACT SYNOPSIS</span>
                <span>VERIFIED</span>
              </div>
              
              <div className="text-sm font-mono leading-relaxed relative z-10" style={{ color: "var(--color-text-secondary)" }}>
                &quot;{paper.abstract ? (paper.abstract.substring(0, 300) + "...") : "High-performance decentralized consensus mechanisms offer robust security guarantees for distributed state machines. This specification formalizes zero-knowledge proofs for horizontal scaling..."}&quot;
              </div>
              
              <div className="mt-8 flex justify-between items-end border-t pt-4 border-[var(--color-border-subtle)]">
                <div className="font-mono text-[10px] uppercase tracking-widest" style={{ color: "var(--color-text-muted)" }}>
                  Block: #Latest
                </div>
                <div className="flex gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-text-muted)]"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-border-subtle)]"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-border-subtle)]"></div>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
