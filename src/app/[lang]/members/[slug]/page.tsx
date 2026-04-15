import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import type { Metadata } from 'next';
import { Globe, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import type { Locale } from '@/i18n-config';
import { TwitterIcon, InstagramIcon, YoutubeIcon, NiconicoIcon } from '@/components/icons/SocialIcons';
import MemberProfileContent from '@/components/members/MemberProfileContent';

interface Props {
  params: Promise<{
    lang: Locale;
    slug: string;
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
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

  return (
    <MemberProfileContent member={member} />
  );
}
