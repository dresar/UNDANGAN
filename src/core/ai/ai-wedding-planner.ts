import { geminiGateway } from '../../infrastructure/ai/gemini.gateway';
import { ValidatedAIDesignPlan, AIDesignPlanSchema } from '../schemas/ai-design-plan.schema';

export interface UserPlannerInput {
  groomName: string;
  brideName: string;
  eventDate: string;
  naturalLanguagePrompt: string;
  preferredTheme?: string;
  city?: string;
}

export class AIWeddingPlanner {
  public static async planWeddingDesign(input: UserPlannerInput): Promise<ValidatedAIDesignPlan> {
    const systemPrompt = `Anda adalah AI Wedding Planner and Creative Director kelas dunia. 
Tugas Anda adalah menganalisis permintaan pengantin dan menghasilkan structured JSON yang sesuai dengan AIDesignPlanSchema.
Hasilkan rekomendasi tema (classic-gold, modern-emerald, romantic-rose), template (cinematic-elegance, editorial-story), urutan section, varian, dan kebutuhan asset visual.`;

    const userPrompt = `Nama Pasangan: ${input.groomName} & ${input.brideName}
Tanggal Acara: ${input.eventDate}
Lokasi Kota: ${input.city || 'Jakarta'}
Preferensi Pengguna: "${input.naturalLanguagePrompt}"
Tema yang dipilih: ${input.preferredTheme || 'Bebas / Rekomendasikan yang terbaik'}`;

    const fallback: ValidatedAIDesignPlan = {
      visualDirection: `Elegan abadi dengan nuansa hangat penuh kasih untuk pernikahan ${input.groomName} & ${input.brideName}`,
      recommendedThemeId: input.preferredTheme || 'classic-gold',
      recommendedTemplateId: 'cinematic-elegance',
      colorMood: 'Emas, Ivory, dan Sentuhan Hangat',
      animationPersonality: 'elegant',
      editorialTagline: 'Dua Hati Bersatu Dalam Ikatan Abadi',
      loveStorySummary: 'Perjalanan cinta indah yang dimulai dari pertemuan berharga hingga melangkah ke pelaminan.',
      sectionPlan: [
        { componentType: 'opening', variant: 'fullscreen_card', order: 0, editorialHeadline: 'Pernikahan Impian', suggestedProps: {} },
        { componentType: 'hero', variant: 'cinematic', order: 1, editorialHeadline: 'The Wedding Of', suggestedProps: {} },
        { componentType: 'quote', variant: 'centered', order: 2, suggestedProps: {} },
        { componentType: 'couple', variant: 'portrait_split', order: 3, suggestedProps: {} },
        { componentType: 'countdown', variant: 'boxes', order: 4, suggestedProps: {} },
        { componentType: 'event', variant: 'cards_side_by_side', order: 5, suggestedProps: {} },
        { componentType: 'story', variant: 'vertical_timeline', order: 6, suggestedProps: {} },
        { componentType: 'gallery', variant: 'grid', order: 7, suggestedProps: {} },
        { componentType: 'location', variant: 'embedded_map', order: 8, suggestedProps: {} },
        { componentType: 'rsvp', variant: 'form_card', order: 9, suggestedProps: {} },
        { componentType: 'guestbook', variant: 'message_list', order: 10, suggestedProps: {} },
        { componentType: 'gift', variant: 'bank_cards', order: 11, suggestedProps: {} },
        { componentType: 'closing', variant: 'gratitude_note', order: 12, suggestedProps: {} },
        { componentType: 'music', variant: 'floating_player', order: 13, suggestedProps: {} },
      ],
      assetRequirements: [
        {
          slotName: 'hero_photo',
          componentType: 'hero',
          visualPurpose: 'hero_photo',
          aspectRatio: '16:9',
          isTransparent: false,
          promptDescription: `Cinematic wedding hero portrait of Indonesian couple in elegant attire`,
          recommendedOrigin: 'USER',
        },
        {
          slotName: 'portrait_groom',
          componentType: 'couple',
          visualPurpose: 'portrait_groom',
          aspectRatio: '1:1',
          isTransparent: false,
          promptDescription: `Groom portrait in formal wedding suit`,
          recommendedOrigin: 'USER',
        },
        {
          slotName: 'portrait_bride',
          componentType: 'couple',
          visualPurpose: 'portrait_bride',
          aspectRatio: '1:1',
          isTransparent: false,
          promptDescription: `Bride portrait in beautiful elegant wedding gown`,
          recommendedOrigin: 'USER',
        },
        {
          slotName: 'divider_ornament',
          componentType: 'divider',
          visualPurpose: 'divider_ornament',
          aspectRatio: 'custom',
          isTransparent: true,
          promptDescription: `Gold ornamental floral divider element on transparent background`,
          recommendedOrigin: 'SHARED_THEME',
        },
      ],
    };

    const rawResult = await geminiGateway.generateStructuredJSON<ValidatedAIDesignPlan>(
      systemPrompt,
      userPrompt,
      () => fallback
    );

    const parsed = AIDesignPlanSchema.safeParse(rawResult);
    return parsed.success ? parsed.data : fallback;
  }
}
