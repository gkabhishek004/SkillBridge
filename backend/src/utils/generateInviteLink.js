const { customAlphabet } = require('nanoid');

// Generate a URL-safe invite code
const nanoid = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', 10);

/**
 * Generates a unique invite code for a batch
 */
const generateInviteCode = () => {
  return nanoid();
};

module.exports = { generateInviteCode };
