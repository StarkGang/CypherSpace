"use client";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import SectionHeading from "../design-system/SectionHeading";

export default function FeaturedProject({ project }) {
  if (!project) return null;

  return (
    <section className="py-12 px-4 relative z-10 border-t border-[var(--color-border-subtle)]">
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-16">
          
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex-1 w-full flex flex-col items-start"
          >
            <SectionHeading
              title={project.title}
              subtitle={project.summary || "Explore production-ready smart contracts and decentralized applications. Architected by core contributors for the broader ecosystem."}
              metadata="FEATURED PROTOCOL"
              align="left"
              className="mb-6"
            />
            
            <div className="flex flex-wrap gap-2 mb-8">
              {project.tags?.map((tag, i) => (
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
              href={`/projects/${project.slug}`}
              className="inline-flex items-center gap-3 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 group"
              style={{
                background: "#2563eb",
                color: "#fff",
              }}
            >
              View Repository 
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
            <div className="chain-card p-2 group relative">

              
              <div
                className="relative rounded-lg overflow-hidden aspect-video border"
                style={{
                  background: "var(--color-bg-dark)",
                  borderColor: "var(--color-border-subtle)",
                }}
              >
                {(project.cover_image || project.image) ? (
                  <img src={project.cover_image || project.image} alt={project.title} className="w-full h-full object-cover brightness-90 group-hover:brightness-110 transition-all" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center hex-grid-bg">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" strokeWidth="1.5" stroke="#2563eb" className="relative z-10">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
                    </svg>
                    <span className="mt-4 font-mono text-xs uppercase tracking-widest text-[var(--color-text-muted)] relative z-10">Smart_Contract.deploy</span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
