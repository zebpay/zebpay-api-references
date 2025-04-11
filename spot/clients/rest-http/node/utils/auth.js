/**
 * Authentication utilities for the spot API client
 */

const crypto = require('crypto');

/**
 * Authentication helper functions for API requests
 */
class AuthUtils {
  /**
   * Creates authentication headers for JWT-based authentication
   *
   * @param {string} jwt - JWT authentication token
   * @returns {Object} Authentication headers
   */
  static getJwtAuthHeaders(jwt) {
    if (!jwt) {
      throw new Error('JWT token is required for authentication');
    }

    return {
      'Authorization': `Bearer ${jwt}`
    };
  }

  /**
   * Creates authentication headers for API key-based authentication for GET requests
   *
   * @param {string} apiKey - API key
   * @param {string} secretKey - API secret key
   * @param {Object} queryParams - Query parameters for the request
   * @returns {Object} Authentication headers with API key and signature
   */
  static getApiKeyAuthHeadersForGetReq(apiKey, secretKey, queryParams = {}) {
    if (!apiKey || !secretKey) {
      throw new Error('API key and secret key are required for authentication');
    }

    // Clone query params to avoid modifying the original
    const params = { ...queryParams };

    // Add timestamp to query parameters
    params.timestamp = Date.now();

    // Create the query string
    const queryString = Object.entries(params)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&');

    // Generate signature
    const signature = crypto
      .createHmac('sha256', secretKey)
      .update(queryString)
      .digest('hex');

    return {
      'x-auth-apikey': apiKey,
      'x-auth-signature': signature
    };
  }

  /**
   * Creates authentication headers for API key-based authentication for POST, PUT, DELETE requests
   *
   * @param {string} apiKey - API key
   * @param {string} secretKey - API secret key
   * @param {Object} bodyParams - Body parameters for the request
   * @returns {Object} Authentication headers with API key and signature
   */
  static getApiKeyAuthHeadersForNonGetReq(apiKey, secretKey, bodyParams = {}) {
    if (!apiKey || !secretKey) {
      throw new Error('API key and secret key are required for authentication');
    }

    // Clone body params to avoid modifying the original
    const body = { ...bodyParams };

    // Add timestamp to body
    body.timestamp = Date.now();

    // Convert body to JSON string
    const bodyString = JSON.stringify(body);

    // Generate signature
    const signature = crypto
      .createHmac('sha256', secretKey)
      .update(bodyString)
      .digest('hex');

    return {
      'x-auth-apikey': apiKey,
      'x-auth-signature': signature,
      'Content-Type': 'application/json'
    };
  }

  /**
   * Determines if an endpoint requires authentication
   *
   * @param {string} endpoint - API endpoint path
   * @returns {boolean} True if the endpoint requires authentication
   */
  static isPrivateEndpoint(endpoint) {
    // Private endpoints include wallet and trade operations
    return endpoint.includes('/api/v2/ex') ||
           endpoint.includes('/api/v2/account');
  }
}

module.exports = AuthUtils; 