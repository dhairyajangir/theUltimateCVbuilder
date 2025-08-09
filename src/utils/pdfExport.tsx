import React from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { CVData } from '../types';

interface CVPreviewProps {
  data: CVData;
}

export async function exportToPDF(elementId: string, filename: string = 'resume.pdf') {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error('Element not found');
    }

    // Create a clone of the element to modify for PDF export
    const clone = element.cloneNode(true) as HTMLElement;
    
    // Set consistent styling for PDF output
    clone.style.width = '800px';
    clone.style.padding = '40px';
    clone.style.backgroundColor = 'white';

    // Fix skills section spacing
    const skillsSection = clone.querySelector('.skills-section');
    if (skillsSection) {
      const skillItems = skillsSection.querySelectorAll('.skill-item');
      skillItems.forEach((item: Element) => {
        (item as HTMLElement).style.marginBottom = '8px';
        (item as HTMLElement).style.gap = '8px';
      });
    }

    // Adjust overall spacing
    const sections = clone.querySelectorAll('section');
    sections.forEach((section: Element) => {
      (section as HTMLElement).style.marginBottom = '20px';
    });
    
    // Ensure profile picture retains aspect ratio
    const profilePicture = clone.querySelector('img[alt="Profile"]');
    if (profilePicture) {
      (profilePicture as HTMLElement).style.width = '100px';
      (profilePicture as HTMLElement).style.height = '100px';
      (profilePicture as HTMLElement).style.objectFit = 'cover';
      (profilePicture as HTMLElement).style.borderRadius = '50%';
    }

    // Temporarily append clone to document for rendering
    clone.style.position = 'absolute';
    clone.style.left = '-9999px';
    document.body.appendChild(clone);

    // Render to canvas with improved settings
    const canvas = await html2canvas(clone, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: 800,
      windowHeight: clone.scrollHeight,
      onclone: (clonedDoc) => {
        // Additional styling adjustments if needed
        const skillElements = clonedDoc.querySelectorAll('.skill-item');
        skillElements.forEach((el: Element) => {
          (el as HTMLElement).style.display = 'flex';
          (el as HTMLElement).style.alignItems = 'center';
          (el as HTMLElement).style.gap = '8px';
        });
      }
    });

    document.body.removeChild(clone);

    // PDF generation settings
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    const pdf = new jsPDF('p', 'mm', 'a4');
    let firstPage = true;

    // Generate PDF pages with improved spacing
    while (heightLeft >= 0) {
      if (!firstPage) {
        pdf.addPage();
      }
      
      const contentWidth = canvas.width;
      const contentHeight = canvas.height;
      
      const pageCanvas = document.createElement('canvas');
      const pageCtx = pageCanvas.getContext('2d');
      
      if (pageCtx) {
        pageCanvas.width = contentWidth;
        pageCanvas.height = Math.min(
          (contentWidth * (pageHeight / imgWidth)),
          contentHeight - position
        );
        
        pageCtx.drawImage(
          canvas,
          0,
          position,
          contentWidth,
          pageCanvas.height,
          0,
          0,
          contentWidth,
          pageCanvas.height
        );
        
        const pageData = pageCanvas.toDataURL('image/jpeg', 1.0);
        pdf.addImage(
          pageData,
          'JPEG',
          0,
          0,
          imgWidth,
          (pageCanvas.height * imgWidth) / pageCanvas.width
        );
      }
      
      heightLeft -= pageHeight;
      position += (contentWidth * (pageHeight / imgWidth));
      firstPage = false;
    }

    pdf.save(filename);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
}

