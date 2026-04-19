import React, { useState } from 'react';
import { attendanceAPI } from '../api';
import { Upload, CheckCircle, AlertCircle, Loader } from 'lucide-react';

const FileUpload = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setMessage(null);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a CSV file');
      return;
    }

    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const result = await attendanceAPI.uploadCSV(file);
      setMessage({
        type: 'success',
        title: 'Upload Successful!',
        recordCount: result.recordCount,
        incidentCount: result.incidentCount,
      });
      setFile(null);
      if (onUploadSuccess) {
        onUploadSuccess();
      }
      // Reset file input
      const fileInput = document.getElementById('file-input');
      if (fileInput) fileInput.value = '';
    } catch (err) {
      setError(err.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-8 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Upload Attendance Data</h2>
      <p className="text-gray-600 mb-6">Upload your CSV file to process attendance records</p>

      {/* File Input Area */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors mb-6">
        <Upload className="mx-auto mb-4 text-gray-400" size={48} />
        <p className="text-gray-600 mb-2">Drag and drop your CSV file here, or click to browse</p>
        <label htmlFor="file-input" className="cursor-pointer">
          <input
            id="file-input"
            type="file"
            accept=".csv,.txt"
            onChange={handleFileChange}
            className="hidden"
            disabled={loading}
          />
          <span className="text-blue-600 hover:text-blue-700 font-medium">Select File</span>
        </label>

        {file && (
          <div className="mt-4 p-3 bg-blue-50 rounded border border-blue-200">
            <p className="text-sm text-blue-900">
              <span className="font-medium">Selected:</span> {file.name} ({(file.size / 1024).toFixed(2)} KB)
            </p>
          </div>
        )}
      </div>

      {/* Upload Button */}
      <button
        onClick={handleUpload}
        disabled={!file || loading}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
      >
        {loading ? (
          <>
            <Loader size={20} className="animate-spin" />
            <span>Processing...</span>
          </>
        ) : (
          <>
            <Upload size={20} />
            <span>Upload & Process</span>
          </>
        )}
      </button>

      {/* Messages */}
      {message && message.type === 'success' && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-start">
            <CheckCircle size={24} className="text-green-600 mr-3 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-green-900 mb-1">{message.title}</h3>
              <p className="text-sm text-green-800">
                Processed <strong>{message.recordCount}</strong> attendance records with{' '}
                <strong>{message.incidentCount}</strong> incidents detected.
              </p>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start">
            <AlertCircle size={24} className="text-red-600 mr-3 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-900 mb-1">Upload Failed</h3>
              <p className="text-sm text-red-800">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* CSV Format Info */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold text-gray-900 mb-3">Expected CSV Format</h3>
        <p className="text-sm text-gray-700 mb-3">Your CSV should include the following structure:</p>
        <div className="bg-white p-3 rounded border border-gray-200 text-left overflow-x-auto">
          <pre className="text-xs text-gray-600 font-mono">
            {`Monday - 04/08/2025
1001,John Smith,Work Day,Department,07:45,17:10,,,,,,,
1002,Jane Doe,Work Day,Department,08:05,17:00,,,,,,,`}
          </pre>
        </div>
        <p className="text-xs text-gray-600 mt-3">
          <strong>Columns:</strong> Employee ID, Name, Day Type, Department, Clock In, Clock Out
        </p>
      </div>
    </div>
  );
};

export default FileUpload;
