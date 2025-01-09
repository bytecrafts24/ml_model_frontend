import React, { useState } from 'react';
import { scrapeWebsite } from './api/scraper-ws.js';

const WebScraper = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [scrapedData, setScrapedData] = useState(null);
  const [isViewVisible, setIsViewVisible] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setScrapedData(null);

    try {
      const response = await scrapeWebsite({ url });
      setScrapedData(response);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!scrapedData) return;
    const jsonString = JSON.stringify(scrapedData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const downloadUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `scraped_data_${new Date().getTime()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(downloadUrl);
  };

  const renderScrapedContent = () => {
    if (!scrapedData?.data) return null;
    const { data } = scrapedData;

    return (
      <div className="space-y-6 text-gray-800">
        {/* Metadata Section */}
        <div>
          <h2 className="text-xl font-bold mb-2">Metadata</h2>
          <p>Title: {data?.metadata?.title}</p>
        </div>

        {/* Content Section */}
        <div>
          <h2 className="text-xl font-bold mb-2">Content</h2>
          
          {/* Paragraphs */}
          {data?.content?.paragraphs?.length > 0 && (
            <div className="mb-4">
              <h3 className="font-bold mb-2">Paragraphs:</h3>
              {data?.content?.paragraphs?.map((paragraph, index) => (
                <p key={index} className="mb-2">{paragraph}</p>
              ))}
            </div>
          )}

          {/* Links */}
          {data?.content?.links?.length > 0 && (
            <div className="mb-4">
              <h3 className="font-bold mb-2">Links:</h3>
              {data?.content?.links?.map((link, index) => (
                <p key={index}>{link.text} - {link.type}</p>
              ))}
            </div>
          )}

          {/* HTML Structure */}
          {data?.unknown_tags.length > 0 && (
            <div>
              <h3 className="font-bold mb-2">HTML Structure:</h3>
              {data.unknown_tags.map((tag, index) => (
                <p key={index}>
                  &lt;{tag.tag}&gt;
                  {tag.attributes.class && (
                    <span className="text-gray-600">
                      class="{tag.attributes.class.join(' ')}"
                    </span>
                  )}
                </p>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Website Scraper</h1>
          
          <form onSubmit={handleSubmit} className="mb-6">
            <div className="mb-4">
              <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">
                Website URL
              </label>
              <input
                type="url"
                id="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400"
            >
              {loading ? 'Scraping...' : 'Scrape Website'}
            </button>
          </form>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {scrapedData && (
            <div className="space-y-4">
              <div className="flex gap-4">
                <button
                  onClick={() => setIsViewVisible(!isViewVisible)}
                  className="flex-1 py-2 px-4 rounded-md text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  {isViewVisible ? 'Hide Data' : 'View Data'}
                </button>
                <button
                  onClick={handleDownload}
                  className="flex-1 py-2 px-4 rounded-md text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                  Download JSON
                </button>
              </div>

              {isViewVisible && renderScrapedContent()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WebScraper;
