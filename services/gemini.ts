import { GoogleGenAI } from "@google/genai";

// Using the key provided by the user as a fallback if env is not set, 
// to ensure the app works immediately as requested.
const API_KEY = process.env.API_KEY || "AIzaSyAekiG825maIb9qM5HIMYwBdEHIskksqC4";

const ai = new GoogleGenAI({ apiKey: API_KEY });

const SYSTEM_INSTRUCTION = `
Kamu adalah "Zyren-Ai", sebuah asisten AI pintar yang dikembangkan oleh developer bernama "Hasbi".
Gunakan bahasa Indonesia yang santai, gaul, namun tetap sopan dan membantu.
Kamu ahli dalam memberikan tips game, strategi, dan juga bisa membuat gambar jika diminta.
Jangan pernah mengaku buatan Google, kamu adalah buatan Hasbi.
`;

export const generateChatResponse = async (message: string, history: { role: string; parts: { text: string }[] }[]) => {
  try {
    const modelId = 'gemini-2.5-flash';
    const contents = history.map(h => ({
      role: h.role === 'model' ? 'model' : 'user',
      parts: h.parts
    }));
    
    // Add current message
    contents.push({
      role: 'user',
      parts: [{ text: message }]
    });

    const response = await ai.models.generateContent({
      model: modelId,
      contents: contents as any, // Type cast for compatibility
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      }
    });

    return response.text || "Maaf, Zyren lagi pusing nih, coba lagi nanti ya!";
  } catch (error) {
    console.error("Chat Error:", error);
    return "Waduh, ada error nih sistem Zyren. Coba cek koneksi kamu.";
  }
};

export const generateImage = async (prompt: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { text: prompt }
        ]
      },
      config: {
        // Nano banana models don't support complex schemas/mimetypes, 
        // we just parse the inlineData from parts
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No image generated");
  } catch (error) {
    console.error("Image Gen Error:", error);
    return null;
  }
};