'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Globe, ArrowLeft, ExternalLink, FileText } from 'lucide-react';
import Link from 'next/link';
import { TwitterIcon, InstagramIcon, YoutubeIcon, NiconicoIcon } from '@/components/icons/SocialIcons';

interface MemberProfileContentProps {
  member: any;
}

interface SocialLink {
  name: string;
  url: string;
  icon: React.ReactNode;
}

export default function MemberProfileContent({ member }: MemberProfileContentProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const socialLinks: SocialLink[] = Array.isArray(member.external_links) ? member.external_links.map((link: any) => {
    const getIcon = (type: string) => {
      switch (type) {
        case 'X': return <TwitterIcon size={20} />;
        case 'Instagram': return <InstagramIcon size={20} />;
        case 'YouTube': return <YoutubeIcon size={20} />;
        case 'niconico': return <NiconicoIcon size={20} />;
        case 'Official Site': return <Globe size={20} />;
        case 'Blog': return <FileText size={20} />;
        default: return <ExternalLink size={20} />;
      }
    };
    return { name: link.type, url: link.url, icon: getIcon(link.type) };
  }) : [];

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // Staggered entrance for each block. Using fromTo to prevent React 18 Strict Mode double-fire bugs
      gsap.fromTo('.reveal-block', 
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out',
          clearProps: 'all'
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative z-10 min-h-screen bg-transparent flex flex-col items-center py-20 px-6">
      <div className="w-full max-w-md flex flex-col items-center space-y-12">
        
        {/* Block 1: Profile Image */}
        <div className="reveal-block relative group">
          <div className="w-32 h-32 rounded-full border-2 border-white shadow-xl overflow-hidden bg-white">
            {member.image_url ? (
              <img src={member.image_url} alt={member.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-200">
                <Globe size={40} strokeWidth={1} />
              </div>
            )}
          </div>
          <div className="absolute -inset-4 border border-black/5 rounded-full -z-10 animate-pulse" />
        </div>

        {/* Block 2: Text Info */}
        <div className="reveal-block text-center space-y-4">
          <h1 className="font-mincho text-3xl font-bold tracking-widest luxury-text normal-case">
            {member.name}
          </h1>
          {member.profile_text && (
            <div className="reveal-block">
              <p 
                className="text-secondary text-sm leading-relaxed max-w-sm mx-auto whitespace-pre-wrap"
                suppressHydrationWarning
              >
                {member.profile_text}
              </p>
            </div>
          )}
        </div>

        {/* Block 3: Social Links Stack */}
        <div className="reveal-block w-full space-y-4 pt-4">
          {socialLinks.map((link, index) => (
            <a
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between w-full bg-white border border-gray-100 p-6 shadow-sm hover:shadow-md hover:border-black transition-all group"
            >
              <div className="flex items-center gap-6">
                <span className="text-black/40 group-hover:text-black transition-colors">
                  {link.icon}
                </span>
                <span className="text-xs font-bold uppercase tracking-[0.3em]">
                  {link.name}
                </span>
              </div>
              <ArrowLeft size={16} className="rotate-180 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0" />
            </a>
          ))}
        </div>

        {/* Block 4: Minimal Footer logo only */}
        <div className="reveal-block pt-24 pb-8 flex flex-col items-center">
          <div className="pt-8 border-t border-gray-100 w-12 text-center">
             <span className="font-mincho text-xl font-black opacity-10">E.</span>
          </div>
        </div>
      </div>

      {/* Luxury Decorative Elements */}
      <div className="fixed inset-0 pointer-events-none -z-10 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
    </div>
  );
}
