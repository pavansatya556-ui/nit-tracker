import { GoogleGenAI } from "@google/genai";
import { Course, TARGET_ATTENDANCE } from '../types';
import { getCourseStats } from '../utils/calculations';

// Initialize the Gemini AI client
// NOTE: In a real production app, you might proxy this through a backend.
// For this frontend-only demo, we use the env variable directly.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getAttendanceInsights = async (courses: Course[]): Promise<string> => {
  if (!process.env.API_KEY) {
    return "API Key is missing. Please check your configuration.";
  }

  const courseData = courses.map(c => {
    const stats = getCourseStats(c);
    return {
      name: c.name,
      total: c.totalClasses,
      absent: c.absentClasses,
      percentage: stats.percentage.toFixed(1) + '%',
      status: stats.status,
      needed: stats.classesToAttend > 0 ? `Needs ${stats.classesToAttend} classes to recover` : `Can miss ${stats.classesCanMiss}`
    };
  });

  const prompt = `
    I am a student at NIT (National Institute of Technology).
    Here is my current attendance data:
    ${JSON.stringify(courseData, null, 2)}
    
    My target attendance is ${TARGET_ATTENDANCE}%.
    
    Please provide a concise, motivational, and strategic analysis.
    1. Highlight critical subjects first.
    2. Give specific advice on how many classes to attend for the worst subjects.
    3. If everything is good, give a "keep it up" message but warn against complacency.
    4. Keep the tone friendly but urgent if stats are low. Use emojis.
    5. Keep the response under 150 words.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "Could not generate insights at this time.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Sorry, I couldn't connect to the AI advisor right now. Please try again later.";
  }
};
