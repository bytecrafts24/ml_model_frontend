// api/scraperApi.js
import { HttpMethod } from '../utils/network.js';
import { API } from '../utils/request.js';

/**
 * Scrape website data from given URL
 * @param {Object} data - Contains url to scrape
 * @param {string} data.url - Website URL to scrape
 * @returns {Promise} - Resolves with the scraped data
 */
export const scrapeWebsite = (data) => {
  const urlPath = '/webscrape/scrape';
  return API.request({
    method: HttpMethod.POST,
    urlPath: urlPath,
    body: data,
  });
};

