'use client';

import React, { useState } from 'react';
import { Gift as GiftIcon, Copy, Check } from 'lucide-react';
import { ComponentRenderProps } from '../../domain/component/component.types';
import { GiftPropsSchema } from '../../schemas/component-props.schema';
import { componentRegistry } from '../../registry/component-registry';

export interface GiftProps {
  heading?: string;
  subheading?: string;
  bankAccounts?: Array<{
    bankName: string;
    accountNumber: string;
    accountHolder: string;
    qrCodeUrl?: string;
  }>;
  physicalAddress?: {
    recipient: string;
    address: string;
    phone?: string;
  };
}

export function GiftComponent({ props }: ComponentRenderProps<GiftProps>) {
  const parsed = GiftPropsSchema.parse(props || {});
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);

  const handleCopy = (accNum: string) => {
    navigator.clipboard.writeText(accNum);
    setCopiedAccount(accNum);
    setTimeout(() => setCopiedAccount(null), 2500);
  };

  return (
    <section className="py-20 px-6 max-w-2xl mx-auto space-y-10 text-center">
      <div className="space-y-3">
        <GiftIcon className="w-8 h-8 mx-auto text-primary" />
        <h2 className="text-3xl sm:text-4xl font-serif text-foreground">{parsed.heading}</h2>
        {parsed.subheading && <p className="text-xs sm:text-sm text-muted-foreground font-sans max-w-md mx-auto">{parsed.subheading}</p>}
      </div>

      <div className="space-y-6">
        {parsed.bankAccounts?.map((acc, idx) => (
          <div
            key={idx}
            className="p-6 rounded-2xl bg-surface border border-primary/20 shadow-md space-y-4 text-left max-w-md mx-auto"
          >
            <div className="flex items-center justify-between border-b border-primary/10 pb-3">
              <span className="text-xs font-bold uppercase tracking-widest text-primary font-sans">{acc.bankName}</span>
              <span className="text-[11px] text-muted-foreground font-sans">Transfer Bank</span>
            </div>
            <div className="space-y-1 font-sans">
              <p className="text-lg font-mono font-bold tracking-wider text-foreground">{acc.accountNumber}</p>
              <p className="text-xs text-muted-foreground">a.n. {acc.accountHolder}</p>
            </div>
            <button
              onClick={() => handleCopy(acc.accountNumber)}
              className="inline-flex items-center justify-center gap-1.5 w-full py-2 rounded-lg text-xs font-medium bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground border border-primary/20 transition-all font-sans"
            >
              {copiedAccount === acc.accountNumber ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Nomor Rekening Tersalin!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Salin Nomor Rekening</span>
                </>
              )}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

componentRegistry.register<GiftProps>({
  type: 'gift',
  displayName: 'Tanda Kasih (Wedding Gift)',
  category: 'engagement',
  description: 'Amplop digital dan rekening transfer kado pernikahan.',
  supportedVariants: [
    { id: 'bank_cards', name: 'Bank Cards with Copy' },
  ],
  defaultVariant: 'bank_cards',
  assetSlots: [],
  defaultProps: {
    heading: 'Tanda Kasih (Wedding Gift)',
    subheading: 'Doa restu Anda merupakan karunia terindah bagi kami. Namun jika ingin memberikan tanda kasih secara digital, Anda dapat menggunakan opsi berikut:',
    bankAccounts: [
      {
        bankName: 'BCA',
        accountNumber: '1234567890',
        accountHolder: 'Eka Pratama',
      },
      {
        bankName: 'Bank Mandiri',
        accountNumber: '9876543210',
        accountHolder: 'Rani Safitri',
      },
    ],
  },
  responsiveBehavior: { mobileStack: true },
});
