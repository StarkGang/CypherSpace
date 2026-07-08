"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { getImageUrl } from "../../lib/supabase";
import { FiArrowRight, FiPlay } from "react-icons/fi";

export default function BlastFromPast({ events }) {
  const [activeIdx, setActiveIdx] = useState(0);
  if (!events || events.length === 0) return null;

  const activeEvent = events[activeIdx];

  return (
    <section className="py-24 px-4 relative z-10 overflow-hidden bg-[var(--color-bg-deep)]">
      
      <div className="absolute top-0 left-1/2 w-[800px] h-[800px] bg-[var(--color-blue-glow)] rounded-full filter blur-[150px] opacity-20 pointer-events-none -translate-x-1/2"></div>
      
      <div className="absolute top-0 right-0 w-full h-[300px] bg-gradient-to-b from-white/5 to-transparent opacity-20 pointer-events-none transform -skew-y-6 origin-top-right"></div>

      <div className="w-full mx-auto max-w-[1600px] px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          <div className="lg:col-span-4 flex flex-col items-start gap-6">
            <h2 className="font-display font-bold text-5xl md:text-6xl uppercase leading-[0.9] text-white tracking-tight">
              Past<br/>Events
            </h2>
            <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed max-w-sm font-body">
              A look back at some of our most memorable events. Rewatch the highlights, read the recaps, and explore what we've built together.
            </p>
            <Link href="/events" className="btn-outline mt-2">
              View Archive <FiArrowRight size={16} />
            </Link>
          </div>

          
          <div className="lg:col-span-8 relative min-w-0 w-full">
            <div className="flex gap-4 md:gap-6 items-center overflow-x-auto py-12 px-4 md:px-8 hide-scrollbar snap-x scroll-smooth w-full after:content-[''] after:w-4 after:flex-shrink-0">
              {events.map((event, idx) => {
                const isActive = idx === activeIdx;
                return (
                  <motion.div 
                    layout
                    transition={{ type: "spring", stiffness: 150, damping: 25, mass: 0.8 }}
                    key={event.id || idx}
                    id={`event-slide-${idx}`}
                    onClick={() => {
                      setActiveIdx(idx);
                      const el = document.getElementById(`event-slide-${idx}`);
                      const container = el?.parentElement;
                      if (el && container) {
                        const elRect = el.getBoundingClientRect();
                        const containerRect = container.getBoundingClientRect();
                        const scrollPos = container.scrollLeft + elRect.left - containerRect.left - (containerRect.width / 2) + (elRect.width / 2);
                        container.scrollTo({ left: scrollPos, behavior: 'smooth' });
                      }
                    }}
                    animate={{ 
                      opacity: isActive ? 1 : 0.5
                    }}
                    whileHover={!isActive ? { opacity: 0.8 } : {}}
                    className={`relative cursor-pointer flex-shrink-0 snap-center rounded-3xl overflow-hidden shadow-2xl transform-gpu will-change-transform transition-[filter] duration-500 ${isActive ? 'w-[240px] md:w-[320px] h-[360px] md:h-[480px] z-20 shadow-[0_20px_50px_rgba(0,0,0,0.5)] grayscale-0' : 'w-[140px] md:w-[200px] h-[220px] md:h-[340px] z-10 grayscale'}`}
                    style={{
                      border: isActive ? '1px solid var(--color-glass-border)' : '1px solid transparent'
                    }}
                  >
                    {(event.banner || event.image) ? (
                      <>
                        <img src={getImageUrl(event.banner || event.image)} className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-40 scale-125 pointer-events-none" alt="" />
                        <img src={getImageUrl(event.banner || event.image)} alt={event.title} className="relative w-full h-full object-contain transition-transform duration-1000 group-hover:scale-105 z-10" />
                      </>
                    ) : (
                      <div className="w-full h-full bg-[var(--color-bg-surface)] flex items-center justify-center text-[var(--color-text-muted)] font-mono text-xs text-center p-4">
                        {event.title}
                      </div>
                    )}
                    
                    {isActive && (
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0E16] via-[#0A0E16]/40 to-transparent flex flex-col justify-end">
                        <Link href={`/events/${event.slug || event.id}`} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-[var(--color-primary-accent)] flex items-center justify-center text-black shadow-lg transition-transform hover:scale-110 group">
                          <FiPlay size={24} className="ml-1" />
                        </Link>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>

            
            {activeEvent && (
              <div className="mt-4 flex flex-col items-center lg:items-start text-center lg:text-left">
                <div className="flex gap-2 justify-center lg:justify-start mb-6">
                  {events.map((_, idx) => (
                    <button 
                      key={idx}
                      onClick={() => {
                        setActiveIdx(idx);
                        const el = document.getElementById(`event-slide-${idx}`);
                        const container = el?.parentElement;
                        if (el && container) {
                          const elRect = el.getBoundingClientRect();
                          const containerRect = container.getBoundingClientRect();
                          const scrollPos = container.scrollLeft + elRect.left - containerRect.left - (containerRect.width / 2) + (elRect.width / 2);
                          container.scrollTo({ left: scrollPos, behavior: 'smooth' });
                        }
                      }}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === activeIdx ? 'w-8 bg-[var(--color-primary-accent)]' : 'bg-gray-700 hover:bg-gray-400'}`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>
                <h3 className="font-display font-bold text-2xl uppercase text-white mb-2 leading-tight">{activeEvent.title}</h3>
              </div>
            )}
          </div>
        </div>
      </div>
      <style dangerouslySetInnerHTML={{
        __html: `
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
