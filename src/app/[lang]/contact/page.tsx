import { getDictionary } from '@/lib/get-dictionary';
import type { Metadata } from 'next';
import type { Locale } from '@/i18n-config';
import ContactContent from '@/components/contact/ContactContent';
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
    .select('show_contact')
    .eq('id', 1)
    .single();

  if (settings && !settings.show_contact) {
    notFound();
  }

  const dict = await getDictionary(lang);
  return {
    title: dict.seo.contact.title,
    description: dict.seo.contact.description,
  };
}

export default async function Contact({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;

  const { data: settings } = await supabase
    .from('site_settings')
    .select('show_contact')
    .eq('id', 1)
    .single();

  if (settings && !settings.show_contact) {
    notFound();
  }

  const dict = await getDictionary(lang);

  return <ContactContent lang={lang} t={dict.contact} />;
}
