import React from 'react';
import { CVData } from '../../types';
import { formatDate } from '../../utils/dateFormat';

interface TemplateProps {
  data: CVData;
}

export const ClassicTemplate: React.FC<TemplateProps> = ({ data }) => {
  return (
    <div className="max-w-4xl mx-auto bg-white p-12 font-serif">
      {/* Header */}
      <header className="text-center border-b-2 border-gray-800 pb-6 mb-8">
        {data.personalInfo.profilePicture && (
          <img
            src={data.personalInfo.profilePicture}
            alt="Profile"
            className="w-20 h-20 rounded-full mx-auto mb-4 border-2 border-gray-300 object-cover"
          />
        )}
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{data.personalInfo.fullName || 'Your Name'}</h1>
        <h2 className="text-lg text-gray-700 mb-4">
          {data.profession || data.customProfession || data.personalInfo.title || 'Your Profession'}
        </h2>
        <div className="flex justify-center space-x-6 text-sm text-gray-600">
          {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
          {data.personalInfo.phone && <span>{data.personalInfo.phone}</span>}
          {data.personalInfo.location && <span>{data.personalInfo.location}</span>}
        </div>
      </header>

      {/* Summary */}
      {data.personalInfo.summary && (
        <section className="mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-wide border-b border-gray-400 pb-2">
            Professional Summary
          </h3>
          <p className="text-gray-800 leading-relaxed text-justify">{data.personalInfo.summary}</p>
        </section>
      )}

      {/* Experience */}
      {data.experience.length > 0 && (
        <section className="mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-wide border-b border-gray-400 pb-2">
            Professional Experience
          </h3>
          {data.experience.map((exp, index) => (
            <div key={index} className="mb-6">
              <div className="flex justify-between items-baseline mb-2">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">{exp.position}</h4>
                  <p className="text-gray-700 font-medium">{exp.company}</p>
                  {exp.location && <p className="text-gray-600 italic">{exp.location}</p>}
                </div>
                <div className="text-gray-600 text-right">
                  <p>{formatDate(exp.startDate)} - {exp.endDate ? formatDate(exp.endDate) : 'Present'}</p>
                </div>
              </div>
              <p className="text-gray-800 mb-2">{exp.description}</p>
              {exp.achievements.length > 0 && (
                <ul className="list-disc list-inside text-gray-800 space-y-1">
                  {exp.achievements.map((achievement, idx) => (
                    <li key={idx}>{achievement}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Education */}
      {data.education.length > 0 && (
        <section className="mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-wide border-b border-gray-400 pb-2">
            Education
          </h3>
          {data.education.map((edu, index) => (
            <div key={index} className="mb-4">
              <div className="flex justify-between items-baseline">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">{edu.degree} in {edu.field}</h4>
                  <p className="text-gray-700">{edu.institution}</p>
                  {edu.gpa && <p className="text-gray-600">GPA: {edu.gpa}</p>}
                </div>
                <div className="text-gray-600">
                  <p>{formatDate(edu.startDate)} - {edu.endDate ? formatDate(edu.endDate) : 'Present'}</p>
                </div>
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Skills */}
      {data.skills.length > 0 && (
        <section className="mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-wide border-b border-gray-400 pb-2">
            Skills & Competencies
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {data.skills.map((skill, index) => (
              <div key={index} className="flex justify-between">
                <span className="text-gray-800">{skill.name}</span>
                <span className="text-gray-600">({skill.level})</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
