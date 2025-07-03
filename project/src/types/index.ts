export interface SalesData {
  month: string;
  sales: number;
  date?: Date;
}

export interface PredictionResult {
  month: string;
  predicted: number;
  confidence?: number;
}

export interface ModelMetrics {
  mse: number;
  rmse: number;
  mae: number;
  r2: number;
}

export interface PredictionModel {
  name: string;
  description: string;
  predict: (data: SalesData[], periods: number) => PredictionResult[];
  getMetrics: (actual: number[], predicted: number[]) => ModelMetrics;
}