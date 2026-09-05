'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Mail, Plus, Edit3, Calendar, Search } from 'lucide-react';

export default function AdminInvitationsPage() {
  const [invitations, setInvitations] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/invitations')
      .then((res) => res.json())
      .then((data) => {
        setInvitations(data.items || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = invitations.filter((inv) =>
    inv.title?.toLowerCase().includes(search.toLowerCase()) ||
    inv.slug?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white">Invitation Studio</h1>
          <p className="text-xs sm:text-sm text-slate-400 font-sans mt-1">
            Kelola pembuatan undangan klien dari template dan lakukan kustomisasi visual.
          </p>
        </div>
        <Link
          href="/admin/invitations/create"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-lg shadow-emerald-500/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Buat Undangan Klien</span>
        </Link>
      </div>

      <div className="relative max-w-md">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          type="text"
          placeholder="Cari nama klien atau slug..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-sans"
        />
      </div>

      {loading ? (
        <div className="py-20 text-center text-xs text-slate-500 font-mono">Memuat data undangan...</div>
      ) : filtered.length === 0 ? (
        <div className="p-12 rounded-3xl border-2 border-dashed border-slate-800 text-center space-y-4 bg-slate-900/30">
          <Mail className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-lg font-serif font-bold text-slate-300">Belum ada undangan klien dibuat</h3>
          <p className="text-xs text-slate-500 font-sans max-w-sm mx-auto">
            Gunakan template yang sudah dirancang untuk membuat website undangan klien baru.
          </p>
          <Link
            href="/admin/invitations/create"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold bg-emerald-500 text-slate-950 hover:bg-emerald-400"
          >
            <Plus className="w-4 h-4" />
            <span>Buat Sekarang</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((inv) => (
            <div
              key={inv.id}
              className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-6 group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span
                    className={`px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider ${
                      inv.status === 'PUBLISHED'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}
                  >
                    {inv.status}
                  </span>
                  <span className="text-[11px] text-slate-500 font-sans flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {inv.eventDate}
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="text-lg font-serif font-bold text-white group-hover:text-emerald-300 transition-colors">
                    {inv.title}
                  </h3>
                  <p className="text-xs font-mono text-emerald-400">/{inv.slug}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-4 border-t border-slate-800/60">
                <Link
                  href={`/editor/${inv.id}`}
                  className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-emerald-500 text-slate-950 hover:bg-emerald-400 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Buka Editor Studio</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}