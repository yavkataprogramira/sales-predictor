import React, { useCallback } from 'react';
import { Upload, FileText, AlertCircle } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  isLoading: boolean;
  error: string | null;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, isLoading, error }) => {
  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  }, [onFileSelect]);

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
  }, []);

  const handleDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type === 'text/csv') {
      onFileSelect(file);
    }
  }, [onFileSelect]);

  return (
    <div className="w-full">
      <div
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
          isLoading 
            ? 'border-blue-300 bg-blue-50' 
            : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
        }`}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center space-y-4">
          {isLoading ? (
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          ) : (
            <Upload className="h-12 w-12 text-gray-400" />
          )}
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Upload Sales Data
            </h3>
            <p className="text-gray-600 mb-4">
              Drop your CSV file here or click to browse
            </p>
            <p className="text-sm text-gray-500">
              Required columns: <span className="font-mono bg-gray-100 px-2 py-1 rounded">Month, Sales</span>
            </p>
          </div>
          
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            disabled={isLoading}
            className="hidden"
            id="csv-upload"
          />
          <label
            htmlFor="csv-upload"
            className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white transition-colors duration-200 cursor-pointer ${
              isLoading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
            }`}
          >
            <FileText className="h-5 w-5 mr-2" />
            Choose CSV File
          </label>
        </div>
      </div>
      
      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
};