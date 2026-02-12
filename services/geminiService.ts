
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getNeuralBriefing = async (status: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are the "Gemini Neural Core" for a futuristic tactical OS called XENON-GHOST. 
      The current system status is: ${status}. 
      Give a short, high-energy tactical briefing in Portuguese (PT-BR) in ALL CAPS. 
      Keep it under 15 words. Example: "SISTEMA NEURAL INICIADO. AGUARDANDO PRIMEIRA MISSÃO."`,
    });
    return response.text?.trim() || "SISTEMA OPERACIONAL ESTÁVEL.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "CONEXÃO COM CORE NEURAL INSTÁVEL. PROTOCOLO DE EMERGÊNCIA ATIVO.";
  }
};

export const generateTacticalImage = async (): Promise<string | null> => {
  try {
    const prompt = "Cinematic 8k resolution, futuristic tactical dashboard fusion for both car and motorcycle professionals. A split-screen or hybrid interface showing a sleek automotive HUD on one side and a rugged high-tech motorcycle digital cluster on the other. Glowing neon cyan and yellow accents (XENON colors). Carbon fiber and brushed metal textures. Night city bokeh background with light trails. Professional, high-performance 'GHOST' energy, full throttle aesthetic. Sleek automotive and motorcycle design elements integrated.";
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: prompt }]
      },
      config: {
        imageConfig: {
          aspectRatio: "9:16"
        }
      }
    });

    const candidate = response.candidates?.[0];
    if (candidate?.content?.parts) {
      for (const part of candidate.content.parts) {
        if (part.inlineData) {
          return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
      }
    }
    return null;
  } catch (error) {
    console.error("Erro ao gerar imagem:", error);
    return null;
  }
};
