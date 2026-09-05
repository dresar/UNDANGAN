import { GoogleGenerativeAI } from '@google/generative-ai';

export class GeminiGateway {
  private genAI: GoogleGenerativeAI | null = null;
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY || '';
    if (this.apiKey) {
      this.genAI = new GoogleGenerativeAI(this.apiKey);
    }
  }

  public async generateStructuredJSON<T>(
    systemInstruction: string,
    userPrompt: string,
    fallbackFactory: () => T
  ): Promise<T> {
    if (!this.genAI || !this.apiKey) {
      // In dev/test mode without API key, return deterministic fallback
      return fallbackFactory();
    }

    try {
      const model = this.genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
        systemInstruction,
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.7,
        },
      });

      const result = await model.generateContent(userPrompt);
      const text = result.response.text();
      const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(cleanedText) as T;
    } catch (error) {
      console.warn('Gemini Gateway error, falling back to deterministic template:', error);
      return fallbackFactory();
    }
  }
}

export const geminiGateway = new GeminiGateway();
