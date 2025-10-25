
import { GoogleGenAI, Chat } from "@google/genai";
import type { ChatMessage } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
let chatSession: Chat | null = null;

export async function generateColoringImage(prompt: string): Promise<string> {
  try {
    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: prompt,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/png',
        aspectRatio: '4:3',
      },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
      const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
      return `data:image/png;base64,${base64ImageBytes}`;
    } else {
      throw new Error("No image was generated.");
    }
  } catch (error) {
    console.error("Error generating image:", error);
    throw error;
  }
}

export async function getChatResponse(history: ChatMessage[], newMessage: string): Promise<string> {
  try {
    if (!chatSession) {
      chatSession = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction: 'You are a friendly and curious robot friend for a young child. Keep your answers short, simple, and exciting! Use fun emojis.',
        },
        // Re-initializing history is handled by the component state in this app structure,
        // so we don't need to pass history to `create`.
      });
    }
    
    const result = await chatSession.sendMessage({ message: newMessage });
    return result.text;
  } catch (error) {
    console.error("Error getting chat response:", error);
    // In case of an error, reset the chat session
    chatSession = null;
    throw error;
  }
}
