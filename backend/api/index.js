// Vercel entry point. Vercel detects an Express app exported here and wraps
// it as a serverless function automatically - do NOT call app.listen() here.
const app = require("../app");

module.exports = app;
