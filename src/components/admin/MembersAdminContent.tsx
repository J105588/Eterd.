'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Plus, Edit2, Trash2, X, Upload, Loader2, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Member {
  id: string;
  name: string;
  slug: string | null;
  profile_text: string | null;
  image_url: string | null;
  display_order: number;
  external_links: { type: string; url: string }[] | null;
  is_public: boolean;
}

const LINK_TYPES = [
  'X',
  'Instagram',
  'YouTube',
  'niconico',
  'Official Site',
  'Blog',
  'Others'
];

export default function MembersAdminContent() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  
  const [uploadMode, setUploadMode] = useState<'url' | 'file'>('url');
  const [uploadingFile, setUploadingFile] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    profile_text: '',
    image_url: '',
    display_order: 0,
    external_links: [] as { type: string; url: string }[],
    is_public: true,
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    const { data, error } = await supabase
      .from('members')
      .select('*')
      .order('display_order', { ascending: true });

    if (data) setMembers(data);
    setLoading(false);
  };

  const handleOpenModal = (member: Member | null = null) => {
    if (member) {
      setEditingMember(member);
      setFormData({
        name: member.name,
        slug: member.slug || '',
        profile_text: member.profile_text || '',
        image_url: member.image_url || '',
        display_order: member.display_order,
        external_links: Array.isArray(member.external_links) ? member.external_links : [],
        is_public: member.is_public ?? true,
      });
      setUploadMode('url');
    } else {
      setEditingMember(null);
      setFormData({
        name: '',
        slug: '',
        profile_text: '',
        image_url: '',
        display_order: members.length,
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
      const filePath = `profiles/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('members')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('members')
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
      external_links: [...formData.external_links, { type: 'X', url: '' }]
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

    if (editingMember) {
      const { error } = await supabase
        .from('members')
        .update(formData)
        .eq('id', editingMember.id);
      if (error) alert(error.message);
    } else {
      const { error } = await supabase
        .from('members')
        .insert([formData]);
      if (error) alert(error.message);
    }

    setIsSaving(false);
    setIsModalOpen(false);
    fetchMembers();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this member?')) {
      const { error } = await supabase.from('members').delete().eq('id', id);
      if (error) alert(error.message);
      else fetchMembers();
    }
  };

  return (
    <div className="space-y-12">
      <header className="flex justify-between items-end">
        <div className="space-y-2">
          <p className="text-xs font-bold uppercase tracking-widest text-secondary">Talent Management</p>
          <h1 className="text-4xl font-light">Artists & Members</h1>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="bg-black text-white px-8 py-4 text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-all flex items-center gap-4"
        >
          <Plus size={16} /> Add New Member
        </button>
      </header>

      {loading ? (
        <div className="flex justify-center py-24">
          <Loader2 className="animate-spin text-gray-200" size={32} />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {members.map((member) => (
            <div key={member.id} className="bg-white border border-gray-100 p-6 flex items-center justify-between group hover:border-black transition-all">
              <div className="flex items-center gap-8">
                <div className="w-16 h-16 bg-gray-50 border border-gray-100 rounded-full overflow-hidden flex items-center justify-center">
                  {member.image_url ? (
                    <img src={member.image_url} alt={member.name} className="w-full h-full object-cover" />
                  ) : (
                    <User size={24} className="text-gray-200" strokeWidth={1} />
                  )}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-4">
                    <h3 className="text-lg font-semibold">{member.name}</h3>
                    {!member.is_public && (
                      <span className="text-[8px] uppercase tracking-widest bg-gray-100 px-2 py-0.5 text-gray-400 font-bold">Draft</span>
                    )}
                  </div>
                  <p className="text-xs text-secondary uppercase tracking-widest">Order: {member.display_order} • URL: /{member.slug}</p>
                </div>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => handleOpenModal(member)}
                  className="p-3 text-secondary hover:text-black hover:bg-gray-50 transition-all"
                >
                  <Edit2 size={18} />
                </button>
                <button
                  onClick={() => handleDelete(member.id)}
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl my-auto">
            <div className="p-8 md:p-12">
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-8 right-8 text-secondary hover:text-black z-10"
              >
                <X size={24} />
              </button>

              <h2 className="luxury-text text-2xl font-bold mb-10">
                {editingMember ? 'Edit Member' : 'Add New Member'}
              </h2>

              <form onSubmit={handleSave} className="space-y-8">
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-secondary">Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => {
                      const newName = e.target.value;
                      const newSlug = formData.slug || newName.toLowerCase().replace(/[^a-z0-9]/g, '-');
                      setFormData({ ...formData, name: newName, slug: newSlug });
                    }}
                    className="w-full bg-gray-50 border border-gray-100 px-6 py-4 outline-none focus:border-black transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-secondary">URL Slug</label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '-') })}
                    className="w-full bg-gray-50 border border-gray-100 px-6 py-4 outline-none focus:border-black transition-all"
                    placeholder="e.g. hanako"
                  />
                  <p className="text-[9px] text-gray-400 mt-1 uppercase tracking-tighter">/members/{formData.slug || '...'}</p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-secondary">Display Order</label>
                <input
                  type="number"
                  value={formData.display_order}
                  onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })}
                  className="w-full bg-gray-50 border border-gray-100 px-6 py-4 outline-none focus:border-black transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-secondary">Profile Bio</label>
                <textarea
                  rows={3}
                  value={formData.profile_text}
                  onChange={(e) => setFormData({ ...formData, profile_text: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-100 px-6 py-4 outline-none focus:border-black transition-all resize-none"
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-secondary">Profile Image</label>
                  <div className="flex gap-2 p-1 bg-gray-100 rounded-sm">
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
                  <div className="relative border-2 border-dashed border-gray-100 p-8 text-center hover:border-black transition-all group">
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
                        <Upload className="mx-auto text-gray-300 group-hover:text-black transition-colors" size={24} />
                      )}
                      <p className="text-[10px] uppercase tracking-widest text-secondary font-bold">
                        {formData.image_url ? 'File Selected ✓' : 'Click to upload or drag & drop'}
                      </p>
                    </div>
                  </div>
                ) : (
                  <input
                    type="text"
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-100 px-6 py-4 outline-none focus:border-black transition-all"
                    placeholder="https://..."
                  />
                )}
              </div>

              <div className="space-y-4 pt-6 border-t border-gray-50">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-secondary">External Links (X, YouTube, Blog, etc.)</label>
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
                    <div key={index} className="flex gap-4 items-start animate-fade-in group">
                      <select
                        value={link.type}
                        onChange={(e) => updateExternalLink(index, 'type', e.target.value)}
                        className="bg-gray-50 border border-gray-100 px-4 py-3 outline-none focus:border-black transition-all text-xs"
                      >
                        {LINK_TYPES.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                      <input
                        type="text"
                        value={link.url}
                        onChange={(e) => updateExternalLink(index, 'url', e.target.value)}
                        placeholder="https://..."
                        className="flex-grow bg-gray-50 border border-gray-100 px-4 py-3 outline-none focus:border-black transition-all text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => removeExternalLink(index)}
                        className="p-3 text-secondary hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
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
                className="w-full bg-black text-white py-6 text-[10px] font-bold uppercase tracking-[0.4em] hover:bg-gray-800 transition-all flex items-center justify-center gap-4 mt-4"
              >
                {isSaving ? <Loader2 className="animate-spin" size={16} /> : 'Save Changes'}
              </button>
            </form>
          </div>
        </div>
      </div>
    )}
  </div>
);
}
