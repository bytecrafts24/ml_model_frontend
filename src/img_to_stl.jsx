import React, { useState } from 'react';
import { API } from './utils/request';
import { convertToPng } from './api/convertApi';

const ImageToSTL = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type.startsWith('image/')) {
      setFile(selectedFile);
      setError('');
    } else {
      setError('Please select a valid image file');
    }
  };

  const handleUpload = async () => {
  if (!file) {
    setError('Please select a file first');
    return;
  }

  setLoading(true);
  setProgress(0);

  try {
    // Convert file to base64
    const reader = new FileReader();
    const base64Promise = new Promise((resolve, reject) => {
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
    reader.readAsDataURL(file);
    
    const base64String = await base64Promise;
    // Remove data URL prefix
    const base64Data = base64String.split(',')[1];

    console.log('Sending payload:', {
      base64Image: base64Data,
      filename: file.name
    });

    const response = await convertToPng({
      base64Image: base64Data,
      filename: file.name
    });

    // Download converted file
    const blob = new Blob([response], { type: 'model/stl' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${file.name.split('.')[0]}.stl`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    
  } catch (err) {
    console.error('Conversion error:', err);
    setError(err.message || 'Conversion failed');
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="container p-4 mx-auto">
      <h1 className="mb-4 text-2xl font-bold">Image to STL Converter</h1>
      
      <div className="p-8 text-center border-2 border-gray-300 border-dashed rounded-lg">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          id="fileInput"
        />
        <label
          htmlFor="fileInput"
          className="px-4 py-2 text-white bg-blue-500 rounded cursor-pointer"
        >
          Select Image
        </label>
        
        {file && (
          <div className="mt-4">
            <p>Selected: {file.name}</p>
            <button
              onClick={handleUpload}
              disabled={loading}
              className="px-4 py-2 mt-2 text-white bg-green-500 rounded"
            >
              {loading ? 'Converting...' : 'Convert to STL'}
            </button>
          </div>
        )}
        
        {loading && (
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded">
              <div
                className="p-1 text-center text-white bg-blue-500 rounded"
                style={{ width: `${progress}%` }}
              >
                {progress}%
              </div>
            </div>
          </div>
        )}
        
        {error && (
          <p className="mt-4 text-red-500">{error}</p>
        )}
      </div>
    </div>
  );
};

export default ImageToSTL;