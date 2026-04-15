'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Locale } from '@/i18n-config';
import type { Dictionary } from '@/dictionaries/jp';

interface HeaderProps {
  lang: Locale;
  dict: Dictionary['header'];
  siteSettings?: any;
}

export default function Header({ lang, dict, siteSettings }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.height = '100%';
      document.body.style.touchAction = 'none';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      document.body.style.height = 'unset';
      document.body.style.touchAction = 'unset';
      document.documentElement.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.height = 'unset';
      document.body.style.touchAction = 'unset';
      document.documentElement.style.overflow = 'unset';
    };
  }, [isOpen]);

  const navItems = [
    { name: dict.home, href: lang === 'jp' ? '/' : '/en', show: true },
    { name: dict.about, href: lang === 'jp' ? '/about' : '/en/about', show: siteSettings?.show_about ?? true },
    { name: dict.members, href: lang === 'jp' ? '/members' : '/en/members', show: siteSettings?.show_members ?? true },
    { name: dict.events, href: lang === 'jp' ? '/events' : '/en/events', show: siteSettings?.show_events ?? true },
    { name: dict.contact, href: lang === 'jp' ? '/contact' : '/en/contact', show: siteSettings?.show_contact ?? true },
  ].filter(item => item.show);

  const getToggleUrl = () => {
    if (lang === 'jp') {
      return pathname === '/' ? '/en' : `/en${pathname}`;
    } else {
      const target = pathname.replace('/en', '');
      return target || '/';
    }
  };

  const isProfilePage = pathname.includes('/members/') && pathname.split('/').filter(Boolean).length >= 2;

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 w-full z-[70] transition-all duration-500 px-8 py-8 md:px-16',
          (isScrolled || isOpen) ? 'bg-white/95 backdrop-blur-2xl py-6 shadow-[0_1px_0_rgba(0,0,0,0.03)]' : 'bg-transparent'
        )}
      >
        <div className="max-w-[1800px] mx-auto flex justify-between items-center">
          <Link 
            href={lang === 'jp' ? '/' : '/en'} 
            className="luxury-text text-xl md:text-2xl font-bold tracking-[0.4em] group relative overflow-hidden"
          >
            <span className="relative z-10">Eterd.</span>
            <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-black transition-all duration-700 group-hover:w-full" />
          </Link>

          {/* Desktop Nav - Hidden on Profile Pages */}
          {!isProfilePage && (
            <nav className="hidden lg:flex items-center gap-14">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="nav-link text-[10px] font-bold uppercase tracking-[0.3em] text-secondary hover:text-black"
                >
                  {item.name}
                </Link>
              ))}
              
              <div className="w-[1px] h-6 bg-black/10 mx-2" />

              {/* Language Toggle */}
              <Link
                href={getToggleUrl()}
                className="group relative flex items-center gap-2 overflow-hidden px-6 py-2 border border-black/10 hover:border-black transition-all duration-700"
              >
                <span className="text-[9px] font-bold tracking-[0.3em] relative z-10 transition-colors group-hover:text-white">
                  {dict.langToggle}
                </span>
                <span className="absolute inset-0 bg-black translate-y-full transition-transform duration-500 ease-out group-hover:translate-y-0" />
              </Link>
            </nav>
          )}

          {/* Mobile Menu Button - Hidden on Profile Pages */}
          {!isProfilePage && (
            <div className="flex items-center gap-6 lg:hidden relative z-[70]">
              <Link
                href={getToggleUrl()}
                className={cn(
                  "text-[9px] font-bold tracking-[0.2em] transition-opacity duration-500",
                  isOpen ? "opacity-0 pointer-events-none" : "opacity-40 hover:opacity-100"
                )}
              >
                {lang === 'jp' ? 'EN' : 'JP'}
              </Link>
              <button
                className="w-10 h-10 flex flex-col items-center justify-center gap-[6px] transition-transform active:scale-90 relative"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle Menu"
              >
                <span 
                  className={cn(
                    "w-7 h-[1.5px] bg-black transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] origin-center",
                    isOpen ? "rotate-45 translate-y-[7.5px]" : ""
                  )} 
                />
                <span 
                  className={cn(
                    "w-7 h-[1.5px] bg-black transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]",
                    isOpen ? "opacity-0 scale-x-0" : ""
                  )} 
                />
                <span 
                  className={cn(
                    "w-7 h-[1.5px] bg-black transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] origin-center",
                    isOpen ? "-rotate-45 -translate-y-[7.5px]" : ""
                  )} 
                />
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Mobile Nav Overlay - Moved outside header container to avoid clipping from backdrop-filter */}
      <div
        className={cn(
          'fixed inset-0 bg-white z-[60] flex flex-col items-center justify-center transition-all duration-700 lg:hidden overflow-y-auto pt-24 pb-12',
          isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full pointer-events-none'
        )}
      >
        <div className="flex flex-col items-center gap-12">
          {navItems.map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              className="font-mincho text-3xl tracking-[0.4em] font-light hover:scale-110 transition-transform duration-500"
              style={{ 
                transitionDelay: isOpen ? `${(i + 1) * 100}ms` : '0ms',
                opacity: isOpen ? 1 : 0,
                transform: isOpen ? 'translateY(0)' : 'translateY(20px)'
              }}
              onClick={() => setIsOpen(false)}
            >
              {item.name}
            </Link>
          ))}
          
          <div className="w-12 h-[1px] bg-black/10 my-4" />
          
          <Link
            href={getToggleUrl()}
            className="text-[10px] font-bold tracking-[0.5em] border border-black px-10 py-4 hover:bg-black hover:text-white transition-all duration-500"
            style={{ 
              transitionDelay: isOpen ? `${(navItems.length + 1) * 100}ms` : '0ms',
              opacity: isOpen ? 1 : 0,
              transform: isOpen ? 'translateY(0)' : 'translateY(20px)'
            }}
            onClick={() => setIsOpen(false)}
          >
            {dict.langToggle}
          </Link>
        </div>
      </div>
    </>
  );
}
