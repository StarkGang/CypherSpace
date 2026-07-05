"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import PageWrapper from "../../../components/layout/PageWrapper";
import Paper from "../../../components/design-system/Paper";
import Sticker from "../../../components/design-system/Sticker";
import { PageSkeleton, CardSkeleton } from "../../../components/ui/Skeleton";
import Button from "../../../components/ui/Button";
import { FiCalendar, FiMapPin, FiClock, FiExternalLink } from "react-icons/fi";
import { api } from "../../../lib/api";

export default function EventDetail() {
  const params = useParams();
  const slug = params?.slug;
  
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!slug) return;
    
    const fetchEvent = async () => {
      try {
        const res = await api.get(`/events/${slug}`);
        let fetchedEvent = res.data.data;
        if (fetchedEvent.status !== 'past' && fetchedEvent.date) {
          const eventDate = new Date(fetchedEvent.date);
          if (!isNaN(eventDate.getTime())) {
            eventDate.setHours(23, 59, 59, 999);
            if (eventDate < new Date()) {
              fetchedEvent = { ...fetchedEvent, status: 'past' };
            }
          }
        }
        setEvent(fetchedEvent);
      } catch (err) {
        setError("Event not found");
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [slug]);

  if (loading) return <PageWrapper>
      <div className="container mx-auto max-w-4xl px-4 py-20">
        <CardSkeleton />
      </div>
    </PageWrapper>;

  if (error || !event) {
    return (
      <PageWrapper>
        <div className="container mx-auto px-4 py-20 flex justify-center">
          <Paper className="text-center p-12" rotate={-1}>
            <h1 className="text-4xl font-display font-black uppercase mb-4">404 - Not Found</h1>
            <p className="font-mono mb-8">{error}</p>
            <Button href="/events">Back to Events</Button>
          </Paper>
        </div>
      </PageWrapper>
    );
  }

  const isPast = event.status === 'past';
  const isOngoing = event.status === 'ongoing';

  return (
    <PageWrapper pattern="gingham">
      <div className="container mx-auto max-w-5xl px-4 py-8">
        
        <Paper variant="default" className="p-0 overflow-hidden" shadowSize="lg">
          
          <div className="w-full h-64 md:h-[400px] bg-gray-100 border-b-brutal relative overflow-hidden">
            {event.banner ? (
              <img src={event.banner} alt={event.title} className="w-full h-full object-cover" />
            ) : (
              <img src="https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2000&auto=format&fit=crop" alt="Fluid flow fallback" className="w-full h-full object-cover" />
            )}
            
            <div className="absolute bottom-4 right-8 z-10 flex gap-2">
              {isOngoing && <Sticker color="lime" size="lg" peel>ONGOING</Sticker>}
              {!isOngoing && !isPast && <Sticker color="yellow" size="lg" peel>UPCOMING</Sticker>}
              {isPast && <Sticker color="black" size="lg" peel>PAST EVENT</Sticker>}
            </div>
          </div>

          <div className="p-6 md:p-12 bg-white dark:bg-[#161b22]">
            
            <div className="mb-10 border-b-4 border-black dark:border-white pb-8">
              <h1 className="font-display font-black text-5xl md:text-7xl uppercase tracking-tighter leading-none mb-6 dark:text-white">
                {event.title}
              </h1>
              
              <div className="flex flex-wrap gap-4 mt-8">
                {event.date && (
                  <div className="bg-[var(--color-paper-cream)] dark:bg-gray-800 border-2 border-black dark:border-white p-3 flex items-center gap-3 shadow-[4px_4px_0px_#1A1A1A] dark:shadow-[4px_4px_0px_#FFFFFF]">
                    <div className="bg-[var(--color-sticker-yellow)] p-2 border-2 border-black dark:border-white text-black">
                      <FiCalendar size={24} />
                    </div>
                    <div>
                      <p className="font-mono text-xs font-bold uppercase text-gray-500 dark:text-gray-400">Date</p>
                      <p className="font-display font-bold uppercase dark:text-white">{event.date}</p>
                    </div>
                  </div>
                )}
                
                {event.time && (
                  <div className="bg-[var(--color-paper-cream)] dark:bg-gray-800 border-2 border-black dark:border-white p-3 flex items-center gap-3 shadow-[4px_4px_0px_#1A1A1A] dark:shadow-[4px_4px_0px_#FFFFFF]">
                    <div className="bg-[var(--color-sticker-pink)] p-2 border-2 border-black dark:border-white text-black">
                      <FiClock size={24} />
                    </div>
                    <div>
                      <p className="font-mono text-xs font-bold uppercase text-gray-500 dark:text-gray-400">Time</p>
                      <p className="font-display font-bold uppercase dark:text-white">{event.time}</p>
                    </div>
                  </div>
                )}
                
                {event.venue && (
                  <div className="bg-[var(--color-paper-cream)] dark:bg-gray-800 border-2 border-black dark:border-white p-3 flex items-center gap-3 shadow-[4px_4px_0px_#1A1A1A] dark:shadow-[4px_4px_0px_#FFFFFF]">
                    <div className="bg-[var(--color-sticker-blue)] p-2 border-2 border-black dark:border-white text-black">
                      <FiMapPin size={24} />
                    </div>
                    <div>
                      <p className="font-mono text-xs font-bold uppercase text-gray-500 dark:text-gray-400">Venue</p>
                      <p className="font-display font-bold uppercase dark:text-white">{event.venue}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {(() => {
              const hasSidebar = !!event.registration_link;
              
              return (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                  <div className={hasSidebar ? "md:col-span-2" : "md:col-span-3"}>
                    {event.description && (
                      <>
                        <h2 className="font-display font-black text-3xl uppercase mb-6 bg-[var(--color-sticker-lime)] text-black inline-block px-2 border-brutal">
                          {isPast ? "Event Recap" : "Event Details"}
                        </h2>
                        
                        <div className="font-body text-lg leading-relaxed whitespace-pre-wrap text-gray-800 dark:text-gray-300">
                          {event.description}
                        </div>
                      </>
                    )}

                    {event.gallery && event.gallery.length > 0 && (
                      <div className="mt-16">
                        <h2 className="font-display font-black text-3xl uppercase mb-6 bg-[var(--color-sticker-yellow)] inline-block px-2 border-brutal">
                          Gallery
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {event.gallery.map((imgUrl, i) => (
                            <div key={i} className="aspect-[4/3] border-brutal overflow-hidden relative bg-gray-100 dark:bg-gray-800">
                              <img 
                                src={imgUrl} 
                                alt={`${event.title} gallery ${i+1}`} 
                                className="w-full h-full object-cover hover:scale-105 transition-transform" 
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  e.target.nextSibling.style.display = 'flex';
                                }}
                              />
                              <div className="hidden w-full h-full flex-col items-center justify-center text-gray-400">
                                <FiExternalLink className="w-8 h-8 mb-2" />
                                <a href={imgUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-mono font-bold uppercase hover:underline">
                                  External Link
                                </a>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {hasSidebar && (
                    <div className="md:col-span-1 flex flex-col gap-8">
                      {!isPast && event.registration_link && (
                        <Paper variant="pinned" noPadding className="p-6 bg-[var(--color-sticker-pink)] border-brutal" rotate={1} shadowSize="sm">
                          <h3 className="font-display font-black text-2xl uppercase mb-2">Join Us</h3>
                          <p className="font-mono text-sm font-bold mb-6">Secure your spot before it fills up!</p>
                          <Button href={event.registration_link} variant="primary" fullWidth icon={<FiExternalLink />}>
                            Register Now
                          </Button>
                        </Paper>
                      )}

                      {isPast && event.registration_link && (
                        <Paper variant="pinned" noPadding className="p-6 bg-[var(--color-paper-cream)]" rotate={-1} shadowSize="sm">
                          <h3 className="font-mono font-bold uppercase tracking-widest text-sm mb-4 border-b border-black pb-2">Resources</h3>
                          <Button href={event.registration_link} variant="outline" fullWidth icon={<FiExternalLink />}>
                            Event Material / Link
                          </Button>
                        </Paper>
                      )}
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        </Paper>
        
        <div className="mt-12 text-center">
          <Button href="/events" variant="ghost">&larr; Back to all events</Button>
        </div>

      </div>
    </PageWrapper>
  );
}
