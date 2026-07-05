"use client";

import React, { useEffect, useState } from "react";
import PageWrapper from "../../components/layout/PageWrapper";
import SectionHeading from "../../components/design-system/SectionHeading";
import Paper from "../../components/design-system/Paper";
import Sticker from "../../components/design-system/Sticker";
import { PageSkeleton, CardSkeleton } from "../../components/ui/Skeleton";
import { FiAward } from "react-icons/fi";
import { api } from "../../lib/api";

function formatDate(dateStr) {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', timeZone: 'UTC' });
  } catch {
    return dateStr;
  }
}

export default function AchievementsList() {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const res = await api.get("/achievements?per_page=50");
        setAchievements(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAchievements();
  }, []);

  if (loading) return <PageWrapper pattern="grid">
      <div className="container mx-auto max-w-7xl px-4 pt-32 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => <CardSkeleton key={i} />)}
        </div>
      </div>
    </PageWrapper>;

  return (
    <PageWrapper pattern="gingham">
      <div className="container mx-auto max-w-6xl px-4">
        
        <SectionHeading 
          title="Wall of Fame" 
          subtitle="Milestones, hackathon wins, and community achievements."
          metadata="CLUB ACHIEVEMENTS"
          className="mb-16"
        />

        <div className="relative">
          <div className="flex flex-col gap-12 sm:gap-24 relative">
            {achievements.length > 0 ? (
              <>
                <div className="absolute left-8 sm:left-1/2 top-0 bottom-0 w-[2px] bg-[var(--color-border-subtle)] -translate-x-1/2 z-0 hidden sm:block" />
                {achievements.map((achievement, i) => {
                const isEven = i % 2 === 0;
                return (
                  <div key={achievement.id} className={`relative flex flex-col sm:flex-row items-center w-full ${isEven ? 'sm:justify-start' : 'sm:justify-end'}`}>
                    
                    <div className="absolute left-8 sm:left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 bg-[var(--color-brand-secondary)] border border-[var(--color-border-subtle)] rounded-full z-10 hidden sm:flex items-center justify-center">
                      <FiAward size={16} />
                    </div>

                    <div className={`w-full sm:w-1/2 ${isEven ? 'sm:pr-8' : 'sm:pl-8'}`}>
                      <Paper 
                        variant="default" 
                        rotate={isEven ? -1 : 1} 
                        shadowSize="lg"
                        className="p-0 overflow-hidden group hover:-translate-y-2 transition-transform duration-300"
                      >
                        {achievement.image && (
                          <div className="w-full h-48 border-b border-[var(--color-border-subtle)] overflow-hidden">
                            <img src={achievement.image} alt={achievement.title} className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-500" />
                          </div>
                        )}
                        
                        <div className="p-6">
                          <div className="flex justify-between items-start mb-4">
                            <Sticker color={isEven ? "lime" : "pink"} size="sm" animate={false}>ACHIEVEMENT</Sticker>
                            <span className="font-mono font-bold uppercase bg-[var(--color-text-primary)] text-[var(--color-bg-deep)] px-2 py-0.5 text-sm rounded">
                              {formatDate(achievement.date)}
                            </span>
                          </div>
                          
                          <h3 className="font-display font-black text-2xl uppercase leading-tight mb-3">
                            {achievement.title}
                          </h3>
                          
                          <p className="font-body text-[var(--color-text-secondary)] mb-6">
                            {achievement.description}
                          </p>

                          {achievement.members && achievement.members.length > 0 && (
                            <div className="bg-[var(--color-bg-surface)] p-3 border-l-4 border-[var(--color-text-primary)]">
                              <p className="font-mono text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Makers</p>
                              <p className="font-display font-bold uppercase text-sm">{achievement.members.join(", ")}</p>
                            </div>
                          )}
                        </div>
                      </Paper>
                    </div>

                  </div>
                );
              })}
              </>
            ) : (
              <Paper variant="default" className="text-center py-20 w-full max-w-2xl mx-auto relative z-10">
                <h3 className="font-display font-black text-2xl uppercase mb-2">No achievements found yet!</h3>
              </Paper>
            )}
          </div>
        </div>

      </div>
    </PageWrapper>
  );
}
