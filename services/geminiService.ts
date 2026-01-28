import { GoogleGenAI } from "@google/genai";
import { UserState } from "../types";

// Helper to get the API key safely
const getApiKey = (): string | undefined => {
  return process.env.API_KEY;
};

export const generateStudentInsight = async (data: UserState): Promise<string> => {
  const apiKey = getApiKey();
  if (!apiKey) {
    return "Please configure your API Key to receive personalized AI insights.";
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    // Prepare a simplified summary of the user's state to send to Gemini
    const summary = {
      assignmentsPending: data.assignments.filter(a => !a.completed).length,
      upcomingDeadlines: data.assignments.filter(a => !a.completed).map(a => `${a.title} (Due: ${a.dueDate})`),
      budgetRemaining: data.budget - data.expenses.reduce((acc, curr) => acc + curr.amount, 0),
      recentMoods: data.moods.slice(-3).map(m => m.mood),
    };

    const prompt = `
      You are a helpful, calm, student life assistant for an app called Quadra.
      Based on this student's current data, give one short, encouraging, and actionable piece of advice (max 2 sentences).
      
      Data:
      ${JSON.stringify(summary, null, 2)}
      
      Tone: Calm, supportive, minimalist.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "Keep moving forward at your own pace.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Remember to take breaks and drink water.";
  }
};
