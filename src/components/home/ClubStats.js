"use client";
import React from "react";
import { motion } from "framer-motion";
import { FiBox, FiCpu, FiGlobe, FiDatabase } from "react-icons/fi";

export default function ClubStats({ stats, settings }) {
  if (!stats) return null;

  const overrides = settings?.club_stats || {};

  const getStatValue = (key, defaultVal) => {
    if (overrides[key] !== null && overrides[key] !== undefined && overrides[key] !== "") {
      return parseInt(overrides[key]);
    }
    return Math.max(stats[key] || 0, defaultVal);
  };

  const statItems = [
    { label: "Members", value: getStatValue('members', 69), icon: <FiGlobe size={24} />, color: "#10b981" },
    { label: "Projects", value: getStatValue('projects', 0), icon: <FiBox size={24} />, color: "#2563eb" },
    { label: "Events", value: getStatValue('events', 1), icon: <FiCpu size={24} />, color: "#4f46e5" },
    { label: "Research Papers", value: getStatValue('papers', 0), icon: <FiDatabase size={24} />, color: "#db2777" },
  ];

  return (
    <section className="py-20 px-4 w-full relative z-10 border-t border-[var(--color-border-subtle)]">
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col items-center text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--color-border-subtle)] mb-6">
            <div className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
            <span className="text-xs font-mono text-[#10b981] uppercase tracking-widest">Community Impact</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-4 text-[var(--color-text-primary)]">
            Club Statistics & <span className="glow-text-primary">Metrics</span>
          </h2>
          <p className="text-[var(--color-text-secondary)] max-w-2xl mx-auto text-lg">
            Real-time statistics and community participation across our ecosystem.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statItems.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="chain-card p-6 flex items-center gap-5 group"
            >
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center transition-transform duration-500 group-hover:rotate-12"
                style={{
                  background: `linear-gradient(135deg, ${stat.color}22, ${stat.color}11)`,
                  border: `1px solid ${stat.color}44`,
                  color: stat.color,
                  boxShadow: `0 0 15px ${stat.color}33`
                }}
              >
                {stat.icon}
              </div>
              
              <div>
                <div className="text-3xl font-display font-bold text-[var(--color-text-primary)] mb-1 group-hover:scale-105 origin-left transition-transform duration-300">
                  {stat.value}+
                </div>
                <div className="text-xs font-mono uppercase tracking-wider text-[var(--color-text-muted)]">
                  {stat.label}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
