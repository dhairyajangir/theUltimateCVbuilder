import React from 'react';
import { CVData } from '../../types';
import { formatDate } from '../../utils/dateFormat';

interface TemplateProps {
  data: CVData;
}

export const ModernTemplate: React.FC<TemplateProps> = ({ data }) => (
  <div className="max-w-4xl mx-auto p-8 bg-white shadow-lg print:shadow-none">
    {/* Existing modern template code */}
    <div className="border-l-4 border-blue-600 pl-4">
      <h1 className="text-4xl font-bold text-gray-800">{data.personalInfo.fullName}</h1>
      <p className="text-xl text-gray-600 mt-2">{data.profession}</p>
    </div>
    {/* ...rest of the modern template... */}
  </div>
);