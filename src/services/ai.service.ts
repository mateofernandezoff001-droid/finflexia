import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface AIInsight {
  insight: string;
}

export class AIService {
  private static instance: AIService;
  private cache: Map<string, { value: string; timestamp: number }> = new Map();
  private readonly CACHE_TTL = 1000 * 60 * 30; // 30 minutes

  static getInstance() {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  private getCached(key: string): string | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.value;
    }
    return null;
  }

  private setCached(key: string, value: string) {
    this.cache.set(key, { value, timestamp: Date.now() });
  }

  async generateFinancialInsight(topic: string) {
    const cacheKey = `insight_${topic}`;
    const cached = this.getCached(cacheKey);
    if (cached) return cached;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Generate a short, professional financial insight about ${topic} for a fintech landing page. Keep it under 150 characters and make it sound authoritative and futuristic.`,
      });
      const text = response.text || "Insight unreachable.";
      this.setCached(cacheKey, text);
      return text;
    } catch (error) {
      console.error("AI Insight Error:", error);
      return "Intelligence stream temporarily throttled. Real-time metrics pending.";
    }
  }

  async analyzeSpending(wallet: any, transactions: any[]): Promise<string> {
    const context = {
      currentBalance: wallet?.balance,
      transactionCount: transactions.length,
      recentTransactions: transactions.slice(0, 5).map(t => ({
        desc: t.description,
        amt: t.amount,
        type: t.type
      }))
    };

    const cacheKey = `analysis_${JSON.stringify(context)}`;
    const cached = this.getCached(cacheKey);
    if (cached) return cached;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Analiza estos datos financieros simulados de forma profesional: ${JSON.stringify(context)}. Dame un insight breve y premium en español.`,
      });
      const text = response.text || "No se pudo generar el análisis.";
      this.setCached(cacheKey, text);
      return text;
    } catch (error) {
      console.error("AI Analysis Error:", error);
      return "Error de procesamiento neural. Inténtalo más tarde.";
    }
  }

  async sendMessage(message: string, history: any[]): Promise<string> {
    try {
      // Map history to SDK format if needed, but for simplicity we join context
      // The latest SDK uses Content objects with roles
      const contents = [
        ...history.map(m => ({
            role: m.role as string,
            parts: [{ text: m.content }]
        })),
        {
            role: 'user',
            parts: [{ text: message }]
        }
      ];

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: contents,
        config: {
            systemInstruction: "Eres el asistente inteligente de FinFlex, una plataforma financiera premium. Eres profesional, directo y experto en mercados.",
        }
      });
      return response.text || "Lo siento, no he podido procesar tu mensaje.";
    } catch (error) {
      console.error("AI Chat Error:", error);
      return "Error de conexión con el núcleo de inteligencia.";
    }
  }
}

export const aiService = AIService.getInstance();
export const generateFinancialInsight = (topic: string) => aiService.generateFinancialInsight(topic);
