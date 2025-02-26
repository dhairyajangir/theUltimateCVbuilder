import React, { useState } from 'react';
import { ProfessionRequirements } from '../types';
import { CheckCircle2, ChevronDown, ChevronUp, TrendingUp, AlertCircle, Lightbulb, DollarSign, Book } from 'lucide-react';

interface AIAssistantProps {
  requirements: ProfessionRequirements | null;
  isLoading: boolean;
}

interface CollapsibleSectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

function CollapsibleSection({ title, icon, children }: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="border border-blue-200 dark:border-blue-800 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
      >
        <div className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
          {icon}
          <h4 className="font-medium">{title}</h4>
        </div>
        {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
      </button>
      {isOpen && <div className="p-4">{children}</div>}
    </div>
  );
}

export default function AIAssistant({ requirements, isLoading }: AIAssistantProps) {
  if (isLoading) {
    return (
      <div className="animate-pulse p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg space-y-4">
        <div className="h-4 bg-blue-200 dark:bg-blue-700 rounded w-3/4"></div>
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-3">
            <div className="h-3 bg-blue-200 dark:bg-blue-700 rounded"></div>
            <div className="h-3 bg-blue-200 dark:bg-blue-700 rounded w-5/6"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!requirements) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-blue-800 dark:text-blue-200 mb-6">
        AI Career Insights
      </h3>

      <CollapsibleSection title="Career Path" icon={<TrendingUp className="w-5 h-5" />}>
        <div className="space-y-4">
          {Object.entries(requirements.careerPath).map(([level, items]) => (
            <div key={level}>
              <h5 className="font-medium text-blue-700 dark:text-blue-300 capitalize mb-2">
                {level} Level
              </h5>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1">
                {items.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Industry Insights" icon={<Lightbulb className="w-5 h-5" />}>
        <div className="space-y-4">
          <div>
            <h5 className="font-medium text-blue-700 dark:text-blue-300 mb-2">Trends</h5>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300">
              {requirements.industryInsights.trends.map((trend, index) => (
                <li key={index}>{trend}</li>
              ))}
            </ul>
          </div>
          <div>
            <h5 className="font-medium text-blue-700 dark:text-blue-300 mb-2">Challenges</h5>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300">
              {requirements.industryInsights.challenges.map((challenge, index) => (
                <li key={index}>{challenge}</li>
              ))}
            </ul>
          </div>
          <div>
            <h5 className="font-medium text-blue-700 dark:text-blue-300 mb-2">Opportunities</h5>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300">
              {requirements.industryInsights.opportunities.map((opportunity, index) => (
                <li key={index}>{opportunity}</li>
              ))}
            </ul>
          </div>
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Salary Insights" icon={<DollarSign className="w-5 h-5" />}>
        <div className="space-y-2">
          {Object.entries(requirements.salaryRange).map(([level, range]) => (
            <div key={level} className="flex justify-between items-center">
              <span className="text-gray-700 dark:text-gray-300 capitalize">{level} Level</span>
              <span className="font-medium text-green-600 dark:text-green-400">{range}</span>
            </div>
          ))}
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Recommended Courses" icon={<Book className="w-5 h-5" />}>
        <div className="space-y-4">
          {requirements.recommendedCourses.map((course, index) => (
            <div key={index} className="border-b border-blue-100 dark:border-blue-800 last:border-0 pb-4 last:pb-0">
              <h5 className="font-medium text-blue-700 dark:text-blue-300">{course.name}</h5>
              <p className="text-gray-600 dark:text-gray-400">Provider: {course.provider}</p>
              <p className="text-gray-600 dark:text-gray-400">Level: {course.level}</p>
            </div>
          ))}
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Project Ideas" icon={<Lightbulb className="w-5 h-5" />}>
        <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2">
          {requirements.projectIdeas.map((idea, index) => (
            <li key={index}>{idea}</li>
          ))}
        </ul>
      </CollapsibleSection>
    </div>
  );
}