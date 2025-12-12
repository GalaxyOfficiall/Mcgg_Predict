
import { GoogleGenAI, GenerateContentResponse, Chat } from "@google/genai";
import type { ImageSize, ChatMessage } from '../types';

let ai: GoogleGenAI | null = null;

function getAI() {
    if (!ai) {
        if (!process.env.API_KEY) {
            throw new Error("API_KEY environment variable not set");
        }
        ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    }
    return ai;
}

export const generateImage = async (prompt: string, size: ImageSize): Promise<string> => {
    const gemini = getAI();
    try {
        const response = await gemini.models.generateContent({
            model: 'gemini-3-pro-image-preview',
            contents: {
                parts: [{ text: prompt }],
            },
            config: {
                imageConfig: {
                    aspectRatio: "1:1",
                    imageSize: size,
                },
            },
        });

        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                const base64EncodeString: string = part.inlineData.data;
                return `data:image/png;base64,${base64EncodeString}`;
            }
        }
        throw new Error("No image data found in response.");

    } catch (error) {
        console.error("Error generating image:", error);
        throw new Error("Failed to generate image. Please check the console for details.");
    }
};

let chatInstance: Chat | null = null;

const initializeChat = () => {
    if (!chatInstance) {
        const gemini = getAI();
        chatInstance = gemini.chats.create({
            model: 'gemini-3-pro-preview',
            config: {
                systemInstruction: 'You are a helpful and friendly AI assistant.',
            },
        });
    }
    return chatInstance;
};

export const streamChat = async (
    message: string,
    onChunk: (chunkText: string) => void,
): Promise<void> => {
    const chat = initializeChat();
    try {
        const result = await chat.sendMessageStream({ message });
        for await (const chunk of result) {
            const response = chunk as GenerateContentResponse;
            if (response.text) {
                onChunk(response.text);
            }
        }
    } catch (error) {
        console.error("Error in streamChat:", error);
        onChunk("Sorry, I encountered an error. Please try again.");
    }
};

export const resetChat = (): void => {
    chatInstance = null;
};
