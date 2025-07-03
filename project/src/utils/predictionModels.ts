import { SalesData, PredictionResult, ModelMetrics, PredictionModel } from '../types';

// Linear Regression Model
export const linearRegressionModel: PredictionModel = {
  name: 'Linear Regression',
  description: 'Simple linear trend analysis',
  
  predict: (data: SalesData[], periods: number): PredictionResult[] => {
    const n = data.length;
    let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;

    for (let i = 0; i < n; i++) {
      const x = i;
      const y = data[i].sales;
      sumX += x;
      sumY += y;
      sumXY += x * y;
      sumX2 += x * x;
    }

    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    const predictions: PredictionResult[] = [];
    for (let i = 1; i <= periods; i++) {
      const predicted = intercept + slope * (n + i - 1);
      predictions.push({
        month: `Month ${n + i}`,
        predicted: Math.max(0, predicted),
        confidence: 0.8
      });
    }

    return predictions;
  },

  getMetrics: (actual: number[], predicted: number[]): ModelMetrics => {
    const n = actual.length;
    const actualMean = actual.reduce((sum, val) => sum + val, 0) / n;
    
    let mse = 0, mae = 0, ssTot = 0, ssRes = 0;
    
    for (let i = 0; i < n; i++) {
      const error = actual[i] - predicted[i];
      mse += error * error;
      mae += Math.abs(error);
      ssTot += (actual[i] - actualMean) ** 2;
      ssRes += error * error;
    }
    
    mse /= n;
    mae /= n;
    const rmse = Math.sqrt(mse);
    const r2 = 1 - (ssRes / ssTot);
    
    return { mse, rmse, mae, r2 };
  }
};

// Moving Average Model
export const movingAverageModel: PredictionModel = {
  name: 'Moving Average',
  description: 'Average of recent periods',
  
  predict: (data: SalesData[], periods: number): PredictionResult[] => {
    const windowSize = Math.min(3, data.length);
    const recentData = data.slice(-windowSize);
    const average = recentData.reduce((sum, item) => sum + item.sales, 0) / windowSize;
    
    const predictions: PredictionResult[] = [];
    for (let i = 1; i <= periods; i++) {
      predictions.push({
        month: `Month ${data.length + i}`,
        predicted: average,
        confidence: 0.7
      });
    }
    
    return predictions;
  },

  getMetrics: linearRegressionModel.getMetrics
};

// Exponential Smoothing Model
export const exponentialSmoothingModel: PredictionModel = {
  name: 'Exponential Smoothing',
  description: 'Weighted average with exponential decay',
  
  predict: (data: SalesData[], periods: number): PredictionResult[] => {
    const alpha = 0.3; // Smoothing parameter
    let smoothed = data[0].sales;
    
    for (let i = 1; i < data.length; i++) {
      smoothed = alpha * data[i].sales + (1 - alpha) * smoothed;
    }
    
    const predictions: PredictionResult[] = [];
    for (let i = 1; i <= periods; i++) {
      predictions.push({
        month: `Month ${data.length + i}`,
        predicted: smoothed,
        confidence: 0.75
      });
    }
    
    return predictions;
  },

  getMetrics: linearRegressionModel.getMetrics
};

// Seasonal Trend Model
export const seasonalTrendModel: PredictionModel = {
  name: 'Seasonal Trend',
  description: 'Accounts for seasonal patterns',
  
  predict: (data: SalesData[], periods: number): PredictionResult[] => {
    if (data.length < 12) {
      return linearRegressionModel.predict(data, periods);
    }
    
    // Calculate seasonal indices (simplified)
    const seasonalPeriod = 12;
    const seasonalIndices: number[] = [];
    
    for (let month = 0; month < seasonalPeriod; month++) {
      const monthlyValues = [];
      for (let i = month; i < data.length; i += seasonalPeriod) {
        monthlyValues.push(data[i].sales);
      }
      const monthlyAverage = monthlyValues.reduce((sum, val) => sum + val, 0) / monthlyValues.length;
      const overallAverage = data.reduce((sum, item) => sum + item.sales, 0) / data.length;
      seasonalIndices.push(monthlyAverage / overallAverage);
    }
    
    // Apply linear trend with seasonal adjustment
    const trendPredictions = linearRegressionModel.predict(data, periods);
    
    return trendPredictions.map((pred, index) => ({
      ...pred,
      predicted: pred.predicted * seasonalIndices[(data.length + index) % seasonalPeriod],
      confidence: 0.85
    }));
  },

  getMetrics: linearRegressionModel.getMetrics
};

export const predictionModels = [
  linearRegressionModel,
  movingAverageModel,
  exponentialSmoothingModel,
  seasonalTrendModel
];