/**
 * HTTP error handler
 * @param {object} res - res object
 * @param {number} code - status code
 * @param {string, object} message  - message
 */

const handleHttpError = (
  res,
  code = 403,
  message = "Something was wrong in the HTTP request"
) => {
  res.status(code).json({ error: message });
};

export default handleHttpError;
