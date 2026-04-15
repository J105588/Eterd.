'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, MoveDown } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import type { Locale } from '@/i18n-config';
import type { Dictionary } from '@/dictionaries/jp';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface HomeContentProps {
  lang: Locale;
  t: Dictionary['home'];
  initialEvents?: any[];
}

export default function HomeContent({ lang, t, initialEvents = [] }: HomeContentProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero Animation
      const heroTl = gsap.timeline();
      heroTl.from('.hero-title', {
        y: 100,
        opacity: 0,
        duration: 1.5,
        ease: 'power4.out',
        delay: 0.2
      })
        .from('.hero-subtitle', {
          y: 40,
          opacity: 0,
          duration: 1.2,
          ease: 'power3.out'
        }, '-=1')
        .from('.hero-cta', {
          y: 20,
          opacity: 0,
          duration: 1,
          ease: 'power2.out'
        }, '-=0.8')
        .from('.scroll-indicator', {
          opacity: 0,
          y: -10,
          duration: 1,
          yoyo: true,
          force3D: true
        });

      // Scroll Transitions for Cards
      gsap.utils.toArray('.reveal-section').forEach((section: any) => {
        gsap.from(section, {
          scrollTrigger: {
            trigger: section,
            start: 'top 85%',
            toggleActions: 'play none none none',
            fastScrollEnd: true,
            preventOverlaps: true,
          },
          y: 40,
          opacity: 0,
          duration: 1,
          ease: 'power3.out',
          force3D: true
        });
      });

      // Background Text Parallax
      gsap.to('.bg-text-parallax', {
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true
        },
        y: -200,
        opacity: 0.1,
        force3D: true
      });

      // Line Drawing Animation
      gsap.from('.decorative-line', {
        scrollTrigger: {
          trigger: '.philosophy-card',
          start: 'top 80%',
        },
        height: 0,
        duration: 2,
        ease: 'power3.inOut'
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative z-10 flex flex-col items-center">
      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex flex-col items-center justify-start pt-16 md:pt-24 text-center px-4 overflow-hidden">

        <div className="relative z-10 max-w-4xl">
          <h1 className="hero-title font-mincho text-6xl md:text-9xl font-black mb-12 tracking-[0.2em] md:tracking-[0.4em] text-black/90">
            {t.hero.title}
          </h1>
          <div className="h-[2px] w-24 bg-black mx-auto mb-12 hero-cta shadow-white" />
          <p className="hero-subtitle max-w-2xl mx-auto text-black text-sm md:text-base tracking-[0.2em] font-bold leading-loose mb-16 px-6 [text-shadow:_0_0_30px_rgba(255,255,255,0.8),_0_0_10px_rgba(255,255,255,0.5)]">
            {t.hero.subtitle}
          </p>
          <div className="hero-cta flex justify-center">
            <Link
              href={lang === 'jp' ? '/members' : '/en/members'}
              className="group relative flex items-center gap-8 overflow-hidden px-12 py-6 border border-black transition-all duration-700 bg-white/5 backdrop-blur-[2px]"
            >
              <span className="relative z-10 text-xs font-bold uppercase tracking-[0.5em] group-hover:text-white transition-colors [text-shadow:_0_0_10px_rgba(255,255,255,0.5)]">
                {t.hero.cta}
              </span>
              <span className="absolute inset-0 bg-black translate-y-full transition-transform duration-500 ease-out group-hover:translate-y-0" />
              <ArrowRight size={18} className="relative z-10 transition-all group-hover:translate-x-3 group-hover:text-white" />
            </Link>
          </div>
        </div>

        {/* Scroll Indicator - Optimized for legibility */}
        <div className="scroll-indicator absolute bottom-12 flex flex-col items-center gap-4 text-secondary">
          <span className="legible-small rotate-90 mb-4">Scroll</span>
          <MoveDown size={20} strokeWidth={1} />
        </div>

        {/* Decorative Background Text */}
        <div className="bg-text-parallax fixed top-1/4 -right-12 font-mincho text-[20vh] leading-none select-none pointer-events-none opacity-[0.03] z-0 vertical-rl">
          ETERD
        </div>
        <div className="bg-text-parallax fixed top-1/2 -left-12 font-mincho text-[15vh] leading-none select-none pointer-events-none opacity-[0.02] z-0 vertical-rl transform rotate-180">
          ETERNAL DYNAMICS
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="w-full max-w-6xl mx-auto px-8 py-24 md:py-48 relative">
        <div className="absolute left-1/2 -top-24 -translate-x-1/2 decorative-line w-[1px] h-48 bg-gradient-to-b from-transparent via-black/20 to-black/40" />

        <div className="reveal-section philosophy-card luxury-card text-center space-y-16 relative overflow-hidden">

          <h2 className="font-mincho text-3xl md:text-6xl tracking-[0.2em] border-b border-gray-100 pb-16 luxury-text">
            {t.sections.philosophyTitle}
          </h2>
          <p className="text-lg md:text-2xl font-medium leading-[2.2] text-secondary max-w-3xl mx-auto font-mincho [text-shadow:_0_0_20px_rgba(255,255,255,0.5)]">
            {t.sections.philosophyText}
          </p>
          <div className="pt-8">
            <Link href={lang === 'jp' ? '/about' : '/en/about'} className="nav-link text-xs font-bold tracking-[0.5em] uppercase border-b-2 border-black/10 pb-2 hover:border-black">
              {t.sections.ourConcept}
            </Link>
          </div>
        </div>
      </section>

      {/* Split Row: Latest & Events */}
      <section className="w-full max-w-7xl mx-auto py-24 px-8 md:px-16 grid grid-cols-1 lg:grid-cols-2 gap-24">
        {/* Latest Release */}
        <div className="reveal-section space-y-12">
          <div className="flex items-center gap-6">
            <h2 className="luxury-text text-xl font-bold">{t.sections.latestRelease}</h2>
            <div className="flex-grow h-[1px] bg-gradient-to-r from-black/10 to-transparent" />
          </div>

          <div className="group relative aspect-video overflow-hidden shadow-2xl bg-gray-50 border border-gray-100 italic flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent z-10" />
            <div className="text-center space-y-4 relative z-20">
              <p className="text-[10px] uppercase tracking-[0.5em] font-bold text-black/30">Release Schedule</p>
              <h3 className="font-mincho text-4xl font-light tracking-[0.4em] text-black/60 transition-all duration-1000">Coming soon...</h3>
            </div>
            {/* Minimalist Grid Pattern */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="reveal-section space-y-12">
          <div className="flex items-center gap-6">
            <h2 className="luxury-text text-xl font-bold">{t.sections.upcomingEvent}</h2>
            <div className="flex-grow h-[1px] bg-gradient-to-r from-black/10 to-transparent" />
          </div>

          <div className="space-y-10">
            {initialEvents.length > 0 ? (
              initialEvents.map((event) => {
                const date = new Date(event.event_date);
                const day = date.getDate();
                const month = date.toLocaleString('en-US', { month: 'short' }).toUpperCase();
                
                return (
                  <div key={event.id} className="flex gap-10 items-start group cursor-pointer border-b border-gray-100 pb-10 last:border-0 hover:bg-gray-50/50 -mx-6 px-6 transition-all duration-500">
                    <div className="luxury-text flex flex-col items-center p-4 bg-white shadow-sm min-w-20 group-hover:bg-black group-hover:text-white transition-all duration-700">
                      <span className="text-3xl font-bold">{day}</span>
                      <span className="text-[10px] tracking-widest">{month}</span>
                    </div>
                    <div className="space-y-3 flex-grow">
                      <div className="flex justify-between items-start">
                        <h3 className="font-mincho text-xl md:text-2xl font-semibold tracking-wider group-hover:translate-x-2 transition-transform duration-700">
                          {event.title}
                        </h3>
                        {event.youtube_url && (
                          <a href={event.youtube_url} target="_blank" rel="noopener noreferrer" className="p-2 opacity-20 hover:opacity-100 transition-opacity">
                            <ArrowRight size={14} className="-rotate-45" />
                          </a>
                        )}
                      </div>
                      <p className="text-secondary text-sm font-medium uppercase tracking-[0.2em]">
                        {event.venue || "TBA"} | {event.event_date}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-24 text-center border border-dashed border-gray-100 italic text-secondary">
                 No upcoming events scheduled.
              </div>
            )}

            <Link
              href={lang === 'jp' ? '/events' : '/en/events'}
              className="group flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.4em] hover:gap-8 transition-all pt-4"
            >
              <span className="border-b border-black pb-1">{t.sections.viewAllEvents}</span>
              <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Decorative vertical spacer */}
      <div className="w-[1px] h-48 bg-gradient-to-b from-black/10 to-transparent mb-24" />
    </div>
  );
}
