import { GoogleGenerativeAI } from '@google/generative-ai';
import { ProfessionRequirements } from '../types';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export async function getProfessionRequirements(
  profession: string
): Promise<ProfessionRequirements> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `
You are an expert career advisor and resume writer with deep knowledge of Applicant Tracking Systems (ATS).
For the profession "${profession}", generate a JSON object with the following structure. Use camelCase for keys and double quotes for all keys and string values.

{
  "atsKeywords": [
    "A list of 10-15 essential ATS keywords, including technical skills, soft skills, and industry jargon."
  ],
  "summary": "A 3-4 sentence professional summary template, optimized with keywords.",
  "certifications": ["A list of 3-5 highly-regarded professional certifications."],
  "salaryRange": {
    "entry": "Entry-level salary range in USD, e.g., '$60,000 - $80,000'",
    "mid": "Mid-level salary range in USD",
    "senior": "Senior-level salary range in USD",
    "expert": "Expert-level salary range in USD"
  },
  "industryInsights": {
    "trends": ["List of 3-4 current industry trends."],
    "challenges": ["List of 2-3 common challenges in this role."],
    "opportunities": ["List of 2-3 growth opportunities."]
  },
  "recommendedCourses": [
    {
      "name": "Course name, e.g., 'Advanced Python for Data Science'",
      "provider": "Course provider, e.g., 'Coursera'",
      "level": "Difficulty level, e.g., 'Intermediate'"
    }
  ],
  "projectIdeas": ["Three innovative portfolio project ideas that would impress a hiring manager."]
}

RESPONSE RULES:
- Output ONLY the raw JSON object. Do not include any extra text, explanations, or markdown formatting.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = await response.text();

    // --- DEBUG --- Log out for diagnosis (remove in production)
    console.log('AI Raw Response:', text);

    // --- CLEANUP ---
    // Remove code fence and anything before/after (triple backticks, possible "json" etc)
    text = text.trim()
      .replace(/^```(?:json)?\s*/i, '') // Remove leading code fence (with optional 'json')
      .replace(/```$/, '')              // Remove trailing code fence
      .trim();

    // --- Attempt parsing ---
    const obj = JSON.parse(text);

    // --- Optionally validate here that all required fields exist ---

    return obj;
  } catch (error) {
    console.error('Error parsing AI response:', error);
    // Return safe fallback to not crash your UI
    return {
      atsKeywords: [],
      summary: '',
      certifications: [],
      projectIdeas: [],
      industryInsights: {
        trends: [],
        challenges: [],
        opportunities: []
      },
      salaryRange: {
        entry: '',
        mid: '',
        senior: '',
        expert: ''
      },
      recommendedCourses: []
    };
  }
}
