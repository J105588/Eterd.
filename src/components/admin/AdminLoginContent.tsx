'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, AlertCircle } from 'lucide-react';

export default function AdminLoginContent() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const isInactive = searchParams.get('reason') === 'inactive';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (loginError) {
      setError(loginError.message);
      setLoading(false);
    } else {
      router.push('/admin/dashboard');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-8">
      <div className="w-full max-w-md space-y-12">
        <div className="text-center space-y-4">
          <h1 className="luxury-text text-3xl font-bold uppercase tracking-[0.5em]">Admin Login</h1>
          <p className="text-secondary text-xs uppercase tracking-widest">Management System Portal</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-8">
          {error && (
            <div className="p-4 bg-red-50 border border-red-100 text-red-600 text-[10px] uppercase tracking-widest flex items-center gap-3">
              <AlertCircle size={14} />
              {error}
            </div>
          )}

          {isInactive && !error && (
            <div className="p-4 bg-amber-50 border border-amber-100 text-amber-700 text-[10px] font-bold uppercase tracking-widest flex items-center gap-3">
              <AlertCircle size={14} />
              操作がなかったためログアウトしました。
            </div>
          )}

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-secondary block">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-50 border border-gray-100 px-6 py-4 focus:border-black outline-none transition-all"
                placeholder="admin@eterd.jp"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-secondary block">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-50 border border-gray-100 px-6 py-4 focus:border-black outline-none transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-5 text-[10px] font-bold uppercase tracking-[0.4em] hover:bg-gray-800 transition-all flex items-center justify-center gap-4"
          >
            {loading ? <Loader2 className="animate-spin" size={16} /> : 'Authenticate'}
          </button>
        </form>

        <p className="text-center text-[10px] text-gray-300 uppercase tracking-widest">
          Secure Access Authorized Personnel Only
        </p>
      </div>
    </div>
  );
}
