"use client";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import SectionHeading from "../design-system/SectionHeading";
import { getImageUrl } from "../../lib/supabase";

export default function FeaturedEvent({ event }) {
  if (!event) return null;

  return (
    <section className="py-12 px-4 relative z-10 border-t border-[var(--color-border-subtle)]">
      <div className="container mx-auto max-w-7xl">
        <SectionHeading
          title={event.title}
          subtitle={event.description || event.summary || "Take a look at our featured event."}
          metadata="FEATURED EVENT"
          align="left"
          className="mb-8"
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="w-full"
        >
          <div className="chain-card p-4 rounded-2xl md:p-8 flex flex-col md:flex-row gap-8 items-center">
            <div
              className="relative rounded-xl overflow-hidden aspect-video border w-full md:w-1/2 flex-shrink-0"
              style={{
                background: "var(--color-bg-dark)",
                borderColor: "var(--color-border-subtle)",
              }}
            >
              {(event.banner || event.image) ? (
                <>
                  <img 
                    src={getImageUrl(event.banner || event.image)} 
                    alt={event.title} 
                    className="w-full h-full object-cover transition-all duration-500 hover:scale-105" 
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div className="hidden w-full h-full items-center justify-center hex-grid-bg opacity-40 font-mono text-xs uppercase tracking-widest text-[var(--color-text-secondary)]">
                    Media format unsupported
                  </div>
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center hex-grid-bg opacity-40 text-slate-500 text-xs font-mono tracking-widest uppercase">
                  No Media
                </div>
              )}
              
              <div
                className="absolute top-4 right-4 px-4 py-2 rounded-lg border backdrop-blur-md"
                style={{
                  background: "rgba(var(--color-bg-surface-rgb), 0.8)",
                  borderColor: "var(--color-border-subtle)",
                }}
              >
                <div className="text-xs font-mono font-bold uppercase tracking-wider" style={{ color: "#2563eb" }}>
                  {event.status === "ongoing" ? "Ongoing" : event.status === "upcoming" ? "Happening On" : "Conducted On"}
                </div>
                <div className="text-lg font-bold font-display leading-tight mt-1" style={{ color: "var(--color-text-primary)" }}>
                  {event.date ? (
                    event.end_date && event.end_date !== event.date 
                      ? <>{new Date(event.date).toLocaleDateString("en-US", { month: "short", day: 'numeric' })} <br/>to {new Date(event.end_date).toLocaleDateString("en-US", { year: 'numeric', month: "short", day: 'numeric' })}</>
                      : new Date(event.date).toLocaleDateString("en-US", { year: 'numeric', month: "long", day: 'numeric' })
                  ) : "TBA"}
                </div>
              </div>
            </div>
            
            <div className="flex-1 w-full">
              <h3 className="font-display font-bold text-3xl mb-4 line-clamp-2">
                {event.title}
              </h3>
              <p className="text-[var(--color-text-secondary)] line-clamp-3 font-body mb-6 text-lg">
                {event.description}
              </p>

              <div className="flex flex-wrap gap-2 mb-8">
                {event.tags?.map((tag, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 rounded-md text-[10px] font-mono tracking-widest uppercase font-bold"
                    style={{
                      background: "rgba(37, 99, 235, 0.1)",
                      border: "1px solid rgba(37, 99, 235, 0.2)",
                      color: "#2563eb",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <Link
                href={`/events/${event.slug || event.id}`}
                className="inline-flex items-center gap-3 px-8 py-4 rounded-xl font-bold text-sm transition-all duration-300 group w-full md:w-auto justify-center"
                style={{
                  background: "#2563eb",
                  color: "#fff",
                }}
              >
                View Full Details 
                <span className="transform group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
