import React, { useState, useCallback } from 'react';
import { BarChart3, Download, Sparkles, Database } from 'lucide-react';
import { FileUpload } from './components/FileUpload';
import { ModelSelector } from './components/ModelSelector';
import { DataVisualization } from './components/DataVisualization';
import { PredictionResults } from './components/PredictionResults';
import { parseCSVFile, generateSampleData } from './utils/csvParser';
import { predictionModels } from './utils/predictionModels';
import { SalesData, PredictionResult, ModelMetrics } from './types';

function App() {
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [predictions, setPredictions] = useState<PredictionResult[]>([]);
  const [selectedModel, setSelectedModel] = useState('Linear Regression');
  const [predictionPeriods, setPredictionPeriods] = useState(3);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<ModelMetrics | undefined>();

  const handleFileSelect = useCallback(async (file: File) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await parseCSVFile(file);
      setSalesData(data);
      setPredictions([]);
      setMetrics(undefined);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse CSV file');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleUseSampleData = useCallback(() => {
    const sampleData = generateSampleData();
    setSalesData(sampleData);
    setPredictions([]);
    setMetrics(undefined);
    setError(null);
  }, []);

  const handlePredict = useCallback(() => {
    if (salesData.length < 2) {
      setError('At least 2 data points are required for prediction');
      return;
    }

    const model = predictionModels.find(m => m.name === selectedModel);
    if (!model) return;

    try {
      const newPredictions = model.predict(salesData, predictionPeriods);
      setPredictions(newPredictions);
      
      // Calculate metrics using cross-validation approach
      if (salesData.length > 3) {
        const trainData = salesData.slice(0, -1);
        const testData = salesData.slice(-1);
        const testPredictions = model.predict(trainData, 1);
        
        if (testPredictions.length > 0) {
          const actualValues = testData.map(d => d.sales);
          const predictedValues = testPredictions.map(p => p.predicted);
          const modelMetrics = model.getMetrics(actualValues, predictedValues);
          setMetrics(modelMetrics);
        }
      }
      
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Prediction failed');
    }
  }, [salesData, selectedModel, predictionPeriods]);

  const handleExportResults = useCallback(() => {
    if (predictions.length === 0) return;

    const csvContent = [
      ['Period', 'Predicted Sales', 'Confidence'],
      ...predictions.map(p => [p.month, p.predicted.toFixed(2), ((p.confidence || 0) * 100).toFixed(1) + '%'])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sales_predictions_${selectedModel.replace(/\s+/g, '_').toLowerCase()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [predictions, selectedModel]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <BarChart3 className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Sales Prediction Platform</h1>
                <p className="text-gray-600">Advanced forecasting with multiple ML models</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {predictions.length > 0 && (
                <button
                  onClick={handleExportResults}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export Results
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Data Input Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <FileUpload
                onFileSelect={handleFileSelect}
                isLoading={isLoading}
                error={error}
              />
            </div>
            <div className="flex flex-col justify-center">
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Start</h3>
                <button
                  onClick={handleUseSampleData}
                  className="w-full inline-flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all duration-200"
                >
                  <Database className="h-5 w-5 mr-2" />
                  Use Sample Data
                </button>
                <p className="text-sm text-gray-600 mt-2">
                  Try the platform with 24 months of sample sales data
                </p>
              </div>
            </div>
          </div>

          {/* Model Selection and Prediction Controls */}
          {salesData.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <ModelSelector
                  models={predictionModels}
                  selectedModel={selectedModel}
                  onModelSelect={setSelectedModel}
                />
              </div>
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Prediction Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Periods to Predict
                    </label>
                    <select
                      value={predictionPeriods}
                      onChange={(e) => setPredictionPeriods(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value={1}>1 Period</option>
                      <option value={3}>3 Periods</option>
                      <option value={6}>6 Periods</option>
                      <option value={12}>12 Periods</option>
                    </select>
                  </div>
                  <button
                    onClick={handlePredict}
                    disabled={salesData.length < 2}
                    className="w-full inline-flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    <Sparkles className="h-5 w-5 mr-2" />
                    Generate Predictions
                  </button>
                </div>
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-700">
                    <strong>Data loaded:</strong> {salesData.length} periods
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Visualization */}
          {salesData.length > 0 && (
            <DataVisualization
              historicalData={salesData}
              predictions={predictions}
              selectedModel={selectedModel}
            />
          )}

          {/* Results */}
          {predictions.length > 0 && (
            <PredictionResults
              predictions={predictions}
              metrics={metrics}
              selectedModel={selectedModel}
            />
          )}
        </div>
      </main>
    </div>
  );
}

export default App;