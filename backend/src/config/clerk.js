const { createClerkClient } = require('@clerk/clerk-sdk-node');
const env = require('./env');

const clerkClient = createClerkClient({ secretKey: env.CLERK_SECRET_KEY });

module.exports = clerkClient;
