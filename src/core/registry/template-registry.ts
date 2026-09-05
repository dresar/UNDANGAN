import { TemplateDefinition } from '../domain/template/template.types';

export class TemplateRegistry {
  private static instance: TemplateRegistry;
  private templates = new Map<string, TemplateDefinition>();

  private constructor() {
    this.registerBuiltinTemplates();
  }

  public static getInstance(): TemplateRegistry {
    if (!TemplateRegistry.instance) {
      TemplateRegistry.instance = new TemplateRegistry();
    }
    return TemplateRegistry.instance;
  }

  public register(template: TemplateDefinition): void {
    this.templates.set(template.id, template);
  }

  public get(id: string): TemplateDefinition | undefined {
    return this.templates.get(id);
  }

  public getAll(): TemplateDefinition[] {
    return Array.from(this.templates.values());
  }

  public getDefault(): TemplateDefinition {
    return this.get('cinematic-elegance') || this.getAll()[0];
  }

  private registerBuiltinTemplates(): void {
    // 1. Cinematic Elegance
    this.register({
      id: 'cinematic-elegance',
      name: 'Cinematic Elegance',
      description: 'Pengalaman visual megah imersif dengan opening cover, hitung mundur hari H, kisah cinta, galeri foto, dan amplop digital.',
      category: 'cinematic',
      thumbnailUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop&q=80',
      supportedThemeIds: ['*'],
      defaultSections: [
        { componentType: 'opening', defaultVariant: 'fullscreen_card', isOptional: false, defaultOrder: 0 },
        { componentType: 'hero', defaultVariant: 'cinematic', isOptional: false, defaultOrder: 1 },
        { componentType: 'quote', defaultVariant: 'centered', isOptional: true, defaultOrder: 2 },
        { componentType: 'couple', defaultVariant: 'portrait_split', isOptional: false, defaultOrder: 3 },
        { componentType: 'countdown', defaultVariant: 'boxes', isOptional: false, defaultOrder: 4 },
        { componentType: 'event', defaultVariant: 'cards_side_by_side', isOptional: false, defaultOrder: 5 },
        { componentType: 'story', defaultVariant: 'vertical_timeline', isOptional: true, defaultOrder: 6 },
        { componentType: 'gallery', defaultVariant: 'grid', isOptional: false, defaultOrder: 7 },
        { componentType: 'location', defaultVariant: 'embedded_map', isOptional: false, defaultOrder: 8 },
        { componentType: 'rsvp', defaultVariant: 'form_card', isOptional: false, defaultOrder: 9 },
        { componentType: 'gift', defaultVariant: 'bank_cards', isOptional: true, defaultOrder: 10 },
        { componentType: 'guestbook', defaultVariant: 'message_list', isOptional: false, defaultOrder: 11 },
        { componentType: 'closing', defaultVariant: 'gratitude_note', isOptional: false, defaultOrder: 12 },
        { componentType: 'music', defaultVariant: 'floating_player', isOptional: true, defaultOrder: 13 },
      ],
    });

    // 2. Editorial Wedding Story
    this.register({
      id: 'editorial-story',
      name: 'Editorial Wedding Story',
      description: 'Gaya majalah kontemporer elegan dengan tipografi artistik, kolase foto polaroid, dan narasi mendalam.',
      category: 'editorial',
      thumbnailUrl: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&auto=format&fit=crop&q=80',
      supportedThemeIds: ['*'],
      defaultSections: [
        { componentType: 'opening', defaultVariant: 'minimal_overlay', isOptional: false, defaultOrder: 0 },
        { componentType: 'hero', defaultVariant: 'editorial', isOptional: false, defaultOrder: 1 },
        { componentType: 'couple', defaultVariant: 'magazine_columns', isOptional: false, defaultOrder: 2 },
        { componentType: 'quote', defaultVariant: 'minimal', isOptional: true, defaultOrder: 3 },
        { componentType: 'story', defaultVariant: 'chapter_layout', isOptional: false, defaultOrder: 4 },
        { componentType: 'event', defaultVariant: 'clean_schedule', isOptional: false, defaultOrder: 5 },
        { componentType: 'gallery', defaultVariant: 'masonry', isOptional: false, defaultOrder: 6 },
        { componentType: 'location', defaultVariant: 'minimal_pin', isOptional: false, defaultOrder: 7 },
        { componentType: 'rsvp', defaultVariant: 'clean_input', isOptional: false, defaultOrder: 8 },
        { componentType: 'guestbook', defaultVariant: 'message_list', isOptional: false, defaultOrder: 9 },
        { componentType: 'closing', defaultVariant: 'minimal_signature', isOptional: false, defaultOrder: 10 },
      ],
    });

    // 3. Javanese Royal Heritage
    this.register({
      id: 'javanese-royal',
      name: 'Javanese Royal Heritage',
      description: 'Kemewahan sakral adat Jawa Keraton dengan ornamen Gunungan emas, prosesi siraman & panggih, serta iringan gamelan agung.',
      category: 'classic',
      thumbnailUrl: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=800&auto=format&fit=crop&q=80',
      supportedThemeIds: ['classic-gold', 'royal-emerald'],
      defaultSections: [
        { componentType: 'opening', defaultVariant: 'fullscreen_card', isOptional: false, defaultOrder: 0 },
        { componentType: 'hero', defaultVariant: 'centered', isOptional: false, defaultOrder: 1 },
        { componentType: 'quote', defaultVariant: 'centered', isOptional: false, defaultOrder: 2 },
        { componentType: 'couple', defaultVariant: 'card', isOptional: false, defaultOrder: 3 },
        { componentType: 'timeline', defaultVariant: 'vertical_timeline', isOptional: false, defaultOrder: 4 },
        { componentType: 'event', defaultVariant: 'cards_side_by_side', isOptional: false, defaultOrder: 5 },
        { componentType: 'countdown', defaultVariant: 'boxes', isOptional: false, defaultOrder: 6 },
        { componentType: 'gallery', defaultVariant: 'grid', isOptional: false, defaultOrder: 7 },
        { componentType: 'location', defaultVariant: 'embedded_map', isOptional: false, defaultOrder: 8 },
        { componentType: 'gift', defaultVariant: 'bank_cards', isOptional: true, defaultOrder: 9 },
        { componentType: 'rsvp', defaultVariant: 'form_card', isOptional: false, defaultOrder: 10 },
        { componentType: 'guestbook', defaultVariant: 'message_list', isOptional: false, defaultOrder: 11 },
        { componentType: 'closing', defaultVariant: 'gratitude_note', isOptional: false, defaultOrder: 12 },
        { componentType: 'music', defaultVariant: 'floating_player', isOptional: false, defaultOrder: 13 },
      ],
    });

    // 4. Minimalist Botanical Sage
    this.register({
      id: 'minimalist-botanical',
      name: 'Minimalist Botanical Sage',
      description: 'Konsep estetik modern bernuansa sage green & linen dengan tata letak bersih dan ramah mobile.',
      category: 'minimal',
      thumbnailUrl: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=800&auto=format&fit=crop&q=80',
      supportedThemeIds: ['*'],
      defaultSections: [
        { componentType: 'opening', defaultVariant: 'minimal_overlay', isOptional: false, defaultOrder: 0 },
        { componentType: 'hero', defaultVariant: 'minimal', isOptional: false, defaultOrder: 1 },
        { componentType: 'couple', defaultVariant: 'portrait_split', isOptional: false, defaultOrder: 2 },
        { componentType: 'event', defaultVariant: 'clean_schedule', isOptional: false, defaultOrder: 3 },
        { componentType: 'countdown', defaultVariant: 'boxes', isOptional: false, defaultOrder: 4 },
        { componentType: 'gallery', defaultVariant: 'masonry', isOptional: false, defaultOrder: 5 },
        { componentType: 'location', defaultVariant: 'minimal_pin', isOptional: false, defaultOrder: 6 },
        { componentType: 'rsvp', defaultVariant: 'clean_input', isOptional: false, defaultOrder: 7 },
        { componentType: 'gift', defaultVariant: 'bank_cards', isOptional: true, defaultOrder: 8 },
        { componentType: 'guestbook', defaultVariant: 'message_list', isOptional: false, defaultOrder: 9 },
        { componentType: 'closing', defaultVariant: 'minimal_signature', isOptional: false, defaultOrder: 10 },
      ],
    });

    // 5. Romantic Rose Velvet
    this.register({
      id: 'romantic-rose',
      name: 'Romantic Rose Velvet',
      description: 'Nuansa romantis mewah penuh kehangatan kelopak mawar, video sinematik prewedding, dan kartu tanda kasih.',
      category: 'romantic',
      thumbnailUrl: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=800&auto=format&fit=crop&q=80',
      supportedThemeIds: ['*'],
      defaultSections: [
        { componentType: 'opening', defaultVariant: 'fullscreen_card', isOptional: false, defaultOrder: 0 },
        { componentType: 'hero', defaultVariant: 'cinematic', isOptional: false, defaultOrder: 1 },
        { componentType: 'quote', defaultVariant: 'centered', isOptional: false, defaultOrder: 2 },
        { componentType: 'couple', defaultVariant: 'card', isOptional: false, defaultOrder: 3 },
        { componentType: 'story', defaultVariant: 'vertical_timeline', isOptional: false, defaultOrder: 4 },
        { componentType: 'video', defaultVariant: 'cinematic_embed', isOptional: true, defaultOrder: 5 },
        { componentType: 'event', defaultVariant: 'cards_side_by_side', isOptional: false, defaultOrder: 6 },
        { componentType: 'countdown', defaultVariant: 'boxes', isOptional: false, defaultOrder: 7 },
        { componentType: 'gallery', defaultVariant: 'grid', isOptional: false, defaultOrder: 8 },
        { componentType: 'location', defaultVariant: 'embedded_map', isOptional: false, defaultOrder: 9 },
        { componentType: 'gift', defaultVariant: 'bank_cards', isOptional: false, defaultOrder: 10 },
        { componentType: 'rsvp', defaultVariant: 'form_card', isOptional: false, defaultOrder: 11 },
        { componentType: 'guestbook', defaultVariant: 'message_list', isOptional: false, defaultOrder: 12 },
        { componentType: 'closing', defaultVariant: 'gratitude_note', isOptional: false, defaultOrder: 13 },
      ],
    });

    // 6. Islamic Sacred Harmony
    this.register({
      id: 'islamic-sacred',
      name: 'Islamic Sacred Harmony',
      description: 'Nuansa Islami penuh berkah dengan terjemahan Surah Ar-Rum 21, kaligrafi Arab estetik, dan jadwal Akad Nikah prioritas.',
      category: 'classic',
      thumbnailUrl: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&auto=format&fit=crop&q=80',
      supportedThemeIds: ['*'],
      defaultSections: [
        { componentType: 'opening', defaultVariant: 'fullscreen_card', isOptional: false, defaultOrder: 0 },
        { componentType: 'hero', defaultVariant: 'centered', isOptional: false, defaultOrder: 1 },
        { componentType: 'quote', defaultVariant: 'centered', isOptional: false, defaultOrder: 2 },
        { componentType: 'couple', defaultVariant: 'portrait_split', isOptional: false, defaultOrder: 3 },
        { componentType: 'event', defaultVariant: 'cards_side_by_side', isOptional: false, defaultOrder: 4 },
        { componentType: 'countdown', defaultVariant: 'boxes', isOptional: false, defaultOrder: 5 },
        { componentType: 'location', defaultVariant: 'embedded_map', isOptional: false, defaultOrder: 6 },
        { componentType: 'gallery', defaultVariant: 'grid', isOptional: false, defaultOrder: 7 },
        { componentType: 'gift', defaultVariant: 'bank_cards', isOptional: true, defaultOrder: 8 },
        { componentType: 'rsvp', defaultVariant: 'form_card', isOptional: false, defaultOrder: 9 },
        { componentType: 'guestbook', defaultVariant: 'message_list', isOptional: false, defaultOrder: 10 },
        { componentType: 'closing', defaultVariant: 'gratitude_note', isOptional: false, defaultOrder: 11 },
      ],
    });
  }
}

export const templateRegistry = TemplateRegistry.getInstance();
