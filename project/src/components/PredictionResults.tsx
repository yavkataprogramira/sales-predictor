import React from 'react';
import { TrendingUp, DollarSign, Target } from 'lucide-react';
import { PredictionResult, ModelMetrics } from '../types';

interface PredictionResultsProps {
  predictions: PredictionResult[];
  metrics?: ModelMetrics;
  selectedModel: string;
}

export const PredictionResults: React.FC<PredictionResultsProps> = ({
  predictions,
  metrics,
  selectedModel
}) => {
  const totalPredicted = predictions.reduce((sum, pred) => sum + pred.predicted, 0);
  const averagePredicted = totalPredicted / predictions.length;
  const averageConfidence = predictions.reduce((sum, pred) => sum + (pred.confidence || 0), 0) / predictions.length;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Predicted</p>
              <p className="text-2xl font-bold">${totalPredicted.toLocaleString()}</p>
            </div>
            <DollarSign className="h-8 w-8 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Average per Period</p>
              <p className="text-2xl font-bold">${averagePredicted.toLocaleString()}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Avg Confidence</p>
              <p className="text-2xl font-bold">{(averageConfidence * 100).toFixed(0)}%</p>
            </div>
            <Target className="h-8 w-8 text-purple-200" />
          </div>
        </div>
      </div>

      {/* Detailed Predictions */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Detailed Predictions - {selectedModel}
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Period
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Predicted Sales
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Confidence
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {predictions.map((prediction, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {prediction.month}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${prediction.predicted.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${(prediction.confidence || 0) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-600">
                        {((prediction.confidence || 0) * 100).toFixed(0)}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      (prediction.confidence || 0) > 0.8
                        ? 'bg-green-100 text-green-800'
                        : (prediction.confidence || 0) > 0.6
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {(prediction.confidence || 0) > 0.8 ? 'High' : 
                       (prediction.confidence || 0) > 0.6 ? 'Medium' : 'Low'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};