"use client";

import React, { useEffect, useState, useMemo } from "react";
import PageWrapper from "../../components/layout/PageWrapper";
import SectionHeading from "../../components/design-system/SectionHeading";
import { PageSkeleton, CardSkeleton } from "../../components/ui/Skeleton";
import Link from "next/link";
import { api } from "../../lib/api";
import { FiArrowUpRight } from "react-icons/fi";

function formatTime(timeStr) {
  if (!timeStr || !timeStr.includes(':')) return timeStr;
  try {
    const [h, m] = timeStr.split(':');
    const d = new Date();
    d.setHours(parseInt(h, 10));
    d.setMinutes(parseInt(m, 10));
    return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }).toLowerCase();
  } catch {
    return timeStr;
  }
}

function formatDateShort(dateStr) {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr.includes('T') ? dateStr : dateStr + "T12:00:00");
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  } catch {
    return dateStr;
  }
}

function formatSmartDateTimeRange(date, time, endDate, endTime) {
  if (!date) return "";
  
  const fDate = formatDateShort(date);
  const fTime = time ? formatTime(time) : "";
  const fEndDate = endDate && endDate !== date ? formatDateShort(endDate) : "";
  const fEndTime = endTime ? formatTime(endTime) : "";

  if (fEndDate && fEndDate !== fDate) {
    return `${fDate}${fTime ? ` ${fTime}` : ''} - ${fEndDate}${fEndTime ? ` ${fEndTime}` : ''}`;
  } else {
    if (fTime && fEndTime && fTime !== fEndTime) {
      return `${fDate} • ${fTime} - ${fEndTime}`;
    } else {
      return `${fDate}${fTime ? ` • ${fTime}` : ''}`;
    }
  }
}

