import { getDictionary } from '@/lib/get-dictionary';
import type { Metadata } from 'next';
import type { Locale } from '@/i18n-config';
import EventsContent from '@/components/events/EventsContent';
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
    .select('show_events')
    .eq('id', 1)
    .single();

  if (settings && !settings.show_events) {
    notFound();
  }

  const dict = await getDictionary(lang);
  return {
    title: dict.seo.events.title,
    description: dict.seo.events.description,
  };
}

export default async function Events({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;

  const { data: settings } = await supabase
    .from('site_settings')
    .select('show_events')
    .eq('id', 1)
    .single();

  if (settings && !settings.show_events) {
    notFound();
  }

  const dict = await getDictionary(lang);

  const { data: events } = await supabase
    .from('events')
    .select('*')
    .eq('is_public', true)
    .order('event_date', { ascending: true });

  return <EventsContent lang={lang} dict={dict} initialEvents={events || []} />;
}
