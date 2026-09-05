'use client';

import React from 'react';
import Link from 'next/link';
import {
  Layers,
  Mail,
  Palette,
  Component,
  Plus,
  ArrowUpRight,
  Sparkles,
  Wand2,
  CheckCircle2,
  Sliders,
} from 'lucide-react';
import { templateRegistry } from '@/core/registry/template-registry';
import { themeRegistry } from '@/core/registry/theme-registry';
import { componentRegistry } from '@/core/registry/component-registry';

export default function AdminDashboardPage() {
  const templates = templateRegistry.getAll();
  const themes = themeRegistry.getAll();
  const components = componentRegistry.getAll();

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto w-full">
      {/* Top Header Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-emerald-950/40 to-slate-900 border border-slate-800 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Admin-Driven Wedding Invitation Engine</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">
            Wedding Template & Invitation Control Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-sans max-w-2xl leading-relaxed">
            Pusat kendali arsitektur pembuatan template pernikahan modular, pengelolaan varian komponen kanonikal, pembuatan undangan klien, dan orkestrasi AI planner.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 relative z-10">
          <Link
            href="/admin/templates/create"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-lg shadow-emerald-500/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Buat Template Baru</span>
          </Link>
          <Link
            href="/admin/invitations/create"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 text-slate-100 hover:bg-slate-700 border border-slate-700 transition-colors"
          >
            <Mail className="w-4 h-4 text-emerald-400" />
            <span>Buat Undangan Klien</span>
          </Link>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800/80 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Total Templates</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="space-y-0.5">
            <span className="text-3xl font-bold font-mono text-white">{templates.length}</span>
            <p className="text-[11px] text-slate-500 font-sans">Siap pakai & terkomposisi</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800/80 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Canonical Components</span>
            <div className="p-2 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/20">
              <Component className="w-4 h-4" />
            </div>
          </div>
          <div className="space-y-0.5">
            <span className="text-3xl font-bold font-mono text-white">{components.length}</span>
            <p className="text-[11px] text-slate-500 font-sans">Terdaftar di Registry</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800/80 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Palet Tema Visual</span>
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Palette className="w-4 h-4" />
            </div>
          </div>
          <div className="space-y-0.5">
            <span className="text-3xl font-bold font-mono text-white">{themes.length}</span>
            <p className="text-[11px] text-slate-500 font-sans">Emerald, Slate, Mist, Velvet, dsb.</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800/80 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">AI Wedding Engine</span>
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Wand2 className="w-4 h-4" />
            </div>
          </div>
          <div className="space-y-0.5">
            <span className="text-3xl font-bold font-mono text-emerald-400">Online</span>
            <p className="text-[11px] text-slate-500 font-sans">Gemini 1.5 Flash Structured</p>
          </div>
        </div>
      </div>

      {/* Quick Launch & Templates Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Template Showcase */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-serif font-bold text-white">Template Aktif</h2>
              <p className="text-xs text-slate-400">Template struktur halaman yang siap di-assign ke undangan klien.</p>
            </div>
            <Link
              href="/admin/templates"
              className="text-xs text-emerald-400 hover:text-emerald-300 font-medium inline-flex items-center gap-1"
            >
              <span>Lihat Semua</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {templates.map((tpl) => (
              <div
                key={tpl.id}
                className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-emerald-500/40 transition-all space-y-4 flex flex-col justify-between group"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {tpl.category}
                    </span>
                    <span className="text-[11px] text-slate-500 font-mono">
                      {tpl.defaultSections.length} Sections
                    </span>
                  </div>
                  <h3 className="text-base font-serif font-bold text-white group-hover:text-emerald-300 transition-colors">
                    {tpl.name}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {tpl.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-800/60">
                  <span className="text-[11px] text-slate-500">ID: {tpl.id}</span>
                  <Link
                    href={`/admin/templates/${tpl.id}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 hover:text-emerald-300"
                  >
                    <span>Edit Template</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions Panel */}
        <div className="space-y-4">
          <h2 className="text-lg font-serif font-bold text-white">Aksi Cepat Admin</h2>
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-3">
            <Link
              href="/admin/templates/create"
              className="w-full p-3 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 flex items-center gap-3 transition-colors text-left"
            >
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-200">Rancang Template Baru</p>
                <p className="text-[10px] text-slate-400">Susun struktur section & variant kanonikal</p>
              </div>
            </Link>

            <Link
              href="/admin/invitations/create"
              className="w-full p-3 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 flex items-center gap-3 transition-colors text-left"
            >
              <div className="p-2 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/20">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-200">Buat Undangan Klien</p>
                <p className="text-[10px] text-slate-400">Pilih template & masukkan data pengantin</p>
              </div>
            </Link>

            <Link
              href="/admin/themes"
              className="w-full p-3 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 flex items-center gap-3 transition-colors text-left"
            >
              <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <Palette className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-200">Kelola Palet & Token Tema</p>
                <p className="text-[10px] text-slate-400">6 preset tema mewah & custom style</p>
              </div>
            </Link>

            <Link
              href="/admin/ai-studio"
              className="w-full p-3 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 flex items-center gap-3 transition-colors text-left"
            >
              <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <Wand2 className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-200">AI Wedding Planner Testbed</p>
                <p className="text-[10px] text-slate-400">Generate design plan dari natural prompt</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}