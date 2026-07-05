"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import PageWrapper from "../../../components/layout/PageWrapper";
import Paper from "../../../components/design-system/Paper";
import Sticker from "../../../components/design-system/Sticker";
import { PageSkeleton, CardSkeleton } from "../../../components/ui/Skeleton";
import Button from "../../../components/ui/Button";
import { FiCalendar, FiMapPin, FiClock, FiExternalLink, FiFileText, FiGrid } from "react-icons/fi";
import { FaGoogleDrive, FaYoutube, FaGithub, FaFigma, FaLinkedin, FaInstagram, FaMedium, FaTwitter } from "react-icons/fa";

const getLinkMeta = (url) => {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.toLowerCase();
    
    if (host.includes('youtube.com') || host.includes('youtu.be')) {
      return { icon: FaYoutube, color: 'bg-[#FF0000]', text: 'text-white', label: 'YouTube Video', isKnownExternal: true };
    }
    if (host.includes('drive.google.com')) {
      return { icon: FaGoogleDrive, color: 'bg-[#0F9D58]', text: 'text-white', label: 'Google Drive', isKnownExternal: true };
    }
    if (host.includes('github.com')) {
      return { icon: FaGithub, color: 'bg-[#181717]', text: 'text-white', label: 'GitHub Repository', isKnownExternal: true };
    }
    if (host.includes('figma.com')) {
      return { icon: FaFigma, color: 'bg-[#F24E1E]', text: 'text-white', label: 'Figma Design', isKnownExternal: true };
    }
    if (host.includes('linkedin.com')) {
      return { icon: FaLinkedin, color: 'bg-[#0A66C2]', text: 'text-white', label: 'LinkedIn', isKnownExternal: true };
    }
    if (host.includes('instagram.com')) {
      return { icon: FaInstagram, color: 'bg-[#E4405F]', text: 'text-white', label: 'Instagram', isKnownExternal: true };
    }
    if (host.includes('medium.com')) {
      return { icon: FaMedium, color: 'bg-[#000000]', text: 'text-white', label: 'Medium Article', isKnownExternal: true };
    }
    if (host.includes('twitter.com') || host.includes('x.com')) {
      return { icon: FaTwitter, color: 'bg-[#1DA1F2]', text: 'text-white', label: 'Twitter / X', isKnownExternal: true };
    }
    if (parsed.pathname.endsWith('.pdf')) {
      return { icon: FiFileText, color: 'bg-[#FF5722]', text: 'text-white', label: 'PDF Document', isKnownExternal: true };
    }
    if (parsed.pathname.endsWith('.xlsx') || parsed.pathname.endsWith('.csv')) {
      return { icon: FiGrid, color: 'bg-[#21A366]', text: 'text-white', label: 'Spreadsheet', isKnownExternal: true };
    }
    
    return { icon: FiExternalLink, color: 'bg-[var(--color-sticker-pink)]', text: 'text-black', label: host.replace(/^www\./, ''), isKnownExternal: false };
  } catch(e) {
    return { icon: FiExternalLink, color: 'bg-gray-200', text: 'text-black', label: 'External Link', isKnownExternal: false };
  }
};

const GalleryImage = ({ imgUrl, eventTitle, index }) => {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const meta = getLinkMeta(imgUrl);
    if (meta.isKnownExternal) {
      setFailed(true);
      return;
    }

    const timer = setTimeout(() => {
      if (!loaded) {
        setFailed(true);
      }
    }, 2000); 

    return () => clearTimeout(timer);
  }, [imgUrl, loaded]);

  const meta = getLinkMeta(imgUrl);
  const Icon = meta.icon;

  return (
    <div className="aspect-[4/3] border-brutal overflow-hidden relative bg-gray-100 dark:bg-gray-800">
      {!failed && (
        <img 
          src={imgUrl} 
          alt={`${eventTitle} gallery ${index+1}`} 
          className="w-full h-full object-cover hover:scale-105 transition-transform absolute inset-0 z-10" 
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
        />
      )}
      
      {(failed || !loaded) && (
        <div className={`w-full h-full flex-col items-center justify-center bg-[var(--color-paper-cream)] p-4 text-center border-brutal border-t-0 border-l-0 border-r-0 border-b-0 h-full relative z-0 ${failed ? 'flex' : 'hidden'}`}>
          <div className={`p-4 rounded-full mb-3 border-2 border-black ${meta.color} ${meta.text} shadow-[2px_2px_0px_#000]`}>
            <Icon className="w-8 h-8" />
          </div>
          <h3 className="font-display font-bold uppercase text-black text-sm mb-3 line-clamp-1">{meta.label}</h3>
          <a href={imgUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-[10px] font-mono font-bold uppercase bg-black text-white px-4 py-2 hover:bg-gray-800 transition-colors shadow-[2px_2px_0px_var(--color-sticker-pink)]">
            Open Link <FiExternalLink />
          </a>
        </div>
      )}
    </div>
  );
};
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
                            <GalleryImage key={i} imgUrl={imgUrl} eventTitle={event.title} index={i} />
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
