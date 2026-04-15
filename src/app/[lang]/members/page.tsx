import { getDictionary } from '@/lib/get-dictionary';
import type { Metadata } from 'next';
import type { Locale } from '@/i18n-config';
import { User } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { TwitterIcon, InstagramIcon, YoutubeIcon, NiconicoIcon } from '@/components/icons/SocialIcons';

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
    <div className="relative z-10 max-w-7xl mx-auto py-32 px-8">
      <header className="mb-24 space-y-4 text-center md:text-left">
        <div className="w-12 h-[1px] bg-black/20 mx-auto md:mx-0" />
        <h1 className="luxury-text text-5xl font-light tracking-[0.2em]">{dict.header.members}</h1>
        <p className="text-secondary text-xs uppercase tracking-widest opacity-60">Affiliated Creators / Artists</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 md:gap-x-12 md:gap-y-24">
        {members && members.length > 0 ? (
          members.map((member) => (
            <div key={member.id} className="group space-y-8 h-full flex flex-col items-center md:items-start">
              <div 
                className="block relative aspect-square w-64 md:w-full max-w-[280px] bg-gray-50 rounded-full border border-gray-100 overflow-hidden grayscale hover:grayscale-0 transition-all duration-1000 group-hover:shadow-2xl group-hover:shadow-black/5"
              >
                {member.image_url ? (
                  <img src={member.image_url} alt={member.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center opacity-5">
                    <User size={120} />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              </div>

              <div className="space-y-4 flex-grow text-center md:text-left px-4 md:px-0">
                <div className="block">
                  <h3 className="font-mincho text-2xl font-bold tracking-widest">{member.name}</h3>
                </div>
                <p className="text-secondary text-sm leading-relaxed font-light whitespace-pre-wrap line-clamp-3 group-hover:line-clamp-none transition-all duration-500">
                  {member.profile_text}
                </p>
              </div>

              <div className="flex items-center gap-6 pt-6 border-t border-gray-50 w-full justify-center md:justify-start">
                {member.twitter_url && (
                  <a href={member.twitter_url} target="_blank" rel="noopener noreferrer" className="text-secondary hover:text-black transition-colors">
                    <TwitterIcon size={18} />
                  </a>
                )}
                {member.instagram_url && (
                  <a href={member.instagram_url} target="_blank" rel="noopener noreferrer" className="text-secondary hover:text-black transition-colors">
                    <InstagramIcon size={18} />
                  </a>
                )}
                {member.youtube_url && (
                  <a href={member.youtube_url} target="_blank" rel="noopener noreferrer" className="text-secondary hover:text-black transition-colors">
                    <YoutubeIcon size={18} />
                  </a>
                )}
                {member.niconico_url && (
                  <a href={member.niconico_url} target="_blank" rel="noopener noreferrer" className="text-secondary hover:text-black transition-colors">
                    <NiconicoIcon size={18} />
                  </a>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-48 text-center border border-dashed border-gray-100 italic text-secondary font-mincho">
             No artists published yet.
          </div>
        )}
      </div>
    </div>
  );
}
