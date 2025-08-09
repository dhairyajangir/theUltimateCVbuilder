export interface CVData {
  contact: any;
  customProfession: string;
  template: 'modern' | 'classic' | 'minimal';
  profession: string;
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    summary: string;
    title: string;
    socialLinks: string[];
    profilePicture: string;
  };
  education: Education[];
  experience: Experience[];
  skills: Skill[];
  languages: Language[];
  projects: Project[];
  awards: Award[];
  certifications: Certification[];
  volunteer: Volunteer[];
  publications: Publication[];
  references: Reference[];
}

export interface Experience {
  role: string | number | readonly string[] | undefined;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
  achievements: string[];
  technologies: string[];
  location: string;
}

export interface Education {
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  achievements: string[];
  gpa?: string;
}

export interface Skill {
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  yearsOfExperience: number;
  certifications: string[];
}

export interface Language {
  name: string;
  proficiency: string;
}

export interface Project {
  name: string | number | readonly string[] | undefined;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  achievements: string[];
  technologies: string[];
  link?: string;
}

export interface Award {
  title: string;
  issuer: string;
  date: string;
  description: string;
}

export interface Certification {
  name: string;
  issuer: string;
  date: string;
  expiryDate?: string;
  credentialId?: string;
}

export interface Volunteer {
  organization: string;
  role: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Publication {
  title: string;
  publisher: string;
  date: string;
  description: string;
  link?: string;
}

export interface Reference {
  name: string;
  position: string;
  company: string;
  email: string;
  phone: string;
}

export interface ProfessionRequirements {
atsKeywords?: string[];
summary?: string;
certifications?: string[];
projectIdeas?: string[];
industryInsights?: {
  trends: string[];
  challenges: string[];
  opportunities: string[];
};
salaryRange?: {
  entry: string;
  mid: string;
  senior: string;
  expert: string;
};
recommendedCourses?: Array<{
  name: string;
  provider: string;
  level: string;
}>;
// Deprecated fields from the old structure, can be removed if not used elsewhere
skills?: string[];
education?: string[];
experience?: string[];
careerPath?: {
  entry: string[];
  mid: string[];
  senior: string[];
  expert: string[];
};
keyTechnologies?: string[];
softSkills?: string[];
}
