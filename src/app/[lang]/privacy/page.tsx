import { getDictionary } from '@/lib/get-dictionary';
import type { Metadata } from 'next';
import { Locale } from '@/i18n-config';
import LegalLayout from '@/components/layout/LegalLayout';
import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ lang: string }> 
}): Promise<Metadata> {
  const { lang } = await params;

  const { data: settings } = await supabase
    .from('site_settings')
    .select('show_privacy')
    .eq('id', 1)
    .single();

  if (settings && !settings.show_privacy) {
    notFound();
  }

  const dict = await getDictionary(lang as Locale);
  return {
    title: dict.seo.privacy.title,
    description: dict.seo.privacy.description,
  };
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  const { data: settings } = await supabase
    .from('site_settings')
    .select('show_privacy')
    .eq('id', 1)
    .single();

  if (settings && !settings.show_privacy) {
    notFound();
  }

  const dict = await getDictionary(lang as Locale);
  const t = dict.privacy;

  return (
    <LegalLayout title={t.title} subtitle={t.subtitle}>
      <div className="space-y-16">
        {t.sections.map((section, index) => (
          <div key={index} className="space-y-6">
            <h2 className="font-mincho text-2xl font-bold tracking-wider">
              {section.title}
            </h2>
            <p className="text-secondary leading-loose tracking-wide whitespace-pre-wrap">
              {section.content}
            </p>
          </div>
        ))}
      </div>
    </LegalLayout>
  );
}
