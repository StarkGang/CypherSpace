"use client";
import React from "react";
import Link from "next/link";
import { FiAward } from "react-icons/fi";
import { motion } from "framer-motion";
import SectionHeading from "../design-system/SectionHeading";

export default function RecentAchievement({ achievement }) {
  if (!achievement) return null;

  return (
    <section className="py-12 px-4 w-full relative z-10 border-t border-[var(--color-border-subtle)]">
      <div className="container mx-auto max-w-7xl">
        
        <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
          <SectionHeading
            title={<>Network <span className="text-[var(--color-brand-primary)]">Milestones</span></>}
            subtitle="Significant events and recognitions achieved by the CypherSpace nodes."
            metadata="ACHIEVEMENTS"
            align="left"
            className="flex-1"
          />
          <div className="hidden md:block pb-2">
            <Link 
              href="/achievements"
              className="btn-outline"
            >
              View All Milestones
            </Link>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="chain-card overflow-hidden group">
            <div className="flex flex-col md:flex-row">
              
              <div className="w-full md:w-1/2 relative bg-[var(--color-bg-deep)] overflow-hidden border-r" style={{ borderColor: "var(--color-border-subtle)" }}>
                {achievement.image ? (
                  <img src={achievement.image} alt={achievement.title} className="w-full h-full object-cover brightness-90 group-hover:brightness-100 group-hover:scale-105 transition-all duration-700" />
                ) : (
                  <div className="w-full h-full aspect-[4/3] flex flex-col items-center justify-center hex-grid-bg">
                    <div className="w-40 h-40 absolute blur-[60px] rounded-full" style={{ background: "var(--color-border-subtle)" }}></div>
                    <FiAward size={64} className="mb-4 relative z-10 text-[var(--color-text-secondary)]" />
                    <span className="relative z-10 font-mono text-[10px] uppercase tracking-widest font-bold text-[var(--color-text-secondary)]">ACHIEVEMENT</span>
                  </div>
                )}
                <div className="absolute inset-0 opacity-80" style={{ background: "linear-gradient(to top, #050b18, transparent)" }}></div>
                
                <div className="absolute bottom-6 left-6 z-20">
                  <div className="font-mono text-[10px] uppercase font-bold px-3 py-1.5 rounded-lg border backdrop-blur-md"
                    style={{ color: "var(--color-primary-accent)", background: "var(--color-glass-bg)", borderColor: "var(--color-primary-accent)", boxShadow: "0 0 10px var(--color-neon-glow)" }}
                  >
                    {achievement.date}
                  </div>
                </div>
              </div>

              <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center relative">
                <div className="absolute top-0 right-0 w-64 h-64 blur-[80px] rounded-full pointer-events-none" style={{ background: "var(--color-blue-glow)" }}></div>
                
                <h3 className="font-display font-bold text-2xl md:text-3xl mb-6 leading-tight transition-colors duration-300" style={{ color: "#e2e8f0" }}
                  onMouseOver={e => e.currentTarget.style.color = "var(--color-primary-accent)"}
                  onMouseOut={e => e.currentTarget.style.color = "#e2e8f0"}
                >
                  {achievement.title}
                </h3>
                
                <p className="text-base md:text-lg mb-8 leading-relaxed line-clamp-4 relative z-10" style={{ color: "#94a3b8" }}>
                  {achievement.description}
                </p>

                {achievement.members && achievement.members.length > 0 && (
                  <div className="mb-8 relative z-10 border-t pt-6" style={{ borderColor: "var(--color-border-subtle)" }}>
                    <p className="font-mono text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: "#64748b" }}>Nodes Involved</p>
                    <p className="font-medium" style={{ color: "#e2e8f0" }}>{achievement.members.join(", ")}</p>
                  </div>
                )}

                <div className="mt-auto relative z-10 md:hidden">
                  <Link 
                    href="/achievements"
                    className="inline-flex items-center gap-2 font-mono font-bold uppercase text-[10px] tracking-widest pb-1 transition-all"
                    style={{ color: "var(--color-primary-accent)", borderBottom: "1px solid var(--color-primary-accent)" }}
                  >
                    View All Milestones <span className="transform transition-transform">→</span>
                  </Link>
                </div>
              </div>

            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
