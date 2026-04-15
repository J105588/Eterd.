'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { useParams } from 'next/navigation';
import { jp } from '@/dictionaries/jp';
import { en } from '@/dictionaries/en';
import { ArrowRight } from 'lucide-react';

export default function NotFound() {
  const params = useParams();
  const lang = params.lang as string;
  const dict = lang === 'en' ? en.notFound : jp.notFound;
  
  const containerRef = useRef<HTMLDivElement>(null);
  const codeBgRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      // Background large 404 fade and scale
      tl.fromTo(codeBgRef.current, 
        { scale: 0.9, opacity: 0 }, 
        { scale: 1, opacity: 0.08, duration: 2.5, ease: 'power2.out' }
      )
      // Main hero 404 digits reveal
      .fromTo('.digit', 
        { y: 100, opacity: 0, rotateX: -90 }, 
        { y: 0, opacity: 1, rotateX: 0, duration: 1.2, stagger: 0.15, ease: 'back.out(1.7)' },
        '-=2'
      )
      // Text elements staggered reveal
      .fromTo('.not-found-stagger', 
        { y: 30, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 1, stagger: 0.2, ease: 'power3.out' },
        '-=1'
      );

      // Subtle jitter/glitch effect on the background text periodically
      const glitchTl = gsap.timeline({ repeat: -1, repeatDelay: 4 });
      glitchTl.to(codeBgRef.current, { duration: 0.05, x: 5, skewX: 2, ease: 'power4.inOut' })
              .to(codeBgRef.current, { duration: 0.05, x: -5, skewX: -2, ease: 'power4.inOut' })
              .to(codeBgRef.current, { duration: 0.05, x: 0, skewX: 0, ease: 'power4.inOut' });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative z-10 min-h-[90vh] flex flex-col items-center justify-center px-8 overflow-hidden">
      {/* Large faint background status code */}
      <h1 
        ref={codeBgRef}
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-mincho text-[20rem] md:text-[40rem] font-bold select-none pointer-events-none opacity-0 mix-blend-multiply"
      >
        {dict.title}
      </h1>

      <div className="relative z-20 text-center space-y-16">
        {/* Hero 404 Digits */}
        <div className="flex justify-center items-baseline gap-4 md:gap-8 font-mincho text-8xl md:text-[12rem] font-bold tracking-tighter leading-none perspective-1000">
          <span className="digit inline-block">4</span>
          <span className="digit inline-block text-black/20">0</span>
          <span className="digit inline-block">4</span>
        </div>

        <div className="relative space-y-10">
          <div className="space-y-4">
            <p className="not-found-stagger text-[11px] font-bold uppercase tracking-[1em] text-secondary ml-[1em]">
              Error Detected
            </p>
            <h2 className="not-found-stagger font-mincho text-2xl md:text-5xl font-bold tracking-[0.15em] leading-tight luxury-text">
              {dict.message}
            </h2>
          </div>

          <p className="not-found-stagger text-secondary text-sm font-light tracking-[0.15em] max-w-lg mx-auto leading-relaxed">
            {dict.subMessage}
          </p>

          <div className="not-found-stagger pt-12">
            <Link 
              href={lang === 'en' ? '/en' : '/'} 
              className="group relative inline-flex items-center justify-center gap-8 px-16 py-6 overflow-hidden border border-black/10 hover:border-black transition-all duration-700"
            >
              <span className="relative z-10 text-[10px] font-bold uppercase tracking-[0.5em] transition-colors group-hover:text-white">
                {dict.backHome}
              </span>
              <div className="relative z-10 transition-transform duration-500 group-hover:translate-x-4">
                <ArrowRight size={20} className="text-black group-hover:text-white transition-colors" />
              </div>
              <span className="absolute inset-0 bg-black translate-y-full transition-transform duration-700 cubic-bezier(0.16, 1, 0.3, 1) group-hover:translate-y-0" />
            </Link>
          </div>
        </div>
      </div>

      {/* Decorative center line */}
      <div className="not-found-stagger absolute bottom-0 left-1/2 -translate-x-1/2 w-[1px] h-32 bg-gradient-to-t from-black/30 via-black/10 to-transparent" />
    </div>
  );
}
