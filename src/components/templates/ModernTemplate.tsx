import React from 'react';
import { CVData } from '../../types';
import { formatDate } from '../../utils/dateFormat';
import { Mail, Phone, MapPin, Calendar } from 'lucide-react';

interface TemplateProps {
  data: CVData;
}

export const ModernTemplate: React.FC<TemplateProps> = ({ data }) => {
  return (
    <div className="max-w-5xl mx-auto bg-white shadow-2xl rounded-2xl overflow-hidden border border-gray-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-500 text-white p-10 flex flex-col md:flex-row md:items-center md:space-x-8">
        {data.personalInfo.profilePicture && (
          <img
            src={data.personalInfo.profilePicture}
            alt="Profile"
            className="w-32 h-32 rounded-full border-4 border-white object-cover mx-auto md:mx-0 shadow-lg"
          />
        )}
        <div className="text-center md:text-left mt-6 md:mt-0">
          <h1 className="text-5xl font-extrabold tracking-tight">{data.personalInfo.fullName || 'Your Name'}</h1>
          <p className="text-lg text-blue-200 mt-2">{data.profession || data.customProfession || data.personalInfo.title || 'Your Profession'}</p>
          <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-4 text-sm text-blue-100">
            {data.personalInfo.email && (
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                <span>{data.personalInfo.email}</span>
              </div>
            )}
            {data.personalInfo.phone && (
              <div className="flex items-center gap-2">
                <Phone className="w-5 h-5" />
                <span>{data.personalInfo.phone}</span>
              </div>
            )}
            {data.personalInfo.location && (
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                <span>{data.personalInfo.location}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="p-10 space-y-12">
        {/* Summary */}
        {data.personalInfo.summary && (
          <Section title="Professional Summary">
            <p className="text-gray-700 leading-relaxed text-lg">{data.personalInfo.summary}</p>
          </Section>
        )}

        {/* Experience */}
        {data.experience.length > 0 && (
          <Section title="Experience">
            {data.experience.map((exp, index) => (
              <div key={index} className="relative pl-8 border-l-4 border-blue-500 space-y-2">
                <div className="absolute -left-4 top-2 w-6 h-6 bg-blue-500 rounded-full" />
                <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                  <div>
                    <h4 className="text-xl font-semibold text-gray-800">{exp.position}</h4>
                    <p className="text-blue-600 font-medium">{exp.company}</p>
                    {exp.location && <p className="text-gray-600 text-sm">{exp.location}</p>}
                  </div>
                  <div className="text-sm text-gray-600 flex items-center gap-2 mt-2 md:mt-0">
                    <Calendar className="w-5 h-5" />
                    <span>{formatDate(exp.startDate)} - {exp.endDate ? formatDate(exp.endDate) : 'Present'}</span>
                  </div>
                </div>
                {exp.description && <p className="text-gray-700 text-base">{exp.description}</p>}
                {exp.achievements.length > 0 && (
                  <ul className="list-disc list-inside text-gray-700">
                    {exp.achievements.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                )}
                {exp.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {exp.technologies.map((tech, idx) => (
                      <Tag key={idx} label={tech} />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </Section>
        )}

        {/* Education */}
        {data.education.length > 0 && (
          <Section title="Education">
            {data.education.map((edu, index) => (
              <div key={index} className="flex justify-between items-start flex-col md:flex-row">
                <div>
                  <h4 className="text-lg font-semibold text-gray-800">{edu.degree} in {edu.field}</h4>
                  <p className="text-blue-600">{edu.institution}</p>
                  {edu.gpa && <p className="text-gray-600 text-sm">GPA: {edu.gpa}</p>}
                </div>
                <span className="text-sm text-gray-600 mt-2 md:mt-0">
                  {formatDate(edu.startDate)} - {edu.endDate ? formatDate(edu.endDate) : 'Present'}
                </span>
              </div>
            ))}
          </Section>
        )}

        {/* Skills */}
        {data.skills.length > 0 && (
          <Section title="Skills">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {data.skills.map((skill, index) => (
                <div key={index} className="bg-gray-50 border rounded-lg p-6 shadow-md">
                  <h4 className="font-semibold text-gray-800 text-lg">{skill.name}</h4>
                  <div className="flex justify-between text-sm text-gray-600 mt-1">
                    <span>{skill.level}</span>
                    <span>{skill.yearsOfExperience} yrs</span>
                  </div>
                  <div className="mt-2 w-full bg-gray-200 h-2 rounded-full">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
                      style={{ width: skill.level === 'Expert' ? '90%' : skill.level === 'Advanced' ? '75%' : skill.level === 'Intermediate' ? '60%' : '40%' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Projects */}
        {data.projects.length > 0 && (
          <Section title="Projects">
            {data.projects.map((project, index) => (
              <div key={index} className="p-6 border rounded-lg shadow-md space-y-2">
                <div className="flex justify-between items-center">
                  <h4 className="text-xl font-semibold text-gray-800">{project.title}</h4>
                  <span className="text-sm text-gray-600">
                    {formatDate(project.startDate)} - {project.endDate ? formatDate(project.endDate) : 'Present'}
                  </span>
                </div>
                <p className="text-gray-700 text-base">{project.description}</p>
                {project.technologies && project.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {project.technologies.map((tech, idx) => (
                      <Tag key={idx} label={tech} />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </Section>
        )}
      </div>
    </div>
  );
};

// === Reusable Section Component ===
const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <section>
    <h3 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-blue-500 pb-1">{title}</h3>
    {children}
  </section>
);

// === Reusable Tag Component ===
const Tag: React.FC<{ label: string }> = ({ label }) => (
  <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">{label}</span>
);
