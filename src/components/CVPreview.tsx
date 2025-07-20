import React from 'react';
import { CVData } from '../types';
import { ModernTemplate } from './templates/ModernTemplate';
import { ClassicTemplate } from './templates/ClassicTemplate';
import { MinimalTemplate } from './templates/MinimalTemplate';

interface CVPreviewProps {
  data: CVData;
}

const CVPreview: React.FC<CVPreviewProps> = ({ data }) => {
  const renderTemplate = () => {
    const templateProps = { data };
    
    switch (data.template) {
      case 'classic':
        return <ClassicTemplate {...templateProps} />;
      case 'minimal':
        return <MinimalTemplate {...templateProps} />;
      case 'modern':
      default:
        return <ModernTemplate {...templateProps} />;
    }
  };

  return (
    <div className="w-full">
      {renderTemplate()}
    </div>
  );
};

export default CVPreview;
