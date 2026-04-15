'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Users, Calendar, ArrowUpRight, Plus } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function DashboardContent() {
  const [stats, setStats] = useState({
    members: 0,
    events: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const [{ count: membersCount }, { count: eventsCount }] = await Promise.all([
        supabase.from('members').select('*', { count: 'exact', head: true }),
        supabase.from('events').select('*', { count: 'exact', head: true }),
      ]);

      setStats({
        members: membersCount || 0,
        events: eventsCount || 0,
      });
      setLoading(false);
    };

    fetchStats();
  }, []);

  const cards = [
    { name: 'Total Members', value: stats.members, icon: Users, href: '/admin/members', color: 'bg-blue-500' },
    { name: 'Upcoming Events', value: stats.events, icon: Calendar, href: '/admin/events', color: 'bg-black' },
  ];

  return (
    <div className="space-y-12">
      <header className="flex justify-between items-end">
        <div className="space-y-2">
          <p className="text-xs font-bold uppercase tracking-widest text-secondary">Overview</p>
          <h1 className="text-4xl font-light">Management Dashboard</h1>
        </div>
        <div className="text-right text-xs text-secondary font-mono">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {cards.map((card) => (
          <Link
            key={card.name}
            href={card.href}
            className="group relative bg-white p-10 border border-gray-100 hover:border-black transition-all hover:shadow-2xl hover:shadow-black/5"
          >
            <div className="flex justify-between items-start">
              <div className="space-y-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-secondary">{card.name}</p>
                <p className="text-6xl font-light">{loading ? '...' : card.value}</p>
              </div>
              <div className={cn("p-4 text-white shrink-0", card.color)}>
                <card.icon size={24} />
              </div>
            </div>
            <div className="mt-8 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-black/40 group-hover:text-black transition-colors">
              Manage Items <ArrowUpRight size={12} />
            </div>
          </Link>
        ))}
      </div>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white border border-gray-100 p-10 space-y-8">
           <div className="flex justify-between items-center">
             <h2 className="text-lg font-semibold uppercase tracking-widest">Quick Actions</h2>
           </div>
           <div className="grid grid-cols-2 gap-4">
              <Link href="/admin/members" className="flex items-center justify-center gap-4 border border-gray-100 py-6 hover:bg-black hover:text-white transition-all text-xs uppercase tracking-widest font-bold">
                 <Plus size={16} /> Add Member
              </Link>
              <Link href="/admin/events" className="flex items-center justify-center gap-4 border border-gray-100 py-6 hover:bg-black hover:text-white transition-all text-xs uppercase tracking-widest font-bold">
                 <Plus size={16} /> Create Event
              </Link>
           </div>
        </div>

        <div className="bg-black text-white p-10 space-y-8 flex flex-col justify-center">
           <h2 className="text-lg font-semibold uppercase tracking-widest text-white/60">System Status</h2>
           <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-white/10 pb-4">
                 <span className="text-xs uppercase tracking-widest text-white/40">Database</span>
                 <span className="text-xs font-bold text-green-400">ONLINE</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/10 pb-4">
                 <span className="text-xs uppercase tracking-widest text-white/40">Storage</span>
                 <span className="text-xs font-bold text-green-400">CONNECTED</span>
              </div>
              <div className="flex justify-between items-center">
                 <span className="text-xs uppercase tracking-widest text-white/40">Auth Service</span>
                 <span className="text-xs font-bold text-green-400">ACTIVE</span>
              </div>
           </div>
        </div>
      </section>
    </div>
  );
}
