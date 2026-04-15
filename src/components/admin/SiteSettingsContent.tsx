'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Loader2, Save, Globe, Users, Calendar, Mail, FileText, ShieldAlert } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SiteSettings {
  show_about: boolean;
  show_members: boolean;
  show_events: boolean;
  show_contact: boolean;
  show_privacy: boolean;
  show_terms: boolean;
}

export default function SiteSettingsContent() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .eq('id', 1)
      .single();

    if (data) setSettings(data);
    setLoading(false);
  };

  const handleToggle = (key: keyof SiteSettings) => {
    if (!settings) return;
    setSettings({ ...settings, [key]: !settings[key] });
  };

  const handleSave = async () => {
    if (!settings) return;
    setIsSaving(true);
    const { error } = await supabase
      .from('site_settings')
      .update(settings)
      .eq('id', 1);

    if (error) alert(error.message);
    setIsSaving(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="animate-spin text-gray-200" size={32} />
      </div>
    );
  }

  const toggleItems = [
    { key: 'show_about' as const, label: 'About Page', icon: <Globe size={18} /> },
    { key: 'show_members' as const, label: 'Artists Page', icon: <Users size={18} /> },
    { key: 'show_events' as const, label: 'Events Page', icon: <Calendar size={18} /> },
    { key: 'show_contact' as const, label: 'Contact Page', icon: <Mail size={18} /> },
    { key: 'show_privacy' as const, label: 'Privacy Policy', icon: <ShieldAlert size={18} /> },
    { key: 'show_terms' as const, label: 'Terms of Service', icon: <FileText size={18} /> },
  ];

  return (
    <div className="space-y-12 max-w-4xl">
      <header className="flex justify-between items-end">
        <div className="space-y-2">
          <p className="text-xs font-bold uppercase tracking-widest text-secondary">Global Configuration</p>
          <h1 className="text-4xl font-light">Site Settings</h1>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-black text-white px-8 py-4 text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-all flex items-center gap-4 disabled:opacity-50"
        >
          {isSaving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
          Save Configuration
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {toggleItems.map((item) => (
          <div key={item.key} className="bg-white border border-gray-100 p-8 flex items-center justify-between group hover:border-black transition-all">
            <div className="flex items-center gap-6">
              <div className="text-secondary group-hover:text-black transition-colors">
                {item.icon}
              </div>
              <span className="text-xs font-bold uppercase tracking-widest">{item.label}</span>
            </div>
            
            <button
              onClick={() => handleToggle(item.key)}
              className={cn(
                "w-12 h-6 rounded-full transition-all relative flex items-center px-1",
                settings?.[item.key] ? "bg-black" : "bg-gray-200"
              )}
            >
              <div className={cn(
                "w-4 h-4 bg-white rounded-full transition-transform",
                settings?.[item.key] ? "translate-x-6" : "translate-x-0"
              )} />
            </button>
          </div>
        ))}
      </div>

      <div className="p-8 bg-gray-50 border border-gray-100">
        <h3 className="text-[10px] font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
          <ShieldAlert size={12} className="text-black" />
          Critical Note
        </h3>
        <p className="text-xs text-secondary leading-loose">
          Disabling a page here will remove it from the navigation and return a <strong>404 Not Found</strong> error for that route. 
          This ensures the content is completely inaccessible until re-enabled.
        </p>
      </div>
    </div>
  );
}
