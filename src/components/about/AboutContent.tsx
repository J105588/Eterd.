'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import type { Locale } from '@/i18n-config';
import type { Dictionary } from '@/dictionaries/jp';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function AboutContent({ lang, t }: { lang: Locale; t: Dictionary['about'] }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.about-title', {
        y: 100,
        opacity: 0,
        duration: 1.5,
        ease: 'power4.out',
        delay: 0.3
      });

      gsap.utils.toArray('.reveal-up').forEach((el: any) => {
        gsap.from(el, {
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            fastScrollEnd: true,
            preventOverlaps: true,
          },
          y: 30,
          opacity: 0,
          duration: 1.2,
          ease: 'power3.out',
          force3D: true
        });
      });

      // Side image parallax
      gsap.to('.parallax-img', {
        scrollTrigger: {
          trigger: '.parallax-img',
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        },
        y: -100
      });

    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative z-10 max-w-[1400px] mx-auto py-32 px-8 md:px-24">
      <div className="space-y-48">
        {/* Header Section */}
        <section className="relative">
          <div className="space-y-12">
            <span className="legible-small border-l-2 border-black pl-4">
              {t.title}
            </span>
            <h1 className="about-title font-mincho text-6xl md:text-[8vw] font-black leading-[1.1] tracking-[0.1em] text-black/90">
               {t.mainTitle.split(' ').map((word, i) => (
                 <span key={i} className="block">{word}</span>
               ))}
            </h1>
          </div>
        </section>

        {/* Narrative Section 1: Off-grid Layout */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-7 reveal-up">
             <div className="luxury-card !p-12 md:!p-24 space-y-10 relative z-20">
                <h2 className="font-mincho text-3xl md:text-5xl font-bold border-b border-gray-100 pb-10">
                  {t.sections.originTitle}
                </h2>
                <p className="font-mincho text-xl md:text-2xl font-medium leading-[2.2] text-secondary">
                  {t.sections.originText}
                </p>
                <div className="pt-6">
                   <div className="accent-line w-24" />
                </div>
             </div>
          </div>
          <div className="lg:col-span-5 reveal-up">
             <div className="parallax-img aspect-[3/4] bg-gray-50 border border-gray-100 overflow-hidden relative grayscale hover:grayscale-0 transition-all duration-1000">
                <div className="absolute inset-0 flex items-center justify-center font-mincho text-black/5 text-9xl">夢</div>
                <div className="absolute bottom-10 left-10 luxury-text text-sm opacity-20">ETRD-LOG.01</div>
             </div>
          </div>
        </section>

        {/* Narrative Section 2: Centered Vision */}
        <section className="max-w-4xl mx-auto text-center space-y-24">
          <div className="reveal-up space-y-12">
            <h2 className="font-mincho text-4xl md:text-6xl font-black">{t.sections.visionTitle}</h2>
            <div className="w-[1px] h-24 bg-black mx-auto" />
            <p className="font-mincho text-2xl md:text-4xl font-semibold leading-relaxed text-black/90 tracking-wider">
              {t.sections.visionText}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 pt-24 reveal-up">
            {[
              { title: 'Precision', text: 'Mastering the technical craft to ensure every acoustic detail is preserved.' },
              { title: 'Freedom', text: 'A sanctuary for expressions that don\'t fit anywhere else.' },
              { title: 'Eternity', text: 'Avoiding temporary trends for timeless art.' }
            ].map((item, i) => (
              <div key={item.title} className="space-y-6 group">
                 <div className="font-mincho text-4xl opacity-5 mb-4 group-hover:opacity-10 transition-opacity">0{i+1}</div>
                 <h3 className="text-xs font-bold uppercase tracking-[0.4em] text-black border-b border-black/5 pb-4">{item.title}</h3>
                 <p className="text-sm text-secondary leading-relaxed font-medium">
                   {item.text}
                 </p>
              </div>
            ))}
          </div>
        </section>

        {/* Closing Quote: Impactful */}
        <section className="reveal-up py-48 text-center relative overflow-hidden">
           <div className="absolute inset-0 bg-black translate-x-full" id="quote-bg" />
           <blockquote className="font-mincho text-3xl md:text-6xl font-bold leading-tight px-4 transition-all duration-1000 hover:tracking-widest">
             <span className="opacity-40 text-4xl md:text-8xl inline-block -translate-y-8">“</span>
             {t.sections.quote}
             <span className="opacity-40 text-4xl md:text-8xl inline-block translate-y-8">”</span>
           </blockquote>
           <div className="mt-24 flex justify-center">
              <div className="vertical-line" />
           </div>
        </section>
      </div>
    </div>
  );
}