export default function EventsList() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPastEvents, setShowPastEvents] = useState(false);

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
        
        const hasUpcoming = smartEvents.some(e => e.status !== 'past');
        if (!hasUpcoming && smartEvents.length > 0) {
          setShowPastEvents(true);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const { upcomingGroups, pastGroups } = useMemo(() => {
    const upcoming = {};
    const past = {};

    events.forEach(event => {
      if (!event.date) return;
      const dateObj = new Date(event.date.includes('T') ? event.date : event.date + "T12:00:00");
      if (isNaN(dateObj.getTime())) return;
      
      const monthYear = dateObj.toLocaleDateString("en-US", { month: "long", year: "numeric" });
      const isPast = event.status === 'past';
      const targetGroup = isPast ? past : upcoming;
      
      if (!targetGroup[monthYear]) {
        targetGroup[monthYear] = {
          label: monthYear,
          timestamp: dateObj.getTime(),
          events: []
        };
      }
      
      targetGroup[monthYear].events.push({
        ...event,
        dateObj,
      });
    });

    const sortedUpcoming = Object.values(upcoming).sort((a, b) => a.timestamp - b.timestamp);
    sortedUpcoming.forEach(group => {
      group.events.sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime());
    });

    const sortedPast = Object.values(past).sort((a, b) => b.timestamp - a.timestamp);
    sortedPast.forEach(group => {
      group.events.sort((a, b) => b.dateObj.getTime() - a.dateObj.getTime());
    });

    return { upcomingGroups: sortedUpcoming, pastGroups: sortedPast };
  }, [events]);

  if (loading) return <PageWrapper pattern="grid">
      <div className="container mx-auto max-w-7xl px-4 pt-8 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => <CardSkeleton key={i} />)}
        </div>
      </div>
    </PageWrapper>;

  const displayedGroups = showPastEvents ? [...upcomingGroups, ...pastGroups] : upcomingGroups;

  return (
    <PageWrapper pattern="gingham">
      <div className="container mx-auto max-w-5xl px-4 pt-12 pb-24">
        
        <div className="mb-16">
          <SectionHeading 
            title="Events" 
            subtitle="Discover and join our upcoming meetups, conferences, and community gatherings. Stay connected with the latest events happening around you."
            metadata="GET INVOLVED"
            className="mb-8"
          />
        </div>

        <div className="space-y-16 relative">
          <div className="absolute left-[7px] md:left-[7px] top-4 bottom-0 w-[2px] bg-gradient-to-b from-[#6366f1]/40 via-[#6366f1]/20 to-transparent hidden md:block"></div>

          <div className="flex justify-end items-center mb-8 relative z-20">
             <label className="flex items-center cursor-pointer group">
              <div className="relative">
                <input type="checkbox" className="sr-only" checked={showPastEvents} onChange={() => setShowPastEvents(!showPastEvents)} />
                <div className={`block w-11 h-6 rounded-full transition-colors ${showPastEvents ? 'bg-[#6366f1]' : 'bg-gray-300 dark:bg-gray-700'}`}></div>
                <div className={`absolute left-[2px] top-[2px] bg-white w-5 h-5 rounded-full transition-transform ${showPastEvents ? 'transform translate-x-5' : ''}`}></div>
              </div>
              <div className="ml-3 font-semibold text-sm text-[var(--color-text-secondary)] group-hover:text-[var(--color-text-primary)] transition-colors">Past events</div>
            </label>
          </div>

          {displayedGroups.length > 0 ? displayedGroups.map((group, groupIndex) => (
            <div key={`${group.label}-${groupIndex}`} className="relative z-10">
              <div className="flex items-center gap-4 mb-8">
                <div className="hidden md:block w-4 h-4 rounded-full bg-[#6366f1] flex-shrink-0 z-10 relative -left-[0px]"></div>
                
                <h2 className="text-2xl md:text-3xl font-display font-black text-[var(--color-text-primary)] flex items-baseline gap-3 tracking-tight">
                  {group.label}
                  <span className="text-lg md:text-xl font-normal text-[var(--color-text-muted)] tracking-normal font-sans">
                    {group.events.length} event{group.events.length !== 1 ? 's' : ''}
                  </span>
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:pl-10">
                {group.events.map((event) => (
                  <div key={event.id} className={`flex flex-col h-full bg-white dark:bg-[#161b22] rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 hover:shadow-xl transition-all duration-300 group ${event.status === 'past' ? 'opacity-75 grayscale-[0.2] hover:opacity-100 hover:grayscale-0' : ''}`}>
                    <Link href={`/events/${event.slug}`} className="flex flex-col flex-grow">
                      
                      <div className="relative aspect-[2/1] w-full bg-gray-100 dark:bg-gray-900 overflow-hidden border-b border-gray-100 dark:border-gray-800">
                         {(event.banner || event.image) ? (
                           <img src={event.banner || event.image} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                         ) : (
                           <div className="w-full h-full bg-[var(--color-glass-bg)] flex items-center justify-center hex-grid-bg opacity-50"></div>
                         )}
                         
                         {event.venue && (
                           <div className="absolute top-4 right-4 bg-gray-900/90 text-white text-xs font-black px-3 py-1.5 rounded uppercase tracking-widest shadow-sm">
                             {event.venue.split(',')[0]}
                           </div>
                         )}

                         {event.status === 'past' && (
                           <div className="absolute top-4 left-4 bg-black/80 text-white text-xs font-black px-3 py-1.5 rounded uppercase tracking-widest shadow-sm">
                             PAST
                           </div>
                         )}
                      </div>

                      <div className="p-6 md:p-8 flex flex-col">
                         <h3 className="font-display font-bold text-xl md:text-2xl text-gray-900 dark:text-white mb-2 leading-snug group-hover:text-[#6366f1] transition-colors line-clamp-2">
                           {event.title}
                         </h3>
                      </div>
                    </Link>

                    <div className="px-6 md:px-8 pb-6 md:pb-8 pt-0 mt-auto flex flex-wrap items-center justify-between gap-4">
                       <div className="font-sans text-sm text-gray-700 dark:text-gray-300 flex items-center gap-2 flex-wrap flex-1 min-w-0">
                         <span className="font-bold whitespace-nowrap text-gray-900 dark:text-gray-100">
                           {formatSmartDateTimeRange(event.date, event.time, event.end_date, event.end_time)}
                         </span>
                         {event.organizer && (
                           <div className="flex items-center gap-2 min-w-0 flex-1">
                             <span className="text-gray-400 flex-shrink-0">•</span>
                             <span className="truncate font-medium">{event.organizer}</span>
                           </div>
                         )}
                       </div>
                       
                       {event.registration_link && event.status !== 'past' && (
                         <a 
                           href={event.registration_link}
                           target="_blank"
                           rel="noreferrer"
                           className="flex-shrink-0 inline-flex items-center justify-center gap-2 bg-[#6366f1] text-white hover:bg-[#4f46e5] shadow-sm hover:shadow-md hover:-translate-y-0.5 px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all w-full sm:w-auto"
                         >
                           Register <FiArrowUpRight className="w-3.5 h-3.5" />
                         </a>
                       )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )) : (
            <div className="text-center py-20 text-[var(--color-text-secondary)] bg-[var(--color-glass-bg)] rounded-3xl border border-dashed border-[var(--color-border-subtle)]">
              <p className="font-medium text-lg">No events found.</p>
            </div>
          )}
        </div>
      </div>
    </PageWrapper>
  );
}
