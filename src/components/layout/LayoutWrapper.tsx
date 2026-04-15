'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import OpeningAnimation from '@/components/home/OpeningAnimation';
import BackgroundSlider from '@/components/home/BackgroundSlider';
import type { Locale } from '@/i18n-config';
import type { Dictionary } from '@/dictionaries/jp';
import { supabase } from '@/lib/supabase';

interface LayoutWrapperProps {
  children: React.ReactNode;
  lang: Locale;
  dict: Dictionary;
}

export default function LayoutWrapper({
  children,
  lang,
  dict,
}: LayoutWrapperProps) {
  const [openingComplete, setOpeningComplete] = useState(true);
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [siteSettings, setSiteSettings] = useState<any>(null);

  useEffect(() => {
    setIsMounted(true);
    const hasPlayed = sessionStorage.getItem('opening-played');
    
    if (!hasPlayed) {
      setOpeningComplete(false);
      setShouldAnimate(true);
    }
    
    setIsChecking(false);
    
    // Fetch site settings for visibility
    const fetchSettings = async () => {
      const { data } = await supabase.from('site_settings').select('*').eq('id', 1).single();
      if (data) setSiteSettings(data);
    };
    fetchSettings();
  }, []);

  const handleComplete = () => {
    setOpeningComplete(true);
    sessionStorage.setItem('opening-played', 'true');
  };

  const bgImages = Array.from({ length: 26 }, (_, i) => `/wallpapers/${i + 2}.png`);

  return (
    <>
      {shouldAnimate && !openingComplete && (
        <OpeningAnimation onComplete={handleComplete} />
      )}
      
      <div 
        className={`relative min-h-screen flex flex-col transition-opacity duration-1000 ${
          (!isMounted || isChecking) ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <BackgroundSlider images={bgImages} />
        
        <Header lang={lang} dict={dict.header} siteSettings={siteSettings} />
        
        <main className="flex-grow pt-24">
          {children}
        </main>
        
        <Footer lang={lang} dict={dict.footer} siteSettings={siteSettings} />
      </div>
    </>
  );
}
