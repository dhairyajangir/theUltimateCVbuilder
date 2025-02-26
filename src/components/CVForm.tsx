import React, { useCallback } from 'react';
import { CVData } from '../types';
import { PlusCircle, MinusCircle, Sparkles } from 'lucide-react';

interface CVFormProps {
  data: CVData;
  setData: React.Dispatch<React.SetStateAction<CVData>>;
  onProfessionChange?: (profession: string) => Promise<void>;
}

export default function CVForm({ data, setData, onProfessionChange }: CVFormProps) {
  const handleProfessionChange = useCallback(async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const profession = e.target.value;
    setData(prev => ({ ...prev, profession }));
    if (onProfessionChange) {
      await onProfessionChange(profession);
    }
  }, [setData, onProfessionChange]);

  // Helper function to handle personal info changes
  const handlePersonalInfoChange = (field: keyof CVData['personalInfo'], value: string) => {
    setData(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value }
    }));
  };

  const addEducation = () => {
    setData(prev => ({
      ...prev,
      education: [...prev.education, {
        institution: '',
        degree: '',
        field: '',
        startDate: '',
        endDate: '',
        achievements: []
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
        description: '',
        achievements: [],
        technologies: [],
        location: ''
      }]
    }));
  };

  const addSkill = () => {
    setData(prev => ({
      ...prev,
      skills: [...prev.skills, { name: '', level: 'Beginner', yearsOfExperience: 0, certifications: [] }]
    }));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg transition-all duration-300">
      <div className="space-y-8">
        {/* Template Selection */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-800">Template Selection</h2>
          <select
            className="w-full p-3 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            value={data.template}
            onChange={(e) => setData(prev => ({ ...prev, template: e.target.value as CVData['template'] }))}
          >
            <option value="modern">Modern Template</option>
            <option value="classic">Classic Template</option>
            <option value="minimal">Minimal Template</option>
          </select>
        </section>

        {/* Profession Selection */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-gray-800">Profession</h2>
            <Sparkles className="w-5 h-5 text-yellow-500" />
          </div>
          <select
            className="w-full p-3 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            value={data.profession}
            onChange={handleProfessionChange}
          >
            <option value="">Select Your Profession</option>
            <option value="software-engineer">Software Engineer</option>
            <option value="other">Scientist</option>
            <option value="other">Physician</option>
            <option value="other">Doctor</option>
            <option value="other">Engineer</option>
            <option value="other">Astronaut</option>
            <option value="other">Mathematician</option>
            <option value="other">Chemist</option>
            <option value="designer">Designer</option>
            <option value="marketing">Marketing Professional</option>
            <option value="teacher">Teacher</option>
            <option value="data-scientist">Data Scientist</option>
            <option value="product-manager">Product Manager</option>
            <option value="other">Other</option>
          </select>
          {data.profession === 'other' && (
            <input
              type="text"
              placeholder="Enter your profession"
              className="w-full p-3 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              value={data.customProfession}
              onChange={(e) => setData(prev => ({ ...prev, customProfession: e.target.value }))}
            />
          )}
        </section>

        {/* Personal Information */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-800">Personal Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Personal Info Fields */}
            <input
              type="text"
              placeholder="Full Name"
              className="p-3 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              value={data.personalInfo.fullName}
              onChange={(e) => handlePersonalInfoChange('fullName', e.target.value)}
            />
            <input
              type="email"
              placeholder="Email"
              className="p-3 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              value={data.personalInfo.email}
              onChange={(e) => handlePersonalInfoChange('email', e.target.value)}
            />
            <input
              type="tel"
              placeholder="Phone"
              className="p-3 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              value={data.personalInfo.phone}
              onChange={(e) => handlePersonalInfoChange('phone', e.target.value)}
            />
            <input
              type="text"
              placeholder="Location"
              className="p-3 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              value={data.personalInfo.location}
              onChange={(e) => handlePersonalInfoChange('location', e.target.value)}
            />
          </div>
          <textarea
            placeholder="Professional Summary"
            className="w-full p-3 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            rows={4}
            value={data.personalInfo.summary}
            onChange={(e) => handlePersonalInfoChange('summary', e.target.value)}
          />
        </section>

        {/* Education Section */}
        <section className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">Education</h2>
            <button
              onClick={addEducation}
              className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
            >
              <PlusCircle className="w-5 h-5" /> Add Education
            </button>
          </div>
          {data.education.map((edu, index) => (
            <div key={index} className="p-4 border rounded-lg mb-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Institution"
                  className="p-3 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
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
                  className="p-3 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
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
                  className="p-3 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
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
                    className="p-3 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
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
                    className="p-3 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
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
        </section>

        {/* Experience Section */}
        <section className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">Experience</h2>
            <button
              onClick={addExperience}
              className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
            >
              <PlusCircle className="w-5 h-5" /> Add Experience
            </button>
          </div>
          {data.experience.map((exp, index) => (
            <div key={index} className="p-4 border rounded-lg mb-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Company"
                  className="p-3 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
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
                  className="p-3 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
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
                    className="p-3 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
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
                    className="p-3 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
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
                className="w-full p-3 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
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
        </section>

        {/* Skills Section */}
        <section className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">Skills</h2>
            <button
              onClick={addSkill}
              className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
            >
              <PlusCircle className="w-5 h-5" /> Add Skill
            </button>
          </div>
          {data.skills.map((skill, index) => (
            <div key={index} className="flex gap-4 mb-4">
              <input
                type="text"
                placeholder="Skill"
                className="flex-1 p-3 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                value={skill.name}
                onChange={(e) => {
                  const newSkills = [...data.skills];
                  newSkills[index].name = e.target.value;
                  setData(prev => ({ ...prev, skills: newSkills }));
                }}
              />
              <select
                className="p-3 border rounded-lg w-40 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
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
        </section>
      </div>
    </div>
  );
}