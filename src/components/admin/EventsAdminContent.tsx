'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Plus, Edit2, Trash2, X, Loader2, Calendar, Upload } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EventItem {
  id: string;
  title: string;
  event_date: string;
  description: string | null;
  image_url: string | null;
  venue: string | null;
  ticket_link: string | null;
  google_form_link: string | null;
  youtube_url: string | null;
  external_links: { type: string; url: string }[] | null;
  is_public: boolean;
}

const LINK_TYPES = [
  'X',
  'YouTube',
  'niconico',
  'Ticket',
  'Google Form',
  'Official Site',
  'Others'
];

export default function EventsAdminContent() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);

  const [uploadMode, setUploadMode] = useState<'url' | 'file'>('url');
  const [uploadingFile, setUploadingFile] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    event_date: '',
    description: '',
    image_url: '',
    venue: '',
    ticket_link: '',
    google_form_link: '',
    youtube_url: '',
    external_links: [] as { type: string; url: string }[],
    is_public: true,
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('event_date', { ascending: true });

    if (data) setEvents(data);
    setLoading(false);
  };

  const handleOpenModal = (event: EventItem | null = null) => {
    if (event) {
      setEditingEvent(event);
      setFormData({
        title: event.title,
        event_date: event.event_date,
        description: event.description || '',
        image_url: event.image_url || '',
        venue: event.venue || '',
        ticket_link: event.ticket_link || '',
        google_form_link: event.google_form_link || '',
        youtube_url: event.youtube_url || '',
        external_links: Array.isArray(event.external_links) ? event.external_links : [],
        is_public: event.is_public ?? true,
      });
      setUploadMode('url');
    } else {
      setEditingEvent(null);
      setFormData({
        title: '',
        event_date: new Date().toISOString().split('T')[0],
        description: '',
        image_url: '',
        venue: '',
        ticket_link: '',
        google_form_link: '',
        youtube_url: '',
        external_links: [],
        is_public: true,
      });
      setUploadMode('url');
    }
    setIsModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingFile(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `events/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('events')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('events')
        .getPublicUrl(filePath);

      setFormData({ ...formData, image_url: publicUrl });
    } catch (error: any) {
      alert('Upload failed: ' + error.message);
    } finally {
      setUploadingFile(false);
    }
  };

  const addExternalLink = () => {
    setFormData({
      ...formData,
      external_links: [...formData.external_links, { type: 'Official Site', url: '' }]
    });
  };

  const removeExternalLink = (index: number) => {
    const newLinks = [...formData.external_links];
    newLinks.splice(index, 1);
    setFormData({ ...formData, external_links: newLinks });
  };

  const updateExternalLink = (index: number, field: 'type' | 'url', value: string) => {
    const newLinks = [...formData.external_links];
    newLinks[index] = { ...newLinks[index], [field]: value };
    setFormData({ ...formData, external_links: newLinks });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    if (editingEvent) {
      const { error } = await supabase
        .from('events')
        .update(formData)
        .eq('id', editingEvent.id);
      if (error) alert(error.message);
    } else {
      const { error } = await supabase
        .from('events')
        .insert([formData]);
      if (error) alert(error.message);
    }

    setIsSaving(false);
    setIsModalOpen(false);
    fetchEvents();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this event?')) {
      const { error } = await supabase.from('events').delete().eq('id', id);
      if (error) alert(error.message);
      else fetchEvents();
    }
  };

  return (
    <div className="space-y-8 md:space-y-12">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-2">
          <p className="text-[10px] font-bold uppercase tracking-widest text-secondary opacity-50">Schedule Management</p>
          <h1 className="text-3xl md:text-4xl font-light">Performance Events</h1>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="bg-black text-white px-6 md:px-8 py-4 text-[10px] md:text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-all flex items-center gap-3 w-full md:w-auto justify-center"
        >
          <Plus size={16} /> Create New Event
        </button>
      </header>

      {loading ? (
        <div className="flex justify-center py-24">
          <Loader2 className="animate-spin text-gray-200" size={32} />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {events.map((event) => (
            <div key={event.id} className="bg-white border border-gray-100 p-4 md:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 group hover:border-black transition-all">
              <div className="flex items-center gap-4 md:gap-8 w-full sm:w-auto">
                <div className="flex flex-col items-center justify-center p-2 md:p-3 bg-gray-50 luxury-text w-16 md:w-20 shrink-0">
                  <span className="text-[10px] text-secondary opacity-60">{event.event_date.split('-')[1]}/{event.event_date.split('-')[2]}</span>
                  <span className="text-lg md:text-xl font-bold">{event.event_date.split('-')[0]}</span>
                </div>
                <div className="space-y-1 flex-grow">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="text-base md:text-xl font-light">{event.title}</h3>
                    {!event.is_public && (
                      <span className="text-[8px] uppercase tracking-widest bg-gray-100 px-2 py-0.5 text-gray-400 font-bold">Draft</span>
                    )}
                  </div>
                  <p className="text-[9px] md:text-xs text-secondary uppercase tracking-widest opacity-60 truncate max-w-[200px] md:max-w-none">{event.venue || "No venue set"}</p>
                </div>
              </div>
              <div className="flex gap-2 w-full sm:w-auto justify-end border-t sm:border-0 pt-4 sm:pt-0">
                <button
                  onClick={() => handleOpenModal(event)}
                  className="p-3 text-secondary hover:text-black hover:bg-gray-50 transition-all"
                >
                  <Edit2 size={18} />
                </button>
                <button
                  onClick={() => handleDelete(event.id)}
                  className="p-3 text-secondary hover:text-red-500 hover:bg-red-50 transition-all"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-white w-full max-w-2xl max-h-[95vh] overflow-y-auto shadow-2xl my-auto animate-fade-in">
            <div className="p-6 md:p-12">
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-6 right-6 md:top-8 md:right-8 text-secondary hover:text-black z-10"
              >
                <X size={20} />
              </button>

              <h2 className="luxury-text text-xl md:text-2xl font-bold mb-8 md:mb-10">
                {editingEvent ? 'Edit Event' : 'Create New Event'}
              </h2>

              <form onSubmit={handleSave} className="space-y-6 md:space-y-8">
                <div className="flex items-center gap-4 pb-4 border-b border-gray-50">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, is_public: !formData.is_public })}
                    className={cn(
                      "w-12 h-6 rounded-full transition-all relative flex items-center px-1",
                      formData.is_public ? "bg-black" : "bg-gray-200"
                    )}
                  >
                    <div className={cn(
                      "w-4 h-4 bg-white rounded-full transition-transform",
                      formData.is_public ? "translate-x-6" : "translate-x-0"
                    )} />
                  </button>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-secondary">Public Visibility</label>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-secondary">Event Title</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-100 px-4 md:px-6 py-3 md:py-4 text-sm outline-none focus:border-black transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-secondary">Date</label>
                    <input
                      type="date"
                      required
                      value={formData.event_date}
                      onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-100 px-4 md:px-6 py-3 md:py-4 text-sm outline-none focus:border-black transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-secondary">Venue</label>
                    <input
                      type="text"
                      value={formData.venue}
                      onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-100 px-4 md:px-6 py-3 md:py-4 text-sm outline-none focus:border-black transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-secondary">Description / Info</label>
                  <textarea
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-100 px-4 md:px-6 py-3 md:py-4 text-sm outline-none focus:border-black transition-all resize-none"
                    placeholder="Additional event details..."
                  />
                </div>

                <div className="space-y-4 pt-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-secondary">Event Image / Flyer</label>
                    <div className="flex gap-2 p-1 bg-gray-100 rounded-sm self-start">
                      <button
                        type="button"
                        onClick={() => setUploadMode('file')}
                        className={cn("px-4 py-1 text-[9px] uppercase tracking-widest transition-all", uploadMode === 'file' ? "bg-white text-black shadow-sm" : "text-gray-400")}
                      >
                        File
                      </button>
                      <button
                        type="button"
                        onClick={() => setUploadMode('url')}
                        className={cn("px-4 py-1 text-[9px] uppercase tracking-widest transition-all", uploadMode === 'url' ? "bg-white text-black shadow-sm" : "text-gray-400")}
                      >
                        URL
                      </button>
                    </div>
                  </div>

                  {uploadMode === 'file' ? (
                    <div className="relative border-2 border-dashed border-gray-100 p-6 md:p-8 text-center hover:border-black transition-all group">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                      <div className="space-y-2">
                        {uploadingFile ? (
                          <Loader2 className="animate-spin mx-auto text-black" size={24} />
                        ) : (
                          <Upload className="mx-auto text-gray-300 group-hover:text-black transition-colors" size={20} />
                        )}
                        <p className="text-[9px] md:text-[10px] uppercase tracking-widest text-secondary font-bold">
                          {formData.image_url ? 'File Selected ✓' : 'Click to upload or drag & drop'}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <input
                      type="text"
                      value={formData.image_url}
                      onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-100 px-4 md:px-6 py-3 md:py-4 text-sm outline-none focus:border-black transition-all"
                      placeholder="https://..."
                    />
                  )}
                </div>

                <div className="space-y-4 pt-6 border-t border-gray-50">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-secondary">External Links</label>
                    <button
                      type="button"
                      onClick={addExternalLink}
                      className="text-[10px] font-bold uppercase tracking-widest text-black hover:opacity-100 opacity-40 transition-opacity flex items-center gap-2"
                    >
                      <Plus size={12} /> Add Link
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    {formData.external_links.map((link, index) => (
                      <div key={index} className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-start animate-fade-in group pb-4 sm:pb-0 border-b sm:border-0 border-gray-50">
                        <select
                          value={link.type}
                          onChange={(e) => updateExternalLink(index, 'type', e.target.value)}
                          className="bg-gray-50 border border-gray-100 px-3 md:px-4 py-2 md:py-3 outline-none focus:border-black transition-all text-[10px] md:text-sm"
                        >
                          {LINK_TYPES.map(type => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </select>
                        <div className="flex gap-2 flex-grow">
                          <input
                            type="text"
                            value={link.url}
                            onChange={(e) => updateExternalLink(index, 'url', e.target.value)}
                            placeholder="https://..."
                            className="flex-grow bg-gray-50 border border-gray-100 px-3 md:px-4 py-2 md:py-3 outline-none focus:border-black transition-all text-[10px] md:text-sm"
                          />
                          <button
                            type="button"
                            onClick={() => removeExternalLink(index)}
                            className="p-2 md:p-3 text-secondary hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                    {formData.external_links.length === 0 && (
                      <p className="text-[10px] text-gray-300 italic">No external links added.</p>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSaving || uploadingFile}
                  className="w-full bg-black text-white py-4 md:py-6 text-[10px] font-bold uppercase tracking-[0.4em] hover:bg-gray-800 transition-all flex items-center justify-center gap-4 mt-8"
                >
                  {isSaving ? <Loader2 className="animate-spin" size={16} /> : 'Publish Event'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
