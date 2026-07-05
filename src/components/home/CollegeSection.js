"use client";
import React from "react";
import { motion } from "framer-motion";

export default function CollegeSection() {
  return (
    <section className="w-full relative z-10 bg-[var(--color-bg-deep)] overflow-hidden">
      
      
      <div className="relative w-full h-[50vh] md:h-[70vh]">
        
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-[50%_15%] bg-no-repeat opacity-70 dark:opacity-40"
          style={{ backgroundImage: "url('/nss.webp')" }}
        />
        
        
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[var(--color-bg-deep)] to-transparent" />

        
        <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-[var(--color-bg-deep)] via-[var(--color-bg-deep)]/90 to-transparent" />
      </div>

      <div className="container mx-auto max-w-5xl px-4 relative z-20 -mt-32 md:-mt-48 pb-20">
        <div className="flex flex-col items-center text-center">
          
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6"
            style={{
              background: "var(--color-glass-bg)",
              border: "1px solid var(--color-border-glow)",
              backdropFilter: "blur(10px)",
            }}
          >
            <div className="w-2 h-2 rounded-full bg-[#2563eb]" />
            <span className="text-xs font-mono text-[#3b82f6] uppercase tracking-widest font-semibold">
              Our Institution
            </span>
          </motion.div>

          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <h2 className="text-4xl md:text-6xl font-display font-bold text-[var(--color-text-primary)] tracking-tight">
              <span className="text-[#3b82f6]">NSS</span> College of Engineering
            </h2>
          </motion.div>
          
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-col gap-4 text-[var(--color-text-secondary)] md:text-lg leading-relaxed max-w-3xl mb-16 font-medium"
          >
            <p>
              Established in 1960, NSS College of Engineering, Palakkad stands as one of the most reputed premier engineering institutions in Kerala.
            </p>
            <p>
              Affiliated to APJ Abdul Kalam Technological University, we provide a vibrant ecosystem for students to explore emerging technologies, foster innovation, and build the decentralized future.
            </p>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
