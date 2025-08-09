import React, { useCallback, useState, useRef } from 'react';
import { CVData } from '../types';
import { PlusCircle, MinusCircle, Upload, XCircle } from 'lucide-react';
import { getFieldSuggestions } from '../utils/ai';

interface CVFormProps {
  data: CVData;
  setData: React.Dispatch<React.SetStateAction<CVData>>;
  onProfessionChange?: (profession: string) => Promise<void>;
}

export default function CVForm({ data, setData, onProfessionChange }: CVFormProps) {
  const [fieldSuggestions, setFieldSuggestions] = useState<{ [key: string]: string }>({});
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleProfessionChange = useCallback(async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const profession = e.target.value;
    setData(prev => ({ ...prev, profession }));
    if (onProfessionChange) {
      await onProfessionChange(profession);
    }
  }, [setData, onProfessionChange]);

  const validateField = (field: string, value: string) => {
    switch (field) {
      case 'email':
        if (!/^\S+@\S+\.\S+$/.test(value)) return 'Invalid email format.';
        break;
      case 'phone':
        if (!/^\+?[0-9\-\s]{7,15}$/.test(value)) return 'Invalid phone number.';
        break;
      case 'fullName':
        if (!/^[A-Za-z\s'-]+$/.test(value)) return 'Name contains invalid characters.';
        break;
      default:
        break;
    }
    return '';
  };

  const handlePersonalInfoChange = async (field: keyof CVData['personalInfo'], value: string) => {
    const error = validateField(field, value);
    setErrors(prev => ({ ...prev, [field]: error }));
    setData(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value }
    }));
    const suggestion = await getFieldSuggestions(field, value);
    setFieldSuggestions(s => ({ ...s, [field]: suggestion.suggestion }));
  };

  const handleExperienceDescriptionChange = async (index: number, value: string) => {
    const newExperience = [...data.experience];
    newExperience[index].description = value;
    setData(prev => ({ ...prev, experience: newExperience }));

    const suggestion = await getFieldSuggestions('experienceDescription', value);
    setFieldSuggestions(s => ({ ...s, [`experience_description_${index}`]: suggestion.suggestion }));
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
    setTimeout(() => {
      const lastInput = document.querySelector('input[placeholder="Institution"]:last-of-type') as HTMLInputElement;
      if (lastInput) lastInput.focus();
    }, 100);
  };

  const addExperience = () => {
    setData(prev => ({
      ...prev,
      experience: [...prev.experience, {
        company: '',
        position: '',
        role: '',
        startDate: '',
        endDate: '',
        description: '',
        achievements: [],
        technologies: [],
        location: ''
      }]
    }));
    setTimeout(() => {
      const lastInput = document.querySelector('input[placeholder="Company"]:last-of-type') as HTMLInputElement;
      if (lastInput) lastInput.focus();
    }, 100);
  };

  const addSkill = () => {
    setData(prev => ({
      ...prev,
      skills: [...prev.skills, { name: '', level: 'Beginner', yearsOfExperience: 0, certifications: [] }]
    }));
  };

  // Refining type handling in handleExperienceChange
  function handleExperienceChange(index: number, field: keyof CVData['experience'][0], value: string): void {
    const newExperience = [...data.experience];
    if (typeof newExperience[index][field] === 'string' || Array.isArray(newExperience[index][field])) {
      newExperience[index][field] = value as any;
    }
    setData(prev => ({ ...prev, experience: newExperience }));
  }

  function addProject(): void {
    setData(prev => ({
      ...prev,
      projects: [...prev.projects, {
        name: '',
        description: '',
        title: '',
        startDate: '',
        endDate: '',
        achievements: [],
        technologies: []
      }]
    }));
    setTimeout(() => {
      const lastInput = document.querySelector('input[placeholder="Project Name"]:last-of-type') as HTMLInputElement;
      if (lastInput) lastInput.focus();
    }, 100);
  }

  // Refining type handling in handleEducationChange
  function handleEducationChange(index: number, field: keyof CVData['education'][0], value: string): void {
    const newEducation = [...data.education];
    if (typeof newEducation[index][field] === 'string' || Array.isArray(newEducation[index][field])) {
      newEducation[index][field] = value as any;
    }
    setData(prev => ({ ...prev, education: newEducation }));
  }

  function removeEducation(index: number): void {
    const newEducation = data.education.filter((_, i) => i !== index);
    setData(prev => ({ ...prev, education: newEducation }));
  }

  function removeExperience(index: number): void {
    const newExperience = data.experience.filter((_, i) => i !== index);
    setData(prev => ({ ...prev, experience: newExperience }));
  }

  return (
    <div className="relative max-w-4xl mx-auto p-8 bg-white dark:bg-neutral-900 rounded-2xl shadow-lg transition-all duration-300 border border-neutral-200 dark:border-neutral-700">
      <div className="space-y-12">

        {/* Template Selection */}
        <section className="space-y-4">
          <h2 className="text-xl font-heading font-bold text-primary-700 dark:text-primary-200 border-l-4 border-primary-500 pl-3">Choose your template</h2>
          <select
            className="w-full p-3 border border-neutral-300 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-primary-400 focus:border-primary-500 dark:text-white"
            value={data.template}
            onChange={(e) => setData(prev => ({ ...prev, template: e.target.value as CVData['template'] }))}
          >
            <option value="modern">Modern</option>
            <option value="classic">Classic</option>
            <option value="minimal">Minimal</option>
          </select>
        </section>

        {/* Profession Selection */}
        <section className="space-y-4">
          <h2 className="text-xl font-heading font-bold text-primary-700 dark:text-primary-200 border-l-4 border-primary-500 pl-3">Profession</h2>
          <select
            className="w-full p-3 border border-neutral-300 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-primary-400 focus:border-primary-500 dark:text-white"
            value={data.profession}
            onChange={handleProfessionChange}
          >
            <option value="">Select Your Profession</option>
            <option value="software-engineer">Software Engineer</option>
            <option value="scientist">Scientist</option>
            <option value="physician">Physician</option>
            <option value="doctor">Doctor</option>
            <option value="engineer">Engineer</option>
            <option value="astronaut">Astronaut</option>
            <option value="mathematician">Mathematician</option>
            <option value="chemist">Chemist</option>
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
              className="w-full p-3 border border-neutral-300 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-primary-400 focus:border-primary-500 dark:text-white"
              value={data.customProfession}
              onChange={(e) => setData(prev => ({ ...prev, customProfession: e.target.value }))}
            />
          )}
        </section>

        {/* Personal Information */}
        <section className="space-y-4">
          <h2 className="text-xl font-heading font-bold text-primary-700 dark:text-primary-200 border-l-4 border-primary-500 pl-3">Personal Information</h2>

          {/* Upload Picture */}
          <div className="my-4 flex items-center justify-center">
            {data.personalInfo.profilePicture ? (
              <div className="flex flex-col items-center gap-2">
                <div className="relative">
                  <img
                    src={data.personalInfo.profilePicture}
                    alt="Profile Preview"
                    className="w-20 h-20 object-cover rounded-full border-2 border-primary-400 shadow-md mb-2"
                    style={{ background: '#222' }}
                  />
                  <button
                    type="button"
                    className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 rounded-full p-1 shadow-md focus:outline-none transition-colors"
                    aria-label="Remove profile picture"
                    onClick={() => setData(prev => ({ ...prev, personalInfo: { ...prev.personalInfo, profilePicture: '' } }))}
                  >
                    <XCircle className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>
            ) : (
              <>
                <label
                  htmlFor="profilePictureInput"
                  className="cursor-pointer flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed border-primary-300 dark:border-primary-600 rounded-xl hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all hover:border-primary-400 dark:hover:border-primary-500"
                  aria-label="Upload Profile Picture"
                  tabIndex={0}
                  onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click(); }}
                >
                  <Upload className="w-8 h-8 text-primary-500" aria-hidden="true" />
                  <span className="text-sm font-medium text-primary-600 dark:text-primary-400">Upload Picture</span>
                </label>
                <input
                  ref={fileInputRef}
                  id="profilePictureInput"
                  type="file"
                  accept="image/png, image/jpeg"
                  className="hidden"
                  aria-describedby="profile-picture-error"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      if (!file.type.startsWith('image/')) {
                        setErrors(prev => ({ ...prev, profilePicture: 'Please upload a valid image file.' }));
                        return;
                      }
                      if (file.size > 2 * 1024 * 1024) {
                        setErrors(prev => ({ ...prev, profilePicture: 'Image must be under 2MB.' }));
                        return;
                      }
                      setErrors(prev => ({ ...prev, profilePicture: '' }));
                      const reader = new FileReader();
                      reader.onload = () => {
                        setData(prev => ({
                          ...prev,
                          personalInfo: { ...prev.personalInfo, profilePicture: reader.result as string }
                        }));
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
                {errors.profilePicture && (
                  <span id="profile-picture-error" className="text-red-600 text-xs ml-4" role="alert">{errors.profilePicture}</span>
                )}
              </>
            )}
          </div>

          {/* Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <input
                type="text"
                placeholder="Full Name"
                className={`p-3 border rounded-xl bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-primary-400 focus:border-primary-500 dark:text-white ${errors.fullName ? 'border-red-500' : 'border-neutral-300 dark:border-neutral-700'}`}
                value={data.personalInfo.fullName}
                onChange={(e) => handlePersonalInfoChange('fullName', e.target.value)}
                aria-invalid={!!errors.fullName}
                aria-describedby={errors.fullName ? 'fullName-error' : undefined}
              />
              {errors.fullName && <span id="fullName-error" className="text-red-600 text-xs" role="alert">{errors.fullName}</span>}
            </div>
            <div className="flex flex-col">
              <input
                type="email"
                placeholder="Email"
                className={`p-3 border rounded-xl bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-primary-400 focus:border-primary-500 dark:text-white ${errors.email ? 'border-red-500' : 'border-neutral-300 dark:border-neutral-700'}`}
                value={data.personalInfo.email}
                onChange={(e) => handlePersonalInfoChange('email', e.target.value)}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'email-error' : undefined}
              />
              {errors.email && <span id="email-error" className="text-red-600 text-xs" role="alert">{errors.email}</span>}
            </div>
            <div className="flex flex-col">
              <input
                type="tel"
                placeholder="Phone"
                className={`p-3 border rounded-xl bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-primary-400 focus:border-primary-500 dark:text-white ${errors.phone ? 'border-red-500' : 'border-neutral-300 dark:border-neutral-700'}`}
                value={data.personalInfo.phone}
                onChange={(e) => handlePersonalInfoChange('phone', e.target.value)}
                aria-invalid={!!errors.phone}
                aria-describedby={errors.phone ? 'phone-error' : undefined}
              />
              {errors.phone && <span id="phone-error" className="text-red-600 text-xs" role="alert">{errors.phone}</span>}
            </div>
            <input
              type="text"
              placeholder="Location"
              className="p-3 border border-neutral-300 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-primary-400 focus:border-primary-500 dark:text-white"
              value={data.personalInfo.location}
              onChange={(e) => handlePersonalInfoChange('location', e.target.value)}
            />
          </div>

          <textarea
            placeholder="Professional Summary"
            className="w-full p-3 border border-neutral-300 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-primary-400 focus:border-primary-500 transition-shadow focus:shadow-outline dark:text-white"
            rows={4}
            value={data.personalInfo.summary}
            onChange={(e) => handlePersonalInfoChange('summary', e.target.value)}
            aria-label="Professional Summary"
          />
          {fieldSuggestions.summary && (
            <div className="text-xs text-blue-600 dark:text-blue-300 mt-1" role="status">AI: {fieldSuggestions.summary}</div>
          )}
        </section>

        {/* Education Section */}
        <section className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-heading font-bold text-primary-700 dark:text-primary-200 border-l-4 border-primary-500 pl-3">Education</h2>
            <button
              onClick={addEducation}
              className="flex items-center gap-2 px-4 py-2 text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors shadow-sm"
            >
              <PlusCircle className="w-5 h-5" /> Add Education
            </button>
          </div>
          {data.education.map((edu, index) => (
            <div key={index} className="p-4 border border-neutral-200 dark:border-neutral-700 rounded-xl mb-4 bg-white dark:bg-neutral-800">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Institution"
                  className="p-3 border border-neutral-300 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-900 dark:text-white"
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
                  className="p-3 border border-neutral-300 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-900 dark:text-white"
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
                  className="p-3 border border-neutral-300 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-900 dark:text-white"
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
                    className="p-3 border border-neutral-300 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-900 dark:text-white"
                    value={edu.startDate}
                    onChange={(e) => {
                      const newEducation = [...data.education];
                      newEducation[index].startDate = e.target.value;
                      setData(prev => ({ ...prev, education: newEducation }));
                    }}
                  />
                  <input
                    type="date"
                    className="p-3 border border-neutral-300 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-900 dark:text-white"
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
                className="flex items-center gap-1 text-white bg-red-500 hover:bg-red-600 mt-4 px-3 py-2 rounded-lg transition-colors shadow-sm"
              >
                <MinusCircle className="w-5 h-5" /> <span>Remove</span>
              </button>
            </div>
          ))}
        </section>

        {/* Experience Section */}
        {/* Experience Section */}
