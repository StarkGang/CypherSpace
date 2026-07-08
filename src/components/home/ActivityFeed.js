"use client";
import React from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";

export default function ActivityFeed({ activities }) {
  if (!activities || activities.length === 0) return null;

  const typeMap = {
    project: { color: "#4361ee", icon: "PROJ", prefix: "PROJ", path: "/projects" },
    event: { color: "#00d4aa", icon: "EVNT", prefix: "EVNT", path: "/events" },
    paper: { color: "#7c3aed", icon: "PAPR", prefix: "PAPR", path: "/papers" },
    resource: { color: "#f472b6", icon: "RSRC", prefix: "RSRC", path: "/resources" },
    blog: { color: "#fbbf24", icon: "BLOG", prefix: "BLOG", path: "/blog" },
    achievement: { color: "#facc15", icon: "ACHV", prefix: "ACHV", path: "/achievements" },
    team: { color: "#3b82f6", icon: "TEAM", prefix: "TEAM", path: "/team", exactPath: true },
    settings: { color: "#94a3b8", icon: "SYSM", prefix: "SYSM", path: null }
  };

  return (
    <section className="py-24 px-4 w-full relative z-10 bg-[var(--color-bg-deep)]">
      <div className="w-full mx-auto max-w-[1440px] px-6 md:px-12">
        <div className="mb-16">
          <h2 className="font-display font-bold text-4xl md:text-5xl uppercase leading-none text-white tracking-tight">
            ACTIVITY<br/>FEED
          </h2>
        </div>

        <div className="flex flex-col gap-4">
          {activities.slice(0, 8).map((activity, index) => {
            const mapData = typeMap[activity.entity_type] || typeMap.settings;
            const timeAgo = activity.created_at ? formatDistanceToNow(new Date(activity.created_at), { addSuffix: true }) : "";

            const content = (
              <div className="flex flex-col md:flex-row items-stretch bg-[#0A0E16] border border-white p-4 md:p-6 transition-all duration-300 hover:border-[var(--color-primary-accent)] group">
                <div className="hidden md:flex flex-col items-center justify-center w-24 border-r border-white/20 pr-6 mr-6 group-hover:border-[var(--color-primary-accent)]/30 transition-colors">
                  <span className="font-mono text-2xl font-bold text-white group-hover:text-[var(--color-primary-accent)] transition-colors">
                    {mapData.icon}
                  </span>
                  <span className="font-mono text-[10px] uppercase text-gray-500 mt-2 text-center">
                    {timeAgo}
                  </span>
                </div>
                <div className="flex-grow flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-2 md:hidden">
                    <span className="font-mono text-xs font-bold text-white">{mapData.icon}</span>
                    <span className="font-mono text-[10px] text-gray-500">{timeAgo}</span>
                  </div>
                  <h3 className="font-display font-bold text-xl md:text-2xl uppercase text-white tracking-tight mb-2 group-hover:text-white">
                    {activity.title || activity.entity_slug || "System Update"}
                  </h3>
                  <p className="font-body text-sm text-[var(--color-text-secondary)] line-clamp-2 max-w-2xl">
                    {activity.summary || `A new ${activity.entity_type || 'item'} was added to the network.`}
                  </p>
                </div>
                <div className="mt-4 md:mt-0 flex items-center md:pl-6">
                  <span className="font-mono text-xs font-bold uppercase tracking-widest text-white flex items-center gap-2 group-hover:text-[var(--color-primary-accent)] transition-colors">
                    View Details
                    <FiArrowRight size={16} className="transform transition-transform duration-300 group-hover:translate-x-2" />
                  </span>
                </div>
              </div>
            );

            return (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                {(mapData.path && (activity.entity_slug || mapData.exactPath)) ? (
                  <Link href={mapData.exactPath ? mapData.path : `${mapData.path}/${activity.entity_slug}`} className="block">
                    {content}
                  </Link>
                ) : (
                  <div>{content}</div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
