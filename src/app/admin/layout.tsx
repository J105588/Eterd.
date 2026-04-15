'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Users, Calendar, LayoutDashboard, LogOut, Loader2, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Inter } from "next/font/google";
import "../globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session && pathname !== '/admin') {
        router.push('/admin');
      } else {
        setLoading(false);
      }
    };

    checkUser();
  }, [router, pathname]);

  // Auto-logout logic
  useEffect(() => {
    if (pathname === '/admin' || loading) return;

    let timeoutId: NodeJS.Timeout;
    const TIMEOUT_DURATION = 30 * 60 * 1000; // 30 minutes

    const logoutDueToInactivity = async () => {
      await supabase.auth.signOut();
      router.push('/admin?reason=inactive');
    };

    const resetTimer = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(logoutDueToInactivity, TIMEOUT_DURATION);
    };

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(event => window.addEventListener(event, resetTimer));

    resetTimer();

    return () => {
      events.forEach(event => window.removeEventListener(event, resetTimer));
      clearTimeout(timeoutId);
    };
  }, [pathname, loading, router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin');
  };

  if (loading && pathname !== '/admin') {
    return (
      <html lang="en">
        <body className={`${inter.variable} font-sans antialiased text-foreground selection:bg-black selection:text-white`}>
          <div className="h-screen flex items-center justify-center bg-white">
            <Loader2 className="animate-spin text-gray-300" size={32} />
          </div>
        </body>
      </html>
    );
  }

  // If it's the login page, don't show the sidebar
  if (pathname === '/admin') {
    return (
      <html lang="en" className="h-full">
        <body className={`${inter.variable} font-sans antialiased text-foreground h-full`}>
          {children}
        </body>
      </html>
    );
  }

  const menuItems = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Members', href: '/admin/members', icon: Users },
    { name: 'Events', href: '/admin/events', icon: Calendar },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased text-foreground selection:bg-black selection:text-white`}>
        <div className="min-h-screen bg-gray-50 flex">
          {/* Sidebar */}
          <aside className="w-64 bg-white border-r border-gray-200 flex flex-col fixed h-full">
            <div className="p-8 border-b border-gray-100 flex items-center gap-4">
              <div className="relative w-8 h-8">
                <Image src="/icon.png" alt="Admin Icon" fill className="object-contain" />
              </div>
              <span className="luxury-text text-lg font-bold">Admin</span>
            </div>

            <nav className="flex-grow p-6 space-y-2">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-4 px-4 py-3 text-sm transition-all',
                    pathname === item.href
                      ? 'bg-black text-white shadow-lg shadow-black/10'
                      : 'text-secondary hover:bg-gray-50 hover:text-black'
                  )}
                >
                  <item.icon size={18} strokeWidth={pathname === item.href ? 2.5 : 2} />
                  {item.name}
                </Link>
              ))}
            </nav>

            <div className="p-6 border-t border-gray-100">
              <button
                onClick={handleLogout}
                className="flex items-center gap-4 px-4 py-3 text-sm text-red-500 hover:bg-red-50 w-full transition-all"
              >
                <LogOut size={18} />
                Sign Out
              </button>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-grow ml-64 p-12">
            <div className="max-w-6xl mx-auto animate-fade-in">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
