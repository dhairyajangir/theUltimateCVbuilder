// import React, { useState, useEffect } from 'react';
// import { ProfessionRequirements, CVData } from '../types';
// import { ChevronDown, ChevronUp, Lightbulb, Sparkles, CheckCircle } from 'lucide-react';

// interface AIAssistantProps {
//   requirements: ProfessionRequirements | null;
//   isLoading: boolean;
//   data: CVData;
//   setData: React.Dispatch<React.SetStateAction<CVData>>;
// }

// interface CollapsibleSectionProps {
//   title: string;
//   icon: React.ReactNode;
//   children: React.ReactNode;
//   defaultOpen?: boolean;
// }

// function CollapsibleSection({ title, icon, children, defaultOpen = false }: CollapsibleSectionProps) {
//   const [isOpen, setIsOpen] = useState(defaultOpen);

//   return (
//     <div className="border border-neutral-300 dark:border-neutral-600 rounded-lg mb-3 bg-neutral-200 dark:bg-neutral-700">
//       <button
//         onClick={() => setIsOpen(!isOpen)}
//         className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-neutral-300 dark:hover:bg-neutral-600 transition-colors"
//       >
//         <div className="flex items-center space-x-2">
//           {icon}
//           <span className="font-medium text-neutral-800 dark:text-white">{title}</span>
//         </div>
//         {isOpen ? <ChevronUp className="w-5 h-5 text-neutral-600 dark:text-neutral-400" /> : <ChevronDown className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />}
//       </button>
//       {isOpen && (
//         <div className="px-4 pb-4 border-t border-neutral-300 dark:border-neutral-600 bg-neutral-200 dark:bg-neutral-700">
//           {children}
//         </div>
//       )}
//     </div>
//   );
// }

// export default function AIAssistant({ requirements, isLoading, data, setData }: AIAssistantProps) {
//   const [suggestions, setSuggestions] = useState<string[]>([]);
//   const [completionScore, setCompletionScore] = useState(0);

//   useEffect(() => {
//     if (requirements) {
//       generateSuggestions();
//       calculateCompletionScore();
//     }
//   }, [requirements, data]);

//   const generateSuggestions = () => {
//     const newSuggestions: string[] = [];
    
//     if (!data.personalInfo.summary && requirements?.summary) {
//       newSuggestions.push("Add a professional summary to your profile");
//     }
    
//     if (data.skills.length < 5 && requirements?.skills) {
//       newSuggestions.push(`Add more skills - aim for at least 5 relevant skills`);
//     }
    
//     if (data.experience.length === 0) {
//       newSuggestions.push("Add work experience to strengthen your profile");
//     }
    
//     if (data.projects.length === 0 && requirements?.projectIdeas) {
//       newSuggestions.push("Include relevant projects to showcase your abilities");
//     }
    
//     if (!data.personalInfo.profilePicture) {
//       newSuggestions.push("Upload a professional profile picture");
//     }

//     setSuggestions(newSuggestions);
//   };

//   const calculateCompletionScore = () => {
//     let score = 0;
    
//     // Basic info (30%)
//     if (data.personalInfo.fullName) score += 10;
//     if (data.personalInfo.email) score += 10;
//     if (data.personalInfo.summary) score += 10;
    
//     // Skills (20%)
//     if (data.skills.length > 0) score += 10;
//     if (data.skills.length >= 5) score += 10;
    
//     // Experience (25%)
//     if (data.experience.length > 0) score += 15;
//     if (data.experience.length >= 2) score += 10;
    
//     // Education (15%)
//     if (data.education.length > 0) score += 15;
    
//     // Extra sections (10%)
//     if (data.projects.length > 0) score += 5;
//     if (data.personalInfo.profilePicture) score += 5;
    
//     setCompletionScore(score);
//   };

//   const applySuggestion = (type: string) => {
//     switch (type) {
//       case 'summary':
//         setData(prev => ({
//           ...prev,
//           personalInfo: {
//             ...prev.personalInfo,
//             summary: requirements?.summary ?? ''
//           }
//         }));
//         break;
//       case 'skills':
//         if (requirements?.atsKeywords) {
//           const currentSkillNames = new Set(data.skills.map(s => s.name.toLowerCase()));
//           const newSkills = requirements.atsKeywords
//             .filter(keyword => !currentSkillNames.has(keyword.toLowerCase()))
//             .map(keyword => ({
//               name: keyword,
//               level: 'Intermediate' as const,
//               yearsOfExperience: 1,
//               certifications: []
//             }));
//           setData(prev => ({
//             ...prev,
//             skills: [...prev.skills, ...newSkills]
//           }));
//         }
//         break;
//     }
//   };

