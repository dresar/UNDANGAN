'use client';

import React, { useState } from 'react';
import { Wand2, Sparkles, Send, CheckCircle2 } from 'lucide-react';
import { AIWeddingPlanner } from '@/core/ai/ai-wedding-planner';

export default function AdminAiStudioPage() {
  const [prompt, setPrompt] = useState('Pernikahan outdoor mewah bernuansa botanical emerald, musik romantis, kisah cinta, countdown, dan galeri interaktif.');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/ai/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          groomName: 'Eka Pratama, S.T.',
          brideName: 'Rani Safitri, S.Ds.',
          eventDate: '24 Oktober 2026',
          naturalLanguagePrompt: prompt,
        }),
      });
      const data = await res.json();
      setResult(data.plan);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 space-y-8 max-w-5xl mx-auto w-full">
      <div className="border-b border-slate-800 pb-6">
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white">AI Wedding Planner Studio</h1>
        <p className="text-xs sm:text-sm text-slate-400 font-sans mt-1">
          Testbed interaktif untuk menguji generasi Design Plan & Asset Requirements terstruktur berbasis Gemini 1.5.
        </p>
      </div>

      <form onSubmit={handleGenerate} className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-4">
        <div className="space-y-1.5 font-sans text-xs">
          <label className="font-semibold text-slate-300">Input Instruksi Natural Language</label>
          <textarea
            rows={3}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none text-xs"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 rounded-xl font-bold text-xs bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-md transition-all flex items-center gap-2"
        >
          <Wand2 className="w-4 h-4" />
          <span>{loading ? 'AI Sedang Merancang...' : 'Generate Structured Design Plan'}</span>
        </button>
      </form>

      {result && (
        <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-4 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="font-bold text-emerald-400">Structured AIDesignPlan Result</span>
            <span className="text-[10px] text-slate-500">Theme: {result.recommendedThemeId}</span>
          </div>
          <pre className="p-4 rounded-xl bg-slate-950 overflow-x-auto text-[11px] text-slate-300 max-h-96">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}