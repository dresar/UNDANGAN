'use client';

import React, { useState, useEffect } from 'react';
import { CalendarPlus } from 'lucide-react';
import { ComponentRenderProps } from '../../domain/component/component.types';
import { CountdownPropsSchema } from '../../schemas/component-props.schema';
import { componentRegistry } from '../../registry/component-registry';

export interface CountdownProps {
  targetDate: string;
  heading?: string;
  subheading?: string;
  calendarButtonText?: string;
}

export function CountdownComponent({ props }: ComponentRenderProps<CountdownProps>) {
  const parsed = CountdownPropsSchema.parse(props || {});
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const target = new Date(parsed.targetDate).getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = Math.max(0, target - now);

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [parsed.targetDate]);

  return (
    <section className="py-16 px-6 bg-primary/5 text-center">
      <div className="max-w-xl mx-auto space-y-8">
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-serif text-foreground">{parsed.heading}</h2>
          {parsed.subheading && <p className="text-xs sm:text-sm text-muted-foreground font-sans">{parsed.subheading}</p>}
        </div>

        <div className="grid grid-cols-4 gap-3 sm:gap-4">
          {[
            { label: 'Hari', value: timeLeft.days },
            { label: 'Jam', value: timeLeft.hours },
            { label: 'Menit', value: timeLeft.minutes },
            { label: 'Detik', value: timeLeft.seconds },
          ].map((item, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-surface border border-primary/20 shadow-sm flex flex-col items-center justify-center">
              <span className="text-2xl sm:text-4xl font-serif font-bold text-primary">
                {String(item.value).padStart(2, '0')}
              </span>
              <span className="text-[10px] sm:text-xs uppercase tracking-widest text-muted-foreground font-sans mt-1">
                {item.label}
              </span>
            </div>
          ))}
        </div>

        <button
          onClick={() => {
            const googleCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=Pernikahan+Eka+%26+Rani&dates=20261024T020000Z/20261024T080000Z`;
            window.open(googleCalUrl, '_blank');
          }}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-medium bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground border border-primary/30 transition-all duration-300"
        >
          <CalendarPlus className="w-4 h-4" />
          <span>{parsed.calendarButtonText}</span>
        </button>
      </div>
    </section>
  );
}

componentRegistry.register<CountdownProps>({
  type: 'countdown',
  displayName: 'Countdown Timer',
  category: 'engagement',
  description: 'Penghitung mundur hari bahagia pernikahan.',
  supportedVariants: [
    { id: 'boxes', name: 'Modern Rounded Boxes' },
    { id: 'circles', name: 'Circular Rings' },
  ],
  defaultVariant: 'boxes',
  assetSlots: [],
  defaultProps: {
    targetDate: '2026-10-24T09:00:00',
    heading: 'Menghitung Hari Bahagia',
    subheading: 'Waktu yang tersisa menuju akad dan resepsi pernikahan kami',
    calendarButtonText: 'Simpan ke Google Calendar',
  },
  responsiveBehavior: { mobileStack: false },
});
