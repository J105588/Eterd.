import SiteSettingsContent from '@/components/admin/SiteSettingsContent';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Site Settings | Admin',
  robots: { index: false, follow: false },
};

export default function SiteSettingsPage() {
  return <SiteSettingsContent />;
}
