'use client';

import { useEffect, useRef } from 'react';
import { Calendar, MapPin, ExternalLink, Ticket, FileText, Globe } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { cn } from '@/lib/utils';
import { TwitterIcon, YoutubeIcon, NiconicoIcon } from '@/components/icons/SocialIcons';
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

                  <div className="flex flex-col sm:flex-row flex-wrap gap-4 pt-8 border-t border-gray-100">
                    {Array.isArray(event.external_links) && event.external_links.map((link: any, index: number) => {
                      const getIcon = (type: string) => {
                        switch (type) {
                          case 'X': return <TwitterIcon size={14} />;
                          case 'YouTube': return <YoutubeIcon size={16} />;
                          case 'niconico': return <NiconicoIcon size={16} />;
                          case 'Ticket': return <Ticket size={14} />;
                          case 'Google Form': return <FileText size={14} />;
                          case 'Official Site': return <Globe size={14} />;
                          default: return <ExternalLink size={14} />;
                        }
                      };

                      const isYouTube = link.type === 'YouTube';
                      const isMain = ['Ticket', 'Google Form', 'Official Site'].includes(link.type);

                      return (
                        <a
                          key={index}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={cn(
                            "flex items-center gap-3 px-6 py-3 text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-300 border group",
                            isMain ? "bg-black text-white hover:bg-gray-800 border-black" :
                            isYouTube ? "border-red-100 text-red-500 hover:border-red-500 hover:bg-red-50" :
                            "border-gray-100 text-secondary hover:border-black hover:text-black"
                          )}
                        >
                          <span className="transition-transform group-hover:scale-110 duration-300">
                             {getIcon(link.type)}
                          </span>
                          <span>{link.type}</span>
                        </a>
                      );
                    })}
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
