/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI, Type } from "@google/genai";

const geminiKey = import.meta.env.VITE_GEMINI_API_KEY?.trim();

// Graceful fallback for missing AI key
const ai = geminiKey 
  ? new GoogleGenAI({ apiKey: geminiKey })
  : {
      models: {
        generateContent: () => Promise.resolve({ text: "{}" })
      },
      chats: {
        create: () => ({ sendMessage: () => Promise.resolve({ text: "Intelligence node offline. Please configure VITE_GEMINI_API_KEY." }) })
      }
    } as any;

export interface AISignalResponse {
  summary: string;
  tags: string[];
  category: string;
}

export interface OnboardingSuggestions {
  suggestedSkills: string[];
  suggestedInvolvedAreas: string[];
}

export const analyzeHelpRequest = async (title: string, description: string): Promise<AISignalResponse> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Perform an intelligence analysis on this community request.
      
      Title: ${title}
      Description: ${description}
      
      Your analysis must include:
      1. A summary (max 100 characters)
      2. 3-5 high-impact tags
      3. The most appropriate category from this list: [Technical, Social, Physical, Materials, Mentorship, Emergency]`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            tags: { type: Type.ARRAY, items: { type: Type.STRING } },
            category: { type: Type.STRING }
          },
          required: ["summary", "tags", "category"]
        }
      }
    });

    let rawText = response.text || '{}';
    // Remove markdown code blocks if present
    if (rawText.includes('```')) {
      rawText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
    }
    const result = JSON.parse(rawText);
    return {
      summary: result.summary || "Pending intelligence analysis...",
      tags: result.tags || [],
      category: result.category || "Social"
    };
  } catch (error) {
    console.error("AI Analysis failed:", error);
    return {
      summary: "Intelligence center currently offline.",
      tags: ["SystemOffline"],
      category: "Social"
    };
  }
};

export const suggestImprovement = async (text: string): Promise<string> => {
  if (!text) return text;
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Rewrite this community help request to be more impactful, clear, and likely to get assistance. Keep the original intent and core facts. 
      Limit to 500 characters.
      
      Original Text: ${text}`,
    });

    return response.text || text;
  } catch (error) {
    console.error("AI Rewrite failed:", error);
    return text;
  }
};

export const getOnboardingSuggestions = async (interests: string[]): Promise<OnboardingSuggestions> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Based on a user's interests in a community help platform, suggest relevant skills they might have to offer and areas where they might need help.
      
      User Interests: ${interests.join(", ")}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            suggestedSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
            suggestedInvolvedAreas: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["suggestedSkills", "suggestedInvolvedAreas"]
        }
      }
    });

    const result = JSON.parse(response.text || '{}');
    return {
      suggestedSkills: result.suggestedSkills || [],
      suggestedInvolvedAreas: result.suggestedInvolvedAreas || []
    };
  } catch (error) {
    console.error("AI Onboarding Analysis failed:", error);
    return {
      suggestedSkills: ["Community Support", "Networking"],
      suggestedInvolvedAreas: ["Local Projects"]
    };
  }
};

export const chatWithAI = async (message: string, history: { role: string, parts: { text: string }[] }[]) => {
  try {
    const chat = ai.chats.create({
      model: "gemini-3-flash-preview",
      config: {
        systemInstruction: `You are HelpHub AI, a community intelligence protocol assistant. 
        Your goal is to help users navigate the HelpHub platform, give advice on how to improve their community requests, and provide insights into local community needs.
        Be professional, helpful, and community-oriented.
        Keep responses concise and impactful.`,
        temperature: 0.7,
      },
      history: history
    });

    const result = await chat.sendMessage({ message });
    return result.text;
  } catch (error) {
    console.error("AI Chat failed:", error);
    return "The intelligence node is experiencing interference. Please verify your connection.";
  }
};