const ModernTemplate: React.FC<CVPreviewProps> = ({ data }) => (
  <div className="max-w-4xl mx-auto p-8 bg-white shadow-lg print:shadow-none">
    <div className="border-l-4 border-blue-600 pl-4">
      <h1 className="text-4xl font-bold text-gray-800">{data.personalInfo.fullName}</h1>
      <p className="text-xl text-gray-600 mt-2">{data.profession}</p>
    </div>
    <div className="grid grid-cols-3 gap-4 mt-6 text-gray-600">
      <p>{data.personalInfo.email}</p>
      <p>{data.personalInfo.phone}</p>
      <p>{data.personalInfo.location}</p>
    </div>
    {data.personalInfo.socialLinks.length > 0 && (
      <div className="mt-4 flex gap-4">
        {data.personalInfo.socialLinks.map((link, index) => (
          <a
            key={index}
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800"
          >
            {link}
          </a>
        ))}
      </div>
    )}
    <div className="mt-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Professional Summary</h2>
      <p className="text-gray-600">{data.personalInfo.summary}</p>
    </div>
    {data.experience.length > 0 && (
      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Experience</h2>
        {data.experience.map((exp, index) => (
          <div key={index} className="mb-6">
            <div className="flex justify-between items-baseline">
              <h3 className="text-xl font-semibold text-gray-700">{exp.position}</h3>
              <p className="text-gray-600">{exp.startDate} - {exp.endDate}</p>
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
    {data.education.length > 0 && (
      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Education</h2>
        {data.education.map((edu, index) => (
          <div key={index} className="mb-6">
            <div className="flex justify-between items-baseline">
              <h3 className="text-xl font-semibold text-gray-700">{edu.degree} in {edu.field}</h3>
              <p className="text-gray-600">{edu.startDate} - {edu.endDate}</p>
            </div>
            <p className="text-gray-700">{edu.institution}</p>
            <p className="text-gray-600 mt-1">GPA: {edu.gpa}</p>
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
    {data.projects.length > 0 && (
      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Projects</h2>
        {data.projects.map((project, index) => (
          <div key={index} className="mb-6">
            <div className="flex justify-between items-baseline">
              <h3 className="text-xl font-semibold text-gray-700">
                {project.name}
                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 text-blue-600 hover:text-blue-800 text-sm"
                  >
                    View Project →
                  </a>
                )}
              </h3>
              <p className="text-gray-600">{project.startDate} - {project.endDate}</p>
            </div>
            <p className="text-gray-600 mt-2">{project.description}</p>
            {project.achievements.length > 0 && (
              <ul className="list-disc list-inside mt-2 text-gray-600">
                {project.achievements.map((achievement, i) => (
                  <li key={i}>{achievement}</li>
                ))}
              </ul>
            )}
            {project.technologies.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {project.technologies.map((tech, i) => (
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
    {data.skills.length > 0 && (
      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Skills</h2>
        <section className="skills-section space-y-2">
          {data.skills.map((skill, index) => (
            <div key={index} className="skill-item flex items-center gap-2">
              <span className="font-semibold">{skill.name}</span>
              <span className="text-sm text-gray-600">({skill.level})</span>
            </div>
          ))}
        </section>
      </div>
    )}
    {data.certifications.length > 0 && (
      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Certifications</h2>
        {data.certifications.map((cert, index) => (
          <div key={index} className="mb-4">
            <h3 className="text-lg font-semibold text-gray-700">{cert.name}</h3>
            <p className="text-gray-600">
              {cert.issuer} • Issued: {cert.date}
              {cert.expiryDate && ` • Expires: ${cert.expiryDate}`}
            </p>
            {cert.credentialId && (
              <p className="text-sm text-gray-500">Credential ID: {cert.credentialId}</p>
            )}
          </div>
        ))}
      </div>
    )}
    {data.languages.length > 0 && (
      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Languages</h2>
        <div className="grid grid-cols-2 gap-4">
          {data.languages.map((lang, index) => (
            <div key={index} className="flex justify-between">
              <span className="text-gray-700">{lang.name}</span>
              <span className="text-gray-600">{lang.proficiency}</span>
            </div>
          ))}
        </div>
      </div>
    )}
    {data.publications.length > 0 && (
      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Publications</h2>
        {data.publications.map((pub, index) => (
          <div key={index} className="mb-4">
            <h3 className="text-lg font-semibold text-gray-700">{pub.title}</h3>
            <p className="text-gray-600">{pub.publisher} • {pub.date}</p>
            <p className="text-gray-600 mt-1">{pub.description}</p>
            {pub.link && (
              <a
                href={pub.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                View Publication →
              </a>
            )}
          </div>
        ))}
      </div>
    )}
    {data.volunteer.length > 0 && (
      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Volunteer Experience</h2>
        {data.volunteer.map((vol, index) => (
          <div key={index} className="mb-4">
            <div className="flex justify-between items-baseline">
              <h3 className="text-lg font-semibold text-gray-700">{vol.role}</h3>
              <p className="text-gray-600">{vol.startDate} - {vol.endDate}</p>
            </div>
            <p className="text-gray-700">{vol.organization}</p>
            <p className="text-gray-600 mt-1">{vol.description}</p>
          </div>
        ))}
      </div>
    )}
    {data.awards.length > 0 && (
      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Awards & Achievements</h2>
        {data.awards.map((award, index) => (
          <div key={index} className="mb-4">
            <h3 className="text-lg font-semibold text-gray-700">{award.title}</h3>
            <p className="text-gray-600">{award.issuer} • {award.date}</p>
            <p className="text-gray-600 mt-1">{award.description}</p>
          </div>
        ))}
      </div>
    )}
    {data.references.length > 0 && (
      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">References</h2>
        {data.references.map((ref, index) => (
          <div key={index} className="mb-4">
            <h3 className="text-lg font-semibold text-gray-700">{ref.name}</h3>
            <p className="text-gray-700">{ref.position} at {ref.company}</p>
            <p className="text-gray-600">{ref.email} • {ref.phone}</p>
          </div>
        ))}
      </div>
    )}
  </div>
);

// Similar updates for ClassicTemplate and MinimalTemplate...

// (I'll continue with those in the next message to stay within response limits)

export default function CVPreview({ data }: CVPreviewProps) {
  switch (data.template) {
    case 'modern':
      return <ModernTemplate data={data} />;
    case 'classic':
      return <ModernTemplate data={data} />; // Temporarily using Modern template
    case 'minimal':
      return <ModernTemplate data={data} />; // Temporarily using Modern template
    default:
      return <ModernTemplate data={data} />;
  }
}