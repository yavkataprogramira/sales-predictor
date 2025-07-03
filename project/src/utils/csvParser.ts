import Papa from 'papaparse';
import { SalesData } from '../types';

export const parseCSVFile = (file: File): Promise<SalesData[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const data: SalesData[] = results.data.map((row: any, index: number) => {
            const month = row.Month || row.month || `Month ${index + 1}`;
            const sales = parseFloat(row.Sales || row.sales || '0');
            
            if (isNaN(sales)) {
              throw new Error(`Invalid sales value at row ${index + 1}`);
            }
            
            return {
              month: month.toString(),
              sales,
              date: new Date(2024, index, 1) // Default date for visualization
            };
          });
          
          if (data.length === 0) {
            throw new Error('No valid data found in CSV file');
          }
          
          resolve(data);
        } catch (error) {
          reject(error);
        }
      },
      error: (error) => {
        reject(new Error(`CSV parsing error: ${error.message}`));
      }
    });
  });
};

export const generateSampleData = (): SalesData[] => {
  const baseValue = 10000;
  const trend = 200;
  const seasonality = [1.2, 1.1, 1.0, 0.9, 0.8, 0.7, 0.8, 0.9, 1.0, 1.1, 1.3, 1.4];
  
  return Array.from({ length: 24 }, (_, i) => ({
    month: `Month ${i + 1}`,
    sales: Math.round((baseValue + trend * i) * seasonality[i % 12] + (Math.random() - 0.5) * 1000),
    date: new Date(2022 + Math.floor(i / 12), i % 12, 1)
  }));
};