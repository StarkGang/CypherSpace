"use client";
import React from "react";
import { motion } from "framer-motion";

export default function ClubStats({ stats, settings }) {
  const overrides = settings?.club_stats || {};

  const getStatValue = (key, defaultVal) => {
    if (overrides[key] !== null && overrides[key] !== undefined && overrides[key] !== "") {
      return parseInt(overrides[key]);
    }
    return Math.max((stats && stats[key]) || 0, defaultVal);
  };

  const statItems = [
    { label: "Members", value: getStatValue('members', 69), desc: "Active students building and learning together in our ecosystem." },
    { label: "Projects", value: getStatValue('projects', 0), desc: "Open-source decentralized applications and tools developed." },
    { label: "Events", value: getStatValue('events', 1), desc: "Workshops, hackathons, and meetups hosted for the community." },
    { label: "Research Papers", value: getStatValue('papers', 0), desc: "Academic and technical papers published by our members." },
  ];

  return (
    <section className="py-24 w-full relative z-10 bg-[#0A0E16]">
      <div className="container mx-auto px-4 max-w-5xl">
        
        <div className="flex items-center gap-4 mb-16">
          <h2 className="font-display font-bold text-4xl md:text-5xl uppercase leading-none text-white tracking-tight">
            NETWORK<br/>STATS
          </h2>
          <div className="flex gap-2 ml-4">
            <div className="w-8 h-2 rounded-full bg-[var(--color-primary-accent)]"></div>
            <div className="w-2 h-2 rounded-full bg-gray-700"></div>
            <div className="w-2 h-2 rounded-full bg-gray-700"></div>
          </div>
        </div>

        <div className="flex flex-col gap-8 md:gap-12">
          {statItems.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex flex-col md:flex-row md:items-center gap-4 md:gap-12 border-b border-white/5 pb-8 md:pb-12"
            >
              <div className="flex-shrink-0 w-48">
                <span className="font-display font-bold text-7xl md:text-8xl leading-none tracking-tighter" style={{ color: "var(--color-primary-accent)" }}>
                  {stat.value}+
                </span>
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="font-mono text-sm md:text-base uppercase tracking-widest font-bold text-white">
                  {stat.label}
                </h3>
                <p className="text-[var(--color-text-secondary)] text-sm md:text-base leading-relaxed max-w-lg font-body">
                  {stat.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
