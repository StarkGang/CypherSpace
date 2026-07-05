"use client";

import React, { useEffect, useState } from "react";
import PageWrapper from "../../components/layout/PageWrapper";
import { CardSkeleton } from "../../components/ui/Skeleton";
import { FaGithub, FaLinkedin, FaGlobe } from "react-icons/fa";
import { FiUsers } from "react-icons/fi";
import { api } from "../../lib/api";
import { motion } from "framer-motion";

export default function TeamList() {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const res = await api.get("/team?per_page=100");
        setTeam(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTeam();
  }, []);

  if (loading) return (
    <PageWrapper>
      <div className="container mx-auto max-w-7xl px-4 pt-32 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => <CardSkeleton key={i} />)}
        </div>
      </div>
    </PageWrapper>
  );

  return (
    <PageWrapper>
      <div className="container mx-auto max-w-7xl px-4 relative z-10 pt-24 pb-20">
        
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 text-[var(--color-brand-tertiary)] text-xs font-mono font-semibold uppercase tracking-wider mb-6">
            <FiUsers />
            Club Directory
          </div>
          <h1 className="text-4xl md:text-6xl font-bold font-display mb-6">
            The <span className="glow-text">Makers</span>
          </h1>
          <p className="text-xl text-[var(--color-text-secondary)] max-w-2xl mx-auto">
            Meet the people building the future of Cypher Space.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8 mb-20">
          {team.length > 0 ? (
            team.map((member, index) => (
              <motion.div 
                key={member.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: (index % 4) * 0.1 }}
                className="h-full relative group"
              >
                <div className="glass-card h-full flex flex-col p-6 items-center text-center hover:border-[var(--color-brand-primary)]/50 transition-all duration-300">
                  <div className="w-28 h-28 md:w-32 md:h-32 rounded-full border border-white/10 overflow-hidden bg-gray-800 mb-6 relative ring-4 ring-black/20 group-hover:ring-[var(--color-brand-primary)]/30 transition-all duration-500">
                    {member.image ? (
                      <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[var(--color-brand-primary)] to-[var(--color-brand-tertiary)] text-white font-display font-bold text-4xl uppercase">
                        {member.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  
                  <h3 className="font-display font-bold text-xl uppercase leading-snug mb-1 text-[var(--color-text-primary)]">
                    {member.name}
                  </h3>
                  
                  <p className="font-mono text-xs font-semibold text-[var(--color-brand-primary)] uppercase tracking-wider mb-4">
                    {member.role}
                  </p>
                  
                  {member.bio && (
                    <p className="text-sm text-[var(--color-text-secondary)] line-clamp-3 mb-6 flex-grow">
                      {member.bio}
                    </p>
                  )}
                  
                  <div className="flex gap-4 mt-auto pt-5 w-full justify-center border-t border-[var(--color-border-subtle)]">
                    {member.github && (
                      <a href={member.github} target="_blank" rel="noreferrer" className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors">
                        <FaGithub size={20} />
                      </a>
                    )}
                    {member.linkedin && (
                      <a href={member.linkedin} target="_blank" rel="noreferrer" className="text-[var(--color-text-muted)] hover:text-blue-400 transition-colors">
                        <FaLinkedin size={20} />
                      </a>
                    )}
                    {member.portfolio && (
                      <a href={member.portfolio} target="_blank" rel="noreferrer" className="text-[var(--color-text-muted)] hover:text-[var(--color-brand-primary)] transition-colors">
                        <FaGlobe size={20} />
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full">
              <div className="glass-card text-center py-20">
                <h3 className="font-display font-bold text-2xl uppercase mb-2 text-[var(--color-text-primary)]">Team directory empty</h3>
              </div>
            </div>
          )}
        </div>

      </div>
    </PageWrapper>
  );
}
