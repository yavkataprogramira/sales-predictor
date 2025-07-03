import React from 'react';
import { Brain, TrendingUp, BarChart3, Calendar } from 'lucide-react';
import { PredictionModel } from '../types';

interface ModelSelectorProps {
  models: PredictionModel[];
  selectedModel: string;
  onModelSelect: (modelName: string) => void;
}

const modelIcons: Record<string, React.ReactNode> = {
  'Linear Regression': <TrendingUp className="h-5 w-5" />,
  'Moving Average': <BarChart3 className="h-5 w-5" />,
  'Exponential Smoothing': <Brain className="h-5 w-5" />,
  'Seasonal Trend': <Calendar className="h-5 w-5" />
};

export const ModelSelector: React.FC<ModelSelectorProps> = ({
  models,
  selectedModel,
  onModelSelect
}) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">
        Prediction Models
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {models.map((model) => (
          <button
            key={model.name}
            onClick={() => onModelSelect(model.name)}
            className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
              selectedModel === model.name
                ? 'border-blue-500 bg-blue-50 shadow-md'
                : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
            }`}
          >
            <div className="flex items-center space-x-3 mb-2">
              <div className={`p-2 rounded-lg ${
                selectedModel === model.name ? 'bg-blue-100' : 'bg-gray-100'
              }`}>
                {modelIcons[model.name]}
              </div>
              <h4 className="font-semibold text-gray-900">{model.name}</h4>
            </div>
            <p className="text-sm text-gray-600">{model.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
};