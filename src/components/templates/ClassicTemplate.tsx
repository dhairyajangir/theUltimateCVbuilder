import React from 'react';
import { CVData } from '../../types';

interface TemplateProps {
  data: CVData;
}

export const ClassicTemplate: React.FC<TemplateProps> = ({ data }) => (
  <div className="max-w-4xl mx-auto p-8 bg-white shadow-lg print:shadow-none">
    <header className="text-center mb-8">
      <h1 className="text-4xl font-serif text-gray-900 mb-2">{data.personalInfo.fullName}</h1>
      <p className="text-xl text-gray-700">{data.profession}</p>
      <div className="flex justify-center gap-4 mt-2 text-gray-600">
        <span>{data.personalInfo.email}</span>
        <span>•</span>
        <span>{data.personalInfo.phone}</span>
        <span>•</span>
        <span>{data.personalInfo.location}</span>
      </div>
    </header>
    {/* Add classic template sections */}
    {/* ...rest of the classic template... */}
  </div>
);