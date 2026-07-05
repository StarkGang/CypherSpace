"use client";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import SectionHeading from "../design-system/SectionHeading";

export default function UpcomingEvents({ events }) {
  if (!events || events.length === 0) return null;

  return (
    <section className="py-24 px-4 relative z-10 border-t border-[var(--color-border-subtle)]">
      <div className="container mx-auto max-w-7xl">
        <SectionHeading
          title={<>Connect & <span className="glow-text-primary">Collaborate</span></>}
          subtitle="Participate in upcoming protocol upgrades, developer hackathons, and decentralized governance proposals."
          metadata="EVENTS"
          align="center"
          className="mb-16"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {events.map((event, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="chain-card flex flex-col h-full group"
            >
              
              <div
                className="h-40 relative border-b border-[var(--color-border-subtle)] overflow-hidden rounded-t-xl"
                style={{ background: "var(--color-bg-dark)" }}
              >
                {(event.banner || event.image) ? (
                  <img src={event.banner || event.image} alt={event.title} className="w-full h-full object-cover brightness-75 group-hover:brightness-100 transition-all duration-500 group-hover:scale-105" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center hex-grid-bg opacity-40 group-hover:opacity-60 transition-opacity" />
                )}
                
                
                <div
                  className="absolute top-4 right-4 px-3 py-1.5 rounded-lg border text-center backdrop-blur-md"
                  style={{
                    background: "var(--color-bg-surface)",
                    borderColor: "var(--color-border-subtle)",
                  }}
                >
                  <div className="text-[10px] font-mono tracking-widest uppercase font-bold" style={{ color: "#2563eb" }}>
                    {event.date ? new Date(event.date).toLocaleDateString("en-US", { month: "short" }) : "TBA"}
                  </div>
                  <div className="text-xl font-bold font-display" style={{ color: "var(--color-text-primary)" }}>
                    {event.date ? new Date(event.date).getDate() : "-"}
                  </div>
                </div>
              </div>

              
              <div className="p-6 flex-grow flex flex-col">
                <div className="flex items-center gap-2 mb-3">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{
                      background: event.status === 'upcoming' ? '#2563eb' : 'var(--color-text-muted)',
                    }}
                  />
                  <span className="text-xs font-mono uppercase tracking-wider" style={{ color: "var(--color-text-muted)" }}>
                    {event.status || 'Upcoming'}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold font-display mb-2 hover:text-[#2563eb] transition-colors" style={{ color: "var(--color-text-primary)" }}>
                  {event.title}
                </h3>
                
                <p className="text-sm mb-6 flex-grow line-clamp-3" style={{ color: "var(--color-text-muted)" }}>
                  {event.summary || "Join us for an exciting deep dive into the latest Web3 technologies and frameworks."}
                </p>
                
                <Link
                  href={`/events/${event.slug}`}
                  className="text-xs font-mono font-bold tracking-widest uppercase pb-1 self-start transition-all"
                  style={{
                    color: "#2563eb",
                    borderBottom: "1px solid rgba(37, 99, 235, 0.3)"
                  }}
                  onMouseOver={e => e.currentTarget.style.borderBottomColor = "#2563eb"}
                  onMouseOut={e => e.currentTarget.style.borderBottomColor = "rgba(37, 99, 235, 0.3)"}
                >
                  View Event →
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
