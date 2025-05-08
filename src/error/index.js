class APIError extends Error {
  /**
   * create an API error
   * @param {string} message - error message
   * @param {number} statusCode - http status code
   * @param {boolean} [isOperational = true] - Indicates if the error is operational (trusted error)
   */

  constructor(message, statusCode, isOperational = true) {
    super(message); // call the base Error class constructor
    this.statusCode = statusCode; // http status code
    this.isOperational = isOperational; // operational error flag
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = { APIError };
