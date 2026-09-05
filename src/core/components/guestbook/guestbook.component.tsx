'use client';

import React, { useState } from 'react';
import { MessageSquare, Send } from 'lucide-react';
import { ComponentRenderProps } from '../../domain/component/component.types';
import { GuestbookPropsSchema } from '../../schemas/component-props.schema';
import { componentRegistry } from '../../registry/component-registry';

export interface GuestbookProps {
  heading?: string;
  subheading?: string;
  pageSize?: number;
}

export function GuestbookComponent({ props }: ComponentRenderProps<GuestbookProps>) {
  const parsed = GuestbookPropsSchema.parse(props || {});
  const [messages, setMessages] = useState([
    { id: '1', name: 'Rendra & Sarah', text: 'Selamat menempuh hidup baru Eka & Rani! Semoga menjadi keluarga yang sakinah, mawaddah, warahmah. Aamiin.', time: '2 jam lalu' },
    { id: '2', name: 'Dimas Wicaksono', text: 'Happy wedding brother! Lancar sampai hari H ya.', time: '5 jam lalu' },
    { id: '3', name: 'Clara Anindita', text: 'Congrats Rani cantik & suami! Bahagia selalu selamanya ??', time: '1 hari lalu' },
  ]);
  const [newName, setNewName] = useState('');
  const [newText, setNewText] = useState('');

  const handleAddMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newText.trim()) return;
    setMessages([
      {
        id: String(Date.now()),
        name: newName,
        text: newText,
        time: 'Baru saja',
      },
      ...messages,
    ]);
    setNewName('');
    setNewText('');
  };

  return (
    <section className="py-20 px-6 max-w-2xl mx-auto space-y-10 text-center">
      <div className="space-y-3">
        <span className="text-xs uppercase tracking-widest text-primary font-semibold font-sans">
          Wishes & Prayers
        </span>
        <h2 className="text-3xl sm:text-4xl font-serif text-foreground">{parsed.heading}</h2>
        {parsed.subheading && <p className="text-xs sm:text-sm text-muted-foreground font-sans">{parsed.subheading}</p>}
      </div>

      {/* Form Tambah Ucapan */}
      <form onSubmit={handleAddMessage} className="p-6 rounded-2xl bg-surface border border-primary/20 shadow-md space-y-4 text-left font-sans">
        <input
          type="text"
          placeholder="Nama Anda"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border border-primary/30 bg-background text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary"
          required
        />
        <textarea
          rows={3}
          placeholder="Tuliskan ucapan selamat & doa restu..."
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border border-primary/30 bg-background text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary resize-none"
          required
        />
        <button
          type="submit"
          className="w-full py-2.5 rounded-lg text-xs font-semibold bg-primary text-primary-foreground hover:opacity-90 shadow flex items-center justify-center gap-2"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Kirim Ucapan</span>
        </button>
      </form>

      {/* Daftar Ucapan */}
      <div className="space-y-4 max-h-96 overflow-y-auto pr-1 text-left">
        {messages.map((item) => (
          <div key={item.id} className="p-4 rounded-xl bg-surface border border-primary/10 shadow-sm space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-foreground font-sans">{item.name}</span>
              <span className="text-[10px] text-muted-foreground font-sans">{item.time}</span>
            </div>
            <p className="text-xs text-foreground/80 font-sans leading-relaxed">{item.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

componentRegistry.register<GuestbookProps>({
  type: 'guestbook',
  displayName: 'Buku Tamu & Ucapan (Guestbook)',
  category: 'engagement',
  description: 'Daftar ucapan selamat dan doa restu interaktif dari para tamu.',
  supportedVariants: [
    { id: 'message_list', name: 'Scrollable Message List' },
  ],
  defaultVariant: 'message_list',
  assetSlots: [],
  defaultProps: {
    heading: 'Ucapan & Doa Restu',
    subheading: 'Ungkapan kasih dan doa restu Anda adalah kado terindah bagi kami.',
    pageSize: 5,
  },
  responsiveBehavior: { mobileStack: true },
});