//   if (isLoading) {
//     return (
//       <div className="bg-neutral-100 dark:bg-neutral-800 rounded-lg shadow-md p-6">
//         <div className="flex items-center space-x-2 mb-4">
//           <Sparkles className="w-5 h-5 text-primary-500 animate-pulse" />
//           <h3 className="text-lg font-semibold text-neutral-800 dark:text-white">AI Assistant</h3>
//         </div>
//         <div className="flex items-center justify-center py-8">
//           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
//           <span className="ml-2 text-neutral-600 dark:text-neutral-400">Analyzing profession...</span>
//         </div>
//       </div>
//     );
//   }

//   if (!requirements) {
//     return (
//       <div className="bg-neutral-100 dark:bg-neutral-800 rounded-lg shadow-md p-6">
//         <div className="flex items-center space-x-2 mb-4">
//           <Sparkles className="w-5 h-5 text-primary-500" />
//           <h3 className="text-lg font-semibold text-neutral-800 dark:text-white">AI Assistant</h3>
//         </div>
//         <p className="text-neutral-600 dark:text-neutral-400 text-center py-8">
//           Select a profession to get personalized AI suggestions
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-neutral-100 dark:bg-neutral-800 rounded-lg shadow-md p-6 max-h-screen overflow-y-auto">
//       <div className="flex items-center space-x-2 mb-4">
//         <Sparkles className="w-5 h-5 text-primary-500" />
//         <h3 className="text-lg font-semibold text-neutral-800 dark:text-white">AI Assistant</h3>
//       </div>

//       {/* Completion Score */}
//       <div className="mb-6 p-4 bg-gradient-to-r from-primary-50 to-accent-50 dark:from-primary-900/20 dark:to-accent-900/20 rounded-lg">
//         <div className="flex items-center justify-between mb-2">
//           <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Profile Completion</span>
//           <span className="text-sm font-bold text-primary-600 dark:text-primary-400">{completionScore}%</span>
//         </div>
//         <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
//           <div
//             className="bg-gradient-to-r from-primary-500 to-accent-500 h-2 rounded-full transition-all duration-500"
//             style={{ width: `${completionScore}%` }}
//           />
//         </div>
//       </div>

//       {/* Real-time Suggestions */}
//       {suggestions.length > 0 && (
//         <div className="mb-6">
//           <h4 className="font-medium text-neutral-800 dark:text-white mb-3">💡 Suggestions for You</h4>
//           <div className="space-y-2">
//             {suggestions.map((suggestion, index) => (
//               <div key={index} className="flex items-start space-x-2 p-3 bg-yellow-200 dark:bg-yellow-900/50 rounded-lg">
//                 <Lightbulb className="w-4 h-4 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
//                 <span className="text-sm text-neutral-700 dark:text-neutral-300">{suggestion}</span>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Only show Required Skills section */}
//       <div className="space-y-4">
//         <CollapsibleSection
//           title="Required Skills"
//           icon={<CheckCircle className="w-5 h-5 text-green-500" />}
//           defaultOpen={true}
//         >
//           <div className="mt-3 bg-neutral-300 dark:bg-neutral-900 rounded-lg p-4">
//             <div className="flex flex-wrap gap-2 mb-4">
//               {requirements.atsKeywords?.slice(0, 15).map((keyword, index) => {
//                 const isPresent = data.skills.some(skill => skill.name.toLowerCase() === keyword.toLowerCase());
//                 return (
//                   <span
//                     key={index}
//                     className={`px-3 py-1 text-sm rounded-full font-medium transition-all ${
//                       isPresent
//                         ? 'bg-green-200 dark:bg-green-700 text-green-900 dark:text-green-100 ring-1 ring-green-400 dark:ring-green-600'
//                         : 'bg-primary-200 dark:bg-primary-900 text-primary-900 dark:text-primary-100 ring-1 ring-primary-300 dark:ring-primary-700'
//                     }`}
//                   >
//                     {keyword}
//                   </span>
//                 );
//               })}
//             </div>
//             <button
//               onClick={() => applySuggestion('skills')}
//               className="text-sm bg-primary-600 dark:bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-700 dark:hover:bg-primary-400 transition-colors w-full shadow"
//             >
//               Add Missing Skills to Profile
//             </button>
//             <div className="flex items-center justify-center space-x-4 text-xs text-neutral-500 dark:text-neutral-400 mt-2 text-center">
//               <p className="flex items-center">
//                 <span className="inline-block w-2.5 h-2.5 bg-green-200 rounded-full mr-1.5"></span> Present in your CV
//               </p>
//               <p className="flex items-center">
//                 <span className="inline-block w-2.5 h-2.5 bg-primary-200 rounded-full mr-1.5"></span> Missing from your CV
//               </p>
//             </div>
//           </div>
//         </CollapsibleSection>
//       </div>
//     </div>
//   );
// }