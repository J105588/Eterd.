import { getDictionary } from '@/lib/get-dictionary';
import type { Metadata } from 'next';
import type { Locale } from '@/i18n-config';
import AboutContent from '@/components/about/AboutContent';
import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ lang: Locale }> 
}): Promise<Metadata> {
  const { lang } = await params;
  
  const { data: settings } = await supabase
    .from('site_settings')
    .select('show_about')
    .eq('id', 1)
    .single();

  if (settings && !settings.show_about) {
    notFound();
  }

  const dict = await getDictionary(lang);
  return {
    title: dict.seo.about.title,
    description: dict.seo.about.description,
  };
}

export default async function About({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;

  const { data: settings } = await supabase
    .from('site_settings')
    .select('show_about')
    .eq('id', 1)
    .single();

  if (settings && !settings.show_about) {
    notFound();
  }

  const dict = await getDictionary(lang);
  
  return <AboutContent lang={lang} t={dict.about} />;
}
