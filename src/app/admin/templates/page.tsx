'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Layers,
  Plus,
  ArrowUpRight,
  Sliders,
  CheckCircle2,
  Eye,
  Filter,
} from 'lucide-react';
import { templateRegistry } from '@/core/registry/template-registry';

export default function AdminTemplatesPage() {
  const templates = templateRegistry.getAll();
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const filtered = filterCategory === 'all'
    ? templates
    : templates.filter((t) => t.category === filterCategory);

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white">Template Builder & Registry</h1>
          <p className="text-xs sm:text-sm text-slate-400 font-sans mt-1">
            Daftar template struktur pernikahan kanonikal yang dapat dipakai untuk membuat ribuan website undangan.
          </p>
        </div>
        <Link
          href="/admin/templates/create"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-lg shadow-emerald-500/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Buat Template Baru</span>
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 text-xs">
        {['all', 'cinematic', 'editorial', 'minimal', 'romantic', 'classic'].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-4 py-2 rounded-xl font-medium capitalize transition-colors ${
              filterCategory === cat
                ? 'bg-emerald-500 text-slate-950 font-bold'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            {cat === 'all' ? 'Semua Kategori' : cat}
          </button>
        ))}
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((tpl) => (
          <div
            key={tpl.id}
            className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 hover:border-emerald-500/40 transition-all flex flex-col justify-between space-y-6 group"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {tpl.category}
                </span>
                <span className="text-[11px] text-slate-500 font-mono">
                  {tpl.defaultSections.length} Bagian
                </span>
              </div>

              <div className="space-y-1">
                <h3 className="text-xl font-serif font-bold text-white group-hover:text-emerald-300 transition-colors">
                  {tpl.name}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">{tpl.description}</p>
              </div>

              {/* Section Preview List */}
              <div className="space-y-1.5 pt-2">
                <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500 block">
                  Urutan Komposisi Section:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {tpl.defaultSections.map((sec, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md bg-slate-800/80 border border-slate-700/60 text-[10px] font-mono text-slate-300 capitalize"
                    >
                      {idx + 1}. {sec.componentType}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-4 border-t border-slate-800/60">
              <Link
                href={`/admin/templates/${tpl.id}`}
                className="flex-1 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 text-center border border-slate-700 transition-colors"
              >
                Edit Konfigurasi
              </Link>
              <Link
                href={`/admin/invitations/create?template=${tpl.id}`}
                className="py-2 px-4 rounded-xl text-xs font-bold bg-emerald-500 text-slate-950 hover:bg-emerald-400 transition-colors text-center"
                title="Gunakan untuk membuat undangan"
              >
                Gunakan
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}