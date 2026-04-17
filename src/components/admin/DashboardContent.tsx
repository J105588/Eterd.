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
    <div className="space-y-8 md:space-y-12">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div className="space-y-2">
          <p className="text-[10px] font-bold uppercase tracking-widest text-secondary text-primary/50">Overview</p>
          <h1 className="text-3xl md:text-4xl font-light">Management Dashboard</h1>
        </div>
        <div className="text-left md:text-right text-[10px] text-secondary font-mono opacity-50">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        {cards.map((card) => (
          <Link
            key={card.name}
            href={card.href}
            className="group relative bg-white p-6 md:p-10 border border-gray-100 hover:border-black transition-all hover:shadow-2xl hover:shadow-black/5"
          >
            <div className="flex justify-between items-start">
              <div className="space-y-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-secondary">{card.name}</p>
                <p className="text-5xl md:text-6xl font-light">{loading ? '...' : card.value}</p>
              </div>
              <div className={cn("p-3 md:p-4 text-white shrink-0", card.color)}>
                <card.icon size={20} className="md:w-6 md:h-6" />
              </div>
            </div>
            <div className="mt-6 md:mt-8 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-black/40 group-hover:text-black transition-colors">
              Manage Items <ArrowUpRight size={12} />
            </div>
          </Link>
        ))}
      </div>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        <div className="lg:col-span-2 bg-white border border-gray-100 p-6 md:p-10 space-y-8">
           <div className="flex justify-between items-center">
             <h2 className="text-sm md:text-lg font-semibold uppercase tracking-widest">Quick Actions</h2>
           </div>
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link href="/admin/members" className="flex items-center justify-center gap-4 border border-gray-100 py-6 hover:bg-black hover:text-white transition-all text-[10px] sm:text-xs uppercase tracking-widest font-bold">
                 <Plus size={16} /> Add Member
              </Link>
              <Link href="/admin/events" className="flex items-center justify-center gap-4 border border-gray-100 py-6 hover:bg-black hover:text-white transition-all text-[10px] sm:text-xs uppercase tracking-widest font-bold">
                 <Plus size={16} /> Create Event
              </Link>
           </div>
        </div>

        <div className="bg-black text-white p-6 md:p-10 space-y-8 flex flex-col justify-center">
           <h2 className="text-sm md:text-lg font-semibold uppercase tracking-widest text-white/60">System Status</h2>
           <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-white/10 pb-4">
                 <span className="text-[10px] uppercase tracking-widest text-white/40">Database</span>
                 <span className="text-[10px] font-bold text-green-400">ONLINE</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/10 pb-4">
                 <span className="text-[10px] uppercase tracking-widest text-white/40">Storage</span>
                 <span className="text-[10px] font-bold text-green-400">CONNECTED</span>
              </div>
              <div className="flex justify-between items-center">
                 <span className="text-[10px] uppercase tracking-widest text-white/40">Auth Service</span>
                 <span className="text-[10px] font-bold text-green-400">ACTIVE</span>
              </div>
           </div>
        </div>
      </section>
    </div>
  );
}
