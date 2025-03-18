import { VisualComponent } from './Visual';
import ReactMarkdown from 'react-markdown';

// Component for rendering content sections
export const ContentSection = ({ section, sectionIndex }) => {
    return (
      <div className="mb-8 border-t border-gray-700 pt-6">
        <h3 className="text-xl font-semibold mb-2">{section.title}</h3>
        <p className="text-gray-300 mb-4">{section.description}</p>
        
        {section.content && (
          <div className="prose prose-invert max-w-none">
            <ReactMarkdown>{section.content}</ReactMarkdown>
          </div>
        )}
        
        {/* Section Visuals */}
        {section.visuals && section.visuals.length > 0 && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {section.visuals.map((visual, vidx) => (
              <VisualComponent
                key={`section-${sectionIndex}-visual-${vidx}`}
                visual={visual} 
                index={vidx} 
                sectionId={`section-${sectionIndex}`} 
              />
            ))}
          </div>
        )}
        
        {/* Subsections */}
        {section.subsections && section.subsections.map((subsection, subidx) => (
          <div key={`subsection-${sectionIndex}-${subidx}`} className="ml-4 mt-4 border-l-2 border-gray-700 pl-4">
            <h4 className="text-lg font-medium mb-2">{subsection.title}</h4>
            <p className="text-gray-300 mb-2">{subsection.description}</p>
            
            {subsection.content && (
              <div className="prose prose-invert max-w-none">
                <ReactMarkdown>{subsection.content}</ReactMarkdown>
              </div>
            )}
            
            {/* Subsection Visuals */}
            {subsection.visuals && subsection.visuals.length > 0 && (
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                {subsection.visuals.map((visual, vsubidx) => (
                  <VisualComponent 
                    key={`subsection-${sectionIndex}-${subidx}-visual-${vsubidx}`}
                    visual={visual} 
                    index={vsubidx} 
                    sectionId={`subsection-${sectionIndex}-${subidx}`} 
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };