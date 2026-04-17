export const dynamic = 'force-dynamic';

import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import type { Metadata } from 'next';
import { Globe, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import type { Locale } from '@/i18n-config';
import { TwitterIcon, InstagramIcon, YoutubeIcon, NiconicoIcon } from '@/components/icons/SocialIcons';
import MemberProfileContent from '@/components/members/MemberProfileContent';
import StructuredData from '@/components/seo/StructuredData';

interface Props {
  params: Promise<{
    lang: Locale;
    slug: string;
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params;
  const { data: member } = await supabase
    .from('members')
    .select('name, profile_text, is_public')
    .eq('slug', slug.toLowerCase())
    .single();

  if (!member || member.is_public === false) return { title: 'Member Not Found' };

  return {
    title: `${member.name}`,
    description: member.profile_text || `${member.name}のプロフィール。`,
    robots: { index: true, follow: true },
    alternates: {
      canonical: `/${lang}/members/${slug}`,
      languages: {
        'ja': `/ja/members/${slug}`,
        'en': `/en/members/${slug}`,
      },
    },
  };
}

export default async function MemberProfilePage({ params }: Props) {
  const { lang, slug } = await params;

  const { data: member } = await supabase
    .from('members')
    .select('*')
    .eq('slug', slug.toLowerCase())
    .single();

  if (!member || member.is_public === false) {
    notFound();
  }

  const socialLinks = [
    ...(Array.isArray(member.external_links) ? member.external_links.map((l: any) => l.url) : [])
  ].filter(Boolean);

  const personData = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": member.name,
    "description": member.profile_text,
    "image": member.image_url,
    "sameAs": socialLinks,
    "url": `https://eterd.vercel.app/${lang}/members/${slug}`,
  };

  return (
    <>
      <StructuredData data={personData} />
      <MemberProfileContent member={member} />
    </>
  );
}
