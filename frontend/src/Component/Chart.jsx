// Component for rendering charts
import { Chart, registerables } from 'chart.js';
import { useEffect } from 'react';

// Register all Chart.js components
Chart.register(...registerables);
export const ChartComponent = ({ chartConfig, chartId, description }) => {
    useEffect(() => {
      if (!chartConfig) return;
      
      // Check if chart instance already exists and destroy it
      const chartInstance = Chart.getChart(chartId);
      if (chartInstance) {
        chartInstance.destroy();
      }
      
      // Get the canvas element
      const ctx = document.getElementById(chartId);
      if (ctx) {
        // Create new chart
        new Chart(ctx, chartConfig);
      }
      
      // Cleanup function
      return () => {
        const chartInstance = Chart.getChart(chartId);
        if (chartInstance) {
          chartInstance.destroy();
        }
      };
    }, [chartConfig, chartId]);
  
    return (
      <div className="border border-gray-700 rounded-lg p-4 bg-[#1E2537] mb-4">
        <canvas id={chartId} width="400" height="200"></canvas>
        <p className="text-sm text-gray-400 mt-2">{description}</p>
      </div>
    );
  };
  