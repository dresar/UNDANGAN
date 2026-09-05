'use client';

import React, { useMemo } from 'react';
import { ThemePackage } from '../domain/theme/theme.types';
import { ThemeOverrides } from '../domain/invitation/invitation.types';

interface ThemeProviderProps {
  theme: ThemePackage;
  overrides?: ThemeOverrides;
  children: React.ReactNode;
}

export function ThemeProvider({ theme, overrides, children }: ThemeProviderProps) {
  const cssVariables = useMemo(() => {
    const colors = theme.colors;
    return {
      '--primary': overrides?.primaryColor || colors.primary,
      '--primary-foreground': colors.primaryForeground,
      '--secondary': overrides?.secondaryColor || colors.secondary,
      '--secondary-foreground': colors.secondaryForeground,
      '--accent': overrides?.accentColor || colors.accent,
      '--accent-foreground': colors.accentForeground,
      '--background': overrides?.backgroundColor || colors.background,
      '--foreground': colors.foreground,
      '--muted': colors.muted,
      '--muted-foreground': colors.mutedForeground,
      '--surface': colors.surface,
      '--surface-border': colors.surfaceBorder,
      '--font-serif': overrides?.fontSerif || theme.typography.fontSerif,
      '--font-sans': overrides?.fontSans || theme.typography.fontSans,
      '--font-script': overrides?.fontScript || theme.typography.fontScript,
    } as React.CSSProperties;
  }, [theme, overrides]);

  return (
    <div style={cssVariables} className="min-h-screen bg-background text-foreground font-sans transition-colors duration-300">
      {children}
    </div>
  );
}
