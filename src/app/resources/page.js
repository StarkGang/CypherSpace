"use client";

import React, { useEffect, useState } from "react";
import PageWrapper from "../../components/layout/PageWrapper";
import { CardSkeleton } from "../../components/ui/Skeleton";
import Button from "../../components/ui/Button";
import { FiExternalLink, FiDownload, FiFileText, FiBookOpen, FiTool, FiBox } from "react-icons/fi";
import { api } from "../../lib/api";
import { motion } from "framer-motion";

export default function ResourcesList() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const res = await api.get("/resources?per_page=100");
        setResources(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchResources();
  }, []);

  if (loading) return (
    <PageWrapper>
      <div className="container mx-auto max-w-7xl px-4 pt-8 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => <CardSkeleton key={i} />)}
        </div>
      </div>
    </PageWrapper>
  );

  const groupedResources = resources.reduce((acc, resource) => {
    const type = resource.category || "other";
    if (!acc[type]) acc[type] = [];
    acc[type].push(resource);
    return acc;
  }, {});

  const typeLabels = {
    fundamentals: "Blockchain Fundamentals",
    cryptography: "Cryptography",
    smart_contracts: "Smart Contracts & Development",
    research: "Research & Papers",
    tools: "Developer Tools",
    other: "Other Resources",
  };

  const getResourceIcon = (type) => {
    switch (type) {
      case 'fundamentals': return <FiBookOpen size={24} />;
      case 'cryptography': return <FiFileText size={24} />;
      case 'smart_contracts': return <FiBox size={24} />;
      case 'research': return <FiFileText size={24} />;
      case 'tools': return <FiTool size={24} />;
      default: return <FiFileText size={24} />;
    }
  };

  const getResourceBadge = (type) => {
    switch (type) {
      case 'fundamentals': return 'BASICS';
      case 'cryptography': return 'CRYPTO';
      case 'smart_contracts': return 'DEV';
      case 'research': return 'PAPER';
      case 'tools': return 'TOOL';
      default: return type.toUpperCase();
    }
  };

  return (
    <PageWrapper>
      <div className="container mx-auto max-w-5xl px-4 relative z-10 pt-8 pb-20">
        
        <div className="mb-16 text-left">
          <div className="inline-flex items-center gap-2 text-[var(--color-brand-primary)] text-xs font-mono font-semibold uppercase tracking-wider mb-6">
            Knowledge Base
          </div>
          <h1 className="text-4xl md:text-6xl font-bold font-display mb-6 text-[var(--color-text-primary)]">
            Resources
          </h1>
          <p className="text-xl text-[var(--color-text-secondary)] max-w-2xl">
            Curated datasets, tools, and tutorials for the community.
          </p>
        </div>

        {Object.keys(groupedResources).length > 0 ? (
          Object.entries(groupedResources).map(([type, items]) => (
            <div key={type} className="mb-20">
              <h2 className="font-display font-bold text-2xl uppercase mb-8 text-[var(--color-text-primary)] flex items-center gap-4">
                {typeLabels[type] || typeLabels.other}
                <div className="flex-1 h-px bg-[var(--color-border-subtle)]"></div>
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {items.map((resource, i) => (
                  <motion.div 
                    key={resource.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className="flex flex-col"
                  >
                    <div className="glass-card flex flex-col h-full p-6 hover:border-[var(--color-brand-primary)]/40 transition-all duration-300">
                      
                      {resource.thumbnail && (
                        <div className="mb-6 w-full aspect-video rounded-xl overflow-hidden border border-[var(--color-border-subtle)] shadow-sm">
                          <img src={resource.thumbnail} alt={resource.title} className="w-full h-full object-cover" />
                        </div>
                      )}

                      <div className="flex justify-between items-start mb-6">
                        <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-[var(--color-bg-deep)] border border-[var(--color-border-subtle)] text-[var(--color-brand-primary)] shadow-sm">
                          {getResourceIcon(type)}
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-brand-primary)] mt-2">
                          {getResourceBadge(type)}
                        </span>
                      </div>

                      <h3 className="font-display font-bold text-xl mb-3 line-clamp-2 text-[var(--color-text-primary)] group-hover:text-[var(--color-brand-primary)] transition-colors">
                        {resource.title}
                      </h3>
                      
                      <p className="text-[var(--color-text-secondary)] mb-6 flex-grow text-sm md:text-base line-clamp-4">
                        {resource.description}
                      </p>
                      
                      <div className="mt-auto pt-4 border-t border-[var(--color-border-subtle)]">
                        <a 
                          href={resource.link}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 text-sm font-bold text-[var(--color-brand-primary)] hover:text-[var(--color-brand-primary)]/80 transition-colors"
                        >
                          <FiExternalLink size={16} />
                          Open Resource
                        </a>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="glass-card text-center py-20">
            <h3 className="font-display font-bold text-2xl uppercase mb-2 text-[var(--color-text-primary)]">No resources found</h3>
          </div>
        )}

      </div>
    </PageWrapper>
  );
}
