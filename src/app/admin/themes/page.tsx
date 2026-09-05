'use client';

import React, { useState } from 'react';
import { Palette, Sparkles, Sliders, Check } from 'lucide-react';
import { themeRegistry } from '@/core/registry/theme-registry';

export default function AdminThemesPage() {
  const themes = themeRegistry.getAll();
  const [selectedTheme, setSelectedTheme] = useState(themes[0]);

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto w-full">
      <div className="border-b border-slate-800 pb-6">
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white">Theme & Style Studio</h1>
        <p className="text-xs sm:text-sm text-slate-400 font-sans mt-1">
          Koleksi visual token, tipografi, dan preset gaya tema untuk merender undangan secara dinamis dan kaya warna.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Themes Selector List */}
        <div className="space-y-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 font-mono block">
            Pilih Tema Visual ({themes.length})
          </span>
          <div className="space-y-3">
            {themes.map((th) => (
              <div
                key={th.id}
                onClick={() => setSelectedTheme(th)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between group ${
                  selectedTheme.id === th.id
                    ? 'border-emerald-500/60 bg-emerald-500/10 shadow-lg shadow-emerald-500/10'
                    : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className={`text-sm font-serif font-bold ${selectedTheme.id === th.id ? 'text-emerald-300' : 'text-slate-200'}`}>
                      {th.name}
                    </p>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-1">{th.description}</p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0 ml-3">
                  <span className="w-5 h-5 rounded-full border border-slate-700 shadow-sm" style={{ backgroundColor: th.colors.primary }} />
                  <span className="w-5 h-5 rounded-full border border-slate-700 shadow-sm" style={{ backgroundColor: th.colors.background }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Theme Token Inspector */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-lg font-serif font-bold text-white">{selectedTheme.name}</h2>
                <p className="text-xs text-slate-400 font-mono">Theme ID: {selectedTheme.id} • Version: {selectedTheme.version}</p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Motion: {selectedTheme.animationPersonality}
              </span>
            </div>

            {/* Color Palette Matrix */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">Palet Warna (Color Tokens)</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: 'Primary', color: selectedTheme.colors.primary, text: selectedTheme.colors.primaryForeground },
                  { label: 'Secondary', color: selectedTheme.colors.secondary, text: selectedTheme.colors.secondaryForeground },
                  { label: 'Accent', color: selectedTheme.colors.accent, text: selectedTheme.colors.accentForeground },
                  { label: 'Background', color: selectedTheme.colors.background, text: selectedTheme.colors.foreground },
                  { label: 'Surface', color: selectedTheme.colors.surface, text: selectedTheme.colors.foreground },
                  { label: 'Muted', color: selectedTheme.colors.muted, text: selectedTheme.colors.mutedForeground },
                  { label: 'Border', color: selectedTheme.colors.surfaceBorder, text: '#fff' },
                  { label: 'Foreground', color: selectedTheme.colors.foreground, text: selectedTheme.colors.background },
                ].map((item, idx) => (
                  <div key={idx} className="p-3 rounded-xl border border-slate-800 space-y-2 bg-slate-950/80">
                    <div className="w-full h-8 rounded-lg border border-slate-800 flex items-center justify-center font-mono text-[10px] font-bold" style={{ backgroundColor: item.color, color: item.text }}>
                      {item.color}
                    </div>
                    <p className="text-[11px] font-medium text-slate-300">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Typography Tokens */}
            <div className="space-y-3 pt-4 border-t border-slate-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">Tipografi (Typography Tokens)</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-sans text-xs">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-500 font-mono">Font Serif</span>
                  <p className="font-bold text-slate-200">{selectedTheme.typography.fontSerif}</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-500 font-mono">Font Sans</span>
                  <p className="font-bold text-slate-200">{selectedTheme.typography.fontSans}</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-500 font-mono">Font Script</span>
                  <p className="font-bold text-slate-200">{selectedTheme.typography.fontScript}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}