import React, { useState } from 'react';


const ContentDisplay = ({ content }) => {
    const [expandedSections, setExpandedSections] = useState({});
  
    const toggleSection = (id) => {
      setExpandedSections((prev) => ({
        ...prev,
        [id]: !prev[id],
      }));
    };
  
    if (!content) return null;
  
    return (
      <div className="mt-8">
        <h2 className="text-2xl font-bold text-primary mb-4">المحتوى المنشأ:</h2>
  
        <div className="mb-8">
          <h2
            className="text-2xl font-bold text-secondary cursor-pointer"
            onClick={() => toggleSection(content.introduction.id)}
          >
            {content.introduction.title}
          </h2>
          {expandedSections[content.introduction.id] && (
            <div className="mt-4 p-6 bg-amber-600 rounded-lg">
              <p className="text-text">{content.introduction.content}</p>
            </div>
          )}
        </div>
  
        {content.sections.map((section) => (
          <div key={section.id} className="mb-8">
            <h2
              className="text-2xl font-bold text-secondary cursor-pointer"
              onClick={() => toggleSection(section.id)}
            >
              {section.title}
            </h2>
            {expandedSections[section.id] && (
              <div className="mt-4 p-6 bg-amber-600 rounded-lg">
                <p className="text-text">{section.content}</p>
  
                {section.subsections.map((subsection) => (
                  <div key={subsection.id} className="mt-4">
                    <h3 className="text-xl font-semibold text-secondary">
                      {subsection.title}
                    </h3>
                    <p className="text-text mt-2">{subsection.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
  
        <div className="mb-8">
          <h2
            className="text-2xl font-bold text-secondary cursor-pointer"
            onClick={() => toggleSection(content.conclusion.id)}
          >
            {content.conclusion.title}
          </h2>
          {expandedSections[content.conclusion.id] && (
            <div className="mt-4 p-6 bg-amber-600 rounded-lg">
              <p className="text-text">{content.conclusion.content}</p>
            </div>
          )}
        </div>
      </div>
    );
  };
  export default ContentDisplay