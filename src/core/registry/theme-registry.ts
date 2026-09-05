import { ThemePackage } from '../domain/theme/theme.types';

export class ThemeRegistry {
  private static instance: ThemeRegistry;
  private themes = new Map<string, ThemePackage>();

  private constructor() {
    this.registerBuiltinThemes();
  }

  public static getInstance(): ThemeRegistry {
    if (!ThemeRegistry.instance) {
      ThemeRegistry.instance = new ThemeRegistry();
    }
    return ThemeRegistry.instance;
  }

  public register(theme: ThemePackage): void {
    this.themes.set(theme.id, theme);
  }

  public get(id: string): ThemePackage | undefined {
    return this.themes.get(id);
  }

  public getAll(): ThemePackage[] {
    return Array.from(this.themes.values());
  }

  public getDefault(): ThemePackage {
    return this.get('royal-emerald') || this.getAll()[0];
  }

  private registerBuiltinThemes(): void {
    // 1. Royal Emerald & Sage (Botanical Luxury)
    this.register({
      id: 'royal-emerald',
      name: 'Royal Emerald & Sage',
      version: '1.0.0',
      description: 'Estetika botanical luxury dengan hijau emerald pekat, sage segar, dan aksen emas lembut.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=600&auto=format&fit=crop',
      colors: {
        primary: '#1E4D3B',
        primaryForeground: '#FFFFFF',
        secondary: '#E8F1EB',
        secondaryForeground: '#142E23',
        accent: '#4C7A65',
        accentForeground: '#FFFFFF',
        background: '#F6FAF7',
        foreground: '#16281F',
        muted: '#E5EDE7',
        mutedForeground: '#5B7064',
        surface: '#FFFFFF',
        surfaceBorder: '#C9DCD0',
      },
      typography: {
        fontSerif: 'Cormorant Garamond, Georgia, serif',
        fontSans: 'Plus Jakarta Sans, sans-serif',
        fontScript: 'Alex Brush, cursive',
        headingScale: 1.3,
        bodyLineHeight: 1.65,
      },
      styles: {
        borderRadius: 'lg',
        cardStyle: 'bordered',
        buttonStyle: 'filled',
        dividerStyle: 'floral',
      },
      animationPersonality: 'elegant',
      supportedTemplates: ['*'],
      recommendedVariants: {
        hero: 'editorial',
        couple: 'portrait_split',
        gallery: 'masonry',
      },
      sharedAssets: [
        {
          slotName: 'divider_floral',
          assetUrl: 'https://placehold.co/800x120/transparent/1E4D3B?text=Botanical+Divider',
          visualType: 'divider_ornament',
        },
      ],
      promptStyleModifiers: {
        artStyle: 'editorial bridal photography, botanical greenery luxury garden backdrop',
        lighting: 'soft diffused morning sun, ambient ethereal glow',
        colorMood: 'deep emerald green, sage, off-white florals, soft gold accents',
        negativePrompt: 'blurry, harsh flash, saturated yellow, noisy artifacts',
      },
    });

    // 2. Nordic Minimal Slate (Contemporary Clean)
    this.register({
      id: 'nordic-slate',
      name: 'Nordic Slate & Chalk',
      version: '1.0.0',
      description: 'Modernisme kontemporer Skandinavia dengan tipografi editorial bersih dan palet monokromatik abu-abu sejuk.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=600&auto=format&fit=crop',
      colors: {
        primary: '#334155',
        primaryForeground: '#FFFFFF',
        secondary: '#F1F5F9',
        secondaryForeground: '#0F172A',
        accent: '#64748B',
        accentForeground: '#FFFFFF',
        background: '#F8FAFC',
        foreground: '#0F172A',
        muted: '#E2E8F0',
        mutedForeground: '#64748B',
        surface: '#FFFFFF',
        surfaceBorder: '#CBD5E1',
      },
      typography: {
        fontSerif: 'Cinzel, Georgia, serif',
        fontSans: 'Inter, sans-serif',
        fontScript: 'Great Vibes, cursive',
        headingScale: 1.25,
        bodyLineHeight: 1.6,
      },
      styles: {
        borderRadius: 'none',
        cardStyle: 'flat',
        buttonStyle: 'outline',
        dividerStyle: 'minimal',
      },
      animationPersonality: 'minimal',
      supportedTemplates: ['*'],
      recommendedVariants: {
        hero: 'minimal',
        couple: 'magazine_columns',
        gallery: 'grid',
      },
      sharedAssets: [],
      promptStyleModifiers: {
        artStyle: 'high fashion minimalist editorial, architectural clean background',
        lighting: 'studio high-key soft lighting, subtle shadows',
        colorMood: 'cool slate, graphite, crisp white, neutral tones',
        negativePrompt: 'ornate flowers, clutter, oversaturated, warm yellow haze',
      },
    });

    // 3. Lavender Mist & Pearl (Romantic Dreamy)
    this.register({
      id: 'lavender-mist',
      name: 'Lavender Mist & Pearl',
      version: '1.0.0',
      description: 'Pesona romantis impian dengan rona lavender pastel, lilac lembut, dan kemilau mutiara.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=600&auto=format&fit=crop',
      colors: {
        primary: '#7C5295',
        primaryForeground: '#FFFFFF',
        secondary: '#F5EFF9',
        secondaryForeground: '#2A1836',
        accent: '#A27EC2',
        accentForeground: '#FFFFFF',
        background: '#FAF6FC',
        foreground: '#23132E',
        muted: '#EBDDF2',
        mutedForeground: '#796288',
        surface: '#FFFFFF',
        surfaceBorder: '#DECBEC',
      },
      typography: {
        fontSerif: 'Playfair Display, Georgia, serif',
        fontSans: 'Plus Jakarta Sans, sans-serif',
        fontScript: 'Pinyon Script, cursive',
        headingScale: 1.35,
        bodyLineHeight: 1.7,
      },
      styles: {
        borderRadius: 'xl',
        cardStyle: 'glassmorphism',
        buttonStyle: 'pill',
        dividerStyle: 'floral',
      },
      animationPersonality: 'romantic',
      supportedTemplates: ['*'],
      recommendedVariants: {
        hero: 'cinematic',
        couple: 'portrait_split',
        gallery: 'polaroid',
      },
      sharedAssets: [],
      promptStyleModifiers: {
        artStyle: 'fairytale dreamy wedding portrait, pastel atmospheric glow',
        lighting: 'twilight soft purple hour light, glowing bokeh pearls',
        colorMood: 'lavender, soft lilac, ivory, pearl silver',
        negativePrompt: 'dark gloom, harsh high contrast, muddy colors',
      },
    });

    // 4. Midnight Velvet & Champagne (Cinematic Glamour)
    this.register({
      id: 'midnight-velvet',
      name: 'Midnight Velvet & Champagne',
      version: '1.0.0',
      description: 'Kemewahan sinematik malam hari berlatar gelap pekat dengan aksen champagne berkilau.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=600&auto=format&fit=crop',
      colors: {
        primary: '#E2C275',
        primaryForeground: '#111827',
        secondary: '#1F2937',
        secondaryForeground: '#F9FAFB',
        accent: '#C49B45',
        accentForeground: '#111827',
        background: '#111827',
        foreground: '#F9FAFB',
        muted: '#374151',
        mutedForeground: '#9CA3AF',
        surface: '#1E293B',
        surfaceBorder: '#475569',
      },
      typography: {
        fontSerif: 'Cinzel, Georgia, serif',
        fontSans: 'Inter, sans-serif',
        fontScript: 'Alex Brush, cursive',
        headingScale: 1.4,
        bodyLineHeight: 1.75,
      },
      styles: {
        borderRadius: 'lg',
        cardStyle: 'glassmorphism',
        buttonStyle: 'filled',
        dividerStyle: 'line-ornament',
      },
      animationPersonality: 'cinematic',
      supportedTemplates: ['*'],
      recommendedVariants: {
        hero: 'cinematic',
        couple: 'portrait_split',
        gallery: 'grid',
      },
      sharedAssets: [],
      promptStyleModifiers: {
        artStyle: 'cinematic moody wedding photography, dramatic dark luxury venue',
        lighting: 'candlelight and golden warm chandeliers contrast against dark night',
        colorMood: 'midnight black, deep charcoal, luminous champagne gold',
        negativePrompt: 'flat white light, washed out colors, low contrast',
      },
    });

    // 5. Tuscan Terracotta & Warm Linen (Earthy Boho)
    this.register({
      id: 'tuscan-terracotta',
      name: 'Tuscan Terracotta & Linen',
      version: '1.0.0',
      description: 'Kehangatan pedesaan Italia dengan rona terakota alami, linen hangat, dan tanaman kering pampas.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=600&auto=format&fit=crop',
      colors: {
        primary: '#C86446',
        primaryForeground: '#FFFFFF',
        secondary: '#F5ECE6',
        secondaryForeground: '#3A1E16',
        accent: '#DE8B72',
        accentForeground: '#FFFFFF',
        background: '#FAF6F2',
        foreground: '#2E1912',
        muted: '#EADCD2',
        mutedForeground: '#8C675B',
        surface: '#FFFFFF',
        surfaceBorder: '#DEC5B6',
      },
      typography: {
        fontSerif: 'Playfair Display, Georgia, serif',
        fontSans: 'Plus Jakarta Sans, sans-serif',
        fontScript: 'Great Vibes, cursive',
        headingScale: 1.25,
        bodyLineHeight: 1.65,
      },
      styles: {
        borderRadius: 'md',
        cardStyle: 'bordered',
        buttonStyle: 'outline',
        dividerStyle: 'floral',
      },
      animationPersonality: 'subtle',
      supportedTemplates: ['*'],
      recommendedVariants: {
        hero: 'editorial',
        couple: 'portrait_split',
        gallery: 'masonry',
      },
      sharedAssets: [],
      promptStyleModifiers: {
        artStyle: 'warm earthy bohemian wedding portrait, sunset golden hour in Tuscany',
        lighting: 'warm golden sun rays, rustic earth tone shadows',
        colorMood: 'terracotta, warm beige, dried florals, olive green',
        negativePrompt: 'cold blue tones, modern neon, futuristic city',
      },
    });

    // 6. Classic Ivory & Gold (Timeless Traditional)
    this.register({
      id: 'classic-gold',
      name: 'Classic Ivory & Gold',
      version: '1.0.0',
      description: 'Pilihan klasik timeless dengan sentuhan emas dan ivory elegan.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=600&auto=format&fit=crop',
      colors: {
        primary: '#D4AF37',
        primaryForeground: '#FFFFFF',
        secondary: '#F5EFE6',
        secondaryForeground: '#332D27',
        accent: '#996515',
        accentForeground: '#FFFFFF',
        background: '#FAF7F2',
        foreground: '#2B2621',
        muted: '#EFEAE1',
        mutedForeground: '#786F66',
        surface: '#FFFFFF',
        surfaceBorder: '#E6DCB8',
      },
      typography: {
        fontSerif: 'Playfair Display, Georgia, serif',
        fontSans: 'Inter, sans-serif',
        fontScript: 'Great Vibes, cursive',
        headingScale: 1.3,
        bodyLineHeight: 1.7,
      },
      styles: {
        borderRadius: 'md',
        cardStyle: 'ornamental',
        buttonStyle: 'filled',
        dividerStyle: 'line-ornament',
      },
      animationPersonality: 'elegant',
      supportedTemplates: ['*'],
      recommendedVariants: {
        hero: 'cinematic',
        couple: 'portrait_split',
        gallery: 'grid',
      },
      sharedAssets: [],
      promptStyleModifiers: {
        artStyle: 'cinematic wedding portrait, fine art photography, hyperrealistic',
        lighting: 'warm golden hour sunlight, soft rim light, glowing ambiance',
        colorMood: 'champagne, cream, gold accents, warm neutral tones',
        negativePrompt: 'blurry, distorted faces, casual clothing, low resolution',
      },
    });
  }
}

export const themeRegistry = ThemeRegistry.getInstance();