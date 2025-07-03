import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { SalesData, PredictionResult } from '../types';

interface DataVisualizationProps {
  historicalData: SalesData[];
  predictions: PredictionResult[];
  selectedModel: string;
}

export const DataVisualization: React.FC<DataVisualizationProps> = ({
  historicalData,
  predictions,
  selectedModel
}) => {
  const combinedData = [
    ...historicalData.map(item => ({
      month: item.month,
      actual: item.sales,
      predicted: null,
      type: 'historical'
    })),
    ...predictions.map(item => ({
      month: item.month,
      actual: null,
      predicted: item.predicted,
      confidence: item.confidence,
      type: 'prediction'
    }))
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.dataKey === 'actual' ? 'Actual Sales' : 'Predicted Sales'}: 
              <span className="font-semibold ml-1">
                ${entry.value?.toLocaleString()}
              </span>
            </p>
          ))}
          {payload[0]?.payload?.confidence && (
            <p className="text-xs text-gray-600 mt-1">
              Confidence: {(payload[0].payload.confidence * 100).toFixed(0)}%
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8">
      {/* Line Chart */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Sales Trend & Predictions ({selectedModel})
        </h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={combinedData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="month" 
                stroke="#666"
                fontSize={12}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis 
                stroke="#666"
                fontSize={12}
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="actual"
                stroke="#2563eb"
                strokeWidth={3}
                dot={{ fill: '#2563eb', strokeWidth: 2, r: 4 }}
                name="Historical Sales"
                connectNulls={false}
              />
              <Line
                type="monotone"
                dataKey="predicted"
                stroke="#dc2626"
                strokeWidth={3}
                strokeDasharray="8 8"
                dot={{ fill: '#dc2626', strokeWidth: 2, r: 4 }}
                name="Predicted Sales"
                connectNulls={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bar Chart for Predictions */}
      {predictions.length > 0 && (
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Prediction Details
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={predictions}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#666" fontSize={12} />
                <YAxis 
                  stroke="#666"
                  fontSize={12}
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
                />
                <Tooltip
                  formatter={(value: number) => [`$${value.toLocaleString()}`, 'Predicted Sales']}
                  labelStyle={{ color: '#374151' }}
                />
                <Bar 
                  dataKey="predicted" 
                  fill="#3b82f6"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};