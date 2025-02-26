export interface Education {
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  achievements: string[];
  gpa?: string;
}

export interface Experience {
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
  achievements: string[];
  technologies: string[];
  location: string;
}

export interface Skill {
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  yearsOfExperience: number;
  certifications: string[];
}

export interface Project {
  name: string;
  description: string;
  technologies: string[];
  link?: string;
  startDate: string;
  endDate: string;
  achievements: string[];
}

export interface Language {
  name: string;
  proficiency: 'Basic' | 'Intermediate' | 'Advanced' | 'Native' | 'Professional';
  certification?: string;
}

export interface SocialLink {
  platform: 'LinkedIn' | 'GitHub' | 'Portfolio' | 'Twitter' | 'Other';
  url: string;
}

export interface CVData {
  template: 'modern' | 'classic' | 'minimal' | 'professional' | 'creative';
  profession: string;
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    summary: string;
    title: string;
    photo?: string;
    socialLinks: SocialLink[];
  };
  education: Education[];
  experience: Experience[];
  skills: Skill[];
  languages: Language[];
  projects: Project[];
  awards: {
    title: string;
    issuer: string;
    date: string;
    description: string;
  }[];
  certifications: {
    name: string;
    issuer: string;
    date: string;
    expiryDate?: string;
    credentialId?: string;
  }[];
  volunteer: {
    organization: string;
    role: string;
    startDate: string;
    endDate: string;
    description: string;
  }[];
  publications: {
    title: string;
    publisher: string;
    date: string;
    link?: string;
    description: string;
  }[];
  references: {
    name: string;
    position: string;
    company: string;
    email: string;
    phone: string;
  }[];
}

export interface ProfessionRequirements {
  skills: string[];
  education: string[];
  experience: string[];
  summary: string;
  certifications: string[];
  projectIdeas: string[];
  careerPath: {
    entry: string[];
    mid: string[];
    senior: string[];
    expert: string[];
  };
  industryInsights: {
    trends: string[];
    challenges: string[];
    opportunities: string[];
  };
  salaryRange: {
    entry: string;
    mid: string;
    senior: string;
    expert: string;
  };
  keyTechnologies: string[];
  softSkills: string[];
  recommendedCourses: {
    name: string;
    provider: string;
    level: string;
  }[];
}