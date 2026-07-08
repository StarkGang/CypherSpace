"use client";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import SectionHeading from "../design-system/SectionHeading";
import { getImageUrl } from "../../lib/supabase";
import { FiCalendar } from "react-icons/fi";

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
          <div className="chain-card p-4 md:p-6 rounded-3xl flex flex-col lg:flex-row gap-8 items-center bg-[#0A0E16] border border-white/10 shadow-2xl group">
            <div className="relative w-full lg:w-[55%] aspect-video rounded-2xl overflow-hidden bg-black flex-shrink-0 flex items-center justify-center">
              {(event.banner || event.image) ? (
                <>
                  <img src={getImageUrl(event.banner || event.image)} className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-40 scale-110 pointer-events-none" alt="" />
                  <img src={getImageUrl(event.banner || event.image)} className="relative w-full h-full object-contain transition-transform duration-700 group-hover:scale-105 z-10" alt={event.title} />
                </>
              ) : (
                 <div className="w-full h-full bg-gradient-to-br from-[#2563eb]/20 to-[#6366f1]/20 flex items-center justify-center">
                   <FiCalendar className="w-16 h-16 text-[#2563eb] opacity-50" />
                 </div>
              )}
              
              <div className="absolute top-4 right-4 z-20 px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 shadow-sm">
                <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#60a5fa]">
                  {event.status === "ongoing" ? "Ongoing" : event.status === "upcoming" ? "Happening On" : "Conducted On"}
                </div>
                <div className="text-sm font-bold font-display leading-tight mt-0.5 text-white">
                  {event.date ? new Date(event.date).toLocaleDateString("en-US", { month: "short", day: 'numeric', year: 'numeric' }) : "TBA"}
                </div>
              </div>
            </div>
            <div className="flex-1 w-full py-4 lg:py-8 pr-4">
              <h3 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl text-white mb-6 leading-tight tracking-tight">
                {event.title}
              </h3>

              <div className="flex flex-wrap gap-2 mb-10">
                {event.tags?.map((tag, i) => (
                  <span key={i} className="px-3 py-1.5 rounded-md text-[10px] font-mono tracking-widest uppercase font-bold bg-[#3b82f6]/10 text-[#60a5fa] border border-[#3b82f6]/20">
                    {tag}
                  </span>
                ))}
              </div>

              <Link
                href={`/events/${event.slug || event.id}`}
                className="inline-flex items-center gap-3 px-8 py-4 rounded-xl font-bold text-sm bg-white text-black hover:bg-gray-200 transition-colors shadow-[0_0_30px_rgba(255,255,255,0.1)] w-full sm:w-auto justify-center hover:scale-105"
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
