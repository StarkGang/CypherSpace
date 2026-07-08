"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { FiArrowRight, FiPlay, FiCalendar, FiMapPin, FiClock } from "react-icons/fi";

export default function UpcomingEvents({ events }) {
  const [activeIdx, setActiveIdx] = useState(0);
  if (!events || events.length === 0) return null;

  const activeEvent = events[activeIdx];

  return (
    <section className="py-24 relative z-10 overflow-hidden bg-[var(--color-bg-deep)]">
      <div className="w-full overflow-hidden whitespace-nowrap mb-20 flex" style={{ userSelect: "none" }}>
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ repeat: Infinity, duration: 120, ease: "linear" }}
          className="flex whitespace-nowrap will-change-transform transform-gpu"
        >
          {[...Array(4)].map((_, i) => (
            <span key={i} className="font-display font-bold text-[8vw] leading-none uppercase text-white/40 tracking-tight px-8">
              UPCOMING EVENTS
            </span>
          ))}
        </motion.div>
      </div>

      <div className="w-full mx-auto max-w-[1440px] px-6 md:px-12 relative">
        <div className="relative min-h-[480px]">
          <div className="flex flex-col md:flex-row gap-1 md:gap-2 relative md:absolute md:-top-12 left-0 right-0 z-20 md:px-8 mb-6 md:mb-0 bg-black/40 md:bg-transparent p-1.5 md:p-0 rounded-2xl md:rounded-none border border-white/10 md:border-transparent">
            {events.map((event, idx) => {
              const isActive = idx === activeIdx;
              return (
                <button
                  key={event.id || idx}
                  onClick={() => setActiveIdx(idx)}
                  className={`w-full md:w-auto px-4 md:px-6 py-3.5 md:py-3 rounded-xl md:rounded-b-none md:rounded-t-xl font-mono text-xs font-bold tracking-widest uppercase transition-all duration-300 md:border ${isActive ? 'bg-[#1A2230] text-white shadow-md md:shadow-none md:border-white/20 md:border-b-transparent h-auto md:h-14' : 'bg-transparent md:bg-[#0A0E16] text-[var(--color-text-secondary)] hover:text-white md:border-transparent md:hover:bg-[#131A28] h-auto md:h-12 md:mt-2'}`}
                  style={isActive ? { flexGrow: 2, flexBasis: 'auto' } : { flexGrow: 1, flexBasis: 'auto' }}
                >
                  <span className="line-clamp-1">{event.title}</span>
                </button>
              );
            })}
          </div>

          <div className="relative w-full">
            <div className="relative z-30 bg-[#1A2230] border border-white/20 rounded-3xl md:rounded-tl-none shadow-[0_0_50px_rgba(0,0,0,0.5)] p-6 md:p-10 overflow-hidden text-white">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIdx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-center"
              >
                <div className="relative aspect-video lg:col-span-3 bg-[#0A0E16] rounded-2xl overflow-hidden group border border-white/10 shadow-2xl flex items-center justify-center">
                  {(activeEvent.banner || activeEvent.image) ? (
                    <>
                      <img src={activeEvent.banner || activeEvent.image} alt="" className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-40 scale-125 pointer-events-none" />
                      <img src={activeEvent.banner || activeEvent.image} alt={activeEvent.title} className="relative w-full h-full object-contain transition-transform duration-700 group-hover:scale-105 z-10" />
                    </>
                  ) : (
                    <div className="w-full h-full bg-[#0A0E16] flex items-center justify-center text-gray-600 font-mono text-sm">
                      NO IMAGE
                    </div>
                  )}
                  <Link href={`/events/${activeEvent.slug || activeEvent.id}`} className="absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity opacity-0 group-hover:opacity-100">
                    <div className="w-20 h-20 bg-[var(--color-primary-accent)] rounded-full flex items-center justify-center shadow-[0_0_40px_var(--color-neon-glow)] transform scale-90 group-hover:scale-100 transition-all">
                      <FiPlay size={30} className="text-white ml-2" />
                    </div>
                  </Link>
                </div>
                <div className="flex flex-col gap-6 lg:col-span-2 py-4">
                  <div>
                    <span className="inline-block px-3 py-1 rounded-full bg-[var(--color-primary-accent)] text-white font-mono text-[10px] font-bold tracking-widest uppercase mb-4 shadow-[0_0_15px_var(--color-neon-glow)]">
                      {activeEvent.status || "Upcoming Event"}
                    </span>
                    <h3 className="font-display font-bold text-4xl md:text-5xl uppercase leading-[0.95] tracking-tight mb-4 text-white">
                      {activeEvent.title}
                    </h3>

                  </div>

                  <div className="flex items-center divide-x divide-white/20 text-xs font-mono font-bold uppercase tracking-wider text-[var(--color-text-secondary)] my-2">
                    {(() => {
                      const isMultiDay = activeEvent.end_date && activeEvent.end_date !== activeEvent.date;
                      if (!activeEvent.date) {
                        return (
                          <div className="flex items-center gap-2 pr-4"><FiCalendar size={14} className="text-[var(--color-primary-accent)]" /> TBA</div>
                        );
                      }

                      const start = new Date(activeEvent.date).toLocaleDateString("en-US", { month: "short", day: "numeric" });
                      const startYear = new Date(activeEvent.date).getFullYear();

                      if (isMultiDay) {
                        const end = new Date(activeEvent.end_date).toLocaleDateString("en-US", { month: "short", day: "numeric" });
                        const endYear = new Date(activeEvent.end_date).getFullYear();
                        const startTime = activeEvent.time ? ` @ ${activeEvent.time}` : "";
                        const endTime = activeEvent.end_time ? ` @ ${activeEvent.end_time}` : "";
                        
                        return (
                          <div className="flex items-center gap-2 pr-4">
                            <FiCalendar size={14} className="text-[var(--color-primary-accent)]" /> 
                            {start}{startTime} — {end}{endTime}, {endYear}
                          </div>
                        );
                      }

                      return (
                        <>
                          <div className="flex items-center gap-2 pr-4">
                            <FiCalendar size={14} className="text-[var(--color-primary-accent)]" /> 
                            {start}, {startYear}
                          </div>
                          {activeEvent.time && (
                            <div className="flex items-center gap-2 px-4">
                              <FiClock size={14} className="text-[var(--color-primary-accent)]" /> 
                              {activeEvent.time}{activeEvent.end_time ? ` - ${activeEvent.end_time}` : ""}
                            </div>
                          )}
                        </>
                      );
                    })()}
                    {activeEvent.venue && (
                      <div className="flex items-center gap-2 pl-4"><FiMapPin size={14} className="text-[var(--color-primary-accent)]" /> {activeEvent.venue}</div>
                    )}
                  </div>

                  <div className="flex items-end gap-3 mt-2">
                    <span className="font-display font-bold text-5xl tracking-tighter text-white leading-none">
                      {activeEvent.mrp ? activeEvent.mrp : "FREE"}
                    </span>
                    <span className="text-gray-500 font-mono text-[10px] uppercase tracking-widest font-bold mb-1">/ ENTRY</span>
                  </div>

                  <div className="flex flex-wrap gap-4 mt-4">
                    {activeEvent.registration_link && (
                      <a href={activeEvent.registration_link} target="_blank" rel="noreferrer" className="btn-solid-primary shadow-[0_0_20px_var(--color-neon-glow)]">
                        Register Now <FiArrowRight size={16} />
                      </a>
                    )}
                    <Link href={`/events/${activeEvent.slug || activeEvent.id}`} className="btn-outline">
                      More Details
                    </Link>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
            </div>
            <div className="absolute top-4 left-4 right-4 h-full bg-[#131A28] border border-white/10 rounded-3xl -z-10 shadow-lg" style={{ transform: "translateY(16px)" }}></div>
            <div className="absolute top-8 left-8 right-8 h-full bg-[#0A0E16] border border-white/5 rounded-3xl -z-20 shadow-lg" style={{ transform: "translateY(32px)" }}></div>
          </div>
          
        </div>

        <div className="mt-20 flex justify-center">
          <Link href="/events" className="group flex items-center gap-3 px-8 py-4 bg-[#1A2230] hover:bg-[#2A3445] text-white rounded-full font-mono text-xs font-bold uppercase tracking-widest transition-all duration-300 border border-white/10 hover:border-white/30 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
            View All Events <FiArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1 text-[var(--color-primary-accent)]" />
          </Link>
        </div>
      </div>
    </section>
  );
}
