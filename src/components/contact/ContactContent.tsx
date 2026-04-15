'use client';

import { useEffect, useRef } from 'react';
import { Mail, X as LucideX, ArrowRight, ExternalLink } from 'lucide-react';
import gsap from 'gsap';
import type { Locale } from '@/i18n-config';
import type { Dictionary } from '@/dictionaries/jp';
import { TwitterIcon } from '@/components/icons/SocialIcons';

interface ContactContentProps {
  lang: Locale;
  t: Dictionary['contact'];
}

export default function ContactContent({ lang, t }: ContactContentProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      
      tl.from('.reveal-item', {
        y: 30,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: 'power3.out'
      });

      gsap.to('.accent-glow', {
        opacity: 0.4,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative z-10 max-w-4xl mx-auto py-24 md:py-48 px-8">
      {/* Background Accent */}
      <div className="accent-glow absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-black/[0.02] rounded-full blur-[100px] -z-10 opacity-20" />

      <div className="text-center space-y-20 md:space-y-32">
        {/* Header */}
        <header className="reveal-item space-y-6">
          <h1 className="font-mincho text-5xl md:text-7xl font-bold tracking-tight text-black">
            {t.title}
          </h1>
          <p className="font-mincho text-lg md:text-2xl text-secondary">
            {t.description}
          </p>
        </header>

        {/* Contact Info Cards */}
        <div className="reveal-item grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {/* Email Card */}
          <a 
            href={`mailto:${t.emailValue}`}
            className="group flex flex-col items-center p-12 md:p-16 bg-white border border-gray-100 rounded-[2.5rem] transition-all duration-700 hover:border-black hover:shadow-2xl hover:shadow-black/5"
          >
            <div className="w-20 h-20 flex items-center justify-center bg-gray-50 rounded-full mb-8 group-hover:bg-black group-hover:text-white transition-all duration-700">
              <Mail size={32} strokeWidth={1} />
            </div>
            <h2 className="text-[10px] font-bold uppercase tracking-[0.5em] text-secondary mb-4 group-hover:text-black transition-colors">{t.email}</h2>
            <span className="font-mincho text-xl md:text-2xl font-bold break-all text-center">
              {t.emailValue}
            </span>
            <div className="mt-8 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
              <ArrowRight size={20} />
            </div>
          </a>

          {/* X Card */}
          <a 
            href={`https://x.com/${t.socialValue}`} 
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col items-center p-12 md:p-16 bg-white border border-gray-100 rounded-[2.5rem] transition-all duration-700 hover:border-black hover:shadow-2xl hover:shadow-black/5"
          >
            <div className="w-20 h-20 flex items-center justify-center bg-gray-50 rounded-full mb-8 group-hover:bg-black group-hover:text-white transition-all duration-700">
              <TwitterIcon size={32} />
            </div>
            <h2 className="text-[10px] font-bold uppercase tracking-[0.5em] text-secondary mb-4 group-hover:text-black transition-colors">{t.social}</h2>
            <div className="text-center">
              <p className="font-mincho text-sm text-secondary italic mb-2">
                {t.follow}
              </p>
              <span className="font-mincho text-2xl md:text-3xl font-bold">
                @{t.socialValue}
              </span>
            </div>
            <div className="mt-8 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
              <ExternalLink size={20} />
            </div>
          </a>
        </div>

        {/* CTA Button */}
        <div className="reveal-item pt-12 md:pt-20">
          <a 
            href="#" 
            className="group relative inline-flex items-center gap-6 bg-black text-white px-12 md:px-16 py-6 md:py-8 rounded-full overflow-hidden transition-all duration-700 hover:scale-[1.02] shadow-2xl shadow-black/20"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-gray-800 to-black translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-700 ease-out" />
            <span className="relative z-10 font-mincho text-xl md:text-2xl font-bold tracking-widest">
              {t.cta}
            </span>
            <ArrowRight size={24} className="relative z-10 group-hover:translate-x-2 transition-transform duration-500" />
          </a>
          <p className="mt-8 text-[10px] uppercase tracking-[0.5em] text-gray-300 font-bold">
            Google Forms
          </p>
        </div>
      </div>

      {/* Footer Decoration */}
      <div className="mt-40 md:mt-64 flex justify-center">
        <div className="w-px h-32 bg-gradient-to-b from-black/20 to-transparent" />
      </div>
    </div>
  );
}
