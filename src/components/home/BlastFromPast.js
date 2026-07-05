"use client";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import SectionHeading from "../design-system/SectionHeading";
import { getImageUrl } from "../../lib/supabase";

export default function BlastFromPast({ events }) {
  if (!events || events.length === 0) return null;

  return (
    <section className="py-12 px-4 relative z-10 border-t border-[var(--color-border-subtle)]">
      <div className="container mx-auto max-w-7xl">
        <SectionHeading
          title="Blast from the Past"
          subtitle="A look back at some of our most memorable events."
          metadata="ARCHIVE"
          align="left"
          className="mb-8"
        />

        <div className="flex overflow-x-auto gap-6 pb-8 snap-x snap-mandatory hide-scrollbar">
          {events.map((event, idx) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="flex-shrink-0 w-80 md:w-96 snap-start"
            >
              <Link href={`/events/${event.slug || event.id}`} className="block group">
                <div className="chain-card p-3 rounded-2xl h-full flex flex-col transition-transform duration-300 group-hover:-translate-y-2">
                  <div
                    className="relative rounded-xl overflow-hidden aspect-video border mb-4"
                    style={{
                      background: "var(--color-bg-dark)",
                      borderColor: "var(--color-border-subtle)",
                    }}
                  >
                    {(event.banner || event.image) ? (
                      <img
                        src={getImageUrl(event.banner || event.image)}
                        alt={event.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center hex-grid-bg opacity-40 text-[var(--color-text-secondary)] text-xs font-mono uppercase tracking-widest">
                        No Media
                      </div>
                    )}
                    
                    <div
                      className="absolute top-2 right-2 px-2 py-1 rounded bg-black/60 backdrop-blur-sm border border-white/10 text-white text-[10px] font-mono uppercase tracking-wider"
                    >
                      {event.date ? (
                        event.end_date && event.end_date !== event.date
                          ? `${new Date(event.date).toLocaleDateString("en-US", { month: "short", day: 'numeric' })} - ${new Date(event.end_date).toLocaleDateString("en-US", { year: 'numeric', month: "short", day: 'numeric' })}`
                          : new Date(event.date).toLocaleDateString("en-US", { year: 'numeric', month: "short", day: 'numeric' })
                      ) : "TBA"}
                    </div>
                  </div>

                  <h3 className="font-display font-bold text-lg mb-2 line-clamp-1 group-hover:text-blue-400 transition-colors">
                    {event.title}
                  </h3>
                  <p className="text-sm text-[var(--color-text-secondary)] line-clamp-2 font-body mb-4 flex-grow">
                    {event.description || "Take a look at the details of this archival event."}
                  </p>

                  <div className="flex flex-wrap gap-2 mt-auto">
                    {event.tags?.slice(0, 2).map((tag, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 rounded text-[9px] font-mono tracking-widest uppercase font-bold"
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
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </section>
  );
}