<section className="space-y-4">
  <div className="flex justify-between items-center">
    <h2 className="text-xl font-heading font-bold text-primary-700 dark:text-primary-200 border-l-4 border-primary-500 pl-3">Experience</h2>
    <button
      onClick={addExperience}
      className="flex items-center gap-2 px-4 py-2 text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors shadow-sm"
    >
      <PlusCircle className="w-5 h-5" /> Add Experience
    </button>
  </div>
  {data.experience.map((exp, index) => (
    <div key={index} className="p-4 border border-neutral-200 dark:border-neutral-700 rounded-xl mb-4 bg-white dark:bg-neutral-800">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Company"
          className="p-3 border border-neutral-300 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-900 dark:text-white"
          value={exp.company}
          onChange={(e) => handleExperienceChange(index, "company", e.target.value)}
        />
        <input
          type="text"
          placeholder="Position"
          className="p-3 border border-neutral-300 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-900 dark:text-white"
          value={exp.position}
          onChange={(e) => handleExperienceChange(index, "position", e.target.value)}
        />
        <div className="grid grid-cols-2 gap-4">
          <input
            type="date"
            className="p-3 border border-neutral-300 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-900 dark:text-white"
            value={exp.startDate}
            onChange={(e) => handleExperienceChange(index, "startDate", e.target.value)}
          />
          <input
            type="date"
            className="p-3 border border-neutral-300 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-900 dark:text-white"
            value={exp.endDate}
            onChange={(e) => handleExperienceChange(index, "endDate", e.target.value)}
          />
        </div>
      </div>
      <textarea
        placeholder="Description"
        className="w-full p-3 border border-neutral-300 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-900 dark:text-white"
        rows={3}
        value={exp.description}
        onChange={(e) => handleExperienceDescriptionChange(index, e.target.value)}
      />
      {fieldSuggestions[`experience_description_${index}`] && (
        <div className="text-xs text-blue-600 dark:text-blue-300 mt-1">
          AI: {fieldSuggestions[`experience_description_${index}`]}
        </div>
      )}
      <button
        onClick={() => removeExperience(index)}
        className="flex items-center gap-1 text-white bg-red-500 hover:bg-red-600 mt-4 px-3 py-2 rounded-lg transition-colors shadow-sm"
      >
        <MinusCircle className="w-5 h-5" /> <span>Remove</span>
      </button>
    </div>
  ))}
