'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Sparkles, ArrowRight, ArrowLeft, Wand2, Layers } from 'lucide-react';
import { templateRegistry } from '@/core/registry/template-registry';
import { themeRegistry } from '@/core/registry/theme-registry';

export default function AdminCreateInvitationPage() {
  const router = useRouter();
  const templates = templateRegistry.getAll();
  const themes = themeRegistry.getAll();

  const [mode, setMode] = useState<'template' | 'ai'>('template');
  const [groomName, setGroomName] = useState('');
  const [brideName, setBrideName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [city, setCity] = useState('Jakarta Pusat');
  const [selectedTemplate, setSelectedTemplate] = useState('cinematic-elegance');
  const [selectedTheme, setSelectedTheme] = useState('royal-emerald');
  const [naturalPrompt, setNaturalPrompt] = useState(
    'Undangan mewah modern dengan pembuka gate amplop, nuansa botanical sage, kisah cinta, hitung mundur, dan galeri elegan.'
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!groomName.trim() || !brideName.trim() || !eventDate.trim()) {
      setError('Mohon lengkapi nama kedua mempelai dan tanggal acara.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (mode === 'ai') {
        const aiRes = await fetch('/api/ai/plan', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            groomName,
            brideName,
            eventDate,
            naturalLanguagePrompt: naturalPrompt,
            preferredTheme: selectedTheme,
            city,
          }),
        });
        const aiData = await aiRes.json();
        if (!aiRes.ok) throw new Error(aiData.error || 'Gagal merancang dengan AI.');

        const saveRes = await fetch('/api/invitations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            groomName,
            brideName,
            eventDate,
            templateId: aiData.plan.recommendedTemplateId,
            themeId: aiData.plan.recommendedThemeId,
            city,
            customTagline: aiData.plan.editorialTagline,
          }),
        });
        const saveData = await saveRes.json();
        if (!saveRes.ok) throw new Error(saveData.error || 'Gagal menyimpan undangan.');

        router.push(`/editor/${saveData.invitationId}`);
      } else {
        const res = await fetch('/api/invitations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            groomName,
            brideName,
            eventDate,
            templateId: selectedTemplate,
            themeId: selectedTheme,
            city,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Gagal membuat undangan.');

        router.push(`/editor/${data.invitationId}`);
      }
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto w-full space-y-8">
      <div className="flex items-center justify-between border-b border-slate-800 pb-6">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/invitations"
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-serif font-bold text-white">Buat Undangan Klien Baru</h1>
            <p className="text-xs text-slate-400 font-sans">Pilih template struktur dan tema visual untuk klien.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() => setMode('template')}
          className={`p-4 rounded-2xl border flex flex-col items-center gap-2 transition-all ${
            mode === 'template'
              ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400 shadow-md'
              : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700'
          }`}
        >
          <Layers className="w-5 h-5" />
          <span className="text-xs font-bold font-sans">Gunakan Template Siap Pakai</span>
        </button>
        <button
          type="button"
          onClick={() => setMode('ai')}
          className={`p-4 rounded-2xl border flex flex-col items-center gap-2 transition-all ${
            mode === 'ai'
              ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400 shadow-md'
              : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700'
          }`}
        >
          <Wand2 className="w-5 h-5" />
          <span className="text-xs font-bold font-sans">AI Wedding Assistant</span>
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-950/40 border border-red-900/60 text-xs text-red-400 font-sans">
          {error}
        </div>
      )}

      <form onSubmit={handleCreate} className="p-8 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-6 font-sans text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300">Nama Mempelai Pria</label>
            <input
              type="text"
              required
              placeholder="Contoh: Eka Pratama, S.T."
              value={groomName}
              onChange={(e) => setGroomName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300">Nama Mempelai Wanita</label>
            <input
              type="text"
              required
              placeholder="Contoh: Rani Safitri, S.Ds."
              value={brideName}
              onChange={(e) => setBrideName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300">Tanggal Acara</label>
            <input
              type="text"
              required
              placeholder="Contoh: Sabtu, 24 Oktober 2026"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300">Kota Lokasi</label>
            <input
              type="text"
              placeholder="Contoh: Jakarta Pusat"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300">Pilih Template Struktur</label>
            <select
              value={selectedTemplate}
              onChange={(e) => setSelectedTemplate(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {templates.map((t) => (
                <option key={t.id} value={t.id}>{t.name} ({t.category})</option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300">Pilih Palet Tema</label>
            <select
              value={selectedTheme}
              onChange={(e) => setSelectedTheme(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {themes.map((th) => (
                <option key={th.id} value={th.id}>{th.name}</option>
              ))}
            </select>
          </div>
        </div>

        {mode === 'ai' && (
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Instruksi Tambahan untuk AI Creative Director</span>
            </label>
            <textarea
              rows={3}
              value={naturalPrompt}
              onChange={(e) => setNaturalPrompt(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
            />
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 rounded-xl font-bold text-xs bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? (
            <span>Membuat Undangan Klien...</span>
          ) : (
            <>
              <span>Generate Undangan & Masuk ke Editor Studio</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}