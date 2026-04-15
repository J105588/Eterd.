'use client';

import { useEffect, useRef } from 'react';
import { Calendar, MapPin, ExternalLink } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import type { Locale } from '@/i18n-config';
import type { Dictionary } from '@/dictionaries/jp';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface EventsContentProps {
  lang: Locale;
  dict: Dictionary;
  initialEvents: any[];
}

export default function EventsContent({ lang, dict, initialEvents }: EventsContentProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Optimized Title Animation
      gsap.from('.events-title', {
        y: 60,
        opacity: 0,
        duration: 1.5,
        ease: 'power4.out',
        force3D: true
      });

      // Optimized Staggered Reveal for Cards
      gsap.utils.toArray('.event-card').forEach((card: any, i: number) => {
        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: 'top 90%',
            toggleActions: 'play none none none',
            fastScrollEnd: true,
            preventOverlaps: true,
          },
          x: i % 2 === 0 ? -30 : 30,
          opacity: 0,
          duration: 1.2,
          ease: 'power3.out',
          force3D: true
        });
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      day: date.getDate(),
      month: date.toLocaleString(lang === 'jp' ? 'ja-JP' : 'en-US', { month: 'short' }).toUpperCase(),
      year: date.getFullYear()
    };
  };

  return (
    <div ref={containerRef} className="relative z-10 max-w-6xl mx-auto py-32 px-8">
      <section className="events-title mb-32 space-y-6 text-center">
        <span className="text-[10px] uppercase tracking-[0.6em] text-secondary font-bold border-b border-black/10 pb-2">Schedule</span>
        <h1 className="font-mincho text-5xl md:text-7xl font-black tracking-widest">{dict.header.events}</h1>
      </section>

      <div className="grid grid-cols-1 gap-16">
        {initialEvents.length > 0 ? (
          initialEvents.map((event, i) => {
            const date = formatDate(event.event_date);
            return (
              <div key={event.id} className="event-card luxury-card !p-0 flex flex-col lg:flex-row overflow-hidden group">
                {/* Date Side */}
                <div className="lg:w-1/3 bg-black text-white p-12 flex flex-col items-center justify-center space-y-4 relative overflow-hidden">
                   {event.image_url && (
                     <div className="absolute inset-0 opacity-40 group-hover:opacity-20 transition-opacity duration-700">
                       <img src={event.image_url} alt="" className="w-full h-full object-cover" />
                     </div>
                   )}
                   <div className="relative z-10 flex flex-col items-center space-y-4">
                     <span className="font-mincho text-7xl font-bold tracking-tighter">{date.day}</span>
                     <div className="h-[1px] w-12 bg-white/30" />
                     <span className="text-xl tracking-[0.4em] font-light">{date.month}</span>
                     <span className="text-[10px] opacity-40">{date.year}</span>
                   </div>
                </div>
                
                {/* Info Side */}
                <div className="lg:w-2/3 p-12 md:p-16 flex flex-col justify-between space-y-10">
                  <div className="space-y-6">
                    <h2 className="font-mincho text-3xl md:text-5xl font-bold leading-tight group-hover:tracking-wider transition-all duration-700">
                      {event.title}
                    </h2>
                    
                    {event.description && (
                      <p className="text-secondary text-sm font-light leading-loose whitespace-pre-wrap">
                        {event.description}
                      </p>
                    )}

                    <div className="flex flex-wrap gap-10 text-secondary text-sm font-semibold uppercase tracking-widest pt-4">
                      <div className="flex items-center gap-4">
                        <MapPin size={18} strokeWidth={1.5} className="text-black" />
                        {event.venue || "TBA"}
                      </div>
                      <div className="flex items-center gap-4">
                        <Calendar size={18} strokeWidth={1.5} className="text-black" />
                        {event.event_date}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <p className="text-secondary text-sm font-light leading-relaxed whitespace-pre-wrap">
                      {event.description || ""}
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-6 pt-10 border-t border-gray-100">
                    {event.google_form_link && (
                      <a
                        href={event.google_form_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative flex items-center justify-center gap-6 overflow-hidden px-10 py-5 bg-black text-white text-[10px] font-bold uppercase tracking-[0.4em]"
                      >
                        <span className="relative z-10 transition-transform group-hover:-translate-x-2">
                          {lang === 'jp' ? '参加申し込み' : 'Participate'}
                        </span>
                        <ExternalLink size={14} className="relative z-10 group-hover:translate-x-2 transition-transform" />
                      </a>
                    )}
                    {event.ticket_link && (
                      <a
                        href={event.ticket_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative flex items-center justify-center gap-4 overflow-hidden px-10 py-5 border-2 border-black text-black text-[10px] font-bold uppercase tracking-[0.4em] hover:text-white"
                      >
                        <span className="relative z-10">{lang === 'jp' ? 'チケット情報' : 'Ticket Info'}</span>
                        <span className="absolute inset-0 bg-black translate-y-full transition-transform duration-500 ease-out group-hover:translate-y-0" />
                      </a>
                    )}
                    {event.youtube_url && (
                      <a
                        href={event.youtube_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative flex items-center justify-center gap-4 overflow-hidden px-10 py-5 border-2 border-red-500 text-red-500 text-[10px] font-bold uppercase tracking-[0.4em] hover:text-white"
                      >
                        <span className="relative z-10">YouTube</span>
                        <span className="absolute inset-0 bg-red-500 translate-y-full transition-transform duration-500 ease-out group-hover:translate-y-0" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="luxury-card py-48 text-center space-y-10">
             <div className="w-[1px] h-20 bg-black/10 mx-auto" />
             <p className="font-mincho text-3xl text-secondary">No upcoming events.</p>
          </div>
        )}
      </div>
    </div>
  );
}
