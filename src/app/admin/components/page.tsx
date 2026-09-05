'use client';

import React from 'react';
import { Component, Layers, Image as ImageIcon } from 'lucide-react';
import { componentRegistry } from '@/core/registry/component-registry';

export default function AdminComponentsPage() {
  const components = componentRegistry.getAll();

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto w-full">
      <div className="border-b border-slate-800 pb-6">
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white">Canonical Component Registry</h1>
        <p className="text-xs sm:text-sm text-slate-400 font-sans mt-1">
          Spesifikasi 18 blok UI kanonikal mandiri, varian visual, deklarasi asset slot, dan aturan responsif.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {components.map((c) => (
          <div
            key={c.type}
            className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {c.category}
                </span>
                <span className="text-[11px] font-mono text-slate-500">type: {c.type}</span>
              </div>

              <div className="space-y-1">
                <h3 className="text-lg font-serif font-bold text-white">{c.displayName}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{c.description}</p>
              </div>

              <div className="space-y-1 pt-2 border-t border-slate-800/60">
                <span className="text-[10px] font-mono uppercase text-slate-500 block">Varian Tersedia:</span>
                <div className="flex flex-wrap gap-1">
                  {c.supportedVariants.map((v) => (
                    <span key={v.id} className="px-2 py-0.5 rounded bg-slate-800 text-[10px] font-mono text-slate-300">
                      {v.name}
                    </span>
                  ))}
                </div>
              </div>

              {c.assetSlots.length > 0 && (
                <div className="space-y-1 pt-2">
                  <span className="text-[10px] font-mono uppercase text-emerald-400 flex items-center gap-1">
                    <ImageIcon className="w-3 h-3" /> Asset Slots ({c.assetSlots.length}):
                  </span>
                  <div className="space-y-1">
                    {c.assetSlots.map((slot, idx) => (
                      <div key={idx} className="p-2 rounded-lg bg-slate-950 text-[10px] font-mono text-slate-400 flex items-center justify-between">
                        <span>{slot.slotName} ({slot.aspectRatio})</span>
                        <span>{slot.recommendedMinWidth}x{slot.recommendedMinHeight}px</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}