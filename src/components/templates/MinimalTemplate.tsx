import React from 'react';
import { CVData } from '../../types';
import { formatDate } from '../../utils/dateFormat';

interface TemplateProps {
  data: CVData;
}

export const MinimalTemplate: React.FC<TemplateProps> = ({ data }) => {
  return (
    <div className="max-w-4xl mx-auto bg-white p-10 font-light">
      {/* Header */}
      <header className="mb-12">
        <div className="flex items-center space-x-8">
          {data.personalInfo.profilePicture && (
            <img
              src={data.personalInfo.profilePicture}
              alt="Profile"
              className="w-24 h-24 rounded-full grayscale object-cover"
            />
          )}
          <div className="flex-1">
            <h1 className="text-4xl font-thin text-gray-900 mb-2">{data.personalInfo.fullName || 'Your Name'}</h1>
            <h2 className="text-lg text-gray-600 mb-4">
              {data.profession || data.customProfession || data.personalInfo.title || 'Your Profession'}
            </h2>
            <div className="space-y-1 text-sm text-gray-500">
              {data.personalInfo.email && <p>{data.personalInfo.email}</p>}
              {data.personalInfo.phone && <p>{data.personalInfo.phone}</p>}
              {data.personalInfo.location && <p>{data.personalInfo.location}</p>}
            </div>
          </div>
        </div>
      </header>

      {/* Summary */}
      {data.personalInfo.summary && (
        <section className="mb-10">
          <p className="text-gray-700 leading-relaxed text-lg">{data.personalInfo.summary}</p>
        </section>
      )}

      {/* Experience */}
      {data.experience.length > 0 && (
        <section className="mb-10">
          <h3 className="text-sm uppercase tracking-wider text-gray-500 mb-6 font-medium">Experience</h3>
          <div className="space-y-8">
            {data.experience.map((exp, index) => (
              <div key={index}>
                <div className="flex justify-between items-baseline mb-2">
                  <h4 className="text-xl text-gray-900">{exp.position}</h4>
                  <span className="text-gray-500 text-sm">
                    {formatDate(exp.startDate)} - {exp.endDate ? formatDate(exp.endDate) : 'Present'}
                  </span>
                </div>
                <p className="text-gray-600 mb-3">{exp.company} • {exp.location}</p>
                <p className="text-gray-700 leading-relaxed">{exp.description}</p>
                {exp.achievements.length > 0 && (
                  <ul className="mt-3 space-y-1">
                    {exp.achievements.map((achievement, idx) => (
                      <li key={idx} className="text-gray-700 flex items-start">
                        <span className="text-gray-400 mr-2">–</span>
                        {achievement}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {data.education.length > 0 && (
        <section className="mb-10">
          <h3 className="text-sm uppercase tracking-wider text-gray-500 mb-6 font-medium">Education</h3>
          <div className="space-y-4">
            {data.education.map((edu, index) => (
              <div key={index} className="flex justify-between items-baseline">
                <div>
                  <h4 className="text-lg text-gray-900">{edu.degree} in {edu.field}</h4>
                  <p className="text-gray-600">{edu.institution}</p>
                  {edu.gpa && <p className="text-gray-500">GPA: {edu.gpa}</p>}
                </div>
                <span className="text-gray-500 text-sm">
                  {formatDate(edu.startDate)} - {edu.endDate ? formatDate(edu.endDate) : 'Present'}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {data.skills.length > 0 && (
        <section className="mb-10">
          <h3 className="text-sm uppercase tracking-wider text-gray-500 mb-6 font-medium">Skills</h3>
          <div className="flex flex-wrap gap-3">
            {data.skills.map((skill, index) => (
              <span key={index} className="text-gray-700 bg-gray-100 px-3 py-1 rounded-full text-sm">
                {skill.name}
              </span>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
