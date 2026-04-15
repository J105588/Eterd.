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

import { Suspense } from 'react';

export default function AdminLoginPage() {
  return (
    <Suspense>
      <AdminLoginContent />
    </Suspense>
  );
}
