'use client';

import React from 'react';
import { Clock } from 'lucide-react';
import { ComponentRenderProps } from '../../domain/component/component.types';
import { TimelinePropsSchema } from '../../schemas/component-props.schema';
import { componentRegistry } from '../../registry/component-registry';

export interface TimelineProps {
  heading?: string;
  items: Array<{
    time: string;
    activity: string;
    description?: string;
  }>;
}

export function TimelineComponent({ props }: ComponentRenderProps<TimelineProps>) {
  const parsed = TimelinePropsSchema.parse(props || {});

  return (
    <section className="py-20 px-6 max-w-2xl mx-auto space-y-10 text-center">
      <div className="space-y-2">
        <span className="text-xs uppercase tracking-widest text-primary font-semibold font-sans">
          Rundown
        </span>
        <h2 className="text-3xl sm:text-4xl font-serif text-foreground">{parsed.heading}</h2>
      </div>

      <div className="space-y-4 text-left">
        {parsed.items.map((item, idx) => (
          <div key={idx} className="flex items-start gap-4 p-4 rounded-xl bg-surface border border-primary/10 shadow-sm">
            <div className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary font-mono font-bold text-xs shrink-0 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>{item.time}</span>
            </div>
            <div className="space-y-0.5">
              <h4 className="text-sm font-serif font-semibold text-foreground">{item.activity}</h4>
              {item.description && <p className="text-xs text-muted-foreground font-sans">{item.description}</p>}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

componentRegistry.register<TimelineProps>({
  type: 'timeline',
  displayName: 'Susunan Acara (Rundown Timeline)',
  category: 'event',
  description: 'Jadwal susunan kegiatan resepsi pernikahan.',
  supportedVariants: [
    { id: 'minimal_list', name: 'Minimal Time Cards' },
  ],
  defaultVariant: 'minimal_list',
  assetSlots: [],
  defaultProps: {
    heading: 'Susunan Acara',
    items: [
      { time: '11:00', activity: 'Pembukaan & Penyambutan Tamu' },
      { time: '11:30', activity: 'Prosesi Masuk Pengantin & Keluarga' },
      { time: '12:00', activity: 'Ramah Tamah & Jamuan Santap Siang' },
      { time: '13:00', activity: 'Sesi Foto Bersama & Penutupan' },
    ],
  },
  responsiveBehavior: { mobileStack: true },
});
