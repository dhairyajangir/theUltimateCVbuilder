import { GoogleGenerativeAI } from '@google/generative-ai';
import { ProfessionRequirements } from '../types';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export async function getProfessionRequirements(
  profession: string
): Promise<ProfessionRequirements> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `
You are a career advisor AI.
Given the profession: "${profession}",
generate and return only a valid JSON object (no markdown, no extra text, no comments).
Use double quotes for all keys and string values.
Structure as follows:
{
  "skills": ["required technical and soft skills"],
  "education": ["recommended education paths"],
  "experience": ["key experience requirements"],
  "summary": "professional summary template",
  "certifications": ["relevant professional certifications"],
  "projectIdeas": ["portfolio project ideas relevant to the role"],
  "careerPath": {
    "entry": ["entry-level positions and requirements"],
    "mid": ["mid-level career steps"],
    "senior": ["senior-level expectations"],
    "expert": ["expert/leadership requirements"]
  },
  "industryInsights": {
    "trends": ["current industry trends"],
    "challenges": ["common challenges in this role"],
    "opportunities": ["growth opportunities"]
  },
  "salaryRange": {
    "entry": "entry-level salary range in USD",
    "mid": "mid-level salary range in USD",
    "senior": "senior-level salary range in USD",
    "expert": "expert-level salary range in USD"
  },
  "keyTechnologies": ["essential technologies and tools"],
  "softSkills": ["important soft skills"],
  "recommendedCourses": [
    {
      "name": "course name",
      "provider": "course provider",
      "level": "difficulty level"
    }
  ]
}
RESPONSE RULES:
- Output ONLY the raw JSON object described above, nothing else.
- Do NOT include any extra text, explanations, or formatting.
- Do NOT use markdown or code block formatting.
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
      skills: [],
      education: [],
      experience: [],
      summary: '',
      certifications: [],
      projectIdeas: [],
      careerPath: {
        entry: [],
        mid: [],
        senior: [],
        expert: []
      },
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
      keyTechnologies: [],
      softSkills: [],
      recommendedCourses: []
    };
  }
}
