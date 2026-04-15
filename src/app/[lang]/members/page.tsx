import { getDictionary } from '@/lib/get-dictionary';
import type { Metadata } from 'next';
import type { Locale } from '@/i18n-config';
import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import MembersContent from '@/components/members/MembersContent';

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ lang: Locale }> 
}): Promise<Metadata> {
  const { lang } = await params;

  const { data: settings } = await supabase
    .from('site_settings')
    .select('show_members')
    .eq('id', 1)
    .single();

  if (settings && !settings.show_members) {
    notFound();
  }

  const dict = await getDictionary(lang);
  return {
    title: dict.seo.members.title,
    description: dict.seo.members.description,
  };
}

export default async function Members({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;

  const { data: settings } = await supabase
    .from('site_settings')
    .select('show_members')
    .eq('id', 1)
    .single();

  if (settings && !settings.show_members) {
    notFound();
  }

  const dict = await getDictionary(lang);

  const { data: members } = await supabase
    .from('members')
    .select('*')
    .eq('is_public', true)
    .order('display_order', { ascending: true });

  return (
    <MembersContent 
      lang={lang} 
      dict={dict} 
      members={members || []} 
    />
  );
}
