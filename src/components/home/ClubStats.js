"use client";
import React from "react";
import { motion } from "framer-motion";
import { FiBox, FiCpu, FiGlobe, FiDatabase } from "react-icons/fi";

export default function ClubStats({ stats, settings }) {
  const overrides = settings?.club_stats || {};

  const getStatValue = (key, defaultVal) => {
    if (overrides[key] !== null && overrides[key] !== undefined && overrides[key] !== "") {
      return parseInt(overrides[key]);
    }
    return Math.max((stats && stats[key]) || 0, defaultVal);
  };

  const statItems = [
    { label: "Members", value: getStatValue('members', 69), icon: <FiGlobe size={28} />, color: "#10b981" },
    { label: "Projects", value: getStatValue('projects', 0), icon: <FiBox size={28} />, color: "#2563eb" },
    { label: "Events", value: getStatValue('events', 1), icon: <FiCpu size={28} />, color: "#4f46e5" },
    { label: "Research Papers", value: getStatValue('papers', 0), icon: <FiDatabase size={28} />, color: "#db2777" },
  ];

  return (
    <section className="py-12 w-full overflow-hidden relative z-10 bg-transparent">
      <div className="container mx-auto px-4 mb-10 text-center flex justify-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--color-border-subtle)] bg-[var(--color-glass-bg)] shadow-sm">
          <div className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
          <span className="text-xs font-medium text-[var(--color-text-secondary)] tracking-wide">
            Statistics & Community Impact
          </span>
        </div>
      </div>

      <div 
        className="relative flex overflow-hidden w-full group"
        style={{
          maskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
          WebkitMaskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)"
        }}
      >
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ repeat: Infinity, duration: 50, ease: "linear" }}
          className="flex whitespace-nowrap min-w-max items-center"
        >
          {[...statItems, ...statItems, ...statItems, ...statItems].map((stat, index) => (
            <div 
              key={index} 
              className="flex items-center gap-4 mx-12 transition-opacity duration-300"
              style={{ color: "var(--color-text-primary)" }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{
                  background: `linear-gradient(135deg, ${stat.color}22, ${stat.color}11)`,
                  border: `1px solid ${stat.color}44`,
                  color: stat.color,
                  boxShadow: `0 0 15px ${stat.color}33`
                }}
              >
                {stat.icon}
              </div>
              <div className="flex flex-col">
                <span className="text-3xl font-display font-bold leading-none mb-1">{stat.value}+</span>
                <span className="text-xs font-mono uppercase tracking-wider text-[var(--color-text-muted)] leading-none">{stat.label}</span>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
