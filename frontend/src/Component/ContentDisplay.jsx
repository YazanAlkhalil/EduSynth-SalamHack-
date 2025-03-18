import { ContentSection } from "./ContentSection";
import { VisualComponent } from "./Visual";
import ReactMarkdown from 'react-markdown';

// Main content display component
 const ContentDisplay = ({ content }) => {
  if (!content) return null;

  return (
    <div className="bg-[#1E2537] p-6 rounded-lg mt-4">
      <h2 className="text-2xl font-bold mb-4">{content.title}</h2>
      
      {/* Introduction */}
      {content.introduction && (
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">{content.introduction.title}</h3>
          <p className="text-gray-300 mb-4">{content.introduction.description}</p>
          <div className="prose prose-invert max-w-none">
            <ReactMarkdown>{content.introduction.content}</ReactMarkdown>
          </div>
          
          {/* Introduction Visuals */}
          {content.introduction.visuals && content.introduction.visuals.length > 0 && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              {content.introduction.visuals.map((visual, idx) => (
                <VisualComponent
                  key={`intro-visual-${idx}`}
                  visual={visual} 
                  index={idx} 
                  sectionId="intro" 
                />
              ))}
            </div>
          )}
        </div>
      )}
      
      {/* Sections */}
      {content.sections && content.sections.map((section, idx) => (
        <ContentSection
          key={`section-${idx}`}
          section={section} 
          sectionIndex={idx} 
        />
      ))}
    </div>
  );
};

export default ContentDisplay