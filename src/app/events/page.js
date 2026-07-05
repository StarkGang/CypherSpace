"use client";

import React, { useEffect, useState } from "react";
import PageWrapper from "../../components/layout/PageWrapper";
import SectionHeading from "../../components/design-system/SectionHeading";
import Paper from "../../components/design-system/Paper";
import Sticker from "../../components/design-system/Sticker";
import TickerTape from "../../components/design-system/TickerTape";
import { PageSkeleton, CardSkeleton } from "../../components/ui/Skeleton";
import Button from "../../components/ui/Button";
import Link from "next/link";
import { FiCalendar, FiMapPin, FiClock } from "react-icons/fi";
import { api } from "../../lib/api";

function formatTime(timeStr) {
  if (!timeStr || !timeStr.includes(':')) return timeStr;
  try {
    const [h, m] = timeStr.split(':');
    const d = new Date();
    d.setHours(parseInt(h, 10));
    d.setMinutes(parseInt(m, 10));
    return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  } catch {
    return timeStr;
  }
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' });
  } catch {
    return dateStr;
  }
}

function getPastEventStyles(event) {
  if (event.status !== "past") {
    return { opacity: "", grayscale: "", badgeText: null };
  }

  let daysPast = null;
  if (event.end_date || event.date) {
    try {
      const eventDate = new Date(event.end_date || event.date);
      if (!isNaN(eventDate.getTime())) {
        const now = new Date();
        daysPast = Math.floor((now - eventDate) / (1000 * 60 * 60 * 24));
      }
    } catch {
    }
  }

  if (daysPast == null || daysPast < 0) {
    return { opacity: "opacity-90", grayscale: "grayscale-[0.3]", badgeText: "PAST" };
  }

  if (daysPast <= 1) {
    return { opacity: "opacity-[0.9]", grayscale: "grayscale-[0.1]", badgeText: "JUST ENDED" };
  }
  if (daysPast <= 3) {
    return { opacity: "opacity-[0.8]", grayscale: "grayscale-[0.3]", badgeText: `${daysPast}D AGO` };
  }
  if (daysPast <= 7) {
    return { opacity: "opacity-[0.65]", grayscale: "grayscale-[0.45]", badgeText: `${daysPast}D AGO` };
  }
  if (daysPast <= 30) {
    return { opacity: "opacity-[0.55]", grayscale: "grayscale-[0.55]", badgeText: "PAST" };
  }
  return { opacity: "opacity-[0.45]", grayscale: "grayscale-[0.65]", badgeText: "PAST" };
}

