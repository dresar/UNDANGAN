'use client';

import React from 'react';
import { Quote as QuoteIcon } from 'lucide-react';
import { ComponentRenderProps } from '../../domain/component/component.types';
import { QuotePropsSchema } from '../../schemas/component-props.schema';
import { componentRegistry } from '../../registry/component-registry';

export interface QuoteProps {
  quoteText: string;
  source?: string;
  arabicText?: string;
}

export function QuoteComponent({ props }: ComponentRenderProps<QuoteProps>) {
  const parsed = QuotePropsSchema.parse(props || {});

  return (
    <section className="py-16 px-6 bg-secondary/30 text-center">
      <div className="max-w-2xl mx-auto space-y-6">
        <QuoteIcon className="w-8 h-8 mx-auto text-primary opacity-60" />
        {parsed.arabicText && (
          <p className="text-xl sm:text-2xl font-serif text-foreground/90 leading-loose" dir="rtl">
            {parsed.arabicText}
          </p>
        )}
        <blockquote className="text-base sm:text-lg font-serif italic text-foreground/80 leading-relaxed">
          "{parsed.quoteText}"
        </blockquote>
        {parsed.source && (
          <p className="text-xs uppercase tracking-widest text-primary font-sans font-semibold">
            � {parsed.source}
          </p>
        )}
      </div>
    </section>
  );
}

componentRegistry.register<QuoteProps>({
  type: 'quote',
  displayName: 'Wedding Quote',
  category: 'header',
  description: 'Kutipan ayat suci atau kata mutiara pernikahan.',
  supportedVariants: [
    { id: 'centered', name: 'Centered Card' },
    { id: 'bordered', name: 'Bordered Elegant' },
  ],
  defaultVariant: 'centered',
  assetSlots: [],
  defaultProps: {
    arabicText: '?????? ???????? ???? ?????? ????? ????? ??????????? ?????????? ????????????? ????????? ???????? ????????? ?????????? ??????????',
    quoteText: 'Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu isteri-isteri dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya, dan dijadikan-Nya diantaramu rasa kasih dan sayang.',
    source: 'QS. Ar-Rum: 21',
  },
  responsiveBehavior: { mobileStack: true },
});
