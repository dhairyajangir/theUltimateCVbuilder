import { GoogleGenerativeAI } from '@google/generative-ai';
import { ProfessionRequirements } from '../types';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export async function getProfessionRequirements(profession: string): Promise<ProfessionRequirements> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const prompt = `As a career expert, provide comprehensive requirements and insights for a ${profession} position in JSON format with the following structure:
    {
      "skills": ["list of required technical and soft skills"],
      "education": ["recommended education paths"],
      "experience": ["key experience requirements"],
      "summary": "a professional summary template",
      "certifications": ["relevant professional certifications"],
      "projectIdeas": ["portfolio project ideas relevant to the role"],
      "careerPath": {
        "entry": ["entry-level positions and requirements"],
        "mid": ["mid-level career progression steps"],
        "senior": ["senior-level expectations"],
        "expert": ["expert/leadership role requirements"]
      },
      "industryInsights": {
        "trends": ["current industry trends"],
        "challenges": ["common challenges in the role"],
        "opportunities": ["growth opportunities"]
      },
      "salaryRange": {
        "entry": "entry-level salary range",
        "mid": "mid-level salary range",
        "senior": "senior-level salary range",
        "expert": "expert-level salary range"
      },
      "keyTechnologies": ["essential technologies and tools"],
      "softSkills": ["important soft skills for success"],
      "recommendedCourses": [
        {
          "name": "course name",
          "provider": "course provider",
          "level": "difficulty level"
        }
      ]
    }`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    return JSON.parse(text);
  } catch (error) {
    console.error('Error getting profession requirements:', error);
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