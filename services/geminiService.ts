
import { GoogleGenAI, Type } from "@google/genai";
import { ComicScript, ComicPanel } from "../types";

const API_KEY = process.env.API_KEY || "";

export const generateComicScript = async (prompt: string): Promise<ComicScript> => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Создай кинематографичный сценарий для комикса из 4 панелей по мотивам аниме "Клинок, рассекающий демонов" (Demon Slayer) на основе этой идеи: "${prompt}". 
    Стиль должен соответствовать напряженному, эмоциональному и динамичному тону аниме. 
    Используй персонажей: Танджиро, Незуко, Зеницу, Иноске или Столпов.
    ВАЖНО: Весь текст (названия, диалоги, описания) должен быть на РУССКОМ языке.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING, description: "Эпичное название истории" },
          panels: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                panelDescription: { 
                  type: Type.STRING, 
                  description: "Детальное визуальное описание панели для генератора изображений на английском языке (чтобы ИИ лучше понял стиль), но с сохранением сути." 
                },
                dialogue: { type: Type.STRING, description: "Текст диалога на русском языке." },
                caption: { type: Type.STRING, description: "Повествовательное описание или закадровый голос на русском языке." },
              },
              required: ["panelDescription", "dialogue", "caption"]
            }
          }
        },
        required: ["title", "panels"]
      }
    }
  });

  const script = JSON.parse(response.text);
  return {
    ...script,
    panels: script.panels.map((p: any) => ({
      ...p,
      id: crypto.randomUUID(),
      status: 'idle'
    }))
  };
};

export const generatePanelImage = async (panelDescription: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  const enhancedPrompt = `High-quality anime style, Demon Slayer Kimetsu no Yaiba art style by Ufotable. ${panelDescription}. 
  Vivid colors, dramatic lighting, detailed background, dynamic pose, breathing effects (water, fire, thunder), cinematic composition. 4k, masterpiece.`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [{ text: enhancedPrompt }]
    },
    config: {
      imageConfig: {
        aspectRatio: "16:9"
      }
    }
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }

  throw new Error("Не удалось сгенерировать изображение");
};
