import React, { useState, useEffect } from 'react';
import { generateImage, getAvailableModels } from './api/generator-ws';

const ImageGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [generatedImage, setGeneratedImage] = useState(null);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const response = await getAvailableModels();
        console.log(response);
        setModels(response.data.models);
        setSelectedModel(response.data.models[0]);
      } catch (err) {
        setError('Failed to fetch models');
      }
    };
    fetchModels();
  }, []);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!prompt) {
      setError('Please enter a prompt');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await generateImage({
        prompt,
        model: selectedModel
      });
      setGeneratedImage(response.imageUrl);
    } catch (err) {
      setError(err.message || 'Failed to generate image');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container p-4 mx-auto">
      <h1 className="mb-4 text-2xl font-bold">AI Image Generator</h1>
      
      <form onSubmit={handleGenerate} className="space-y-4">
        <div>
          <label className="block mb-2">Model:</label>
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="w-full p-2 border rounded"
          >
            {models.map(model => (
              <option key={model} value={model}>{model}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-2">Prompt:</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full p-2 border rounded"
            rows="3"
            placeholder="Enter your image description..."
          />
        </div>

        <button
          type="submit"
          disabled={true}
          className="px-4 py-2 text-white bg-blue-500 rounded"
        >
          {loading ? 'Generating...' : 'Generate Image'}
        </button>
      </form>

      {error && (
        <div className="mt-4 text-red-500">{error}</div>
      )}

      {generatedImage && (
        <div className="mt-8">
          <h2 className="mb-2 text-xl font-bold">Generated Image:</h2>
          <img
            src={generatedImage}
            alt="Generated"
            className="max-w-full rounded shadow-lg"
          />
        </div>
      )}
    </div>
  );
};

export default ImageGenerator;