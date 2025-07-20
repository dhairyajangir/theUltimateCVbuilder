import React, { useState, useEffect } from 'react';
import { ProfessionRequirements, CVData } from '../types';
import { ChevronDown, ChevronUp, TrendingUp, Lightbulb, DollarSign, Book, Sparkles, CheckCircle } from 'lucide-react';

interface AIAssistantProps {
  requirements: ProfessionRequirements | null;
  isLoading: boolean;
  data: CVData;
  setData: React.Dispatch<React.SetStateAction<CVData>>;
}

interface CollapsibleSectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function CollapsibleSection({ title, icon, children, defaultOpen = false }: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg mb-3">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
      >
        <div className="flex items-center space-x-2">
          {icon}
          <span className="font-medium text-gray-900 dark:text-white">{title}</span>
        </div>
        {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
      </button>
      {isOpen && (
        <div className="px-4 pb-4 border-t border-gray-200 dark:border-gray-700">
          {children}
        </div>
      )}
    </div>
  );
}

export default function AIAssistant({ requirements, isLoading, data, setData }: AIAssistantProps) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [completionScore, setCompletionScore] = useState(0);

  useEffect(() => {
    if (requirements) {
      generateSuggestions();
      calculateCompletionScore();
    }
  }, [requirements, data]);

  const generateSuggestions = () => {
    const newSuggestions: string[] = [];
    
    if (!data.personalInfo.summary && requirements?.summary) {
      newSuggestions.push("Add a professional summary to your profile");
    }
    
    if (data.skills.length < 5 && requirements?.skills) {
      newSuggestions.push(`Add more skills - aim for at least 5 relevant skills`);
    }
    
    if (data.experience.length === 0) {
      newSuggestions.push("Add work experience to strengthen your profile");
    }
    
    if (data.projects.length === 0 && requirements?.projectIdeas) {
      newSuggestions.push("Include relevant projects to showcase your abilities");
    }
    
    if (!data.personalInfo.profilePicture) {
      newSuggestions.push("Upload a professional profile picture");
    }

    setSuggestions(newSuggestions);
  };

  const calculateCompletionScore = () => {
    let score = 0;
    const maxScore = 100;
    
    // Basic info (30%)
    if (data.personalInfo.fullName) score += 10;
    if (data.personalInfo.email) score += 10;
    if (data.personalInfo.summary) score += 10;
    
    // Skills (20%)
    if (data.skills.length > 0) score += 10;
    if (data.skills.length >= 5) score += 10;
    
    // Experience (25%)
    if (data.experience.length > 0) score += 15;
    if (data.experience.length >= 2) score += 10;
    
    // Education (15%)
    if (data.education.length > 0) score += 15;
    
    // Extra sections (10%)
    if (data.projects.length > 0) score += 5;
    if (data.personalInfo.profilePicture) score += 5;
    
    setCompletionScore(score);
  };

  const applySuggestion = (type: string) => {
    switch (type) {
      case 'summary':
        if (requirements?.summary) {
          setData(prev => ({
            ...prev,
            personalInfo: {
              ...prev.personalInfo,
              summary: requirements.summary
            }
          }));
        }
        break;
      case 'skills':
        if (requirements?.skills) {
          const newSkills = requirements.skills.slice(0, 5).map(skill => ({
            name: skill,
            level: 'Intermediate' as const,
            yearsOfExperience: 2,
            certifications: []
          }));
          setData(prev => ({
            ...prev,
            skills: [...prev.skills, ...newSkills]
          }));
        }
        break;
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Sparkles className="w-5 h-5 text-blue-500 animate-pulse" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">AI Assistant</h3>
        </div>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-2 text-gray-600 dark:text-gray-400">Analyzing profession...</span>
        </div>
      </div>
    );
  }

  if (!requirements) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Sparkles className="w-5 h-5 text-blue-500" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">AI Assistant</h3>
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-center py-8">
          Select a profession to get personalized AI suggestions
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 max-h-screen overflow-y-auto">
      <div className="flex items-center space-x-2 mb-4">
        <Sparkles className="w-5 h-5 text-blue-500" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">AI Assistant</h3>
      </div>

      {/* Completion Score */}
      <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Profile Completion</span>
          <span className="text-sm font-bold text-blue-600 dark:text-blue-400">{completionScore}%</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${completionScore}%` }}
          />
        </div>
      </div>

      {/* Real-time Suggestions */}
      {suggestions.length > 0 && (
        <div className="mb-6">
          <h4 className="font-medium text-gray-900 dark:text-white mb-3">💡 Suggestions for You</h4>
          <div className="space-y-2">
            {suggestions.map((suggestion, index) => (
              <div key={index} className="flex items-start space-x-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <Lightbulb className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-700 dark:text-gray-300">{suggestion}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI-Generated Content Sections */}
      <div className="space-y-4">
        <CollapsibleSection
          title="Required Skills"
          icon={<CheckCircle className="w-5 h-5 text-green-500" />}
          defaultOpen={true}
        >
          <div className="mt-3">
            <div className="flex flex-wrap gap-2 mb-3">
              {requirements.skills?.slice(0, 8).map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 text-sm rounded-full"
                >
                  {skill}
                </span>
              ))}
            </div>
            <button
              onClick={() => applySuggestion('skills')}
              className="text-sm bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add to Profile
            </button>
          </div>
        </CollapsibleSection>

        <CollapsibleSection
          title="Salary Insights"
          icon={<DollarSign className="w-5 h-5 text-green-500" />}
        >
          <div className="mt-3 space-y-2">
            {Object.entries(requirements.salaryRange || {}).map(([level, range]) => (
              <div key={level} className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700 last:border-0">
                <span className="capitalize font-medium text-gray-700 dark:text-gray-300">{level}</span>
                <span className="text-green-600 dark:text-green-400 font-semibold">{range}</span>
              </div>
            ))}
          </div>
        </CollapsibleSection>

        <CollapsibleSection
          title="Industry Trends"
          icon={<TrendingUp className="w-5 h-5 text-purple-500" />}
        >
          <div className="mt-3">
            <ul className="space-y-2">
              {requirements.industryInsights?.trends?.map((trend, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{trend}</span>
                </li>
              ))}
            </ul>
          </div>
        </CollapsibleSection>

        <CollapsibleSection
          title="Recommended Courses"
          icon={<Book className="w-5 h-5 text-indigo-500" />}
        >
          <div className="mt-3 space-y-3">
            {requirements.recommendedCourses?.map((course, index) => (
              <div key={index} className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                <h5 className="font-medium text-gray-900 dark:text-white">{course.name}</h5>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  <span>Provider: {course.provider}</span> • <span>Level: {course.level}</span>
                </div>
              </div>
            ))}
          </div>
        </CollapsibleSection>

        <CollapsibleSection
          title="Project Ideas"
          icon={<Lightbulb className="w-5 h-5 text-orange-500" />}
        >
          <div className="mt-3">
            <ul className="space-y-2">
              {requirements.projectIdeas?.map((project, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{project}</span>
                </li>
              ))}
            </ul>
          </div>
        </CollapsibleSection>
      </div>
    </div>
  );
}
