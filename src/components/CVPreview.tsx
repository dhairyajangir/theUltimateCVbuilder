import React from 'react';
import { CVData } from '../types';
import { formatDate } from '../utils/dateFormat';

interface CVPreviewProps {
  data: CVData;
}

const CVPreview: React.FC<CVPreviewProps> = ({ data }) => {
  return (
    <div className="max-w-4xl mx-auto p-8 bg-white shadow-lg print:shadow-none">
      {/* Personal Info Section */}
      <div className="border-l-4 border-blue-600 pl-4 mb-8">
        <h1 className="text-4xl font-bold text-gray-800">{data.personalInfo.fullName || 'Your Name'}</h1>
        <p className="text-xl text-gray-600 mt-2">{data.profession || data.customProfession || 'Your Profession'}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {data.personalInfo.email && (
          <p className="text-gray-600">{data.personalInfo.email}</p>
        )}
        {data.personalInfo.phone && (
          <p className="text-gray-600">{data.personalInfo.phone}</p>
        )}
        {data.personalInfo.location && (
          <p className="text-gray-600">{data.personalInfo.location}</p>
        )}
      </div>

      {/* Summary Section */}
      {data.personalInfo.summary && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Professional Summary</h2>
          <p className="text-gray-600">{data.personalInfo.summary}</p>
        </div>
      )}

      {/* Experience Section */}
      {data.experience.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Experience</h2>
          {data.experience.map((exp, index) => (
            <div key={index} className="mb-6">
              <div className="flex justify-between items-baseline">
                <h3 className="text-xl font-semibold text-gray-700">{exp.position}</h3>
                <p className="text-gray-600">
                  {formatDate(exp.startDate)} - {exp.endDate ? formatDate(exp.endDate) : 'Present'}
                </p>
              </div>
              <p className="text-gray-700 font-medium">{exp.company} • {exp.location}</p>
              <p className="text-gray-600 mt-2">{exp.description}</p>
              {exp.achievements.length > 0 && (
                <ul className="list-disc list-inside mt-2 text-gray-600">
                  {exp.achievements.map((achievement, i) => (
                    <li key={i}>{achievement}</li>
                  ))}
                </ul>
              )}
              {exp.technologies.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {exp.technologies.map((tech, i) => (
                    <span key={i} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                      {tech}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Education Section */}
      {data.education.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Education</h2>
          {data.education.map((edu, index) => (
            <div key={index} className="mb-6">
              <div className="flex justify-between items-baseline">
                <h3 className="text-xl font-semibold text-gray-700">{edu.degree} in {edu.field}</h3>
                <p className="text-gray-600">
                  {formatDate(edu.startDate)} - {edu.endDate ? formatDate(edu.endDate) : 'Present'}
                </p>
              </div>
              <p className="text-gray-700">{edu.institution}</p>
              {edu.gpa && <p className="text-gray-600 mt-1">GPA: {edu.gpa}</p>}
              {edu.achievements.length > 0 && (
                <ul className="list-disc list-inside mt-2 text-gray-600">
                  {edu.achievements.map((achievement, i) => (
                    <li key={i}>{achievement}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Skills Section */}
      {data.skills.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Skills</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {data.skills.map((skill, index) => (
              <div key={index} className="skill-item">
                <span className="font-semibold text-gray-700">{skill.name}</span>
                <span className="text-sm text-gray-600 ml-2">({skill.level})</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CVPreview;