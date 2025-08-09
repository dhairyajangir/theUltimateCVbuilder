// Get grammar correction and suggestion for a single field
export async function getFieldSuggestions(field: string, value: string): Promise<{ suggestion: string }> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const prompt = `You are a resume writing assistant. For the field "${field}", the user entered: "${value}".\n
If there are any grammar or spelling mistakes, correct them. If the sentence can be improved, rewrite it in a more professional and concise way.\n
Respond with only the improved/corrected sentence. If the input is already good, return it as is. Do not include any extra text or explanation.`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = await response.text();
    text = text.trim().replace(/^"|"$/g, '');
    return { suggestion: text };
  } catch (error) {
    return { suggestion: value };
  }
}

// Get a live ATS score (0-100) for the current CV data
export async function getLiveATSScore(cvData: any): Promise<number> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const prompt = `You are an ATS (Applicant Tracking System) scoring engine. Given the following CV data as JSON, return a single integer score from 0 to 100 representing how well this CV would perform for ATS screening.\n
CV Data: ${JSON.stringify(cvData)}\n
Respond with only the integer score. Do not include any extra text or explanation.`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = await response.text();
    const score = parseInt(text.match(/\d+/)?.[0] || '0', 10);
    return Math.max(0, Math.min(100, score));
  } catch (error) {
    return 0;
  }
}
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
