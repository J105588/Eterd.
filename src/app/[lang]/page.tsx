import { getDictionary } from '@/lib/get-dictionary';
import type { Locale } from '@/i18n-config';
import HomeContent from '../../components/home/HomeContent';
import { supabase } from '@/lib/supabase';

export default async function Home({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  
  // Fetch top 3 upcoming events
  const today = new Date().toISOString().split('T')[0];
  const { data: events } = await supabase
    .from('events')
    .select('*')
    .eq('is_public', true)
    .filter('event_date', 'gte', today)
    .order('event_date', { ascending: true })
    .limit(3);

  return <HomeContent lang={lang} t={dict.home} initialEvents={events || []} />;
}
