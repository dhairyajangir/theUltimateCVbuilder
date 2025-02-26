import React from 'react';
import { CVData } from '../../types';
import { formatDate } from '../../utils/dateFormat';

interface TemplateProps {
  data: CVData;
}

export const MinimalTemplate: React.FC<TemplateProps> = ({ data }) => (
  <div className="max-w-4xl mx-auto p-8 bg-white shadow-lg print:shadow-none">
    <div className="mb-8">
      <h1 className="text-3xl font-light text-gray-900">{data.personalInfo.fullName}</h1>
      <p className="text-lg text-gray-600 mt-1">{data.profession}</p>
      <div className="text-sm text-gray-500 mt-2">
        {data.personalInfo.email} • {data.personalInfo.phone} • {data.personalInfo.location}
      </div>
    </div>
    {/* Add minimal template sections */}
    {/* ...rest of the minimal template... */}
  </div>
);