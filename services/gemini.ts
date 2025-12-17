import { GoogleGenAI, Type } from "@google/genai";
import { BirthdayContent } from "../types";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
if (!apiKey) {
  throw new Error("VITE_GEMINI_API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey });

// Generate the personalized birthday message
export const generateBirthdayMessage = async (): Promise<BirthdayContent> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Hoje é aniversário da Eduarda. 
      Ela é SUPER fã do anime "Dandadan". Ela gosta de arte grega, mas Dandadan é a paixão principal.
      
      Escreva uma mensagem de aniversário criativa para ela.
      
      Regras de Estilo (Dandadan):
      1. Use referências diretas ao anime: Okarun, Momo, Vovo Turbo, Aliens Serpo, Yokais, Aura Espiritual.
      2. O tom deve ser divertido, meio caótico mas com coração, como a dinâmica do anime.
      3. Compare a personalidade dela (Raio de luz, incrível, engraçada e expontanea) a uma "Energia" poderosa que nem os aliens conseguem conter.
      4. A Arte Grega entra apenas como uma metáfora visual: "Uma Deusa esculpida em mármore lutando contra o bizarro".  Termine com um  Feliz aniversário, nossa própria heroína dadeira!
      
      Responda estritamente em JSON.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: {
              type: Type.STRING,
              description:
                "Um título estilo anime/RPG (ex: A Invocadora da Luz Eterna)",
            },
            message: {
              type: Type.STRING,
              description:
                "A mensagem principal misturando carinho e referências de Dandadan.",
            },
            poem: {
              type: Type.STRING,
              description: "Um haiku ou poema curto sobre espíritos e mármore.",
            },
          },
          required: ["title", "message", "poem"],
        },
      },
    });

    const text = response.text;
    if (!text) throw new Error("No text returned from Gemini");

    return JSON.parse(text) as BirthdayContent;
  } catch (error) {
    console.error("Error generating text:", error);
    throw error;
  }
};

// Generate the unique artwork
export const generateDandadanGreekArt = async (): Promise<string> => {
  try {
    const prompt = `
      Digital art illustration, anime style (Dandadan aesthetic).
      Subject: A classical Greek statue of a girl (Eduarda) that has come to life with spiritual energy.
      Vibe: Mysterious, supernatural, slightly darker tone. NOT neon party.
      Details: The marble is cracking, revealing a soft, glowing teal and muted pink spiritual aura underneath (like Okarun's transformation power).
      Background: A distorted reality field with floating geometric shapes and "Dandadan" style spirit wisps.
      Colors: Muted teal, slate gray, antique gold, pale rose. Low saturation, high contrast. Cinematic lighting.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: {
        parts: [{ text: prompt }],
      },
      config: {
        // Default configs
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData && part.inlineData.data) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }

    throw new Error("No image data found in response");
  } catch (error) {
    console.error("Error generating image:", error);
    throw error;
  }
};
