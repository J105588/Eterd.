import type { Metadata } from 'next';
import AdminLoginContent from '@/components/admin/AdminLoginContent';

export const metadata: Metadata = {
  title: 'ログイン | Eterd. 管理',
  description: 'Eterd. 管理システムへのセキュアログイン。',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLoginPage() {
  return <AdminLoginContent />;
}
