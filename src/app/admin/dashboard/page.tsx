import type { Metadata } from 'next';
import DashboardContent from '@/components/admin/DashboardContent';

export const metadata: Metadata = {
  title: 'ダッシュボード | Eterd. 管理',
  description: 'Eterd. 管理システムのオーバービュー。',
  robots: {
    index: false,
    follow: false,
  },
};

export default function DashboardPage() {
  return <DashboardContent />;
}
