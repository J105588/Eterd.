import type { Metadata } from 'next';
import EventsAdminContent from '@/components/admin/EventsAdminContent';

export const metadata: Metadata = {
  title: 'イベント管理 | Eterd. 管理',
  description: 'Eterd. 関連イベント・公演情報の編集・管理。',
  robots: {
    index: false,
    follow: false,
  },
};

export default function EventsPage() {
  return <EventsAdminContent />;
}