</section>


        {/* Skills Section */}
        <section className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-heading font-bold text-primary-700 dark:text-primary-200 border-l-4 border-primary-500 pl-3">Skills</h2>
            <button
              onClick={addSkill}
              className="flex items-center gap-2 px-4 py-2 text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors shadow-sm"
            >
              <PlusCircle className="w-5 h-5" /> Add Skill
            </button>
          </div>
          {data.skills.map((skill, index) => (
            <div key={index} className="flex gap-4 mb-4 items-center">
              <input
                type="text"
                placeholder="Skill"
                className="flex-1 p-3 border border-neutral-300 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-900 dark:text-white"
                value={skill.name}
                onChange={(e) => {
                  const newSkills = [...data.skills];
                  newSkills[index].name = e.target.value;
                  setData(prev => ({ ...prev, skills: newSkills }));
                }}
              />
              <select
                className="p-3 border border-neutral-300 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-900 dark:text-white"
                value={skill.level}
                onChange={(e) => {
                  const newSkills = [...data.skills];
                  newSkills[index].level = e.target.value as 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
                  setData(prev => ({ ...prev, skills: newSkills }));
                }}
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="Expert">Expert</option>
              </select>
              <button
                type="button"
                className="ml-2 p-1 rounded-full bg-red-500 hover:bg-red-600 transition-colors shadow-sm"
                aria-label="Remove skill"
                onClick={() => {
                  const newSkills = data.skills.filter((_, i) => i !== index);
                  setData(prev => ({ ...prev, skills: newSkills }));
                }}
              >
                <XCircle className="w-4 h-4 text-white" />
              </button>
            </div>
          ))}
        </section>

        {/* Projects Section */}
        <section className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-heading font-bold text-primary-700 dark:text-primary-200 border-l-4 border-primary-500 pl-3">Projects</h2>
            <button
              onClick={addProject}
              className="flex items-center gap-2 px-4 py-2 text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors shadow-sm"
            >
              <PlusCircle className="w-5 h-5" /> Add Project
            </button>
          </div>
          {data.projects.map((project, index) => (
            <div key={index} className="flex gap-4 mb-4 items-center">
              <input
                type="text"
                placeholder="Project Name"
                className="flex-1 p-3 border border-neutral-300 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-900 dark:text-white"
                value={project.name}
                onChange={(e) => {
                  const newProjects = [...data.projects];
                  newProjects[index].name = e.target.value;
                  setData(prev => ({ ...prev, projects: newProjects }));
                }}
              />
              <input
                type="text"
                placeholder="Project Description"
                className="flex-1 p-3 border border-neutral-300 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-900 dark:text-white"
                value={project.description}
                onChange={(e) => {
                  const newProjects = [...data.projects];
                  newProjects[index].description = e.target.value;
                  setData(prev => ({ ...prev, projects: newProjects }));
                }}
              />
              <button
                type="button"
                className="ml-2 p-1 rounded-full bg-red-500 hover:bg-red-600 transition-colors shadow-sm"
                aria-label="Remove project"
                onClick={() => {
                  const newProjects = data.projects.filter((_, i) => i !== index);
                  setData(prev => ({ ...prev, projects: newProjects }));
                }}
              >
                <XCircle className="w-4 h-4 text-white" />
              </button>
            </div>
          ))}
        </section>

      </div>
    </div>
  );
}