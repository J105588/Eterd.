'use client';

import React from 'react';

interface LegalLayoutProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export default function LegalLayout({ title, subtitle, children }: LegalLayoutProps) {
  return (
    <div className="relative z-10 max-w-4xl mx-auto py-32 px-8">
      <section className="mb-24 space-y-6 text-center reveal-up active">
        <span className="text-[10px] uppercase tracking-[0.6em] text-secondary font-bold border-b border-black/10 pb-2">
          Legal
        </span>
        <h1 className="font-mincho text-5xl md:text-7xl font-black tracking-widest uppercase">
          {title}
        </h1>
        {subtitle && (
          <p className="text-secondary text-sm font-medium tracking-[0.2em] mt-8">
            {subtitle}
          </p>
        )}
      </section>

      <div className="luxury-card space-y-16 animate-in fade-in slide-in-from-bottom-10 duration-1000">
        {children}
      </div>

      <div className="mt-24 w-[1px] h-24 bg-gradient-to-b from-black/20 to-transparent mx-auto" />
    </div>
  );
}
