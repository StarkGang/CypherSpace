"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { FaGithub, FaLinkedin, FaGlobe } from "react-icons/fa";

export default function TeamPreview({ team }) {
  const [activeIdx, setActiveIdx] = useState(Math.floor((team?.length || 0) / 2));
  
  useEffect(() => {
    if (!team || team.length === 0) return;
    const interval = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % team.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [team]);

  if (!team || team.length === 0) return null;

  const activeMember = team[activeIdx];

  return (
    <section className="py-24 px-4 w-full relative z-10 overflow-hidden bg-[var(--color-bg-deep)]">
      <div className="container mx-auto w-full max-w-full px-0">
        <div className="flex justify-center items-center h-64 md:h-80 mb-12 relative -mx-4 md:-mx-12">
          
          <div className="flex items-center justify-center gap-2 md:gap-4 px-2 md:px-8 w-full">
            {team.map((member, index) => {
              const isActive = index === activeIdx;
              const isEven = index % 2 === 0;
              
              return (
                <motion.div
                  layout
                  transition={{ type: "spring", stiffness: 150, damping: 20, mass: 0.8 }}
                  key={member.id || index}
                  onClick={() => setActiveIdx(index)}
                  className={`relative cursor-pointer flex-shrink-0 bg-[var(--color-bg-surface)] 
                    ${isActive ? 'w-32 h-48 md:w-64 md:h-[400px] z-20 shadow-[0_0_50px_var(--color-neon-glow)]' : 'w-12 h-16 md:w-40 md:h-64 z-10 opacity-60 hover:opacity-100'}
                  `}
                  style={{
                    filter: isActive ? 'none' : 'grayscale(100%) contrast(1.2)',
                    border: isActive ? '1px solid var(--color-glass-border)' : '1px solid transparent',
                  }}
                >
                  {member.image ? (
                    <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-display font-bold text-3xl uppercase bg-[var(--color-bg-surface)] text-[var(--color-text-muted)]">
                      {member.name?.charAt(0) || "U"}
                    </div>
                  )}
                  {isActive && (
                    <div className="absolute inset-0 border-[4px] border-[var(--color-primary-accent)] pointer-events-none opacity-40"></div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
        {activeMember && (
          <div className="flex flex-col items-center text-center max-w-2xl mx-auto px-4">
            <h3 className="font-display font-bold text-3xl md:text-5xl uppercase text-white mb-4 tracking-tight">
              {activeMember.name}
            </h3>
            
            <p className="text-[var(--color-text-secondary)] text-base md:text-xl font-body leading-relaxed mb-6">
              "{activeMember.role || "Core Contributor"}"
            </p>

            <div className="flex gap-4 mb-10 text-[var(--color-text-secondary)]">
              {activeMember.github && (
                <a href={activeMember.github} target="_blank" rel="noreferrer" className="hover:text-[var(--color-primary-accent)] transition-colors">
                  <FaGithub size={20} />
                </a>
              )}
              {activeMember.linkedin && (
                <a href={activeMember.linkedin} target="_blank" rel="noreferrer" className="hover:text-[var(--color-primary-accent)] transition-colors">
                  <FaLinkedin size={20} />
                </a>
              )}
              {activeMember.portfolio && (
                <a href={activeMember.portfolio} target="_blank" rel="noreferrer" className="hover:text-[var(--color-primary-accent)] transition-colors">
                  <FaGlobe size={20} />
                </a>
              )}
            </div>
            <div className="flex gap-3 justify-center mb-12">
              {team.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveIdx(idx)}
                  className={`transition-all duration-300 rounded-[2px] ${idx === activeIdx ? 'w-4 h-4 bg-[var(--color-primary-accent)]' : 'w-2 h-2 bg-gray-700 hover:bg-gray-500 mt-1'}`}
                  aria-label={`Select ${idx}`}
                />
              ))}
            </div>

            <Link href="/team" className="btn-outline">
              Meet All Nodes
            </Link>
          </div>
        )}
        
      </div>
    </section>
  );
}
