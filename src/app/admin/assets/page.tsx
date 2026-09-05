'use client';

import React from 'react';
import { Image as ImageIcon, UploadCloud, CheckCircle2 } from 'lucide-react';
import { sharedAssetRegistry } from '@/core/registry/shared-asset-registry';

export default function AdminAssetsPage() {
  const assets = sharedAssetRegistry.findByCategory('divider').concat(sharedAssetRegistry.findByCategory('ornament'));

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto w-full">
      <div className="border-b border-slate-800 pb-6">
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white">Media & Shared Asset Hub</h1>
        <p className="text-xs sm:text-sm text-slate-400 font-sans mt-1">
          Koleksi shared assets (divider floral, ornamen transparan, tekstur) yang dioptimasi dan terhubung ke CDN ImageKit.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {assets.map((ast) => (
          <div key={ast.id} className="p-5 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-4">
            <div className="aspect-video rounded-2xl bg-slate-950 border border-slate-800/80 flex items-center justify-center p-4 overflow-hidden">
              <img src={ast.url} alt={ast.name} className="max-h-full object-contain" />
            </div>
            <div className="space-y-1 font-sans text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-200">{ast.name}</span>
                <span className="text-[10px] font-mono text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10">
                  {ast.category}
                </span>
              </div>
              <p className="text-[10px] font-mono text-slate-500 truncate">{ast.url}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}