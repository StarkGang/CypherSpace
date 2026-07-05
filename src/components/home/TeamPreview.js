"use client";
import React from "react";
import Link from "next/link";
import { FaGithub, FaLinkedin, FaGlobe } from "react-icons/fa";
import { motion } from "framer-motion";
import SectionHeading from "../design-system/SectionHeading";

export default function TeamPreview({ team }) {
  if (!team || team.length === 0) return null;

  return (
    <section className="py-12 px-4 w-full relative z-10 border-t border-[var(--color-border-subtle)]">
      <div className="container mx-auto max-w-7xl">
        
        <SectionHeading
          title={<>The <span style={{color: "#2563eb"}}>Makers</span></>}
          subtitle="The core developers and researchers maintaining the CypherSpace ecosystem."
          metadata="CORE TEAM"
          align="center"
          className="mb-16"
        />

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {team.map((member, index) => (
            <motion.div 
              key={member.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative group"
            >
              <div className="chain-card p-4 flex flex-col items-center text-center h-full transition-all duration-300">
                
                <div
                  className="w-20 h-20 md:w-24 md:h-24 overflow-hidden mb-4 relative z-10 transition-all duration-300 group-hover:scale-105"
                  style={{
                    clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                    background: "var(--color-bg-surface)",
                    border: "2px solid var(--color-border-subtle)",
                  }}
                >
                  {member.image ? (
                    <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center font-display font-bold text-3xl uppercase"
                      style={{
                        background: "#2563eb",
                        color: "#fff",
                      }}
                    >
                      {member.name.charAt(0)}
                    </div>
                  )}
                </div>
                
                <h4 className="font-display font-bold text-lg md:text-lg leading-tight mb-1" style={{ color: "var(--color-text-primary)" }}>
                  {member.name}
                </h4>
                
                <p className="font-mono text-[10px] font-bold uppercase tracking-widest mb-4" style={{ color: "#2563eb" }}>
                  {member.role || "Member"}
                </p>

                <div className="flex gap-3 mt-auto">
                  {member.github && (
                    <a href={member.github} target="_blank" rel="noreferrer" className="transition-colors" style={{ color: "var(--color-text-muted)" }} onMouseOver={e => e.currentTarget.style.color = "#2563eb"} onMouseOut={e => e.currentTarget.style.color = "var(--color-text-muted)"}>
                      <FaGithub size={16} />
                    </a>
                  )}
                  {member.linkedin && (
                    <a href={member.linkedin} target="_blank" rel="noreferrer" className="transition-colors" style={{ color: "var(--color-text-muted)" }} onMouseOver={e => e.currentTarget.style.color = "#2563eb"} onMouseOut={e => e.currentTarget.style.color = "var(--color-text-muted)"}>
                      <FaLinkedin size={16} />
                    </a>
                  )}
                  {member.portfolio && (
                    <a href={member.portfolio} target="_blank" rel="noreferrer" className="transition-colors" style={{ color: "var(--color-text-muted)" }} onMouseOver={e => e.currentTarget.style.color = "#2563eb"} onMouseOut={e => e.currentTarget.style.color = "var(--color-text-muted)"}>
                      <FaGlobe size={16} />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link 
            href="/team"
            className="inline-flex items-center gap-2 font-mono font-bold tracking-widest uppercase text-xs transition-all duration-300 group pb-1"
            style={{
              color: "#2563eb",
              borderBottom: "1px solid rgba(37, 99, 235, 0.3)"
            }}
            onMouseOver={e => e.currentTarget.style.borderBottomColor = "#2563eb"}
            onMouseOut={e => e.currentTarget.style.borderBottomColor = "rgba(37, 99, 235, 0.3)"}
          >
            Meet All Nodes
            <span className="transform group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>
        
      </div>
    </section>
  );
}
