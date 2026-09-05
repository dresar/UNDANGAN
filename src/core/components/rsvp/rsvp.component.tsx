'use client';

import React, { useState } from 'react';
import { Send, CheckCircle2 } from 'lucide-react';
import { ComponentRenderProps } from '../../domain/component/component.types';
import { RsvpPropsSchema } from '../../schemas/component-props.schema';
import { componentRegistry } from '../../registry/component-registry';

export interface RsvpProps {
  heading?: string;
  subheading?: string;
  allowGuestCount?: boolean;
  maxGuestCount?: number;
}

export function RsvpComponent({ props }: ComponentRenderProps<RsvpProps>) {
  const parsed = RsvpPropsSchema.parse(props || {});
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    attendance: 'hadir',
    guestCount: 1,
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    setSubmitted(true);
  };

  return (
    <section className="py-20 px-6 max-w-xl mx-auto space-y-8 text-center">
      <div className="space-y-3">
        <span className="text-xs uppercase tracking-widest text-primary font-semibold font-sans">
          RSVP
        </span>
        <h2 className="text-3xl sm:text-4xl font-serif text-foreground">{parsed.heading}</h2>
        {parsed.subheading && <p className="text-xs sm:text-sm text-muted-foreground font-sans">{parsed.subheading}</p>}
      </div>

      <div className="p-8 rounded-2xl bg-surface border border-primary/20 shadow-lg text-left">
        {submitted ? (
          <div className="py-10 text-center space-y-4 animate-in fade-in">
            <CheckCircle2 className="w-12 h-12 text-primary mx-auto" />
            <h3 className="text-xl font-serif font-medium text-foreground">Terima Kasih!</h3>
            <p className="text-xs text-muted-foreground font-sans max-w-sm mx-auto">
              Konfirmasi kehadiran Anda telah berhasil kami catat. Kami sangat menantikan kehadiran Anda!
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5 font-sans">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Nama Lengkap</label>
              <input
                type="text"
                required
                placeholder="Contoh: Budi Santoso"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border border-primary/30 bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Konfirmasi Kehadiran</label>
              <select
                value={formData.attendance}
                onChange={(e) => setFormData({ ...formData, attendance: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border border-primary/30 bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="hadir">Hadir</option>
                <option value="tidak_hadir">Tidak Dapat Hadir</option>
                <option value="ragu">Masih Ragu / Belum Pasti</option>
              </select>
            </div>

            {parsed.allowGuestCount && formData.attendance === 'hadir' && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Jumlah Tamu</label>
                <select
                  value={formData.guestCount}
                  onChange={(e) => setFormData({ ...formData, guestCount: Number(e.target.value) })}
                  className="w-full px-4 py-2.5 rounded-lg border border-primary/30 bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {Array.from({ length: parsed.maxGuestCount || 2 }).map((_, i) => (
                    <option key={i + 1} value={i + 1}>{i + 1} Orang</option>
                  ))}
                </select>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Pesan / Ucapan Singkat</label>
              <textarea
                rows={3}
                placeholder="Tuliskan ucapan atau doa restu..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border border-primary/30 bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-lg font-semibold text-xs bg-primary text-primary-foreground hover:opacity-90 shadow-md transition-opacity flex items-center justify-center gap-2"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Kirim Konfirmasi</span>
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

componentRegistry.register<RsvpProps>({
  type: 'rsvp',
  displayName: 'Formulir RSVP Kehadiran',
  category: 'engagement',
  description: 'Formulir konfirmasi kehadiran tamu undangan.',
  supportedVariants: [
    { id: 'form_card', name: 'Modern Form Card' },
    { id: 'clean_input', name: 'Clean Editorial Inputs' },
  ],
  defaultVariant: 'form_card',
  assetSlots: [],
  defaultProps: {
    heading: 'Konfirmasi Kehadiran (RSVP)',
    subheading: 'Mohon konfirmasikan kehadiran Anda sebelum tanggal 10 Oktober 2026 demi kenyamanan dan kelancaran acara.',
    allowGuestCount: true,
    maxGuestCount: 2,
  },
  responsiveBehavior: { mobileStack: true },
});
