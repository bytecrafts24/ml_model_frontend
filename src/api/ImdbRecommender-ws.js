import { HttpMethod } from '../utils/network.js';
import { API } from '../utils/request.js';

/**
 * Get movie recommendations based on the movie title
 * @param {string} movieTitle - The title of the movie to base recommendations on.
 * @returns {Promise} - Promise resolving with movie recommendations.
 */
export const getMovieRecommendations = (movieTitle) => {
  const urlPath = '/recommend';
  return API.request({
    method: HttpMethod.POST,
    urlPath: urlPath,
    body: { title: movieTitle }
  });
};