export default function EventsList() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); 

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await api.get("/events?per_page=50");
        const smartEvents = res.data.data.map(event => {
          if (event.status !== 'past' && (event.date || event.end_date)) {
            const eventDate = new Date(event.end_date || event.date);
            if (!isNaN(eventDate.getTime())) {
              eventDate.setHours(23, 59, 59, 999);
              if (eventDate < new Date()) {
                return { ...event, status: 'past' };
              }
            }
          }
          return event;
        });
        setEvents(smartEvents);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  if (loading) return <PageWrapper pattern="grid">
      <div className="container mx-auto max-w-7xl px-4 pt-8 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => <CardSkeleton key={i} />)}
        </div>
      </div>
    </PageWrapper>;

  const filteredEvents = filter === "all" 
    ? events 
    : events.filter(e => e.status === filter);

  const sortedEvents = [...filteredEvents].sort((a, b) => {
    const statusWeight = { ongoing: 0, upcoming: 1, past: 2 };
    if (statusWeight[a.status] !== statusWeight[b.status]) {
      return statusWeight[a.status] - statusWeight[b.status];
    }
    return new Date(b.end_date || b.date || 0) - new Date(a.end_date || a.date || 0);
  });

  return (
    <PageWrapper pattern="gingham">
      <div className="container mx-auto max-w-6xl px-4">
        
        <SectionHeading 
          title="Events" 
          subtitle="Workshops, hackathons, guest lectures, and community meetups."
          metadata="CLUB CALENDAR"
          className="mb-12"
        />

        <div className="flex flex-wrap gap-4 mb-16">
          <Button variant={filter === "all" ? "primary" : "outline"} size="sm" onClick={() => setFilter("all")}>All Events</Button>
          <Button variant={filter === "upcoming" ? "primary" : "outline"} size="sm" onClick={() => setFilter("upcoming")}>Upcoming</Button>
          <Button variant={filter === "ongoing" ? "primary" : "outline"} size="sm" onClick={() => setFilter("ongoing")}>Ongoing</Button>
          <Button variant={filter === "past" ? "primary" : "outline"} size="sm" onClick={() => setFilter("past")}>Past</Button>
        </div>

        <div className="flex flex-col gap-12 mb-20">
          {sortedEvents.length > 0 ? (
            sortedEvents.map((event, i) => {
              const isPast = event.status === 'past';
              const isOngoing = event.status === 'ongoing';
              const pastStyles = getPastEventStyles(event);
              
              return (
                <Paper 
                  key={event.id}
                  variant={i % 2 === 0 ? "stacked" : "default"}
                  rotate={i % 2 === 0 ? 1 : -1}
                  className={`flex flex-col md:flex-row p-0 overflow-hidden transition-opacity duration-300 ${pastStyles.opacity}`}
                >
                  <div className={`md:w-2/5 aspect-[4/3] md:aspect-auto border-b-brutal md:border-b-0 md:border-r-brutal relative bg-gray-100 dark:bg-gray-800 ${pastStyles.grayscale}`}>
                    {event.banner ? (
                      <img src={event.banner} alt={event.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center font-mono text-gray-400 bg-[var(--color-bg-gingham)]">
                        <img src="https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2000&auto=format&fit=crop" alt="Fluid flow fallback" className="w-full h-full object-cover" />
                      </div>
                    )}
                    
                    <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                      {isOngoing && <Sticker color="lime" size="md" animate={false}>ONGOING</Sticker>}
                      {!isOngoing && !isPast && <Sticker color="yellow" size="md" animate={false}>UPCOMING</Sticker>}
                      {isPast && (
                        <Sticker color="black" size="md" animate={false}>
                          {pastStyles.badgeText || "PAST"}
                        </Sticker>
                      )}
                    </div>
                  </div>

                  <div className="md:w-3/5 p-6 md:p-10 flex flex-col bg-white dark:bg-[#161b22]">
                    <h3 className="font-display font-black text-3xl md:text-4xl uppercase mb-6 leading-tight dark:text-white">
                      {event.title}
                    </h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 font-mono font-bold text-sm bg-[var(--color-paper-cream)] dark:bg-[#0d1117] p-4 border-brutal">
                      {event.date && (
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[var(--color-sticker-pink)] border-2 border-black flex items-center justify-center flex-shrink-0">
                            <FiCalendar />
                          </div>
                          <span>
                            {formatDate(event.date)}
                            {event.end_date && event.end_date !== event.date && ` - ${formatDate(event.end_date)}`}
                          </span>
                        </div>
                      )}
                      {event.time && (
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[var(--color-sticker-yellow)] border-2 border-black flex items-center justify-center flex-shrink-0">
                            <FiClock />
                          </div>
                          <span>
                            {formatTime(event.time)}
                            {event.end_time && ` - ${formatTime(event.end_time)}`}
                          </span>
                        </div>
                      )}
                      {event.venue && (
                        <div className="flex items-center gap-3 sm:col-span-2">
                          <div className="w-8 h-8 rounded-full bg-[var(--color-sticker-blue)] border-2 border-black flex items-center justify-center flex-shrink-0">
                            <FiMapPin />
                          </div>
                          <span>{event.venue}</span>
                        </div>
                      )}
                    </div>

                    <p className="font-body text-lg text-gray-700 dark:text-gray-300 mb-8 line-clamp-3">
                      {event.description}
                    </p>

                    <div className="mt-auto flex flex-wrap gap-4 items-center">
                      <Button href={`/events/${event.slug}`} variant="secondary">
                        {isPast ? "View Recap" : "Event Details"}
                      </Button>
                      
                      {!isPast && event.registration_link && (
                        <a 
                          href={event.registration_link} 
                          target="_blank" 
                          rel="noreferrer"
                          className="font-mono font-bold uppercase underline decoration-2 underline-offset-4 hover:bg-[var(--color-sticker-lime)] transition-colors px-2"
                        >
                          Register Now &#x2197;
                        </a>
                      )}
                    </div>
                  </div>
                </Paper>
              );
            })
          ) : (
            <Paper variant="default" className="text-center py-20">
              <h3 className="font-display font-black text-2xl uppercase mb-2">No events found</h3>
              <p className="font-mono">Try changing your filters.</p>
            </Paper>
          )}
        </div>
      </div>

      <TickerTape items={["LEARN", "CONNECT", "NETWORK", "GROW", "SHARE", "DISCOVER"]} color="pink" rotate={-1} speed="fast" />

    </PageWrapper>
  );
}
