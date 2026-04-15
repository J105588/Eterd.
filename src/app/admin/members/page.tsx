import type { Metadata } from 'next';
import MembersAdminContent from '@/components/admin/MembersAdminContent';

export const metadata: Metadata = {
  title: 'アーティスト管理 | Eterd. 管理',
  description: 'Eterd. 所属アーティスト・メンバーの編集・管理。',
  robots: {
    index: false,
    follow: false,
  },
};

export default function MembersPage() {
  return <MembersAdminContent />;
}
