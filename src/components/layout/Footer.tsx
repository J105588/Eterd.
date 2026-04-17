import Link from 'next/link';
import type { Locale } from '@/i18n-config';
import type { Dictionary } from '@/dictionaries/jp';

interface FooterProps {
  lang: Locale;
  dict: Dictionary['footer'];
  siteSettings?: any;
}

export default function Footer({ lang, dict, siteSettings }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative z-10 bg-white/50 border-t border-gray-100 py-16 px-8 md:px-12 mt-auto backdrop-blur-sm">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-12">
        <div className="space-y-4">
          <h2 className="luxury-text text-2xl font-semibold tracking-[0.3em]">Eterd.</h2>
          <p className="text-secondary text-sm max-w-xs leading-relaxed font-light whitespace-pre-wrap">
            {dict.description}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-12">
          <div className="space-y-4">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-black">Exploration</h3>
            <ul className="space-y-3 text-sm text-secondary font-light">
              {(siteSettings?.show_about ?? true) && <li><Link href={lang === 'jp' ? '/about' : '/en/about'} className="hover:text-black transition-colors">{dict.links.concept}</Link></li>}
              {(siteSettings?.show_members ?? true) && <li><Link href={lang === 'jp' ? '/members' : '/en/members'} className="hover:text-black transition-colors">{dict.links.artists}</Link></li>}
              {(siteSettings?.show_events ?? true) && <li><Link href={lang === 'jp' ? '/events' : '/en/events'} className="hover:text-black transition-colors">{dict.links.events}</Link></li>}
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-black">Contact</h3>
            <ul className="space-y-3 text-sm text-secondary font-light">
              <li><a href="mailto:eterd.contact@gmail.com" className="hover:text-black transition-colors">{dict.links.email}</a></li>
              <li><a href="https://x.com/Eterd_jp" target="_blank" className="hover:text-black transition-colors">X (Twitter)</a></li>
              {(siteSettings?.show_contact ?? true) && <li><Link href={lang === 'jp' ? '/contact' : '/en/contact'} className="hover:text-black transition-colors">{dict.links.inquiry}</Link></li>}
            </ul>
          </div>
          <div className="space-y-4 col-span-2 md:col-span-1">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-black">Legal</h3>
            <ul className="space-y-3 text-sm text-secondary font-light">
              {(siteSettings?.show_privacy ?? true) && <li><Link href={lang === 'jp' ? '/privacy' : '/en/privacy'} className="hover:text-black transition-colors">{dict.links.privacy}</Link></li>}
              {(siteSettings?.show_terms ?? true) && <li><Link href={lang === 'jp' ? '/terms' : '/en/terms'} className="hover:text-black transition-colors">{dict.links.terms}</Link></li>}
            </ul>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-gray-100 flex justify-between items-center text-[9px] uppercase tracking-[0.3em] text-secondary font-medium">
        <p>&copy; {currentYear} Eterd. {dict.copyright}</p>
        {dict.location && <p className="hidden md:block">{dict.location}</p>}
      </div>
    </footer>
  );
}
