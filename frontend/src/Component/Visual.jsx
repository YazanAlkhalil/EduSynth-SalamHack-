import { ChartComponent } from './Chart';

export const VisualComponent = ({ visual, index, sectionId }) => {
    const visualId = `${sectionId}-visual-${index}`;
    
    if (visual.type === 'chart') {
      return <ChartComponent
        key={visualId} 
        chartConfig={visual.config} 
        chartId={visualId} 
        description={visual.description} 
      />;
    } else if (visual.type === 'image' || visual.type === 'map') {
      return (
        <div key={visualId} className="border border-gray-700 rounded-lg overflow-hidden mb-4">
          <img src={visual.url} alt={visual.alt} className="w-full h-auto" />
          <div className="p-2">
            <p className="text-sm text-gray-400">{visual.description}</p>
          </div>
        </div>
      );
    }
    return null;
  };