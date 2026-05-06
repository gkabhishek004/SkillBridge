/**
 * Validates that required fields are present in an object
 */
const validateRequired = (data, fields) => {
  const missing = fields.filter((f) => !data[f] && data[f] !== 0 && data[f] !== false);
  if (missing.length > 0) {
    const err = new Error(`Missing required fields: ${missing.join(', ')}`);
    err.statusCode = 400;
    throw err;
  }
};

/**
 * Validates email format
 */
const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!re.test(email)) {
    const err = new Error('Invalid email format');
    err.statusCode = 400;
    throw err;
  }
};

/**
 * Validates role value
 */
const validateRole = (role) => {
  const validRoles = ['STUDENT', 'TRAINER', 'INSTITUTION', 'MANAGER', 'MONITORING'];
  if (!validRoles.includes(role)) {
    const err = new Error(`Invalid role. Must be one of: ${validRoles.join(', ')}`);
    err.statusCode = 400;
    throw err;
  }
};

module.exports = { validateRequired, validateEmail, validateRole };
