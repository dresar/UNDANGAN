'use client';

import { useEffect, use } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminEditorRedirectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  useEffect(() => {
    router.replace(`/editor/${id}`);
  }, [id, router]);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center space-y-3">
      <div className="w-10 h-10 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
      <p className="text-xs font-mono text-slate-400">Membuka Fullscreen Studio Canvas...</p>
    </div>
  );
}