'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Layers,
  Palette,
  Mail,
  Component,
  Image,
  Wand2,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';

const MENU_ITEMS = [
  {
    category: 'Core Builder',
    items: [
      {
        label: 'Dashboard',
        href: '/admin/dashboard',
        icon: LayoutDashboard,
        badge: null,
      },
      {
        label: 'Template Builder',
        href: '/admin/templates',
        icon: Layers,
        badge: 'Core',
      },
      {
        label: 'Invitation Studio',
        href: '/admin/invitations',
        icon: Mail,
        badge: null,
      },
    ],
  },
  {
    category: 'Design & Components',
    items: [
      {
        label: 'Theme Studio',
        href: '/admin/themes',
        icon: Palette,
        badge: '6 Themes',
      },
      {
        label: 'Component Registry',
        href: '/admin/components',
        icon: Component,
        badge: '18 Specs',
      },
      {
        label: 'Asset & Media Hub',
        href: '/admin/assets',
        icon: Image,
        badge: null,
      },
    ],
  },
  {
    category: 'Intelligence & Engine',
    items: [
      {
        label: 'AI Planner Studio',
        href: '/admin/ai-studio',
        icon: Wand2,
        badge: 'Gemini',
      },
    ],
  },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Hide sidebar completely when in Visual Template Builder or Visual Editor Studio
  const isFullScreenStudio =
    pathname.startsWith('/admin/templates/create') ||
    (pathname.startsWith('/admin/templates/') && pathname !== '/admin/templates') ||
    pathname.startsWith('/admin/invitations/editor') ||
    pathname.startsWith('/admin/editor');

  if (isFullScreenStudio) {
    return (
      <div className="min-h-screen w-screen h-screen overflow-hidden bg-[#05070E] text-slate-100 font-sans antialiased selection:bg-emerald-500 selection:text-white">
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex font-sans antialiased selection:bg-emerald-500 selection:text-white">
      {/* Admin Sidebar */}
      <aside className="w-64 bg-slate-900/90 backdrop-blur-xl border-r border-slate-800/80 flex flex-col justify-between shrink-0 h-screen sticky top-0 z-30">
        <div>
          {/* Logo & Header */}
          <div className="h-16 px-6 flex items-center gap-3 border-b border-slate-800/60">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-emerald-900/30">
              <Sparkles className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <span className="font-serif font-bold text-sm tracking-wide text-white block">
                WEDDING<span className="text-emerald-400">ENGINE</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono tracking-widest uppercase block">
                Admin Portal v2.0
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-6 overflow-y-auto max-h-[calc(100vh-140px)]">
            {MENU_ITEMS.map((group, idx) => (
              <div key={idx} className="space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3 block">
                  {group.category}
                </span>
                <div className="space-y-1">
                  {group.items.map((item) => {
                    const isActive = pathname === item.href || (item.href !== '/admin/dashboard' && pathname.startsWith(item.href));
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all group ${
                          isActive
                            ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/10 text-emerald-300 border border-emerald-500/30 shadow-sm'
                            : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60 border border-transparent'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-emerald-400' : 'text-slate-400 group-hover:text-slate-200'}`} />
                          <span>{item.label}</span>
                        </div>
                        {item.badge && (
                          <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-mono uppercase tracking-wider ${
                            isActive
                              ? 'bg-emerald-500/30 text-emerald-200'
                              : 'bg-slate-800 text-slate-400'
                          }`}>
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </div>

        {/* Footer Admin Status */}
        <div className="p-4 border-t border-slate-800/60 bg-slate-950/40">
          <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-semibold text-slate-200 truncate">Super Admin Mode</p>
              <p className="text-[9px] text-emerald-400 font-mono flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Engine Ready
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Admin Workspace */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {children}
      </div>
    </div>
  );
}