import React from 'react';
import { CVData } from '../types';
import { PlusCircle, MinusCircle } from 'lucide-react';

interface CVFormProps {
  data: CVData;
  setData: React.Dispatch<React.SetStateAction<CVData>>;
}

export default function CVForm({ data, setData }: CVFormProps) {
  const addEducation = () => {
    setData(prev => ({
      ...prev,
      education: [...prev.education, {
        institution: '',
        degree: '',
        field: '',
        startDate: '',
        endDate: ''
      }]
    }));
  };

  const addExperience = () => {
    setData(prev => ({
      ...prev,
      experience: [...prev.experience, {
        company: '',
        position: '',
        startDate: '',
        endDate: '',
        description: ''
      }]
    }));
  };

  const addSkill = () => {
    setData(prev => ({
      ...prev,
      skills: [...prev.skills, { name: '', level: 'Beginner' }]
    }));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="space-y-6">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Template Selection</h2>
          <select
            className="w-full p-2 border rounded"
            value={data.template}
            onChange={(e) => setData(prev => ({ ...prev, template: e.target.value as CVData['template'] }))}
          >
            <option value="modern">Modern</option>
            <option value="classic">Classic</option>
            <option value="minimal">Minimal</option>
          </select>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Profession</h2>
          <select
            className="w-full p-2 border rounded"
            value={data.profession}
            onChange={(e) => setData(prev => ({ ...prev, profession: e.target.value }))}
          >
            <option value="">Select Profession</option>
            <option value="software-engineer">Software Engineer</option>
            <option value="designer">Designer</option>
            <option value="marketing">Marketing Professional</option>
            <option value="teacher">Teacher</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Personal Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Full Name"
              className="p-2 border rounded"
              value={data.personalInfo.fullName}
              onChange={(e) => setData(prev => ({
                ...prev,
                personalInfo: { ...prev.personalInfo, fullName: e.target.value }
              }))}
            />
            <input
              type="email"
              placeholder="Email"
              className="p-2 border rounded"
              value={data.personalInfo.email}
              onChange={(e) => setData(prev => ({
                ...prev,
                personalInfo: { ...prev.personalInfo, email: e.target.value }
              }))}
            />
            <input
              type="tel"
              placeholder="Phone"
              className="p-2 border rounded"
              value={data.personalInfo.phone}
              onChange={(e) => setData(prev => ({
                ...prev,
                personalInfo: { ...prev.personalInfo, phone: e.target.value }
              }))}
            />
            <input
              type="text"
              placeholder="Location"
              className="p-2 border rounded"
              value={data.personalInfo.location}
              onChange={(e) => setData(prev => ({
                ...prev,
                personalInfo: { ...prev.personalInfo, location: e.target.value }
              }))}
            />
          </div>
          <textarea
            placeholder="Professional Summary"
            className="w-full p-2 border rounded mt-4"
            rows={4}
            value={data.personalInfo.summary}
            onChange={(e) => setData(prev => ({
              ...prev,
              personalInfo: { ...prev.personalInfo, summary: e.target.value }
            }))}
          />
        </div>

        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Education</h2>
            <button
              onClick={addEducation}
              className="flex items-center text-blue-600 hover:text-blue-800"
            >
              <PlusCircle className="w-5 h-5 mr-1" /> Add Education
            </button>
          </div>
          {data.education.map((edu, index) => (
            <div key={index} className="p-4 border rounded mb-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Institution"
                  className="p-2 border rounded"
                  value={edu.institution}
                  onChange={(e) => {
                    const newEducation = [...data.education];
                    newEducation[index].institution = e.target.value;
                    setData(prev => ({ ...prev, education: newEducation }));
                  }}
                />
                <input
                  type="text"
                  placeholder="Degree"
                  className="p-2 border rounded"
                  value={edu.degree}
                  onChange={(e) => {
                    const newEducation = [...data.education];
                    newEducation[index].degree = e.target.value;
                    setData(prev => ({ ...prev, education: newEducation }));
                  }}
                />
                <input
                  type="text"
                  placeholder="Field of Study"
                  className="p-2 border rounded"
                  value={edu.field}
                  onChange={(e) => {
                    const newEducation = [...data.education];
                    newEducation[index].field = e.target.value;
                    setData(prev => ({ ...prev, education: newEducation }));
                  }}
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="date"
                    placeholder="Start Date"
                    className="p-2 border rounded"
                    value={edu.startDate}
                    onChange={(e) => {
                      const newEducation = [...data.education];
                      newEducation[index].startDate = e.target.value;
                      setData(prev => ({ ...prev, education: newEducation }));
                    }}
                  />
                  <input
                    type="date"
                    placeholder="End Date"
                    className="p-2 border rounded"
                    value={edu.endDate}
                    onChange={(e) => {
                      const newEducation = [...data.education];
                      newEducation[index].endDate = e.target.value;
                      setData(prev => ({ ...prev, education: newEducation }));
                    }}
                  />
                </div>
              </div>
              <button
                onClick={() => {
                  const newEducation = data.education.filter((_, i) => i !== index);
                  setData(prev => ({ ...prev, education: newEducation }));
                }}
                className="flex items-center text-red-600 hover:text-red-800 mt-4"
              >
                <MinusCircle className="w-5 h-5 mr-1" /> Remove
              </button>
            </div>
          ))}
        </div>

        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Experience</h2>
            <button
              onClick={addExperience}
              className="flex items-center text-blue-600 hover:text-blue-800"
            >
              <PlusCircle className="w-5 h-5 mr-1" /> Add Experience
            </button>
          </div>
          {data.experience.map((exp, index) => (
            <div key={index} className="p-4 border rounded mb-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Company"
                  className="p-2 border rounded"
                  value={exp.company}
                  onChange={(e) => {
                    const newExperience = [...data.experience];
                    newExperience[index].company = e.target.value;
                    setData(prev => ({ ...prev, experience: newExperience }));
                  }}
                />
                <input
                  type="text"
                  placeholder="Position"
                  className="p-2 border rounded"
                  value={exp.position}
                  onChange={(e) => {
                    const newExperience = [...data.experience];
                    newExperience[index].position = e.target.value;
                    setData(prev => ({ ...prev, experience: newExperience }));
                  }}
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="date"
                    placeholder="Start Date"
                    className="p-2 border rounded"
                    value={exp.startDate}
                    onChange={(e) => {
                      const newExperience = [...data.experience];
                      newExperience[index].startDate = e.target.value;
                      setData(prev => ({ ...prev, experience: newExperience }));
                    }}
                  />
                  <input
                    type="date"
                    placeholder="End Date"
                    className="p-2 border rounded"
                    value={exp.endDate}
                    onChange={(e) => {
                      const newExperience = [...data.experience];
                      newExperience[index].endDate = e.target.value;
                      setData(prev => ({ ...prev, experience: newExperience }));
                    }}
                  />
                </div>
              </div>
              <textarea
                placeholder="Description"
                className="w-full p-2 border rounded mt-4"
                rows={3}
                value={exp.description}
                onChange={(e) => {
                  const newExperience = [...data.experience];
                  newExperience[index].description = e.target.value;
                  setData(prev => ({ ...prev, experience: newExperience }));
                }}
              />
              <button
                onClick={() => {
                  const newExperience = data.experience.filter((_, i) => i !== index);
                  setData(prev => ({ ...prev, experience: newExperience }));
                }}
                className="flex items-center text-red-600 hover:text-red-800 mt-4"
              >
                <MinusCircle className="w-5 h-5 mr-1" /> Remove
              </button>
            </div>
          ))}
        </div>

        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Skills</h2>
            <button
              onClick={addSkill}
              className="flex items-center text-blue-600 hover:text-blue-800"
            >
              <PlusCircle className="w-5 h-5 mr-1" /> Add Skill
            </button>
          </div>
          {data.skills.map((skill, index) => (
            <div key={index} className="flex gap-4 mb-4">
              <input
                type="text"
                placeholder="Skill"
                className="flex-1 p-2 border rounded"
                value={skill.name}
                onChange={(e) => {
                  const newSkills = [...data.skills];
                  newSkills[index].name = e.target.value;
                  setData(prev => ({ ...prev, skills: newSkills }));
                }}
              />
              <select
                className="p-2 border rounded w-40"
                value={skill.level}
                onChange={(e) => {
                  const newSkills = [...data.skills];
                  newSkills[index].level = e.target.value as any;
                  setData(prev => ({ ...prev, skills: newSkills }));
                }}
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="Expert">Expert</option>
              </select>
              <button
                onClick={() => {
                  const newSkills = data.skills.filter((_, i) => i !== index);
                  setData(prev => ({ ...prev, skills: newSkills }));
                }}
                className="flex items-center text-red-600 hover:text-red-800"
              >
                <MinusCircle className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}