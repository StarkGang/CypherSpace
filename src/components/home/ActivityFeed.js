"use client";
import React from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";
import SectionHeading from "../design-system/SectionHeading";

export default function ActivityFeed({ activities }) {
  if (!activities || activities.length === 0) return null;

  const typeMap = {
    project: { color: "#4361ee", icon: "📦", prefix: "PROJ", path: "/projects" },
    event: { color: "#00d4aa", icon: "🗓️", prefix: "EVNT", path: "/events" },
    paper: { color: "#7c3aed", icon: "📄", prefix: "PAPR", path: "/papers" },
    resource: { color: "#f472b6", icon: "📚", prefix: "RSRC", path: "/resources" },
    blog: { color: "#fbbf24", icon: "✍️", prefix: "BLOG", path: "/blog" },
    achievement: { color: "#facc15", icon: "🏆", prefix: "ACHV", path: "/achievements" },
    team: { color: "#3b82f6", icon: "👥", prefix: "TEAM", path: "/team", exactPath: true },
    settings: { color: "#94a3b8", icon: "⚙️", prefix: "SYSM", path: null }
  };

  return (
    <section className="py-24 px-4 w-full relative z-10 border-t border-[var(--color-border-subtle)]">
      <div className="container mx-auto max-w-4xl">
        <SectionHeading
          title="Network Explorer"
          subtitle="Live telemetry, smart contract deployments, and on-chain milestones across the CypherSpace network."
          metadata="LIVE MEMPOOL"
          align="center"
          className="mb-16"
        />

        <div className="chain-card overflow-hidden">
          
          <div
            className="grid px-6 py-4 text-xs font-mono font-bold tracking-widest uppercase border-b"
            style={{
              gridTemplateColumns: "100px 1fr 140px",
              borderColor: "var(--color-border-subtle)",
              background: "var(--color-bg-dark)",
              color: "var(--color-text-muted)"
            }}
          >
            <span>TX HASH</span>
            <span>PAYLOAD / ENTITY</span>
            <span className="text-right">TIMESTAMP</span>
          </div>

          
          <div className="divide-y" style={{ borderColor: "var(--color-border-subtle)" }}>
            {activities.slice(0, 8).map((activity, index) => {
              const mapData = typeMap[activity.entity_type] || typeMap.settings;
              const timeAgo = activity.created_at ? formatDistanceToNow(new Date(activity.created_at), { addSuffix: true }) : "";

              
              const fakeHash = "0x" + (activity.id || "0").toString().slice(-6).padStart(6, "0") + (index * 3).toString(16).padStart(2, "0");

              const content = (
                <div
                  className="grid px-6 py-4 text-sm font-mono items-center transition-colors duration-300 hover:bg-[var(--color-bg-dark)] group"
                  style={{ gridTemplateColumns: "100px 1fr 140px" }}
                >
                  
                  <span style={{ color: "#2563eb" }}>
                    {fakeHash}
                  </span>

                  
                  <div className="flex items-center gap-4 min-w-0 pr-4">
                    <span
                      className="px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-widest hidden sm:inline-block"
                      style={{
                        background: `${mapData.color}15`,
                        border: `1px solid ${mapData.color}40`,
                        color: mapData.color
                      }}
                    >
                      {mapData.prefix}_{activity.type === 'published' ? 'PUB' : 'NEW'}
                    </span>
                    <span className="truncate" style={{ color: "var(--color-text-primary)" }}>
                      {activity.title || activity.entity_slug || "System Update"}
                    </span>
                  </div>

                  
                  <div className="text-right flex items-center justify-end gap-2" style={{ color: "var(--color-text-muted)" }}>
                    <span className="text-xs">{timeAgo}</span>
                    {(mapData.path && (activity.entity_slug || mapData.exactPath)) && (
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: "#2563eb" }}>
                        →
                      </span>
                    )}
                  </div>
                </div>
              );

              return (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
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

      </div>
    </section>
  );
}
