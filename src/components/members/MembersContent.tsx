'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { User, ExternalLink, Globe, FileText } from 'lucide-react';
import { TwitterIcon, InstagramIcon, YoutubeIcon, NiconicoIcon } from '@/components/icons/SocialIcons';
import type { Locale } from '@/i18n-config';
import type { Dictionary } from '@/dictionaries/jp';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface MembersContentProps {
  lang: Locale;
  dict: Dictionary;
  members: any[];
}

export default function MembersContent({ lang, dict, members }: MembersContentProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Optimized Title Animation (Matching Events)
      gsap.from('.members-title', {
        y: 60,
        opacity: 0,
        duration: 1.5,
        ease: 'power4.out',
        force3D: true
      });

      // Optimized Staggered Reveal for Cards
      gsap.utils.toArray('.member-card').forEach((card: any, i: number) => {
        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: 'top 90%',
            toggleActions: 'play none none none',
            fastScrollEnd: true,
            preventOverlaps: true,
          },
          y: 30,
          opacity: 0,
          duration: 1.2,
          ease: 'power3.out',
          force3D: true,
          delay: (i % 3) * 0.1 // Adding slight horizontal stagger
        });
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative z-10 max-w-7xl mx-auto py-32 px-8">
      <header className="members-title mb-32 space-y-6 text-center">
        <span className="text-[10px] uppercase tracking-[0.6em] text-secondary font-bold border-b border-black/10 pb-2 inline-block">
          Affiliated Creators / Artists
        </span>
        <h1 className="font-mincho text-5xl md:text-7xl font-black tracking-widest uppercase">
          {dict.header.members}
        </h1>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 md:gap-x-12 md:gap-y-24">
        {members && members.length > 0 ? (
          members.map((member) => (
            <div key={member.id} className="member-card group space-y-8 h-full flex flex-col items-center md:items-start">
              <div 
                className="block relative aspect-square w-64 md:w-full max-w-[280px] bg-gray-50 rounded-full border border-gray-100 overflow-hidden grayscale hover:grayscale-0 transition-all duration-1000 group-hover:shadow-2xl group-hover:shadow-black/5"
              >
                {member.image_url ? (
                  <img src={member.image_url} alt={member.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center opacity-5">
                    <User size={120} />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              </div>

              <div className="space-y-4 flex-grow text-center md:text-left px-4 md:px-0">
                <div className="block">
                  <h3 className="font-mincho text-2xl font-bold tracking-widest">{member.name}</h3>
                </div>
                <p className="text-secondary text-sm leading-relaxed font-light whitespace-pre-wrap line-clamp-3 group-hover:line-clamp-none transition-all duration-500">
                  {member.profile_text}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-6 pt-6 border-t border-gray-50 w-full justify-center md:justify-start">
                {/* Dynamic External Links Only */}
                {Array.isArray(member.external_links) && member.external_links.map((link: any, index: number) => {
                   const getIcon = (type: string) => {
                     switch (type) {
                       case 'X': return <TwitterIcon size={18} />;
                       case 'Instagram': return <InstagramIcon size={18} />;
                       case 'YouTube': return <YoutubeIcon size={18} />;
                       case 'niconico': return <NiconicoIcon size={18} />;
                       case 'Official Site': return <Globe size={18} />;
                       case 'Blog': return <FileText size={18} />;
                       default: return <ExternalLink size={18} />;
                     }
                   };
                   return (
                     <a 
                       key={index} 
                       href={link.url} 
                       target="_blank" 
                       rel="noopener noreferrer" 
                       className="text-secondary hover:text-black transition-colors"
                       title={link.type}
                     >
                       {getIcon(link.type)}
                     </a>
                   );
                })}
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-48 text-center border border-dashed border-gray-100 italic text-secondary font-mincho">
             No artists published yet.
          </div>
        )}
      </div>
    </div>
  );
}
